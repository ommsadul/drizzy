import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  fetchUserSpotifyPlaylists,
  getSpotifyAccessTokenForUser,
} from "@/lib/spotify";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { status: "unauthorized", message: "Please sign in with Spotify." },
      { status: 401 }
    );
  }

  try {
    const accessToken = await getSpotifyAccessTokenForUser(session.user.id);
    const playlists = await fetchUserSpotifyPlaylists(accessToken);

    return NextResponse.json({
      status: "ok",
      playlists,
    });
  } catch (error) {
    console.error("Playlist import failed", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Could not import playlists right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
