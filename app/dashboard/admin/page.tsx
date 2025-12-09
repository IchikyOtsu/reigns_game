import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Récupérer tous les joueurs
    const { data: players, error } = await supabase
        .from('Player')
        .select(`
            *,
            country:Country(name)
        `)
        .order('createdAt', { ascending: false });

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Administration</h1>
                <p className="text-slate-600">Gestion des joueurs et de la base de données.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Joueurs</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Pseudo Discord</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Pays</th>
                                <th className="px-6 py-4">Date d'inscription</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {players?.map((player) => (
                                <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {player.discordPseudo}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${player.role === 'ADMIN'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {player.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {player.country?.name || <span className="text-slate-400 italic">Aucun</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(player.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-amber-600 hover:text-amber-700 font-medium">
                                            Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!players || players.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Aucun joueur trouvé.
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
