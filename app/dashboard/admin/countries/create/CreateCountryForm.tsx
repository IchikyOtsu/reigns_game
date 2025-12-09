"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { createCountry } from "../../actions";

interface Props {
    regimes: any[];
    cultures: any[];
    religions: any[];
    players: any[];
}

export default function CreateCountryForm({ regimes, cultures, religions, players }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [emblemFile, setEmblemFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Ajouter la couleur sélectionnée
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

            // Appel de l'action serveur pour la création en DB
            await createCountry(formData);

            router.push("/dashboard/admin/users");
            router.refresh();

        } catch (err: any) {
            console.error("Erreur lors de la création:", err);
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations Générales */}
                <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 border-b pb-2">Informations Générales</h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Pays</label>
                        <input required name="name" type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Capitale</label>
                        <input required name="capitalName" type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEmblemFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        <p className="text-xs text-slate-500 mt-1">PNG ou JPG recommandé (500px)</p>
                    </div>
                </div>

                {/* Politique & Culture */}
                <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 border-b pb-2">Politique & Culture</h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Joueur (Dirigeant)</label>
                        <select required name="playerId" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner un joueur...</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>{p.discordPseudo}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Régime</label>
                        <select required name="regimeId" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner un régime...</option>
                            {regimes.map(r => (
                                <option key={r.id} value={r.id}>{r.name} ({r.category})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Culture</label>
                        <select required name="cultureId" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Sélectionner une culture...</option>
                            {cultures.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Religion (Optionnel)</label>
                        <select name="religionId" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                            <option value="">Aucune / Laïque</option>
                            {religions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Démographie */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="font-medium text-slate-900 border-b pb-2">Démographie</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Population Totale</label>
                            <input required name="population" type="number" min="0" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Superficie (km²)</label>
                            <input required name="areaKm2" type="number" min="0" step="0.1" className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Création..." : "Créer le Pays"}
                </button>
            </div>
        </form>
    );
}
