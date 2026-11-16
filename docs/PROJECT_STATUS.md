# MEMOVYA — Project status and continuity

Last updated: 2026-11-16 (signup and Google OAuth flow implementation)

## Product decisions
- Working name: MEMOVYA (legal clearance pending).
- Slogan: "Votre espace numérique. Vos souvenirs. Votre avenir."
- Brand palette: blue #2563EB, green #10B981, violet #885CF6. No white panels or page backgrounds; use palette tints/shades.
- Free plan target: 2 GB, enforced server-side and in storage authorization.
- Responsive private cloud storage for individuals and organizations.
- Signup must be immediate: first name, last name, email, password, password confirmation, optional purpose/description. No email verification. Successful signup must establish a session and redirect to dashboard.
- Login on any device uses the same email/password and must retrieve cloud-synced data.
- Google signup/login must prompt account selection, then create/sign in to the Supabase Auth user and retain Google profile metadata. Password reset is deferred until core features are complete.

## Infrastructure
- GitHub repository: https://github.com/jemoresjemor9-collab/MEMOVYA
- Active feature branch: feature/auth-email-password. Do not merge to main without explicit approval.
- Supabase project ref: xccrhqtojghwprcsokcp; region eu-west-3; status previously ACTIVE_HEALTHY.
- Supabase project URL: https://xccrhqtojghwprcsokcp.supabase.co
- Vercel project: memovya; ID prj_lHNd8l3KOv3ilcNkqI7G4CxkJAh0.
- Preview deployments require Vercel SSO. Production alias is not updated by feature-branch commits.
- Vercel env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are configured for Production, Preview and Development. Never expose service-role/secret keys.

## Current implementation
- Email signup now collects first name, last name, email, password, confirmation and optional description. The values are saved to Supabase Auth user metadata.
- Signup checks password confirmation and minimum 10 characters, calls Supabase signUp, and only proceeds if Supabase returns an active session. This is the expected result when Confirm email is disabled.
- Email/password login calls signInWithPassword and redirects to the dashboard.
- Google OAuth browser initiation now calls signInWithOAuth(provider: google), explicitly requests account selection, and redirects to /auth/callback.
- Added Next.js callback route to exchange the PKCE code for a session, then redirect to dashboard.
- Google OAuth cannot complete until the Google provider is enabled and Client ID/Client Secret are configured in Supabase Auth, and redirect URLs are allow-listed. Credentials must be entered directly in Google Cloud/Supabase dashboards, never shared in chat.
- User metadata is stored in Supabase Auth; no separate profile table currently exists.
- Dashboard is still a starter page. File/folder storage, cross-device file restoration, 2 GB quota and backups are not implemented yet.
- Password reset remains deferred.
- PWA is present but installation behavior remains device/browser dependent and unverified.

## Verified vs pending
- Previous preview deployment for branch feature/auth-email-password reached Vercel READY, but that was before the latest signup/OAuth code changes.
- The latest signup/OAuth code has been committed to the feature branch; its new Vercel build must be checked before calling it deployed.
- No live signup/login test has been completed because no test account has been created.
- User reports Supabase Confirm email is disabled; the current dashboard setting has not been independently read back. A real signup test must confirm that signUp returns a session immediately.
- Google OAuth has not been configured or end-to-end tested.
- No database schema, RLS policies, private storage bucket, file uploads/downloads, quota enforcement, or backup/restore are implemented.

## Next actions
1. Verify the latest preview deployment reaches READY and inspect build/runtime logs.
2. User tests email signup: create an account, confirm immediate dashboard redirect, then sign in from a second device/browser.
3. If signup returns no session, verify Supabase Auth Confirm email is disabled and resolve that setting before proceeding.
4. Configure Google OAuth in Google Cloud and Supabase; allow-list the production and preview callback URLs, then test account selection and session creation.
5. Implement and secure profiles/storage schema, private Storage bucket, file/folder operations, quota enforcement, and restore.
6. Implement deletion/trash, sharing, audit, and admin controls only after the core storage foundation is secure.

## Security and data safety
- No public bucket for private user files.
- Enable RLS on every exposed public table and define ownership-aware policies.
- Never trust client-supplied user IDs, object paths, MIME types, file sizes or quota values.
- Never expose service-role/secret keys in browser code, NEXT_PUBLIC variables, logs or Git.
- Use short-lived signed URLs for private downloads where appropriate.
- Database backups and object-storage backups are separate; both restore paths need tests.
- Do not claim zero data-loss risk or production readiness without end-to-end tests and restore drills.

## Continuity
Before every work session, inspect the active branch and project states. Preserve existing features. Update this document with verified changes and exact next steps.
