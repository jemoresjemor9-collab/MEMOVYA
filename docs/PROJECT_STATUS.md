# MEMOVYA — Project status and continuity

Last updated: 2026-11-16

## Product decisions

- Working name: MEMOVYA (legal clearance still pending).
- Slogan: "Votre espace numérique. Vos souvenirs. Votre avenir."
- Brand colors: blue #2563EB, green #10B981, violet #885CF6. Neutral backgrounds/text are permitted for readability; no additional accent colors.
- Brand style: elegant, premium, professional, simple and intuitive.
- Free plan target: 2 GB. The limit must be enforced server-side and in the storage authorization flow, never only in the UI.
- Target: responsive web application for desktop, tablet and mobile.
- Core purpose: private storage and retrieval of personal and professional files across devices.

## Infrastructure verified

### GitHub
- Repository: https://github.com/jemoresjemor9-collab/MEMOVYA
- Default branch: main
- Repository was empty at first inspection; initial source files have now been committed.
- Latest bootstrap commit: see repository history (latest README/status commits).
- Do not overwrite existing work. Inspect the current main branch before every change.

### Supabase
- Project name: MEMOVYA
- Project ref: xccrhqtojghwprcsokcp
- Region: eu-west-3 (Paris)
- Status at last check: ACTIVE_HEALTHY
- Database engine: PostgreSQL 17
- Public project URL: https://xccrhqtojghwprcsokcp.supabase.co
- Public publishable key is configured in Vercel as NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
- NEXT_PUBLIC_SUPABASE_URL is configured in Vercel.
- No public schema tables existed at initial inspection.
- No user storage bucket or RLS policy has been created yet.
- Never expose or store a service-role/secret key in browser code or GitHub.

### Vercel
- Project name: memovya (lowercase slug to support memovya.vercel.app).
- Project ID: prj_lHNd8l3KOv3ilcNkqI7G4CxkJAh0
- Framework: Next.js
- Node runtime: 24.x
- Function region: cdg1 (Paris)
- Preview deployments are protected by Vercel SSO; production deployment is not protected by SSO.
- GitHub integration is now verified as linked: repository `jemoresjemor9-collab/MEMOVYA` on GitHub, project `memovya` on Vercel (verified through Vercel Git deployment context).
- First production deployment from a source snapshot: deployment ID `dpl_FijS5hyk8FDbJGnvLtFneMNCynk6`; state `READY`; Next.js compilation and TypeScript checks succeeded.
- Production aliases now include `https://memovya.vercel.app` and `https://memovya-jemoresjemor9-6990.vercel.app`.
- Temporary deployment URL: https://memovya-2sqit4ya8-jemoresjemor9-6990.vercel.app.
- Build output reported 7 moderate npm audit vulnerabilities and an ESLint deprecation warning. These have not yet been investigated or fixed; do not run blanket `npm audit fix` without reviewing impact.

## Source files committed

- package.json — Next.js 16.4.6, React 19.3.1, TypeScript, ESLint.
- next.config.ts
- tsconfig.json
- eslint.config.mjs
- .gitignore
- .env.example
- app/layout.tsx
- app/globals.css
- app/page.tsx — initial branded landing page and illustrative storage dashboard preview.
- app/login/page.tsx — email/password sign-in UI wired to Supabase Auth.
- app/signup/page.tsx — registration UI.
- components/auth-form.tsx — client-side sign-up/sign-in form; Google button remains disabled pending OAuth setup.
- lib/supabase/client.ts and lib/supabase/server.ts — browser and cookie-based SSR clients.
- lib/supabase/proxy.ts and proxy.ts — session refresh using verified claims, following Next.js 16 Proxy convention.
- app/dashboard/page.tsx — server-protected starter dashboard.
- app/auth/signout/route.ts — server-side sign-out endpoint.
- app/globals.css — responsive authentication/dashboard styles; accent gradients now use only the official blue/green/violet palette.
- public/favicon.svg and public/apple-touch-icon.svg — SVG brand marks.
- public/icons/memovya-192.svg and public/icons/memovya-512.svg — scalable PWA icon assets.
- public/manifest.webmanifest — PWA metadata, standalone display and icons.
- public/sw.js — service worker with a minimal offline fallback; authenticated dashboard/API routes are excluded from caching.
- public/offline.html — offline notice.
- components/pwa-register.tsx — registers the service worker in supported browsers.
- README.md — setup and safety rules.

## Verified vs not verified

Verified:
- GitHub repository exists and source files were committed successfully.
- Supabase project creation succeeded and project reports ACTIVE_HEALTHY.
- Supabase public schema is empty at initial inspection.
- Vercel project creation succeeded.
- Supabase URL and publishable key were added to Vercel for production, preview and development.
- Vercel project settings updated to Node 24.x, Paris functions region, preview-only SSO protection.

Not yet verified:
- No local install or separate ESLint run has been performed.
- GitHub push triggered Vercel preview deployments for `feature/auth-email-password`.
- Auth source build verified READY on Vercel deployment `dpl_3TuisB1YCew6rdnj8VARS1PjHBXL` (commit `10e6b402bb60ccd026a432fb33b4023330a00eaf`): Next.js compilation, TypeScript, static generation and route analysis completed successfully.
- No package lockfile has yet been generated/committed; dependencies in package.json are pinned to exact Supabase versions pending lockfile generation.
- Supabase Auth code is committed on branch `feature/auth-email-password`; live sign-up/sign-in has not yet been tested.
- Supabase Auth setting `Email confirmations` has NOT been disabled yet. It must be turned off in the Supabase dashboard to allow registration without email verification, as requested.
- Google OAuth is not configured.
- PWA files and service worker are added on branch `feature/auth-email-password`; cross-platform installation and iOS home-screen icon behavior still require browser/device testing. SVG icons are supplied; native iOS home-screen PNG icon compatibility has not yet been verified.
- No database schema or RLS policies exist.
- No private Storage bucket or Storage policies exist.
- No upload/download, quota enforcement, backup, or restore feature exists.

## Immediate next actions

1. Verify the latest PWA/brand commit builds successfully on Vercel and test installability on Android/desktop browsers and iOS Safari.
2. Generate platform-appropriate PNG app icons (192x192, 512x512, and Apple touch icon) if needed after device validation.
3. Investigate the 7 moderate npm audit advisories and ESLint deprecation warning; update dependencies deliberately and pin them with a lockfile.
4. Review current Supabase Auth documentation and finish testing cookie-based SSR sessions with @supabase/ssr.
5. Test email/password registration and login with email confirmation disabled; password reset remains deferred.
6. Configure Google OAuth after user creates Google Cloud OAuth client credentials and enters them directly in Supabase dashboard (never in chat).
7. Design and review the initial database schema before applying migrations.
8. Create private Storage bucket and ownership policies only after schema/policy review.
9. Implement quota enforcement (2 GB free) with server-side/database safeguards.
10. Test cross-user isolation, file upload/download, deletion/restore, and backups before allowing real user data.

## Data safety requirements

- Never make a public bucket for private user files.
- Every exposed public table must have RLS enabled and policies matching its access model.
- Storage RLS is separate from application-table RLS.
- Do not trust client-supplied user IDs, object paths, file sizes, MIME types, or quota values.
- Do not expose Supabase service-role/secret keys in browser code, NEXT_PUBLIC variables, logs, or Git.
- Use authenticated storage operations and short-lived signed URLs where appropriate.
- Deletion should be recoverable through a trash/retention workflow when possible; permanent deletion needs explicit confirmation and clear warning.
- Database backups and file-object backups are separate; configure and test both restore paths.
- No claim of "zero bugs" or guaranteed never-loss. Release only after tests and restore drills.

## Continuity rule

At the start of every new conversation, read this file and inspect the current GitHub repository, Supabase project, and Vercel project state. Update this file at the end of each work session with verified changes and the exact next task.
