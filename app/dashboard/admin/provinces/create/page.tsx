import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import CreateProvinceForm from "./CreateProvinceForm";

export default async function CreateProvincePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch countries for the dropdown
    const { data: countries } = await supabase
        .from('Country')
        .select('id, name')
        .order('name');

    // Fetch existing provinces for the list
    const { data: provinces } = await supabase
        .from('Province')
        .select(`
            *,
            country:Country(name)
        `)
        .order('name');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Provinces</h1>
                <p className="text-slate-600">Créer et visualiser les provinces.</p>
            </header>

            <CreateProvinceForm countries={countries || []} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Provinces ({provinces?.length || 0})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Pays</th>
                                <th className="px-6 py-4">ID Azgaar</th>
                                <th className="px-6 py-4">Couleur</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {provinces?.map((province) => (
                                <tr key={province.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{province.name}</td>
                                    <td className="px-6 py-4">{province.country?.name}</td>
                                    <td className="px-6 py-4">{province.azgaarId || "-"}</td>
                                    <td className="px-6 py-4">
                                        {province.color && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: province.color }}></div>
                                                {province.color}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!provinces || provinces.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Aucune province trouvée.
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
