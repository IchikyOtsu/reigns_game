"use client";

import { useState } from "react";

export default function GoalIconViewer({ icons }: { icons: string[] }) {
    const [selectedIcon, setSelectedIcon] = useState<string>(icons[0] || "");

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-md">
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sélectionner une icône
                </label>
                <select
                    value={selectedIcon}
                    onChange={(e) => setSelectedIcon(e.target.value)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                >
                    {icons.map((icon) => (
                        <option key={icon} value={icon}>
                            {icon}
                        </option>
                    ))}
                </select>
            </div>

            {selectedIcon && (
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center mb-4 p-4">
                        <img
                            src={`/goals/${selectedIcon}`}
                            alt={selectedIcon}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="font-medium text-slate-900">{selectedIcon}</p>
                </div>
            )}
            
            {icons.length === 0 && (
                <p className="text-slate-500 text-center">Aucune icône trouvée dans /public/goals</p>
            )}
        </div>
    );
}
