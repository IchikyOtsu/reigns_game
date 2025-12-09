import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CountriesPage() {
    let countries: any[] = [];
    let error = null;

    try {
        // Récupération des pays avec leurs relations
        // Note: La syntaxe Player(*) suppose que la relation est détectée par Supabase via les clés étrangères
        const { data, error: supabaseError } = await supabase
            .from('Country')
            .select(`
        *,
        player:Player(*),
        religion:Religion(*),
        culture:Culture(*)
      `);

        if (supabaseError) {
            throw supabaseError;
        }

        countries = data || [];
    } catch (e: any) {
        console.error("Erreur Supabase:", e);
        error = "Impossible de récupérer les données. " + (e.message || "");
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Liste des Pays</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country) => (
                    <Link href={`/countries/${country.id}`} key={country.id} className="block">
                        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white text-black">
                            <h2 className="text-xl font-semibold mb-2">{country.name}</h2>
                            <p className="text-gray-600">Capitale: {country.capital}</p>
                            <p className="text-gray-600">Régime: {country.regime}</p>
                            <div className="mt-4 flex justify-between text-sm text-gray-500">
                                <span>Pop: {country.population?.toLocaleString()}</span>
                                <span>{country.areaKm2?.toLocaleString()} km²</span>
                            </div>
                            {country.player && (
                                <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                                    Joueur: {country.player.discordPseudo}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}

                {countries.length === 0 && !error && (
                    <p className="text-gray-500">Aucun pays trouvé dans la base de données.</p>
                )}
            </div>
        </div>
    );
}