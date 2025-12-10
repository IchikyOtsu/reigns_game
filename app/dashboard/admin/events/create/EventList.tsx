"use client";

import { useState } from "react";
import EditEventForm from "./EditEventForm";

export default function EventList({ events, bonusTypes }: { events: any[]; bonusTypes: any[] }) {
  const [editing, setEditing] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  return (
    <div className="divide-y divide-slate-200">
      {events.length === 0 && (
        <div className="p-6 text-slate-500">Aucun événement.</div>
      )}
      {(events.filter(ev => (
        filter === 'all' || (filter === 'active' && ev.isActive) || (filter === 'inactive' && !ev.isActive)
      ))).map((ev) => (
        <div key={ev.id} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{ev.name}</h3>
              <p className="text-sm text-slate-600">{ev.description || '—'}</p>
              <p className="text-sm text-slate-600 mt-1">Pays: <span className="font-medium">{ev.country?.name || ev.countryId}</span></p>
              <p className="text-sm mt-1">
                <span className={ev.isActive ? 'text-green-600' : 'text-slate-500'}>{ev.isActive ? 'Actif' : 'Inactif'}</span>
                <span className="text-slate-600"> • {ev.activeFor} tour(s)</span>
              </p>
              <div className="mt-3 text-sm text-slate-700">
                <span className="font-medium">Bonus:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(ev.bonuses || []).map((b: any) => (
                    <span key={b.id} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {b.bonusType?.name}: {(Math.round((b.modifierValue || 0) * 1000)/10)}%
                    </span>
                  ))}
                  {(ev.bonuses || []).length === 0 && (
                    <span className="text-slate-500">Aucun bonus</span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setEditing(ev)} className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Modifier</button>
          </div>
        </div>
      ))}

      <div className="p-4 border-t flex items-center gap-3">
        <span className="text-sm text-slate-600">Filtrer:</span>
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all'?'bg-slate-200':'bg-slate-100'}`}>Tous</button>
        <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded ${filter==='active'?'bg-slate-200':'bg-slate-100'}`}>Actifs</button>
        <button onClick={() => setFilter('inactive')} className={`px-3 py-1 rounded ${filter==='inactive'?'bg-slate-200':'bg-slate-100'}`}>Inactifs</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Modifier l'Événement</h3>
              <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-700">✖</button>
            </div>
            <div className="p-6">
              <EditEventForm event={editing} bonusTypes={bonusTypes} onClose={() => setEditing(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
