import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';
import GoalIconViewer from "./GoalIconViewer";

export default async function AdminGoalsPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    const goalsDir = path.join(process.cwd(), 'public', 'goals');
    let icons: string[] = [];

    try {
        if (fs.existsSync(goalsDir)) {
            icons = fs.readdirSync(goalsDir).filter(file => 
                /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(file)
            );
        }
    } catch (error) {
        console.error("Error reading goals directory:", error);
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Icônes d'Objectifs</h1>
                <p className="text-slate-600">Visualisation des icônes disponibles dans /public/goals</p>
            </header>

            <GoalIconViewer icons={icons} />
        </div>
    );
}
