"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNationalSpirit } from "../../actions";

interface EditNationalSpiritFormProps {
    spirit: any;
    countries: { id: string; name: string }[];
    bonusTypes: { id: string; name: string }[];
    icons: string[];
    onClose: () => void;
}

export default function EditNationalSpiritForm({ spirit, countries, bonusTypes, icons, onClose }: EditNationalSpiritFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [name, setName] = useState(spirit.name || "");
    const [description, setDescription] = useState(spirit.description || "");
    const [countryId, setCountryId] = useState(spirit.countryId || "");
    const [icon, setIcon] = useState(spirit.icon || icons[0] || "");
    
    const [bonuses, setBonuses] = useState<{ bonusTypeName: string; modifierValue: string }[]>(
        (spirit.bonuses || []).map((b: any) => ({
            bonusTypeName: b.bonusType?.name || "",
            modifierValue: String(b.modifierValue || 0)
        }))
    );

    const addBonusRow = () => {
        setBonuses([...bonuses, { bonusTypeName: "", modifierValue: "0" }]);
    };

    const updateBonusRow = (index: number, field: 'bonusTypeName' | 'modifierValue', value: string) => {
        const next = [...bonuses];
        next[index] = { ...next[index], [field]: value };
        setBonuses(next);
    };

    const removeBonusRow = (index: number) => {
        setBonuses(bonuses.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await updateNationalSpirit({
                id: spirit.id,
                name,
                description,
                countryId,
                icon,
                bonuses: bonuses.map(b => ({
                    bonusTypeName: b.bonusTypeName,
                    modifierValue: parseFloat(b.modifierValue)
                })).filter(b => b.bonusTypeName && !isNaN(b.modifierValue))
            });

            setSuccess("Esprit National modifié avec succès !");
            router.refresh();
            // Optional: close modal after short delay
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 p-3 rounded">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
                        <select
                            value={countryId}
                            onChange={(e) => setCountryId(e.target.value)}
                            className="w-full rounded-md border-slate-300"
                            required
                        >
                            <option value="">Sélectionner un pays...</option>
                            {countries.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'Esprit</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border-slate-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-slate-300"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Icône (Goal)</label>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <select
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="w-full rounded-md border-slate-300"
                                >
                                    {icons.map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-1">
                                {icon ? (
                                    <img src={`/goals/${icon}`} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">Aperçu</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">Bonus</label>
                            <button
                                type="button"
                                onClick={addBonusRow}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                + Ajouter un bonus
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {bonuses.map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <select
                                        value={b.bonusTypeName}
                                        onChange={(e) => updateBonusRow(i, 'bonusTypeName', e.target.value)}
                                        className="flex-1 rounded-md border-slate-300 text-sm"
                                    >
                                        <option value="">Type...</option>
                                        {bonusTypes.map(bt => (
                                            <option key={bt.id} value={bt.name}>{bt.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={b.modifierValue}
                                        onChange={(e) => updateBonusRow(i, 'modifierValue', e.target.value)}
                                        className="w-24 rounded-md border-slate-300 text-sm"
                                        placeholder="Val"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeBonusRow(i)}
                                        className="text-red-500 hover:text-red-700 px-2"
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                            {bonuses.length === 0 && (
                                <p className="text-sm text-slate-500 italic">Aucun bonus ajouté.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-100">Fermer</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                >
                    {loading ? "Modification..." : "Sauvegarder"}
                </button>
            </div>
        </form>
    );
}
