"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface City {
    id: string;
    name: string;
    population: number;
    isCapital: boolean;
    isPort: boolean;
    isWalled: boolean;
    hasCitadel: boolean;
    hasMarketplace: boolean;
    hasReligiousCenter: boolean;
    hasShanty: boolean;
}

interface CityGridProps {
    cities: City[];
}

export default function CityGrid({ cities }: CityGridProps) {
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    if (!cities || cities.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">Aucune ville fondée pour le moment.</p>
            </div>
        );
    }

    const getCityIcon = (city: City) => {
        if (city.isCapital) return "👑";
        if (city.hasCitadel) return "🏯";
        if (city.isPort) return "⚓";
        return "🏘️";
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city) => (
                    <button
                        key={city.id}
                        onClick={() => setSelectedCity(city)}
                        className="group relative flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all overflow-hidden text-left"
                    >
                        <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500">
                            {getCityIcon(city)}
                        </div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-700 transition-colors">
                                    {city.name}
                                </h3>
                                {city.isCapital && (
                                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Capitale
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                                <span>👥</span>
                                <span>{city.population.toLocaleString()} habitants</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {city.isPort && <span title="Port" className="text-lg">⚓</span>}
                                {city.isWalled && <span title="Fortifiée" className="text-lg">🏰</span>}
                                {city.hasMarketplace && <span title="Marché" className="text-lg">🏪</span>}
                                {city.hasReligiousCenter && <span title="Centre Religieux" className="text-lg">⛪</span>}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <Modal
                isOpen={!!selectedCity}
                onClose={() => setSelectedCity(null)}
                title={selectedCity?.name || ""}
            >
                <div className="p-6">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-6xl shadow-inner">
                            {selectedCity && getCityIcon(selectedCity)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Population</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {selectedCity?.population.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Statut</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {selectedCity?.isCapital ? "Capitale du Royaume" : "Ville de Province"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Infrastructures & Caractéristiques</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FeatureItem 
                                active={selectedCity?.isCapital} 
                                icon="👑" 
                                label="Capitale" 
                                description="Siège du gouvernement et du pouvoir royal."
                            />
                            <FeatureItem 
                                active={selectedCity?.isPort} 
                                icon="⚓" 
                                label="Port" 
                                description="Accès au commerce maritime et à la pêche."
                            />
                            <FeatureItem 
                                active={selectedCity?.isWalled} 
                                icon="🏰" 
                                label="Fortifiée" 
                                description="Murs de protection contre les envahisseurs."
                            />
                            <FeatureItem 
                                active={selectedCity?.hasCitadel} 
                                icon="🏯" 
                                label="Citadelle" 
                                description="Forteresse militaire avancée."
                            />
                            <FeatureItem 
                                active={selectedCity?.hasMarketplace} 
                                icon="🏪" 
                                label="Marché" 
                                description="Centre de commerce et d'échanges."
                            />
                            <FeatureItem 
                                active={selectedCity?.hasReligiousCenter} 
                                icon="⛪" 
                                label="Centre Religieux" 
                                description="Lieu de culte majeur et de pèlerinage."
                            />
                            <FeatureItem 
                                active={selectedCity?.hasShanty} 
                                icon="🏚️" 
                                label="Bidonville" 
                                description="Quartiers pauvres et insalubres."
                                isNegative
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

function FeatureItem({ active, icon, label, description, isNegative = false }: { active?: boolean, icon: string, label: string, description: string, isNegative?: boolean }) {
    if (!active) return null;
    
    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${isNegative ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <span className="text-2xl">{icon}</span>
            <div>
                <p className={`font-semibold ${isNegative ? 'text-red-900' : 'text-emerald-900'}`}>{label}</p>
                <p className={`text-xs ${isNegative ? 'text-red-700' : 'text-emerald-700'}`}>{description}</p>
            </div>
        </div>
    );
}
