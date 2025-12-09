"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EditReligionForm from "./EditReligionForm";

interface Props {
    religions: any[];
    religionTypes: any[];
    religionForms: any[];
}

export default function ReligionList({ religions, religionTypes, religionForms }: Props) {
    const [selectedReligion, setSelectedReligion] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (religion: any) => {
        setSelectedReligion(religion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReligion(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Forme</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Croyants</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Couleur</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {religions.map((religion) => (
                            <tr
                                key={religion.id}
                                onClick={() => handleRowClick(religion)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{religion.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{religion.type?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{religion.form?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{religion.followers?.toLocaleString() || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: religion.color || '#000000' }}></div>
                                        {religion.color}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {religions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                                    Aucune religion créée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Modifier ${selectedReligion?.name}`}
            >
                {selectedReligion && (
                    <EditReligionForm
                        religion={selectedReligion}
                        religionTypes={religionTypes}
                        religionForms={religionForms}
                        onSuccess={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}
