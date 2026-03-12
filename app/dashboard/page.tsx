import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { PlaylistPublisher } from "@/components/PlaylistPublisher";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3000";
    const callbackUrl = encodeURIComponent(`${baseUrl}/dashboard`);
    redirect(`${baseUrl}/api/auth/signin?provider=spotify&callbackUrl=${callbackUrl}`);
  }

  const publishedPlaylists = await prisma.playlist.findMany({
    where: {
      curatorId: session.user.id,
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      spotifyId: true,
      title: true,
      spotifyUrl: true,
      description: true,
      imageUrl: true,
      publishedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="border border-black/10 bg-black/[0.01] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Curator dashboard
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome, {session.user.name ?? "Curator"}
              </h1>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center border border-black bg-white px-3 text-[11px] font-semibold tracking-[0.14em] text-black hover:bg-black/[0.03]"
              >
                SIGN OUT
              </button>
            </form>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="border border-black/10 bg-white px-4 py-4 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Account
              </p>
              <p className="mt-2 font-medium text-black">
                {session.user.email ?? "No email returned by Spotify"}
              </p>
            </div>
            <div className="border border-black/10 bg-white px-4 py-4 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Spotify
              </p>
              <p className="mt-2 leading-6 text-black/75">
                Connected. Import playlists from Spotify and publish selected
                ones to Drizzy below.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5">
            <PlaylistPublisher
              initialPublished={publishedPlaylists.map((playlist) => ({
                ...playlist,
                publishedAt: playlist.publishedAt.toISOString(),
              }))}
            />
          </div>

          <div className="mt-5 text-sm text-black/70">
            <Link href="/" className="underline">
              Back to landing page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
