import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCityForm from "./CreateCityForm";

export default async function CreateCityPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch countries
    const { data: countries } = await supabaseAdmin
        .from('Country')
        .select('id, name')
        .order('name');

    // Fetch provinces
    const { data: provinces } = await supabaseAdmin
        .from('Province')
        .select('id, name, countryId')
        .order('name');

    // Fetch existing cities
    const { data: cities, error: citiesError } = await supabaseAdmin
        .from('City')
        .select(`
            *,
            country:Country!countryId(name),
            province:Province(name)
        `)
        .order('name');

    if (citiesError) {
        console.error("Error fetching cities:", citiesError);
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Villes</h1>
                <p className="text-slate-600">Créer et visualiser les villes.</p>
            </header>

            <CreateCityForm countries={countries || []} provinces={provinces || []} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Villes ({cities?.length || 0})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Pays</th>
                                <th className="px-6 py-4">Province</th>
                                <th className="px-6 py-4">Population</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Capitale</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cities?.map((city) => (
                                <tr key={city.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{city.name}</td>
                                    <td className="px-6 py-4">{city.country?.name}</td>
                                    <td className="px-6 py-4">{city.province?.name || "-"}</td>
                                    <td className="px-6 py-4">{city.population?.toLocaleString() || "-"}</td>
                                    <td className="px-6 py-4">{city.type || "-"}</td>
                                    <td className="px-6 py-4">
                                        {city.isCapital ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                Oui
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">Non</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!cities || cities.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        Aucune ville trouvée.
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
