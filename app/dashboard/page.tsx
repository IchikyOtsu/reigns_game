import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
    const session = await getServerSession();

    // Récupérer les infos du joueur et de son pays
    let playerInfo = null;

    if (session?.user) {
        // @ts-ignore
        const discordId = session.user.discordId;

        const { data } = await supabase
            .from('Player')
            .select(`
        *,
        country:Country(*)
      `)
            .eq('discordId', discordId)
            .single();

        playerInfo = data;
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
                <p className="text-slate-600">Bienvenue, {session?.user?.name}. Voici la situation actuelle.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Carte Pays */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                        <span>🏰</span> Mon Pays
                    </h2>
                    {playerInfo?.country ? (
                        <div>
                            <p className="text-2xl font-bold text-amber-600 mb-1">{playerInfo.country.name}</p>
                            <p className="text-sm text-slate-500 mb-4">Capitale : {playerInfo.country.capital}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Population</span>
                                    <span className="font-medium">{playerInfo.country.population?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Superficie</span>
                                    <span className="font-medium">{playerInfo.country.areaKm2?.toLocaleString()} km²</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-slate-500 mb-4">Vous n'avez pas encore de pays.</p>
                            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
                                Créer / Rejoindre un pays
                            </button>
                        </div>
                    )}
                </div>

                {/* Carte Notifications (Exemple) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                        <span>📢</span> Dernières Annonces
                    </h2>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-800 font-medium">Bienvenue sur la version Alpha !</p>
                            <p className="text-xs text-blue-600 mt-1">Le système est en cours de construction.</p>
                        </div>
                    </div>
                </div>

                {/* Carte Stats Rapides */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                        <span>📈</span> Statistiques Globales
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-700">0</p>
                            <p className="text-xs text-slate-500 uppercase">Tours de jeu</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-700">1</p>
                            <p className="text-xs text-slate-500 uppercase">Joueurs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
