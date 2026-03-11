# Drizzy

Drizzy is a Next.js app for playlist ranking and early-access waitlist signup.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables and fill your values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL`: Postgres connection string.
- `RESEND_API_KEY`: API key from Resend.
- `RESEND_FROM_EMAIL`: Verified sender address for confirmation emails.

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Create and apply your first migration:

```bash
npm run prisma:migrate -- --name init_waitlist
```

5. Start the app:

```bash
npm run dev
```

## Waitlist Flow

- UI form: `components/WaitlistForm.tsx`
- API endpoint: `app/api/waitlist/route.ts`
- DB model: `prisma/schema.prisma`

Behavior:
- New email: saved to DB and sent a confirmation email.
- Duplicate email: accepted with an "already on waitlist" response and no duplicate row.
- Invalid payload: request rejected with a 400 response.

## Useful Commands

- `npm run lint`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
