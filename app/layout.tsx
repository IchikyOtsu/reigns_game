import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
    title: "Reigns Game",
    description: "RP Géopolitique Discord",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
                <Providers>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Reigns Game. Tous droits réservés.</p>
                    </footer>
                </Providers>
            </body>
        </html>
    );
}