import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import CreateCountryForm from "./CreateCountryForm";

export default async function CreateCountryPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Récupérer les données nécessaires pour le formulaire
    const { data: regimes } = await supabase.from('Regime').select('*').order('name');
    const { data: cultures } = await supabase.from('Culture').select('*').order('name');
    const { data: religions } = await supabase.from('Religion').select('*').order('name');
    const { data: players } = await supabase.from('Player').select('*').order('discordPseudo');

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Créer un Pays</h1>
                <p className="text-slate-600">Ajouter une nouvelle nation au monde.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <CreateCountryForm
                    regimes={regimes || []}
                    cultures={cultures || []}
                    religions={religions || []}
                    players={players || []}
                />
            </div>
        </div>
    );
}
