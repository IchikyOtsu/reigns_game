import Link from 'next/link';

export default async function Home() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full bg-slate-900 text-white py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Bâtissez votre <span className="text-amber-500">Empire</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Plongez dans un jeu de rôle géopolitique unique sur Discord. Gérez votre économie, menez vos armées et écrivez l'histoire.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/countries"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Explorer la Carte
                        </Link>
                        <button className="bg-transparent border-2 border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold py-3 px-8 rounded-lg transition-all">
                            Rejoindre le Discord
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                            🌍
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">Géopolitique Réaliste</h3>
                        <p className="text-slate-600">
                            Un système complet de gestion de pays, incluant économie, population et diplomatie complexe entre joueurs.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                            ⚔️
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">Guerres & Conquêtes</h3>
                        <p className="text-slate-600">
                            Étendez votre territoire par la force ou par des alliances stratégiques. Chaque province compte.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                            📜
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">Histoire Dynamique</h3>
                        <p className="text-slate-600">
                            Vos actions façonnent le monde. Les religions, les cultures et les régimes évoluent selon vos choix.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}