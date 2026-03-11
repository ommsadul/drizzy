# Drizzy

Drizzy is a Next.js app for playlist ranking with a real early-access waitlist flow.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Prisma ORM
- Postgres (works well with Supabase)
- Resend (confirmation emails)

## Features

- Landing page with waitlist CTA
- Waitlist API endpoint (`POST /api/waitlist`)
- Duplicate email protection (unique DB constraint)
- Confirmation email on successful signup
- Branded HTML email + plain-text fallback

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

macOS/Linux (bash):

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Fill `.env` values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Drizzy <onboarding@resend.dev>"
APP_URL="http://localhost:3000"
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run migration:

```bash
npm run prisma:migrate -- --name init_waitlist
```

6. Start development server:

```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: Postgres connection string used by Prisma.
- `RESEND_API_KEY`: Resend API key.
- `RESEND_FROM_EMAIL`: Sender identity used for waitlist confirmations.
- `APP_URL`: URL included in email CTA links.

## Waitlist Architecture

- Form UI: `components/WaitlistForm.tsx`
- API route: `app/api/waitlist/route.ts`
- Prisma schema: `prisma/schema.prisma`

Request behavior:

- New email: inserted, confirmation email sent, returns `joined`.
- Existing email: no duplicate row, returns `already_joined`.
- Invalid email/body: returns `400` with validation message.

## API Contract

Endpoint:

- `POST /api/waitlist`

Request body:

```json
{
	"email": "user@example.com"
}
```

Success responses:

- `200 OK`

```json
{
	"status": "joined",
	"message": "You are on the waitlist."
}
```

- `200 OK` (duplicate email)

```json
{
	"status": "already_joined",
	"message": "This email is already on the waitlist."
}
```

Validation and error responses:

- `400 Bad Request`

```json
{
	"status": "invalid_email",
	"message": "Please provide a valid email address."
}
```

- `400 Bad Request`

```json
{
	"status": "bad_request",
	"message": "Invalid request body."
}
```

- `500 Internal Server Error`

```json
{
	"status": "error",
	"message": "Could not save your signup right now. Please try again."
}
```

## Useful Scripts

- `npm run dev` - Start local dev server.
- `npm run build` - Create production build.
- `npm run lint` - Run ESLint.
- `npm run prisma:generate` - Generate Prisma client.
- `npm run prisma:migrate` - Run Prisma migrations.
- `npm run prisma:studio` - Open Prisma Studio.

## Deploy Notes

- Set all env vars in your hosting platform.
- Use a production Postgres database.
- Verify your sender domain in Resend before going live.
- Update `APP_URL` to your deployed URL.
