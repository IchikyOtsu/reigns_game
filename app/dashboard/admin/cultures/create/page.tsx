import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateCultureForm from "./CreateCultureForm";

export default async function CreateCulturePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Créer une Culture</h1>
                <p className="text-slate-600">Ajouter une nouvelle culture disponible pour les pays.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
                <CreateCultureForm />
            </div>
        </div>
    );
}
