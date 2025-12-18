"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProvince } from "../../actions";

interface Props {
    province: any;
    countries: any[];
    biomes: any[];
    onSuccess: () => void;
}

export default function EditProvinceForm({ province, countries, biomes, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialiser les biomes existants
    const [selectedBiomes, setSelectedBiomes] = useState<{ biomeId: string; cellCount: number }[]>(
        province.biomes?.map((pb: any) => ({
            biomeId: pb.biome.id,
            cellCount: pb.cellCount
        })) || []
    );

    const handleAddBiome = () => {
        setSelectedBiomes([...selectedBiomes, { biomeId: "", cellCount: 0 }]);
    };

    const handleRemoveBiome = (index: number) => {
        const newBiomes = [...selectedBiomes];
        newBiomes.splice(index, 1);
        setSelectedBiomes(newBiomes);
    };

    const handleBiomeChange = (index: number, field: 'biomeId' | 'cellCount', value: string | number) => {
        const newBiomes = [...selectedBiomes];
        // @ts-ignore
        newBiomes[index][field] = value;
        setSelectedBiomes(newBiomes);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', province.id);

        // Ajouter les biomes en JSON
        formData.append('biomes', JSON.stringify(selectedBiomes));

        try {
            await updateProvince(formData);
            router.refresh();
            onSuccess();
        } catch (err: any) {
            console.error("Erreur lors de la modification:", err);
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Province</label>
                    <input required name="name" defaultValue={province.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
                    <select required name="countryId" defaultValue={province.countryId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner un pays</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emblème (URL ou Description)</label>
                    <input name="emblem" defaultValue={province.emblem || ""} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Superficie (km²)</label>
                    <input name="areaKm2" defaultValue={province.areaKm2 || ""} type="number" step="0.01" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Population</label>
                    <input name="population" defaultValue={province.population || ""} type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Couleur (Hex)</label>
                    <input name="color" defaultValue={province.color || "#000000"} type="color" className="h-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>
            </div>

            {/* Section Biomes */}
            <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-slate-800">Biomes (Optionnel)</h3>
                    <button
                        type="button"
                        onClick={handleAddBiome}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                        + Ajouter un biome
                    </button>
                </div>

                <div className="space-y-3">
                    {selectedBiomes.map((biome, index) => (
                        <div key={index} className="flex gap-4 items-end bg-slate-50 p-3 rounded-md">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Biome</label>
                                <select
                                    value={biome.biomeId}
                                    onChange={(e) => handleBiomeChange(index, 'biomeId', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                >
                                    <option value="">Choisir...</option>
                                    {biomes.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Cellules</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={biome.cellCount}
                                    onChange={(e) => handleBiomeChange(index, 'cellCount', parseInt(e.target.value))}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveBiome(index)}
                                className="text-red-500 hover:text-red-700 pb-2"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                    {selectedBiomes.length === 0 && (
                        <p className="text-sm text-slate-500 italic">Aucun biome défini.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrer" : "Modifier la Province"}
                </button>
            </div>
        </form>
    );
}
