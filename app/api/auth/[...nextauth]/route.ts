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
                        .select("id, role")
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
                                    role: "USER"
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
            // On ajoute l'ID Discord et le rôle à la session
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.discordId = token.sub;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                // Lors de la connexion initiale, on peut récupérer le rôle
                // Attention: 'user' ici est l'objet retourné par authorize/signIn, il faut s'assurer qu'il contient le rôle
                // Comme on ne retourne pas l'objet user complet depuis signIn, on va faire un appel DB rapide ou l'ajouter au token
                const { data: player } = await supabase
                    .from("Player")
                    .select("role")
                    .eq("discordId", token.sub)
                    .single();

                if (player) {
                    token.role = player.role;
                }
            }
            return token;
        }
    },
});

export { handler as GET, handler as POST };
