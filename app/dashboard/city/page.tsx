import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CityGrid from "./CityGrid";

export default async function CityPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // Récupérer le pays du joueur et ses villes
    const { data: player, error } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                id,
                name,
                cities:City!City_countryId_fkey(
                    id, 
                    name, 
                    population, 
                    isCapital, 
                    isPort, 
                    isWalled, 
                    hasCitadel, 
                    hasMarketplace, 
                    hasReligiousCenter, 
                    hasShanty
                )
            )
        `)
        .eq('discordId', discordId)
        .single();

    if (error) {
        console.error("Error fetching cities:", error);
        return <div className="p-6 text-red-600">Erreur lors du chargement des villes.</div>;
    }

    const country = player?.country;
    // @ts-ignore
    const countryData = Array.isArray(country) ? country[0] : country;

    if (!countryData) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Mes Villes</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays.</p>
            </div>
        );
    }

    const cities = countryData.cities || [];
    // Trier les villes : Capitale en premier, puis par population décroissante
    cities.sort((a: any, b: any) => {
        if (a.isCapital) return -1;
        if (b.isCapital) return 1;
        return b.population - a.population;
    });

    return (
        <div className="space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Villes du Royaume</h1>
                <p className="text-slate-600">
                    Gestion et aperçu des {cities.length} cités de {countryData.name}
                </p>
            </header>

            <CityGrid cities={cities} />
        </div>
    );
}
