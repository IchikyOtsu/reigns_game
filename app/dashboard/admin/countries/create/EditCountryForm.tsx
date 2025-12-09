"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCountry } from "../../actions";
import { supabase } from "@/lib/supabase";

interface Props {
    country: any;
    cultures: any[];
    regimes: any[];
    cities: any[];
    onSuccess: () => void;
}

export default function EditCountryForm({ country, cultures, regimes, cities, onSuccess }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(country.color || "#000000");
    const [emblemFile, setEmblemFile] = useState<File | null>(null);

    // Filtrer les villes pour n'afficher que celles du pays
    const countryCities = cities.filter(city => city.countryId === country.id);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('id', country.id);
        formData.set('color', selectedColor);

        try {
            let emblemUrl = "";

            // Upload de l'emblème si présent (Côté Client)
            if (emblemFile) {
                const fileExt = emblemFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('emblems')
                    .upload(filePath, emblemFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('emblems')
                    .getPublicUrl(filePath);

                emblemUrl = publicUrl;
            }

            // Ajouter l'URL de l'emblème au FormData pour l'action serveur
            if (emblemUrl) {
                formData.set('emblem', emblemUrl);
            }

            await updateCountry(formData);
            router.refresh();
            onSuccess();
        } catch (err: any) {
            console.error("Erreur lors de la modification:", err);
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="religionId" value={country.religionId || ""} />
            <input type="hidden" name="playerId" value={country.playerId} />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne Gauche */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Pays</label>
                        <input required name="name" defaultValue={country.name} type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Régime</label>
                        <select required name="regimeId" defaultValue={country.regimeId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner un régime</option>
                            {regimes.map((regime) => (
                                <option key={regime.id} value={regime.id}>
                                    {regime.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Culture</label>
                        <select required name="cultureId" defaultValue={country.cultureId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner une culture</option>
                            {cultures.map((culture) => (
                                <option key={culture.id} value={culture.id}>
                                    {culture.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Capitale</label>
                        <select name="capitalId" defaultValue={country.capitalId} className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner une capitale</option>
                            {countryCities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Changer la capitale mettra à jour automatiquement les statuts des villes.</p>
                    </div>
                </div>

                {/* Colonne Droite */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Population</label>
                        <input required name="population" defaultValue={country.population} type="number" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Superficie (km²)</label>
                        <input required name="areaKm2" defaultValue={country.areaKm2} type="number" step="0.01" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Couleur (Hex)</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="h-10 w-20 rounded-md border border-slate-300 p-1 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                placeholder="#RRGGBB"
                                className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Emblème (Image)</label>
                        <div className="flex items-center gap-4">
                            {country.emblem && !emblemFile && (
                                <img src={country.emblem} alt="Actuel" className="w-12 h-12 object-contain border rounded bg-slate-50" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEmblemFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Laisser vide pour conserver l'image actuelle.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrement..." : "Modifier le Pays"}
                </button>
            </div>
        </form>
    );
}
