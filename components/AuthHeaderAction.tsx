import Link from "next/link";

import { auth } from "@/auth";

export async function AuthHeaderAction() {
  const session = await auth();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3000";
  const callbackUrl = encodeURIComponent(`${baseUrl}/dashboard`);

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="hidden h-8 items-center justify-center border border-black bg-black px-3 text-[11px] font-semibold tracking-[0.16em] text-white sm:inline-flex"
      >
        DASHBOARD
      </Link>
    );
  }

  return (
    <Link
      href={`${baseUrl}/api/auth/signin?provider=spotify&callbackUrl=${callbackUrl}`}
      className="hidden h-8 items-center justify-center border border-black bg-black px-3 text-[11px] font-semibold tracking-[0.16em] text-white sm:inline-flex"
    >
      CONNECT SPOTIFY
    </Link>
  );
}
