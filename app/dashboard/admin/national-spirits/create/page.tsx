import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import fs from 'fs';
import path from 'path';
import CreateNationalSpiritForm from "./CreateNationalSpiritForm";
import NationalSpiritList from "./NationalSpiritList";

export default async function CreateNationalSpiritPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch data needed for the form
    const { data: countries } = await supabaseAdmin
        .from('Country')
        .select('id, name')
        .order('name');

    const { data: bonusTypes } = await supabaseAdmin
        .from('BonusType')
        .select('id, name')
        .order('name');

    // Fetch existing National Spirits
    const { data: spirits } = await supabaseAdmin
        .from('NationalSpirit')
        .select(`
            *,
            country:Country(name),
            bonuses:NationalSpiritBonus(
                id, modifierValue, bonusType:BonusType(name)
            )
        `)
        .order('name');

    // Get icons from public/goals
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
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Esprits Nationaux</h1>
                <p className="text-slate-600">Ajoutez ou modifiez des caractéristiques uniques aux pays.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Créer un nouvel Esprit</h2>
                <CreateNationalSpiritForm 
                    countries={countries || []} 
                    bonusTypes={bonusTypes || []}
                    icons={icons}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <NationalSpiritList 
                    spirits={spirits || []}
                    countries={countries || []}
                    bonusTypes={bonusTypes || []}
                    icons={icons}
                />
            </div>
        </div>
    );
}
