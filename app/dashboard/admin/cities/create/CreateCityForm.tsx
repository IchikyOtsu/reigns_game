"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createCity } from "../../actions";

interface Props {
    countries: any[];
    provinces: any[];
}

export default function CreateCityForm({ countries, provinces }: Props) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [selectedCountryId, setSelectedCountryId] = useState<string>("");

    // Filter provinces based on selected country
    const filteredProvinces = useMemo(() => {
        if (!selectedCountryId) return [];
        return provinces.filter(p => p.countryId === selectedCountryId);
    }, [selectedCountryId, provinces]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);

        try {
            await createCity(formData);

            setSuccess("Ville créée avec succès !");
            formRef.current?.reset();
            setSelectedCountryId(""); // Reset selection
            router.refresh();

        } catch (err: any) {
            console.error("Erreur lors de la création:", err);
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Créer une Ville</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Ville</label>
                    <input required name="name" type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                {/* Pays */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
                    <select
                        required
                        name="countryId"
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        value={selectedCountryId}
                        onChange={(e) => setSelectedCountryId(e.target.value)}
                    >
                        <option value="">Sélectionner un pays</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Province (Filtrée) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                    <select
                        required
                        name="provinceId"
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        disabled={!selectedCountryId}
                    >
                        <option value="">Sélectionner une province</option>
                        {filteredProvinces.map((province) => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                    </select>
                    {!selectedCountryId && <p className="text-xs text-slate-500 mt-1">Sélectionnez un pays d'abord.</p>}
                </div>

                {/* Population */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Population</label>
                    <input name="population" type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type (ex: Port, Bourg...)</label>
                    <input name="type" type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                {/* Capitale */}
                <div className="md:col-span-2">
                    <div className="flex items-center">
                        <input id="isCapital" name="isCapital" type="checkbox" className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                        <label htmlFor="isCapital" className="ml-2 block text-sm text-slate-900">
                            Est une capitale
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? "Création..." : "Créer la Ville"}
                </button>
            </div>
        </form>
    );
}
