import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function EconomyPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // Récupérer le pays du joueur
    const { data: player, error: playerError } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                id,
                name,
                population,
                treasury,
                regime:Regime(
                    name
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
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Économie</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays associé.</p>
            </div>
        );
    }

    // Constantes et Calculs
    const POPULATION_THRESHOLD = 100000; // Seuil de population pour l'efficacité
    const population = countryData.population || 0;
    const treasury = countryData.treasury || 0;

    // Calcul de l'efficacité
    // Si Pop <= Seuil, Efficacité = 100%
    // Si Pop > Seuil, Efficacité diminue logarithmiquement
    let efficiency = 1.0;
    if (population > POPULATION_THRESHOLD) {
        // Formule : 1 / (1 + log10(Pop / Seuil))
        // Ex: 1M hab (10x seuil) -> 1 / (1 + 1) = 50%
        efficiency = 1 / (1 + Math.log10(population / POPULATION_THRESHOLD));
    }

    const baseIncome = Math.floor(population / 100);
    const finalIncome = Math.floor(baseIncome * efficiency);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion Économique</h1>
                <p className="text-slate-600">
                    Finances de {countryData.name}
                </p>
            </header>

            {/* Indicateurs Clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trésorerie */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Trésorerie</h3>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-4xl font-bold text-amber-500">{treasury.toLocaleString()} <span className="text-lg text-slate-400 font-normal">Or</span></p>
                    <p className="text-xs text-slate-400 mt-2">Fonds disponibles</p>
                </div>

                {/* Revenu Estimé */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Revenu Net</h3>
                        <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-4xl font-bold text-emerald-600">+{finalIncome.toLocaleString()} <span className="text-lg text-slate-400 font-normal">/ tour</span></p>
                    <div className="mt-2 flex items-center text-xs text-slate-500">
                        <span>Base: {baseIncome.toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <span>Efficacité: {(efficiency * 100).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Efficacité Administrative */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Efficacité Admin.</h3>
                        <span className="text-2xl">⚙️</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className={`text-4xl font-bold ${efficiency >= 0.8 ? 'text-blue-600' : efficiency >= 0.5 ? 'text-amber-600' : 'text-red-600'}`}>
                            {(efficiency * 100).toFixed(1)}%
                        </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {population > POPULATION_THRESHOLD
                            ? "Malus dû à la surpopulation administrative"
                            : "Gestion optimale de la population"}
                    </p>
                </div>
            </div>

            {/* Détails du Calcul */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Détails du Calcul des Revenus</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Population Totale</span>
                        <span className="font-medium text-slate-900">{population.toLocaleString()} habitants</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Revenu de Base (Pop / 100)</span>
                        <span className="font-medium text-slate-900">{baseIncome.toLocaleString()} Or</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Seuil d'Efficacité Optimale</span>
                        <span className="font-medium text-slate-900">{POPULATION_THRESHOLD.toLocaleString()} habitants</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 bg-slate-50 px-2 rounded">
                        <span className="font-semibold text-slate-700">Revenu Final (Base × Efficacité)</span>
                        <span className="font-bold text-emerald-600">{finalIncome.toLocaleString()} Or</span>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p>
                        <strong>Note sur l'efficacité :</strong> L'efficacité administrative commence à diminuer lorsque la population dépasse {POPULATION_THRESHOLD.toLocaleString()} habitants.
                        Cela représente le coût croissant de la gestion d'une grande nation (corruption, bureaucratie, logistique).
                    </p>
                </div>
            </div>
        </div>
    );
}
