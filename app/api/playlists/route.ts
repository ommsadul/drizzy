import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PublishBody = {
  spotifyId?: unknown;
  title?: unknown;
  spotifyUrl?: unknown;
  description?: unknown;
  imageUrl?: unknown;
};

function asCleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { status: "unauthorized", message: "Please sign in with Spotify." },
      { status: 401 }
    );
  }

  const playlists = await prisma.playlist.findMany({
    where: { curatorId: session.user.id },
    orderBy: { publishedAt: "desc" },
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

  return NextResponse.json({ status: "ok", playlists });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { status: "unauthorized", message: "Please sign in with Spotify." },
      { status: 401 }
    );
  }

  let body: PublishBody;

  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json(
      { status: "bad_request", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const spotifyId = asCleanString(body.spotifyId);
  const title = asCleanString(body.title);
  const spotifyUrl = asCleanString(body.spotifyUrl);
  const description = asCleanString(body.description);
  const imageUrl = asCleanString(body.imageUrl);

  if (!spotifyId || !title || !spotifyUrl) {
    return NextResponse.json(
      { status: "bad_request", message: "spotifyId, title, and spotifyUrl are required." },
      { status: 400 }
    );
  }

  const existing = await prisma.playlist.findUnique({
    where: { spotifyId },
    select: { id: true, curatorId: true },
  });

  if (existing && existing.curatorId !== session.user.id) {
    return NextResponse.json(
      {
        status: "conflict",
        message: "This playlist is already published by another curator.",
      },
      { status: 409 }
    );
  }

  const playlist = await prisma.playlist.upsert({
    where: { spotifyId },
    create: {
      spotifyId,
      title,
      spotifyUrl,
      description: description || null,
      imageUrl: imageUrl || null,
      curatorId: session.user.id,
    },
    update: {
      title,
      spotifyUrl,
      description: description || null,
      imageUrl: imageUrl || null,
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

  return NextResponse.json({
    status: "published",
    playlist,
  });
}
