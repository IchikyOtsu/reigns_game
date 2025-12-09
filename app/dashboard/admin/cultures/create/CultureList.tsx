"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EditCultureForm from "./EditCultureForm";

interface Props {
    cultures: any[];
}

export default function CultureList({ cultures }: Props) {
    const [selectedCulture, setSelectedCulture] = useState<any | null>(null);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Cultures ({cultures?.length || 0})</h2>
                    <p className="text-sm text-slate-500 mt-1">Cliquez sur une ligne pour modifier.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Couleur</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">ID Azgaar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cultures?.map((culture) => (
                                <tr
                                    key={culture.id}
                                    onClick={() => setSelectedCulture(culture)}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">{culture.name}</td>
                                    <td className="px-6 py-4">
                                        {culture.color && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: culture.color }}></div>
                                                {culture.color}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={culture.description || ""}>
                                        {culture.description || "-"}
                                    </td>
                                    <td className="px-6 py-4">{culture.azgaarId || "-"}</td>
                                </tr>
                            ))}
                            {(!cultures || cultures.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Aucune culture trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={!!selectedCulture}
                onClose={() => setSelectedCulture(null)}
                title={`Modifier ${selectedCulture?.name}`}
            >
                {selectedCulture && (
                    <EditCultureForm
                        culture={selectedCulture}
                        onSuccess={() => setSelectedCulture(null)}
                    />
                )}
            </Modal>
        </>
    );
}
