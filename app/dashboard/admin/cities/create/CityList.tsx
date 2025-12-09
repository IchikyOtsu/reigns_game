"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EditCityForm from "./EditCityForm";

interface Props {
    cities: any[];
    provinces: any[];
}

export default function CityList({ cities, provinces }: Props) {
    const [selectedCity, setSelectedCity] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (city: any) => {
        setSelectedCity(city);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCity(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Province</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID Azgaar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capitale</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {cities.map((city) => (
                            <tr
                                key={city.id}
                                onClick={() => handleRowClick(city)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{city.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{city.province?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{city.azgaarId || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {city.isCapital ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            Capitale
                                        </span>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                        {cities.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                                    Aucune ville créée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Modifier ${selectedCity?.name}`}
            >
                {selectedCity && (
                    <EditCityForm
                        city={selectedCity}
                        provinces={provinces}
                        onSuccess={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}
