"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateReligion } from "../../actions";

interface Props {
    religion: any;
    religionTypes: any[];
    religionForms: any[];
    onSuccess: () => void;
}

export default function EditReligionForm({ religion, religionTypes, religionForms, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(religion.color || "#000000");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', religion.id);
        formData.set('color', selectedColor);

        try {
            await updateReligion(formData);
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Religion</label>
                    <input required name="name" defaultValue={religion.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select name="typeId" defaultValue={religion.typeId || ""} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner un type</option>
                        {religionTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Forme</label>
                    <select name="formId" defaultValue={religion.formId || ""} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner une forme</option>
                        {religionForms.map((form) => (
                            <option key={form.id} value={form.id}>{form.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Divinité Suprême</label>
                    <input name="deityName" defaultValue={religion.deityName || ""} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Potentiel</label>
                    <select name="potential" defaultValue={religion.potential || ""} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                        <option value="">Sélectionner un potentiel</option>
                        <option value="Global">Global</option>
                        <option value="Culture">Culture</option>
                        <option value="State">State</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Surface (km²)</label>
                    <input name="areaKm2" defaultValue={religion.areaKm2 || ""} type="number" step="0.01" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de croyants</label>
                    <input name="followers" defaultValue={religion.followers || ""} type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Facteur d'expansion</label>
                    <input name="expansionFactor" defaultValue={religion.expansionFactor || ""} type="number" step="0.01" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optionnel)</label>
                    <textarea name="description" defaultValue={religion.description || ""} rows={3} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"></textarea>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrer" : "Modifier la Religion"}
                </button>
            </div>
        </form>
    );
}
