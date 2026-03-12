"use client";

import { useMemo, useState } from "react";

type ImportedPlaylist = {
  spotifyId: string;
  title: string;
  description: string;
  spotifyUrl: string;
  imageUrl: string;
};

type PublishedPlaylist = {
  id: string;
  spotifyId: string;
  title: string;
  spotifyUrl: string;
  description: string | null;
  imageUrl: string | null;
  publishedAt: string;
};

export function PlaylistPublisher({
  initialPublished,
}: {
  initialPublished: PublishedPlaylist[];
}) {
  const [imported, setImported] = useState<ImportedPlaylist[]>([]);
  const [published, setPublished] = useState<PublishedPlaylist[]>(initialPublished);
  const [loadingImport, setLoadingImport] = useState(false);
  const [publishingId, setPublishingId] = useState("");
  const [message, setMessage] = useState("");

  const publishedSet = useMemo(
    () => new Set(published.map((p) => p.spotifyId)),
    [published]
  );

  async function importPlaylists() {
    setMessage("");
    setLoadingImport(true);

    try {
      const res = await fetch("/api/playlists/import", { cache: "no-store" });
      const data = (await res.json()) as {
        status?: string;
        message?: string;
        playlists?: ImportedPlaylist[];
      };

      if (!res.ok || data.status !== "ok" || !data.playlists) {
        setMessage(data.message ?? "Could not import playlists.");
        return;
      }

      setImported(data.playlists);
      setMessage(`Imported ${data.playlists.length} playlist(s) from Spotify.`);
    } catch {
      setMessage("Network error while importing playlists.");
    } finally {
      setLoadingImport(false);
    }
  }

  async function publishPlaylist(playlist: ImportedPlaylist) {
    setMessage("");
    setPublishingId(playlist.spotifyId);

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlist),
      });

      const data = (await res.json()) as {
        status?: string;
        message?: string;
        playlist?: PublishedPlaylist;
      };

      if (!res.ok || data.status !== "published" || !data.playlist) {
        setMessage(data.message ?? "Could not publish playlist.");
        return;
      }

      const nextPlaylist = data.playlist;

      setPublished((prev) => {
        const exists = prev.some((p) => p.spotifyId === nextPlaylist.spotifyId);
        if (exists) {
          return prev.map((p) =>
            p.spotifyId === nextPlaylist.spotifyId ? nextPlaylist : p
          );
        }
        return [nextPlaylist, ...prev];
      });
      setMessage(`Published: ${playlist.title}`);
    } catch {
      setMessage("Network error while publishing playlist.");
    } finally {
      setPublishingId("");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={importPlaylists}
          disabled={loadingImport}
          className="inline-flex h-9 items-center justify-center border border-black bg-black px-3 text-[11px] font-semibold tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingImport ? "IMPORTING..." : "IMPORT SPOTIFY PLAYLISTS"}
        </button>
        <span className="text-[11px] text-black/60">
          Import your playlists, then publish the ones you want on Drizzy.
        </span>
      </div>

      {message ? <p className="text-[12px] text-black/70">{message}</p> : null}

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Spotify playlists
        </h2>
        {imported.length === 0 ? (
          <div className="border border-dashed border-black/20 bg-white px-4 py-4 text-[12px] text-black/65">
            No playlists imported yet.
          </div>
        ) : (
          <div className="space-y-2">
            {imported.map((playlist) => {
              const isPublished = publishedSet.has(playlist.spotifyId);
              const isPublishing = publishingId === playlist.spotifyId;

              return (
                <div
                  key={playlist.spotifyId}
                  className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{playlist.title}</div>
                    <div className="truncate text-[11px] text-black/60">
                      {playlist.spotifyUrl}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isPublished || isPublishing}
                    onClick={() => publishPlaylist(playlist)}
                    className="inline-flex h-8 items-center justify-center border border-black bg-white px-3 text-[10px] font-semibold tracking-[0.14em] text-black disabled:cursor-not-allowed disabled:border-black/20 disabled:text-black/40"
                  >
                    {isPublished ? "PUBLISHED" : isPublishing ? "PUBLISHING..." : "PUBLISH"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Published on Drizzy
        </h2>
        {published.length === 0 ? (
          <div className="border border-dashed border-black/20 bg-white px-4 py-4 text-[12px] text-black/65">
            You have not published any playlists yet.
          </div>
        ) : (
          <div className="space-y-2">
            {published.map((playlist) => (
              <a
                key={playlist.id}
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="block border border-black/10 bg-white px-4 py-3"
              >
                <div className="text-sm font-medium">{playlist.title}</div>
                <div className="text-[11px] text-black/60">{playlist.spotifyUrl}</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
