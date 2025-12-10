"use client";

import { useState } from "react";

interface Event {
    id: string;
    name: string;
    description: string | null;
    activeFor: number;
    isActive: boolean;
    bonuses?: any[];
}

export default function EventList({ events }: { events: Event[] }) {
    const [sortBy, setSortBy] = useState<'name' | 'turns'>('turns');
    const [filterText, setFilterText] = useState('');

    // Filter active events only (just in case, though parent should probably pass only active ones)
    // And apply text filter
    const filteredEvents = events
        .filter(e => e.isActive)
        .filter(e => 
            e.name.toLowerCase().includes(filterText.toLowerCase()) || 
            (e.description && e.description.toLowerCase().includes(filterText.toLowerCase()))
        );

    // Sort
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else {
            return a.activeFor - b.activeFor; // Ascending turns
        }
    });

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span>⚡</span> Événements Actifs ({filteredEvents.length})
                </h2>
                
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <select 
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'turns')}
                    >
                        <option value="turns">Tours restants</option>
                        <option value="name">Nom</option>
                    </select>
                </div>
            </div>

            {sortedEvents.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
                    Aucun événement actif pour le moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
                            {/* Header Color Strip */}
                            <div className="h-1 bg-gradient-to-r from-amber-500 to-red-500"></div>
                            
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 leading-tight">{event.name}</h3>
                                </div>
                                
                                <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3" title={event.description || ''}>
                                    {event.description || 'Aucune description.'}
                                </p>

                                {/* Turn Counter - Centered visually in the card bottom or as a badge */}
                                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tours Restants</span>
                                        <div className="text-2xl font-bold text-amber-600">
                                            {event.activeFor}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hover effect or decoration */}
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-4xl">⚡</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
