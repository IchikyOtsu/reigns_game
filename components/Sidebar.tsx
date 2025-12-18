"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-bold text-2xl tracking-wider text-amber-500">REIGNS</span>
                </Link>
            </div>

            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt="Avatar"
                            className="h-10 w-10 rounded-full border border-slate-600"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-lg font-bold">{session?.user?.name?.[0]}</span>
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                            {/* @ts-ignore */}
                            {session?.user?.role === 'ADMIN' ? 'Administrateur' : 'Joueur'}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="pb-2">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Général
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>📊</span>
                    <span className="font-medium">Vue d'ensemble</span>
                </Link>

                <Link
                    href="/dashboard/map"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/map')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>🗺️</span>
                    <span className="font-medium">Map</span>
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Gestion
                    </p>
                </div>

                <Link
                    href="/dashboard/country"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/country')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>🏰</span>
                    <span className="font-medium">Mon Pays</span>
                </Link>

                <Link
                    href="/dashboard/city"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/city')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>🏘️</span>
                    <span className="font-medium">Villes</span>
                </Link>

                <Link
                    href="/dashboard/economy"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/economy')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>💰</span>
                    <span className="font-medium">Économie</span>
                </Link>

                <Link
                    href="/dashboard/events"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/events')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>⚡</span>
                    <span className="font-medium">Événements</span>
                </Link>

                <Link
                    href="/dashboard/resources"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/resources')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>⛏️</span>
                    <span className="font-medium">Ressources</span>
                </Link>

                <Link
                    href="/dashboard/military"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/military')
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <span>⚔️</span>
                    <span className="font-medium">Armée</span>
                </Link>

                {/* @ts-ignore */}
                {session?.user?.role === 'ADMIN' && (
                    <>
                        <div className="pt-4 pb-2">
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Administration
                            </p>
                        </div>

                        <Link
                            href="/dashboard/admin/users"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/users')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>👥</span>
                            <span className="font-medium">Joueurs</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/countries/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/countries/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>➕</span>
                            <span className="font-medium">Créer un Pays</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/cultures/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/cultures/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🎭</span>
                            <span className="font-medium">Créer une Culture</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/religions/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/religions/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🛐</span>
                            <span className="font-medium">Créer une Religion</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/provinces/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/provinces/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🗺️</span>
                            <span className="font-medium">Créer une Province</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/cities/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/cities/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🏙️</span>
                            <span className="font-medium">Créer une Ville</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/biomes"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/biomes')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🌿</span>
                            <span className="font-medium">Biomes & Ressources</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/events/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/events/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🎫</span>
                            <span className="font-medium">Créer un Événement</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/goals"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/goals')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>🎯</span>
                            <span className="font-medium">Icônes Objectifs</span>
                        </Link>

                        <Link
                            href="/dashboard/admin/national-spirits/create"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/national-spirits/create')
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>👻</span>
                            <span className="font-medium">Créer Esprit National</span>
                        </Link>
                    </>
                )}

            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                    <span>🚪</span>
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
}
