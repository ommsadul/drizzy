import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Drizzy",
    template: "%s · Drizzy",
  },
  description:
    "Share Spotify playlists, get votes from the community, and climb a global leaderboard of curators.",
  applicationName: "Drizzy",
  keywords: [
    "spotify",
    "playlist",
    "music discovery",
    "leaderboard",
    "curators",
    "ranking",
    "community voting",
  ],
  openGraph: {
    title: "Drizzy",
    description:
      "Share Spotify playlists, get votes from the community, and climb a global leaderboard of curators.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drizzy",
    description:
      "Share Spotify playlists, get votes from the community, and climb a global leaderboard of curators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
