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
            <input type="hidden" name="type" value={city.type || ""} />

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

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ID Azgaar (Optionnel)</label>
                    <input name="azgaarId" defaultValue={city.azgaarId || ""} type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div className="flex items-center gap-2 pt-6">
                    <input
                        type="checkbox"
                        name="isCapital"
                        id="isCapital"
                        defaultChecked={city.isCapital}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="isCapital" className="text-sm font-medium text-slate-700">
                        Est une capitale
                    </label>
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
