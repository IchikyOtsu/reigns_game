import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import EventList from "./EventList";

export default async function EventsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    // @ts-ignore
    const discordId = session.user.discordId;

    // Récupérer le pays du joueur
    const { data: player, error: playerError } = await supabaseAdmin
        .from('Player')
        .select(`
            country:Country(
                id,
                name,
                events:Event(
                    id, name, description, activeFor, isActive
                )
            )
        `)
        .eq('discordId', discordId)
        .single();

    // @ts-ignore
    const countryData = Array.isArray(player?.country) ? player.country[0] : player?.country;

    if (playerError || !countryData) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Événements</h1>
                <p className="text-slate-600">Vous n'avez pas encore de pays associé.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Événements</h1>
                <p className="text-slate-600">
                    Événements actifs affectant {countryData.name}.
                </p>
            </header>

            <EventList events={countryData.events || []} />
        </div>
    );
}
