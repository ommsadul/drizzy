import type { Account } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in: number;
  refresh_token?: string;
};

type SpotifyPlaylistItem = {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{ url: string }>;
};

type SpotifyPlaylistsResponse = {
  items: SpotifyPlaylistItem[];
  next: string | null;
};

function encodeClientCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify client credentials.");
  }

  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

async function refreshSpotifyAccessToken(account: Account) {
  if (!account.refresh_token) {
    throw new Error("Spotify refresh token not found for account.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodeClientCredentials()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token.");
  }

  const payload = (await response.json()) as SpotifyTokenResponse;

  const updated = await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
    },
    data: {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token ?? account.refresh_token,
      expires_at: Math.floor(Date.now() / 1000 + payload.expires_in),
      token_type: payload.token_type,
      scope: payload.scope ?? account.scope,
    },
  });

  if (!updated.access_token) {
    throw new Error("Spotify access token refresh returned no access token.");
  }

  return updated.access_token;
}

export async function getSpotifyAccessTokenForUser(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "spotify",
    },
  });

  if (!account?.access_token) {
    throw new Error("Spotify account is not connected for this user.");
  }

  const now = Math.floor(Date.now() / 1000);
  const hasExpired = Boolean(account.expires_at && account.expires_at <= now + 60);

  if (!hasExpired) {
    return account.access_token;
  }

  return refreshSpotifyAccessToken(account);
}

export async function fetchUserSpotifyPlaylists(accessToken: string) {
  const playlists: SpotifyPlaylistItem[] = [];
  let url: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlists from Spotify.");
    }

    const page = (await response.json()) as SpotifyPlaylistsResponse;
    playlists.push(...page.items);
    url = page.next;
  }

  return playlists.map((playlist) => ({
    spotifyId: playlist.id,
    title: playlist.name,
    description: playlist.description || "",
    spotifyUrl: playlist.external_urls.spotify,
    imageUrl: playlist.images[0]?.url ?? "",
  }));
}
