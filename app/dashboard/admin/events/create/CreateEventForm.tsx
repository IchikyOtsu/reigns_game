"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "../../actions";

interface Props {
  countries: { id: string; name: string }[];
  bonusTypes: { id: string; name: string; description?: string }[];
}

export default function CreateEventForm({ countries, bonusTypes }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bonuses, setBonuses] = useState<Array<{ bonusTypeId: string; modifierValue: string }>>([]);

  const addBonusRow = () => {
    setBonuses([...bonuses, { bonusTypeId: "", modifierValue: "0.10" }]);
  };

  const updateBonusRow = (index: number, field: 'bonusTypeId' | 'modifierValue', value: string) => {
    const next = [...bonuses];
    // prevent duplicate bonus types
    if (field === 'bonusTypeId' && value) {
      const duplicateIndex = next.findIndex((b, i) => b.bonusTypeId === value && i !== index);
      if (duplicateIndex !== -1) return; // ignore duplicates
    }
    next[index] = { ...next[index], [field]: value } as any;
    setBonuses(next);
  };

  const removeBonusRow = (index: number) => {
    const next = bonuses.filter((_, i) => i !== index);
    setBonuses(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    // pack bonuses as JSON
    formData.set('bonuses', JSON.stringify(bonuses.map(b => ({
      bonusTypeId: b.bonusTypeId,
      modifierValue: parseFloat(b.modifierValue || '0')
    }))));

    try {
      const res = await createEvent(formData);
      setSuccess("Événement créé avec succès.");
      // reset form fields
      (e.currentTarget as HTMLFormElement).reset();
      setBonuses([]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const availableBonusTypes = (selectedId?: string) => bonusTypes.map(bt => (
    <option key={bt.id} value={bt.id}>{bt.name}</option>
  ));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">{success}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 border-b pb-2">Informations de l'événement</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input required name="name" type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
            <select required name="countryId" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
              <option value="">Sélectionner un pays...</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de tours actifs</label>
            <input name="activeFor" type="number" min="1" defaultValue={1} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
            <p className="text-xs text-slate-500 mt-1">Par défaut: 1 tour. L'événement est actif automatiquement.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 border-b pb-2">Bonus de l'événement</h3>
          <p className="text-xs text-slate-500">Ajoutez un ou plusieurs bonus (format décimal: 0.15 = 15%).</p>
          <div className="space-y-3">
            {bonuses.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <select 
                  value={b.bonusTypeId}
                  onChange={(e) => updateBonusRow(i, 'bonusTypeId', e.target.value)}
                  className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="">Choisir un type de bonus...</option>
                  {availableBonusTypes(b.bonusTypeId)}
                </select>
                <input 
                  type="number" step="0.01" min="-1" max="1"
                  value={b.modifierValue}
                  onChange={(e) => updateBonusRow(i, 'modifierValue', e.target.value)}
                  placeholder="0.10"
                  className="w-28 rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
                <button type="button" onClick={() => removeBonusRow(i)} className="px-3 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Supprimer</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addBonusRow} className="px-4 py-2 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100">Ajouter un bonus</button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading || bonuses.some(b => !b.bonusTypeId)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer l'Événement"}
        </button>
      </div>
    </form>
  );
}
