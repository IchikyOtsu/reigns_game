import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Récupérer les infos du joueur et de son pays
    let playerInfo = null;

    if (session?.user) {
        // @ts-ignore
        const discordId = session.user.discordId;
        console.log("Dashboard - Discord ID:", discordId);

        const { data, error } = await supabaseAdmin
            .from('Player')
            .select(`
        *,
        country:Country(*)
      `)
            .eq('discordId', discordId)
            .single();

        if (error) {
            console.error("Dashboard - Error fetching player info:", error);
        } else {
            console.log("Dashboard - Player Data:", JSON.stringify(data, null, 2));
        }

        playerInfo = data;
        
        // Handle case where country might be an array (PostgREST quirk)
        if (playerInfo && Array.isArray(playerInfo.country)) {
             // @ts-ignore
            playerInfo.country = playerInfo.country[0];
        }
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
                        <div className="flex flex-col items-center text-center">
                            {playerInfo.country.emblem ? (
                                <img
                                    src={playerInfo.country.emblem}
                                    alt={`Emblème de ${playerInfo.country.name}`}
                                    className="w-32 h-32 object-contain mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                                    🏰
                                </div>
                            )}
                            <p className="text-2xl font-bold text-amber-600">{playerInfo.country.name}</p>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-slate-500 mb-4">Vous n'avez pas encore de pays.</p>
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
