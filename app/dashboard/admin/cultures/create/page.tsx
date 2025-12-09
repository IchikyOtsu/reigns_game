import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCultureForm from "./CreateCultureForm";

export default async function CreateCulturePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch existing cultures
    const { data: cultures } = await supabaseAdmin
        .from('Culture')
        .select('*')
        .order('name');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Créer une Culture</h1>
                <p className="text-slate-600">Ajouter une nouvelle culture disponible pour les pays.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
                <CreateCultureForm />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Cultures ({cultures?.length || 0})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Couleur</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">ID Azgaar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cultures?.map((culture) => (
                                <tr key={culture.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{culture.name}</td>
                                    <td className="px-6 py-4">
                                        {culture.color && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: culture.color }}></div>
                                                {culture.color}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={culture.description || ""}>
                                        {culture.description || "-"}
                                    </td>
                                    <td className="px-6 py-4">{culture.azgaarId || "-"}</td>
                                </tr>
                            ))}
                            {(!cultures || cultures.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Aucune culture trouvée.
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
