import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCountryForm from "./CreateCountryForm";
import CountryList from "./CountryList";

export default async function CreateCountryPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Récupérer les données nécessaires pour le formulaire
    const { data: regimes } = await supabaseAdmin.from('Regime').select('*').order('name');
    const { data: cultures } = await supabaseAdmin.from('Culture').select('*').order('name');
    const { data: religions } = await supabaseAdmin.from('Religion').select('*').order('name');
    const { data: players } = await supabaseAdmin.from('Player').select('*').order('discordPseudo');

    // Récupérer toutes les villes pour le choix de la capitale (optimisation possible: ne charger que id, name, countryId)
    const { data: cities } = await supabaseAdmin.from('City').select('id, name, countryId').order('name');

    // Récupérer les pays existants
    const { data: countries, error: countriesError } = await supabaseAdmin
        .from('Country')
        .select(`
            *,
            regime:Regime(name),
            culture:Culture(name),
            player:Player(discordPseudo),
            capital:City!capitalId(name)
        `)
        .order('name');

    if (countriesError) {
        console.error("Error fetching countries:", countriesError);
    }

    return (
        <div className="space-y-8">
            <header>
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Pays ({countries?.length || 0})</h2>
                </div>
                <CountryList
                    countries={countries || []}
                    cultures={cultures || []}
                    regimes={regimes || []}
                    cities={cities || []}
                />
            </div>
        </div>
    );
}
