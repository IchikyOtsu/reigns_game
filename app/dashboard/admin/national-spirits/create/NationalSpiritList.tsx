"use client";

import { useState } from "react";
import EditNationalSpiritForm from "./EditNationalSpiritForm";

interface NationalSpiritListProps {
    spirits: any[];
    countries: { id: string; name: string }[];
    bonusTypes: { id: string; name: string }[];
    icons: string[];
}

export default function NationalSpiritList({ spirits, countries, bonusTypes, icons }: NationalSpiritListProps) {
    const [editing, setEditing] = useState<any | null>(null);
    const [filterText, setFilterText] = useState("");

    const filteredSpirits = spirits.filter(s => 
        s.name.toLowerCase().includes(filterText.toLowerCase()) ||
        s.country?.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Esprits Nationaux ({spirits.length})</h2>
                <input 
                    type="text" 
                    placeholder="Filtrer par nom ou pays..." 
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <div className="divide-y divide-slate-200">
                {filteredSpirits.length === 0 && (
                    <div className="p-6 text-slate-500 text-center">Aucun esprit national trouvé.</div>
                )}
                
                {filteredSpirits.map((spirit) => (
                    <div key={spirit.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex-shrink-0">
                            <img 
                                src={`/goals/${spirit.icon}`} 
                                alt={spirit.name} 
                                className="w-full h-full object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="20" font-size="20">👻</text></svg>' }}
                            />
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{spirit.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-1">
                                        {spirit.country?.name || "Pays inconnu"}
                                    </p>
                                    <p className="text-sm text-slate-600 mb-2">{spirit.description || '—'}</p>
                                </div>
                                <button 
                                    onClick={() => setEditing(spirit)} 
                                    className="px-3 py-1.5 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                                >
                                    Modifier
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(spirit.bonuses || []).map((b: any) => (
                                    <span key={b.id} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs border border-amber-100">
                                        {b.bonusType?.name}: {b.modifierValue > 0 ? '+' : ''}{b.modifierValue}
                                    </span>
                                ))}
                                {(spirit.bonuses || []).length === 0 && (
                                    <span className="text-xs text-slate-400 italic">Aucun bonus</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-semibold text-lg">Modifier l'Esprit National</h3>
                            <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-700 text-xl">✖</button>
                        </div>
                        <div className="p-6">
                            <EditNationalSpiritForm 
                                spirit={editing} 
                                countries={countries}
                                bonusTypes={bonusTypes}
                                icons={icons}
                                onClose={() => setEditing(null)} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
