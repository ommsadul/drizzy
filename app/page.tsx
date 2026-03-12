import { AuthHeaderAction } from "@/components/AuthHeaderAction";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs">
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
          >
            <span>DRIZZY</span>
          </a>
          <nav className="hidden items-center gap-6 text-[11px] text-black/60 md:flex">
            <a className="hover:text-black" href="#how">
              How it works
            </a>
            <a className="hover:text-black" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <AuthHeaderAction />
            <span className="inline-flex h-7 items-center border border-black/10 bg-black/[0.02] px-2 text-[10px] font-mono uppercase tracking-[0.16em] text-black/60">
              v0.1
            </span>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-6">
        <section className="border-b border-black/10 pb-14 pt-12 sm:pb-20 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)] lg:items-start">
            <div>
              <div className="mb-6 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                <span className="border border-black bg-black px-2 py-1 text-white">
                  Waitlist
                </span>
                <span className="border border-amber-400 bg-amber-50 px-2 py-1 text-amber-700">
                  In development
                </span>
                <span className="border border-emerald-500 bg-emerald-50 px-2 py-1 text-emerald-700">
                  For playlist curators
                </span>
              </div>
              <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-[3.2rem]">
                RANK&nbsp;YOUR
                <br />
                SPOTIFY&nbsp;PLAYLISTS
                <br />
                ON&nbsp;A&nbsp;GLOBAL&nbsp;BOARD.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-black/70">
                Drizzy is a ranking layer for playlists. Connect Spotify,
                publish your best sets, and let the community decide what
                climbs. No ads, no algorithm tweaks — just curators and their
                work.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-black/60">
                <span className="border border-black/10 bg-black/[0.02] px-2 py-1">
                  No followers required
                </span>
                <span className="border border-black/10 bg-black/[0.02] px-2 py-1">
                  Simple upvotes + time decay
                </span>
                <span className="border border-black/10 bg-black/[0.02] px-2 py-1">
                  Spotify sign-in
                </span>
              </div>

            </div>

            <div className="border border-black/10 bg-black/[0.01] px-5 py-4 text-xs">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div className="font-semibold tracking-tight">
                  Featured board · Mock
                </div>
                <span className="border border-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  View sample
                </span>
              </div>
              <div className="grid grid-cols-[60px_minmax(0,1fr)_70px] items-center gap-x-4 border-b border-black/10 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                <div>#</div>
                <div>Playlist</div>
                <div className="text-right">Votes</div>
              </div>
              <div className="divide-y divide-black/10">
                {[
                  { n: 1, name: "Late Night Drive", votes: 1284 },
                  { n: 2, name: "Workout Heat", votes: 1139 },
                  { n: 3, name: "Indie Gems", votes: 972 },
                  { n: 4, name: "R&B Smooth", votes: 841 },
                ].map((p) => (
                  <div
                    key={p.n}
                    className="grid grid-cols-[60px_minmax(0,1fr)_70px] items-center gap-x-4 py-3 text-[12px]"
                  >
                    <div className="font-mono text-[11px] text-black/70">
                      {String(p.n).padStart(2, "0")}
                    </div>
                    <div className="truncate">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="mt-0.5 text-[11px] text-black/50">
                        @curator{p.n}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] text-black/80">
                      {p.votes.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-dashed border-black/20 bg-white px-3 py-3 text-[11px] leading-5 text-black/65">
                At launch, boards update in real time from community votes +
                time decay. This block is a static preview.
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-b border-black/10 py-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-black/60">
                How it works
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-black/70">
                The first version of Drizzy is intentionally narrow: import
                playlists, collect votes, show a ranked list. Everything else
                layers on afterwards.
              </p>
            </div>
            <ol className="space-y-4 text-sm">
              {[
                {
                  t: "Connect your Spotify account",
                  d: "Sign in with Spotify and select which playlists you want to publish to Drizzy.",
                },
                {
                  t: "Share your playlist pages",
                  d: "Every published playlist gets a clean URL. Share it with your community and collaborators.",
                },
                {
                  t: "Watch the rankings move",
                  d: "Votes and recency combine into a score. Top playlists surface on the global board and in category views.",
                },
              ].map((s, idx) => (
                <li
                  key={s.t}
                  className="flex gap-4 border border-black/10 bg-black/[0.01] px-4 py-4"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center border border-black bg-white text-[11px] font-semibold">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <p className="mt-1 text-[13px] leading-6 text-black/70">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="waitlist" className="border-b border-black/10 py-12 sm:py-14">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] md:items-start">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-black/60">
                Early access
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-black/70">
                We’re looking for a small group of playlist-obsessed people to
                help shape the first version. Add your email and we’ll reach out
                as soon as the private beta is ready.
              </p>
            </div>
            <div className="space-y-4">
              <WaitlistForm align="left" />
              <p className="text-[11px] text-black/55">
                We’ll never sell your data. One or two emails as we get closer
                to launch, plus an invite to test the leaderboard early.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="py-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-black/60">
                FAQ
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-black/70">
                Short answers for now. Full docs will ship alongside the
                product.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              {[
                {
                  q: "Is this affiliated with Spotify?",
                  a: "No. Drizzy is an independent product that uses Spotify only for authentication and playlist metadata.",
                },
                {
                  q: "What stops people from gaming votes?",
                  a: "We start with simple protections: one vote per account per playlist, rate limiting, and basic anomaly checks. As the board grows, we’ll add stronger anti-abuse measures.",
                },
                {
                  q: "When will this launch?",
                  a: "We’re building now. The first private beta invites will go out to the waitlist once playlist import and basic ranking are stable.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="border border-black/10 bg-black/[0.01] px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-medium">
                    <span>{item.q}</span>
                    <span className="text-black/40">+</span>
                  </summary>
                  <p className="mt-2 text-[13px] leading-6 text-black/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 py-8 text-xs">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-black/55 sm:flex-row sm:items-center sm:justify-between">
          <div>© Drizzy · Playlist leaderboard for Spotify</div>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-black" href="#waitlist">
              Waitlist
            </a>
            <a className="hover:text-black" href="#faq">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
