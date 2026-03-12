import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import { prisma } from "@/lib/prisma";

const spotifyScope = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: spotifyScope,
        },
      },
    }),
  ],
  events: {
    async signIn({ user, account }) {
      if (!user.id || account?.provider !== "spotify") {
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          spotifyId: account.providerAccountId,
        },
      });
    },
  },
});
