import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { resend, resendFromEmail } from "@/lib/resend";

type WaitlistResponseStatus =
  | "joined"
  | "already_joined"
  | "invalid_email"
  | "bad_request"
  | "error";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getWaitlistEmailHtml() {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  return `
    <div style="margin:0;background:#f5f5f5;padding:24px 12px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#0a0a0a;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
        <tr>
          <td style="padding:18px 20px;border-bottom:1px solid #ededed;">
            <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#525252;font-weight:700;">Drizzy</div>
            <div style="margin-top:6px;font-size:24px;line-height:1.2;font-weight:700;">You're on the waitlist</div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px;">
            <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#262626;">
              Thanks for joining early access. We'll email you as soon as Drizzy opens private beta.
            </p>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#262626;">
              You'll be among the first to publish playlists and appear on the live global board.
            </p>
            <a href="${appUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:10px 14px;border:1px solid #0a0a0a;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
              Visit Drizzy
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-top:1px solid #ededed;font-size:12px;line-height:1.6;color:#737373;">
            This message was sent because this email joined the Drizzy waitlist.
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendConfirmationEmail(email: string) {
  if (!resend) {
    return { sent: false };
  }

  await resend.emails.send({
    from: resendFromEmail,
    to: [email],
    subject: "You're on the Drizzy waitlist",
    html: getWaitlistEmailHtml(),
    text: [
      "You're on the Drizzy waitlist.",
      "",
      "Thanks for joining early access. We'll email you when private beta is ready.",
      "Visit Drizzy: " + (process.env.APP_URL ?? "http://localhost:3000"),
    ].join("\n"),
  });

  return { sent: true };
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        status: "bad_request" satisfies WaitlistResponseStatus,
        message: "Invalid request body.",
      },
      { status: 400 }
    );
  }

  const email = typeof (body as { email?: unknown }).email === "string"
    ? normalizeEmail((body as { email: string }).email)
    : "";

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        status: "invalid_email" satisfies WaitlistResponseStatus,
        message: "Please provide a valid email address.",
      },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.waitlistEntry.createMany({
      data: [
        {
          email,
          source: "landing_waitlist",
        },
      ],
      skipDuplicates: true,
    });

    if (created.count === 0) {
      return NextResponse.json({
        status: "already_joined" satisfies WaitlistResponseStatus,
        message: "This email is already on the waitlist.",
      });
    }
  } catch (error) {

    console.error("Waitlist insert failed", error);

    return NextResponse.json(
      {
        status: "error" satisfies WaitlistResponseStatus,
        message: "Could not save your signup right now. Please try again.",
      },
      { status: 500 }
    );
  }

  try {
    await sendConfirmationEmail(email);
  } catch (error) {
    // We keep the signup successful even if email delivery fails.
    console.error("Waitlist confirmation email failed", error);
  }

  return NextResponse.json({
    status: "joined" satisfies WaitlistResponseStatus,
    message: "You are on the waitlist.",
  });
}
