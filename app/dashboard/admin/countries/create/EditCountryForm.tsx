"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCountry } from "../../actions";

interface Props {
    country: any;
    cultures: any[];
    onSuccess: () => void;
}

export default function EditCountryForm({ country, cultures, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', country.id);

        try {
            await updateCountry(formData);
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Pays</label>
                    <input required name="name" defaultValue={country.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Culture</label>
                    <select required name="cultureId" defaultValue={country.cultureId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner une culture</option>
                        {cultures.map((culture) => (
                            <option key={culture.id} value={culture.id}>
                                {culture.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Couleur (Hex)</label>
                    <input name="color" defaultValue={country.color || "#000000"} type="color" className="h-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrer" : "Modifier le Pays"}
                </button>
            </div>
        </form>
    );
}
