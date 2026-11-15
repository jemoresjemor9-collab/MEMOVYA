# MEMOVYA

**Votre espace numérique. Vos souvenirs. Votre avenir.**

Memovya is a private digital storage application for personal and professional files.

## Brand

- Primary blue: `#2563EB`
- Secondary green: `#10B981`
- Accent violet: `#885CF6`
- Light background: `#F8FAFC`
- Free plan target: 2 GB (enforced server-side before launch)

## Stack

- Next.js App Router + TypeScript
- Supabase Auth, PostgreSQL and private Storage
- Vercel deployment
- GitHub source control

## Local setup

1. Install Node.js 20.9 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in the Supabase public project URL and publishable/anon key.
5. Run `npm run dev`.

Never put a Supabase service-role/secret key in a `NEXT_PUBLIC_*` variable or browser code.

## Current status

- [x] GitHub repository created
- [x] Supabase project provisioned in eu-west-3
- [x] Initial Next.js app shell committed
- [ ] Vercel project linked and first preview deployed
- [ ] Supabase Auth integration
- [ ] Database schema and RLS policies
- [ ] Private Storage bucket and ownership policies
- [ ] Upload/download flow and quota enforcement
- [ ] Independent file backups and tested restoration

The landing page is an initial UI foundation only. It is not an authentication system or a functioning file-storage service yet.

## Non-negotiable data safety

- No public user-file buckets.
- Every user-owned database row must have explicit authorization policies.
- Storage policies must enforce the authenticated owner or authorized shared-space membership.
- Never trust a client-supplied storage path or quota value.
- Validate file type, size, ownership and available quota on the server.
- Destructive actions require explicit confirmation and recoverable trash where appropriate.
- Database backups and object-storage backups are separate concerns; both need documented restore tests.
- Never describe the service as zero-risk or promise that data can never be lost.

## Development discipline

Review the existing implementation before changing it. Make small, testable changes, run checks, and record verified results. Do not claim a feature is complete until it has been tested end to end.
