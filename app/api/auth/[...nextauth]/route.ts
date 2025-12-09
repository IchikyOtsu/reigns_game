import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

const handler = NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "discord") {
                const discordId = user.id;
                const discordPseudo = user.name || "Inconnu";

                try {
                    // 1. Vérifier si le joueur existe déjà
                    const { data: existingPlayer, error: fetchError } = await supabase
                        .from("Player")
                        .select("id")
                        .eq("discordId", discordId)
                        .single();

                    if (fetchError && fetchError.code !== "PGRST116") {
                        console.error("Erreur Supabase (Select):", fetchError);
                        return false;
                    }

                    // 2. Si le joueur n'existe pas, le créer
                    if (!existingPlayer) {
                        const { error: insertError } = await supabase
                            .from("Player")
                            .insert([
                                {
                                    id: randomUUID(),
                                    discordId: discordId,
                                    discordPseudo: discordPseudo,
                                },
                            ]);

                        if (insertError) {
                            console.error("Erreur Supabase (Insert):", insertError);
                            return false;
                        }
                    } else {
                        // Optionnel : Mettre à jour le pseudo si il a changé sur Discord
                        await supabase.from("Player").update({ discordPseudo }).eq("discordId", discordId);
                    }

                    return true;
                } catch (error) {
                    console.error("Erreur inattendue lors du signIn:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // On ajoute l'ID Discord à la session pour pouvoir l'utiliser côté client
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.discordId = token.sub;
            }
            return session;
        }
    },
});

export { handler as GET, handler as POST };
