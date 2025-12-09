import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCountryForm from "./CreateCountryForm";

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
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Capitale</th>
                                <th className="px-6 py-4">Joueur</th>
                                <th className="px-6 py-4">Régime</th>
                                <th className="px-6 py-4">Culture</th>
                                <th className="px-6 py-4">Population</th>
                                <th className="px-6 py-4">Couleur</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {countries?.map((country) => (
                                <tr key={country.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            {country.emblem && (
                                                <img src={country.emblem} alt="" className="w-6 h-6 object-contain" />
                                            )}
                                            {country.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{country.capital?.name || "-"}</td>
                                    <td className="px-6 py-4">{country.player?.discordPseudo || "-"}</td>
                                    <td className="px-6 py-4">{country.regime?.name || "-"}</td>
                                    <td className="px-6 py-4">{country.culture?.name || "-"}</td>
                                    <td className="px-6 py-4">{country.population?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {country.color && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: country.color }}></div>
                                                {country.color}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!countries || countries.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        Aucun pays trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
