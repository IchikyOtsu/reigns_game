"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-slate-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <span className="font-bold text-xl tracking-wider text-amber-500">REIGNS</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    href="/"
                                    className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Accueil
                                </Link>
                                <Link
                                    href="/countries"
                                    className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Carte du Monde
                                </Link>
                                <span className="text-slate-500 px-3 py-2 text-sm font-medium cursor-not-allowed">
                                    Règles (Bientôt)
                                </span>
                                <span className="text-slate-500 px-3 py-2 text-sm font-medium cursor-not-allowed">
                                    Classement (Bientôt)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {session ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                        <p className="text-xs text-slate-400">Connecté</p>
                                    </div>
                                    {session.user?.image && (
                                        <img
                                            src={session.user.image}
                                            alt="Avatar"
                                            className="h-8 w-8 rounded-full border border-slate-600"
                                        />
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('discord')}
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Connexion Discord
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}