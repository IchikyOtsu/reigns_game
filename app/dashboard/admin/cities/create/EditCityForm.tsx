"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCity } from "../../actions";

interface Props {
    city: any;
    provinces: any[];
    onSuccess: () => void;
}

export default function EditCityForm({ city, provinces, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', city.id);

        try {
            await updateCity(formData);
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
            <input type="hidden" name="countryId" value={city.countryId} />
            <input type="hidden" name="population" value={city.population || ""} />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Ville</label>
                    <input required name="name" defaultValue={city.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                    <select required name="provinceId" defaultValue={city.provinceId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner une province</option>
                        {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="flex items-center">
                        <input id="isCapital" name="isCapital" type="checkbox" defaultChecked={city.isCapital} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="isCapital" className="ml-2 block text-sm text-slate-900">Capitale</label>
                    </div>
                    <div className="flex items-center">
                        <input id="isPort" name="isPort" type="checkbox" defaultChecked={city.isPort} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="isPort" className="ml-2 block text-sm text-slate-900">Port</label>
                    </div>
                    <div className="flex items-center">
                        <input id="isWalled" name="isWalled" type="checkbox" defaultChecked={city.isWalled} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="isWalled" className="ml-2 block text-sm text-slate-900">Fortifiée</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hasCitadel" name="hasCitadel" type="checkbox" defaultChecked={city.hasCitadel} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="hasCitadel" className="ml-2 block text-sm text-slate-900">Citadelle</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hasMarketplace" name="hasMarketplace" type="checkbox" defaultChecked={city.hasMarketplace} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="hasMarketplace" className="ml-2 block text-sm text-slate-900">Marché</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hasReligiousCenter" name="hasReligiousCenter" type="checkbox" defaultChecked={city.hasReligiousCenter} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="hasReligiousCenter" className="ml-2 block text-sm text-slate-900">Centre Religieux</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hasShanty" name="hasShanty" type="checkbox" defaultChecked={city.hasShanty} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="hasShanty" className="ml-2 block text-sm text-slate-900">Bidonville</label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrer" : "Modifier la Ville"}
                </button>
            </div>
        </form>
    );
}
