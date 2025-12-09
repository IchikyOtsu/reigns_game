import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function BiomesPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    const { data: biomes, error } = await supabaseAdmin
        .from('Biome')
        .select(`
            *,
            resources:BiomeResource(
                quantity,
                resourceType:ResourceType(name)
            )
        `)
        .order('name');

    if (error) {
        console.error("Error fetching biomes:", error);
        return <div>Erreur lors du chargement des biomes.</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Biomes & Ressources</h1>
                <p className="text-slate-600">Vue d'ensemble des ressources par biome.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Biome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Habitabilité</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ressources (Quantité)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {biomes?.map((biome) => (
                            <tr key={biome.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                    {biome.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {biome.habitability}%
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {biome.resources && biome.resources.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {biome.resources.map((res: any) => (
                                                <span key={res.resourceType.name} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    {res.resourceType.name}: {res.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Aucune ressource</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {biomes?.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                                    Aucun biome trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
