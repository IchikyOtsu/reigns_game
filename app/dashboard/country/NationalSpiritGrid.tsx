"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface Bonus {
    modifierValue: number;
    bonusType: {
        name: string;
    };
}

interface NationalSpirit {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    bonuses: Bonus[];
}

interface NationalSpiritGridProps {
    spirits: NationalSpirit[];
}

export default function NationalSpiritGrid({ spirits }: NationalSpiritGridProps) {
    const [selectedSpirit, setSelectedSpirit] = useState<NationalSpirit | null>(null);

    if (!spirits || spirits.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🕊️</span> Esprits Nationaux
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {spirits.map((spirit) => (
                    <button
                        key={spirit.id}
                        onClick={() => setSelectedSpirit(spirit)}
                        className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-center"
                    >
                        <div className="w-16 h-16 mb-3 relative">
                            <img
                                src={`/goals/${spirit.icon}`}
                                alt={spirit.name}
                                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 line-clamp-2">
                            {spirit.name}
                        </span>
                    </button>
                ))}
            </div>

            <Modal
                isOpen={!!selectedSpirit}
                onClose={() => setSelectedSpirit(null)}
                title={selectedSpirit?.name || ""}
            >
                <div className="p-6 space-y-6">
                    <div className="flex justify-center">
                        <div className="w-32 h-32">
                            {selectedSpirit && (
                                <img
                                    src={`/goals/${selectedSpirit.icon}`}
                                    alt={selectedSpirit.name}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-slate-700 leading-relaxed">
                            {selectedSpirit?.description || "Aucune description disponible."}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Effets</h4>
                        {selectedSpirit?.bonuses && selectedSpirit.bonuses.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedSpirit.bonuses.map((bonus, idx) => (
                                    <li key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="text-slate-700 font-medium">{bonus.bonusType.name}</span>
                                        <span className={`font-bold ${bonus.modifierValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {bonus.modifierValue > 0 ? '+' : ''}{Math.round(bonus.modifierValue * 100)}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic">Aucun effet actif.</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
