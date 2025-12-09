"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EditProvinceForm from "./EditProvinceForm";

interface Props {
    provinces: any[];
    countries: any[];
}

export default function ProvinceList({ provinces, countries }: Props) {
    const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (province: any) => {
        setSelectedProvince(province);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProvince(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pays</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Azgaar ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Couleur</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {provinces.map((province) => (
                            <tr
                                key={province.id}
                                onClick={() => handleRowClick(province)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{province.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{province.country?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{province.azgaarId || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: province.color || '#000000' }}></div>
                                        {province.color}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {provinces.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                                    Aucune province créée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Modifier ${selectedProvince?.name}`}
            >
                {selectedProvince && (
                    <EditProvinceForm
                        province={selectedProvince}
                        countries={countries}
                        onSuccess={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}
