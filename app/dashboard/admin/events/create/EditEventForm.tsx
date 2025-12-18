"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEvent } from "../../actions";

export default function EditEventForm({ event, bonusTypes, onClose }: { event: any; bonusTypes: any[]; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name, setName] = useState(event.name || "");
  const [description, setDescription] = useState(event.description || "");
  const [bonuses, setBonuses] = useState<Array<{ id?: string; bonusTypeName: string; modifierValue: string }>>(
    (event.bonuses || []).map((b: any) => ({ id: b.id, bonusTypeName: b.bonusType?.name, modifierValue: String(b.modifierValue ?? 0) }))
  );
  const [isActive, setIsActive] = useState<boolean>(event.isActive ?? true);
  const [activeFor, setActiveFor] = useState<number>(event.activeFor ?? 1);

  const updateBonusRow = (index: number, field: 'bonusTypeName' | 'modifierValue', value: string) => {
    const next = [...bonuses];
    next[index] = { ...next[index], [field]: value } as any;
    setBonuses(next);
  };

  const removeBonusRow = (index: number) => {
    const next = bonuses.filter((_, i) => i !== index);
    setBonuses(next);
  };

  const addBonusRow = () => {
    setBonuses([...bonuses, { bonusTypeName: "", modifierValue: "0" }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateEvent({
        id: event.id,
        name,
        description,
        bonuses: bonuses.map(b => ({ bonusTypeName: b.bonusTypeName, modifierValue: parseFloat(b.modifierValue || '0') })),
        isActive,
        activeFor
      });
      setSuccess("Événement modifié.");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Actif</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span>{isActive ? 'Oui' : 'Non'}</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de tours actifs</label>
                <input type="number" min={1} value={activeFor} onChange={(e) => setActiveFor(parseInt(e.target.value || '1'))} className="w-full rounded-md border-slate-300" />
              </div>
            </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded">{success}</div>}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-slate-300" />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border-slate-300" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Bonus</h4>
          <button type="button" onClick={addBonusRow} className="text-sm text-blue-600 hover:underline">+ Ajouter un bonus</button>
        </div>
        {bonuses.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={b.bonusTypeName}
              onChange={(e) => updateBonusRow(i, 'bonusTypeName', e.target.value)}
              className="flex-1 rounded-md border-slate-300"
            >
              <option value="">Sélectionner un bonus...</option>
              {bonusTypes.map((bt: any) => (
                <option key={bt.id} value={bt.name}>{bt.name}</option>
              ))}
            </select>
            <input 
              type="number" step="0.01" min="-1" max="1"
              value={b.modifierValue}
              onChange={(e) => updateBonusRow(i, 'modifierValue', e.target.value)}
              className="w-28 rounded-md border-slate-300"
            />
            <button type="button" onClick={() => removeBonusRow(i)} className="px-3 py-2 rounded-md bg-slate-100">Supprimer</button>
          </div>
        ))}
        {bonuses.length === 0 && (
          <p className="text-sm text-slate-500">Aucun bonus.</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-100">Fermer</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-red-600 text-white">Sauvegarder</button>
      </div>
    </form>
  );
}
