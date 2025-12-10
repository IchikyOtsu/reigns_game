import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CountryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // Récupérer le pays du joueur avec toutes les relations
    const { data: player, error } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                *,
                capital:City!Country_capitalId_fkey(name),
                regime:Regime(name, category),
                religion:Religion(name),
                culture:Culture(name),
                provinces:Province(id, name, population, areaKm2, emblem),
                cities:City!City_countryId_fkey(id, name, population, isCapital, isPort, isWalled, hasCitadel, hasMarketplace, hasReligiousCenter, hasShanty)
            )
        `)
        .eq('discordId', discordId)
        .single();

    if (error) {
        console.error("Error fetching country details:", error);
        return <div className="p-6 text-red-600">Erreur lors du chargement des données du pays.</div>;
    }

    const country = player?.country;

    // Gestion du cas où country est un tableau (bug potentiel PostgREST)
    const countryData = Array.isArray(country) ? country[0] : country;

    if (!countryData) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Mon Pays</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* En-tête du Pays */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-amber-600 to-amber-800"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                                {countryData.emblem ? (
                                    <img
                                        src={countryData.emblem}
                                        alt={`Emblème de ${countryData.name}`}
                                        className="w-full h-full object-contain rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl">
                                        🏰
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold text-slate-900">{countryData.name}</h1>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: countryData.color || '#000000' }}></span>
                                    <span>{countryData.regime?.name || 'Régime inconnu'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques Générales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-100 pt-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Capitale</p>
                            <p className="font-semibold text-slate-900">{countryData.capital?.name || 'Non définie'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Population Totale</p>
                            <p className="font-semibold text-slate-900">{countryData.population?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Superficie</p>
                            <p className="font-semibold text-slate-900">{countryData.areaKm2?.toLocaleString()} km²</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Culture & Religion</p>
                            <p className="font-semibold text-slate-900">
                                {countryData.culture?.name} • {countryData.religion?.name || 'Aucune'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Stabilité de base</p>
                            <p className="font-semibold text-slate-900">{Math.round(((countryData.stabilityBase ?? 0.5) * 100))}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Lassitude</p>
                            <p className="font-semibold text-slate-900">{Math.round(((countryData.fatigue ?? 0.0) * 100))}%</p>
                        </div>
                    </div>
                            {/* Stabilité actuelle */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-200 flex items-center gap-3">
                                    <span className="text-2xl">🛡️</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Stabilité</h2> </div>
                                </div>
                                <div className="p-8 flex items-center justify-center">
                                    <div className="w-full max-w-md">
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-4 bg-amber-600 rounded-full transition-all"
                                                style={{ width: `${Math.round(((countryData.stabilityBase ?? 0.5) * 100))}%` }}
                                            />
                                        </div>
                                        <div className="mt-3 flex justify-between text-sm text-slate-600">
                                            <span>0%</span>
                                            <span className="font-semibold text-slate-900">{Math.round(((countryData.stabilityBase ?? 0.5) * 100))}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                </div>
            </div>

            {/* Provinces */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🗺️</span> Provinces ({countryData.provinces?.length || 0})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryData.provinces?.map((province: any) => (
                        <div key={province.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-amber-300 transition-colors">
                            <div className="flex items-center gap-4 mb-3">
                                {province.emblem ? (
                                    <img src={province.emblem} alt={province.name} className="w-10 h-10 object-contain" />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">📍</div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-slate-900">{province.name}</h3>
                                    <p className="text-xs text-slate-500">{province.areaKm2?.toLocaleString()} km²</p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600">
                                <span className="font-medium">{province.population?.toLocaleString()}</span> habitants
                            </div>
                        </div>
                    ))}
                    {(!countryData.provinces || countryData.provinces.length === 0) && (
                        <p className="text-slate-500 col-span-full italic">Aucune province enregistrée.</p>
                    )}
                </div>
            </div>

            {/* Villes */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🏘️</span> Villes ({countryData.cities?.length || 0})
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Population</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Caractéristiques</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {countryData.cities?.map((city: any) => (
                                <tr key={city.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {city.isCapital && <span className="mr-2 text-amber-500" title="Capitale">👑</span>}
                                            <span className="text-sm font-medium text-slate-900">{city.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {city.population?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex flex-wrap gap-1">
                                            {city.isPort && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Port</span>}
                                            {city.isWalled && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Fortifiée</span>}
                                            {city.hasCitadel && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Citadelle</span>}
                                            {city.hasMarketplace && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Marché</span>}
                                            {city.hasReligiousCenter && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Religieux</span>}
                                            {city.hasShanty && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Bidonville</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!countryData.cities || countryData.cities.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                                        Aucune ville enregistrée.
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
