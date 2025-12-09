"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCulture } from "../../actions";

interface Props {
    culture: any;
    onSuccess: () => void;
}

export default function EditCultureForm({ culture, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(culture.color || "#000000");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', culture.id);
        formData.set('color', selectedColor);

        try {
            await updateCulture(formData);
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

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Culture</label>
                    <input required name="name" defaultValue={culture.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Couleur (Hex)</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="h-10 w-20 rounded-md border border-slate-300 p-1 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            placeholder="#RRGGBB"
                            className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optionnel)</label>
                    <textarea name="description" defaultValue={culture.description || ""} rows={3} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ID Azgaar (Optionnel)</label>
                    <input name="azgaarId" defaultValue={culture.azgaarId || ""} type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrer" : "Modifier la Culture"}
                </button>
            </div>
        </form>
    );
}
