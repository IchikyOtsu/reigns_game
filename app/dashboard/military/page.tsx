import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function MilitaryPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // 1. Récupérer le pays du joueur avec son régime et son armée
    const { data: player, error: playerError } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                id,
                name,
                population,
                regime:Regime(
                    name,
                    baseManpowerRate
                ),
                army:Army(
                    infantry,
                    archers,
                    cavalry,
                    artillery,
                    fleet
                )
            )
        `)
        .eq('discordId', discordId)
        .single();

    // @ts-ignore
    const countryData = Array.isArray(player?.country) ? player.country[0] : player?.country;

    if (playerError || !countryData) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Armée</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays associé.</p>
            </div>
        );
    }

    // @ts-ignore
    const regime = Array.isArray(countryData.regime) ? countryData.regime[0] : countryData.regime;
    // @ts-ignore
    const army = Array.isArray(countryData.army) ? countryData.army[0] : countryData.army;

    // Calculs
    const population = countryData.population || 0;
    const manpowerRate = regime?.baseManpowerRate || 0;
    const availableManpower = Math.floor(population * manpowerRate);

    const armyStats = army || {
        infantry: 0,
        archers: 0,
        cavalry: 0,
        artillery: 0,
        fleet: 0
    };

    const totalArmy = (armyStats.infantry || 0) + (armyStats.archers || 0) + (armyStats.cavalry || 0) + (armyStats.artillery || 0) + (armyStats.fleet || 0);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion Militaire</h1>
                <p className="text-slate-600">
                    Forces armées de {countryData.name}
                </p>
            </header>

            {/* Statistiques Générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Population Totale</h3>
                    <p className="text-3xl font-bold text-slate-900">{population.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Taux de Recrutement</h3>
                    <p className="text-3xl font-bold text-amber-600">{(manpowerRate * 100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400 mt-1">Basé sur le régime : {regime?.name}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Effectifs Disponibles</h3>
                    <p className="text-3xl font-bold text-blue-600">{availableManpower.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Hommes mobilisables</p>
                </div>
            </div>

            {/* Composition de l'Armée */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Composition de l'Armée</h2>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                        Total : {totalArmy.toLocaleString()} unités
                    </span>
                </div>

                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type d'Unité</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Effectif</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Part de l'armée</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">⚔️ Infanterie</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">{armyStats.infantry?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                                {totalArmy > 0 ? ((armyStats.infantry / totalArmy) * 100).toFixed(1) : 0}%
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">🏹 Archers</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">{armyStats.archers?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                                {totalArmy > 0 ? ((armyStats.archers / totalArmy) * 100).toFixed(1) : 0}%
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">🐎 Cavalerie</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">{armyStats.cavalry?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                                {totalArmy > 0 ? ((armyStats.cavalry / totalArmy) * 100).toFixed(1) : 0}%
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">💣 Artillerie</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">{armyStats.artillery?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                                {totalArmy > 0 ? ((armyStats.artillery / totalArmy) * 100).toFixed(1) : 0}%
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">🚢 Flotte</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">{armyStats.fleet?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                                {totalArmy > 0 ? ((armyStats.fleet / totalArmy) * 100).toFixed(1) : 0}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
