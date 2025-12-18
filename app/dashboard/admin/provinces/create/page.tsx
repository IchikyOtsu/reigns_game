import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateProvinceForm from "./CreateProvinceForm";
import ProvinceList from "./ProvinceList";

export default async function CreateProvincePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch countries for the dropdown
    const { data: countries } = await supabaseAdmin
        .from('Country')
        .select('id, name')
        .order('name');

    // Fetch existing provinces for the list
    const { data: provinces } = await supabaseAdmin
        .from('Province')
        .select(`
            *,
            country:Country(name),
            biomes:ProvinceBiome(
                cellCount,
                biome:Biome(id, name)
            )
        `)
        .order('name');

    // Fetch available biomes
    const { data: biomes } = await supabaseAdmin
        .from('Biome')
        .select('id, name')
        .order('name');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Provinces</h1>
                <p className="text-slate-600">Créer et visualiser les provinces.</p>
            </header>

            <CreateProvinceForm countries={countries || []} biomes={biomes || []} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Provinces ({provinces?.length || 0})</h2>
                </div>
                <ProvinceList provinces={provinces || []} countries={countries || []} biomes={biomes || []} />
            </div>
        </div>
    );
}
