import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCityForm from "./CreateCityForm";
import CityList from "./CityList";

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
                <CityList cities={cities || []} provinces={provinces || []} />
            </div>
        </div>
    );
}
