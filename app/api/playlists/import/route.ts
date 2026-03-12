import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  fetchUserSpotifyPlaylists,
  forceRefreshSpotifyAccessTokenForUser,
  getSpotifyAccessTokenForUser,
  SpotifyApiError,
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
    let accessToken = await getSpotifyAccessTokenForUser(session.user.id);
    let playlists;

    try {
      playlists = await fetchUserSpotifyPlaylists(accessToken);
    } catch (error) {
      if (error instanceof SpotifyApiError && error.status === 401) {
        accessToken = await forceRefreshSpotifyAccessTokenForUser(session.user.id);
        playlists = await fetchUserSpotifyPlaylists(accessToken);
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      status: "ok",
      playlists,
    });
  } catch (error) {
    if (error instanceof SpotifyApiError) {
      console.error("Playlist import failed", {
        status: error.status,
        details: error.details,
      });

      if (error.status === 403) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "Spotify denied playlist access. Reconnect Spotify and confirm playlist scopes are approved.",
          },
          { status: 403 }
        );
      }
    }

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
