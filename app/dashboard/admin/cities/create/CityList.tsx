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
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pays</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Province</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Population</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Caractéristiques</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{city.country?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{city.province?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{city.population?.toLocaleString() || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    <div className="flex flex-wrap gap-1">
                                        {city.isCapital && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Capitale</span>}
                                        {city.isPort && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Port</span>}
                                        {city.isWalled && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Fortifiée</span>}
                                        {city.hasCitadel && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Citadelle</span>}
                                        {city.hasMarketplace && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Marché</span>}
                                        {city.hasReligiousCenter && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Religieux</span>}
                                        {city.hasShanty && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Bidonville</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {cities.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
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
