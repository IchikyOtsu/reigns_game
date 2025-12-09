import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function ResourcesPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // 1. Récupérer le pays du joueur via son discordId
    const { data: player, error: playerError } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                id,
                name,
                provinces:Province(
                    id,
                    biomes:ProvinceBiome(
                        biomeId,
                        cellCount
                    )
                )
            )
        `)
        .eq('discordId', discordId)
        .single();

    const country = player?.country;

    // Gestion du cas où country est un tableau (bug potentiel PostgREST)
    // @ts-ignore
    const countryData = Array.isArray(country) ? country[0] : country;

    if (playerError || !countryData) {
        console.error("Error fetching country:", playerError);
        // Si pas de pays, rediriger ou afficher un message
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Ressources</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays associé.</p>
            </div>
        );
    }

    // 2. Récupérer les définitions des biomes et leurs ressources
    const { data: biomesData, error: biomesError } = await supabaseAdmin
        .from('Biome')
        .select(`
            id,
            name,
            resources:BiomeResource(
                quantity,
                resourceType:ResourceType(name)
            )
        `);

    if (biomesError) {
        console.error("Erreur chargement biomes:", biomesError);
        return <div>Erreur lors du calcul des ressources.</div>;
    }

    // 3. Calculer le total des cellules par biome pour tout le pays
    const biomeTotalCells: Record<string, number> = {};

    // @ts-ignore
    countryData.provinces.forEach((province: any) => {
        province.biomes.forEach((pb: any) => {
            const current = biomeTotalCells[pb.biomeId] || 0;
            biomeTotalCells[pb.biomeId] = current + pb.cellCount;
        });
    });

    // 4. Calculer la production de ressources
    // Règle : Total Cellules Biome / Ratio (Quantity) = Production (Arrondi inférieur)
    const resourceProduction: Record<string, number> = {};
    const productionDetails: Record<string, { biome: string, cells: number, ratio: number, amount: number }[]> = {};

    Object.entries(biomeTotalCells).forEach(([biomeId, totalCells]) => {
        const biomeDef = biomesData?.find((b: any) => b.id === biomeId);
        if (!biomeDef) return;

        biomeDef.resources.forEach((res: any) => {
            if (res.quantity > 0) {
                const amount = Math.floor(totalCells / res.quantity);
                if (amount > 0) {
                    const resName = res.resourceType.name;

                    // Total global
                    resourceProduction[resName] = (resourceProduction[resName] || 0) + amount;

                    // Détails pour l'affichage (optionnel mais sympa)
                    if (!productionDetails[resName]) {
                        productionDetails[resName] = [];
                    }
                    productionDetails[resName].push({
                        biome: biomeDef.name,
                        cells: totalCells,
                        ratio: res.quantity,
                        amount: amount
                    });
                }
            }
        });
    });

    // Trier les ressources par nom
    const sortedResources = Object.keys(resourceProduction).sort();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Production de Ressources</h1>
                <p className="text-slate-600">
                    Production estimée basée sur les biomes de vos provinces ({countryData.name}).
                </p>
            </header>            {sortedResources.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                    <p className="text-slate-500">Aucune production de ressources détectée. Assignez des biomes à vos provinces.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedResources.map((resName) => (
                        <div key={resName} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800">{resName}</h3>
                                <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                                    +{resourceProduction[resName]}
                                </span>
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Détails par Biome</p>
                                <ul className="space-y-2">
                                    {productionDetails[resName].map((detail, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="text-slate-600">{detail.biome}</span>
                                            <span className="text-slate-400 text-xs flex items-center gap-1">
                                                ({detail.cells} ➗ {detail.ratio}) = <span className="text-slate-800 font-medium">{detail.amount}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
