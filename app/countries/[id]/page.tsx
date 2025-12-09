import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CountryDetailPage({ params }: PageProps) {
    const { id } = await params;

    let country: any = null;
    let error = null;

    try {
        const { data, error: supabaseError } = await supabase
            .from('Country')
            .select(`
        *,
        player:Player(*),
        religion:Religion(*),
        culture:Culture(*),
        provinces:Province(*),
        cities:City(*)
      `)
            .eq('id', id)
            .single();

        if (supabaseError) {
            // Si code PGRST116, c'est que l'objet n'est pas trouvé (0 rows)
            if (supabaseError.code !== 'PGRST116') {
                throw supabaseError;
            }
        } else {
            country = data;
        }

    } catch (e: any) {
        console.error("Erreur Supabase:", e);
        error = e.message;
    }

    if (!country && !error) {
        notFound();
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                Erreur lors du chargement: {error}
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/countries" className="text-blue-500 hover:underline mb-4 block">
                &larr; Retour à la liste
            </Link>

            <div className="bg-white shadow rounded-lg p-6 text-black">
                <div className="border-b pb-4 mb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{country.name}</h1>
                        <p className="text-xl text-gray-600">Capitale: {country.capital}</p>
                    </div>
                    {country.player && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Dirigé par</p>
                            <p className="font-semibold">{country.player.discordPseudo}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 border-b">Informations Générales</h3>
                        <ul className="space-y-2">
                            <li><span className="font-medium">Régime:</span> {country.regime}</li>
                            <li><span className="font-medium">Population:</span> {country.population?.toLocaleString()} habitants</li>
                            <li><span className="font-medium">Superficie:</span> {country.areaKm2?.toLocaleString()} km²</li>
                            <li><span className="font-medium">Religion:</span> {country.religion?.name || 'Aucune'}</li>
                            <li><span className="font-medium">Culture:</span> {country.culture?.name || 'Aucune'}</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 border-b">Géographie</h3>
                        <p className="mb-2"><span className="font-medium">Provinces:</span> {country.provinces?.length || 0}</p>
                        <p><span className="font-medium">Villes principales:</span> {country.cities?.length || 0}</p>

                        {country.cities && country.cities.length > 0 && (
                            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                                {country.cities.slice(0, 5).map((city: any) => (
                                    <li key={city.id}>
                                        {city.name} {city.isCapital ? '(Capitale)' : ''} - {city.population?.toLocaleString()} hab.
                                    </li>
                                ))}
                                {country.cities.length > 5 && <li>...</li>}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
