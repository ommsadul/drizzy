"use client";

import { useId, useMemo, useState } from "react";

type Status = "idle" | "loading" | "success" | "already_joined" | "error";
type ApiStatus =
  | "joined"
  | "already_joined"
  | "invalid_email"
  | "bad_request"
  | "error";

function isValidEmail(value: string) {
  const email = value.trim();
  if (!email) return false;
  // Intentionally simple: enough for UI gating without being overly strict.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function WaitlistForm({
  align = "left",
  cta = "Join the waitlist",
}: {
  align?: "left" | "center";
  cta?: string;
}) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => isValidEmail(email), [email]);

  if (status === "success" || status === "already_joined") {
    return (
      <div
        className={[
          "rounded-md border border-black/10 bg-black/[0.02] p-4",
          align === "center" ? "text-center" : "text-left",
        ].join(" ")}
      >
        <p className="text-sm font-medium text-black">
          {status === "already_joined" ? "Already on the list." : "You’re on the list."}
        </p>
        <p className="mt-1 text-sm text-black/70">
          {status === "already_joined"
            ? "This email is already signed up. We’ll still notify you when early access opens."
            : "We’ll email you when the first leaderboards go live."}
        </p>
        <button
          type="button"
          className="mt-3 inline-flex h-9 items-center justify-center rounded border border-black/10 bg-white px-4 text-xs font-semibold tracking-wide text-black hover:bg-black/[0.03]"
          onClick={() => {
            setEmail("");
            setStatus("idle");
            setErrorMessage("");
          }}
        >
          Add another email
        </button>
      </div>
    );
  }

  return (
    <form
      className={[
        "w-full border border-black/10 bg-white px-3 py-2 text-xs",
        align === "center" ? "mx-auto max-w-xl" : "max-w-lg",
      ].join(" ")}
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValidEmail(email)) return;
        setErrorMessage("");
        setStatus("loading");

        void (async () => {
          try {
            const res = await fetch("/api/waitlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            });

            const data = (await res.json()) as {
              status?: ApiStatus;
              message?: string;
            };

            if (res.ok && data.status === "already_joined") {
              setStatus("already_joined");
              return;
            }

            if (res.ok && data.status === "joined") {
              setStatus("success");
              return;
            }

            setStatus("error");
            setErrorMessage(
              data.message ?? "Could not join right now. Please try again."
            );
          } catch {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
          }
        })();
      }}
    >
      <div className={align === "center" ? "text-center" : "text-left"}>
        <label
          htmlFor={emailId}
          className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60"
        >
          Email
        </label>
      </div>
      <div
        className={[
          "mt-2 flex flex-col gap-2 sm:flex-row sm:items-center",
          align === "center" ? "sm:justify-center" : "sm:justify-start",
        ].join(" ")}
      >
        <input
          id={emailId}
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 w-full border-none bg-transparent px-0 text-sm text-black outline-none placeholder:text-black/35 sm:flex-1"
          aria-invalid={email.length > 0 && !canSubmit}
        />
        <button
          type="submit"
          disabled={!canSubmit || status === "loading"}
          className="h-10 whitespace-nowrap border border-black bg-black px-4 text-xs font-semibold tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:border-black/40 disabled:bg-black/40"
        >
          {status === "loading" ? "Joining..." : cta}
        </button>
      </div>
      {status === "error" ? (
        <div
          className={[
            "mt-2 text-[10px] text-red-700",
            align === "center" ? "text-center" : "text-left",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      ) : null}
      <div
        className={[
          "mt-2 text-[10px] text-black/55",
          align === "center" ? "text-center" : "text-left",
        ].join(" ")}
      >
        No spam. Unsubscribe anytime.
      </div>
    </form>
  );
}

