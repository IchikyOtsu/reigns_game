"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EditCountryForm from "./EditCountryForm";

interface Props {
    countries: any[];
    cultures: any[];
}

export default function CountryList({ countries, cultures }: Props) {
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (country: any) => {
        setSelectedCountry(country);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCountry(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Culture</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Couleur</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {countries.map((country) => (
                            <tr
                                key={country.id}
                                onClick={() => handleRowClick(country)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{country.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{country.culture?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: country.color || '#000000' }}></div>
                                        {country.color}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {countries.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                                    Aucun pays créé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Modifier ${selectedCountry?.name}`}
            >
                {selectedCountry && (
                    <EditCountryForm
                        country={selectedCountry}
                        cultures={cultures}
                        onSuccess={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}
