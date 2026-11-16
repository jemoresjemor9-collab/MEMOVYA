# MEMOVYA — Project status and continuity

Last updated: 2026-11-16 (private storage foundation and dashboard upload flow deployed; 3-level recovery design specified)

## Product decisions
- Working name: MEMOVYA (legal clearance pending).
- Slogan: "Votre espace numérique. Vos souvenirs. Votre avenir."
- Brand palette: blue #2563EB, green #10B981, violet #885CF6. No white panels or page backgrounds; use palette tints/shades.
- Free plan target: 2 GB, enforced server-side and in storage authorization.
- Responsive private cloud storage for individuals and organizations.
- Signup must be immediate: first name, last name, email, password, password confirmation, optional purpose/description. No email verification. Successful signup must establish a session and redirect to dashboard.
- Login on any device uses the same email/password and must retrieve cloud-synced data.
- Google signup/login must prompt account selection, then create/sign in to the Supabase Auth user and retain Google profile metadata. Password recovery design: primary password, secondary recovery password, then final recovery code; each level recovers the preceding credential. If all three are lost, recovery is intentionally impossible. This flow is specified but not yet implemented.
- Homepage must show two separate, obvious actions: Se connecter and S'inscrire.

## Infrastructure
- GitHub repository: https://github.com/jemoresjemor9-collab/MEMOVYA
- Development branch: feature/auth-email-password. Its 52 commits were integrated into main through PR #1 (merged). Main now contains the authentication/PWA work.
- Supabase project ref: xccrhqtojghwprcsokcp; region eu-west-3; status previously ACTIVE_HEALTHY.
- Supabase project URL: https://xccrhqtojghwprcsokcp.supabase.co
- Vercel project: memovya; ID prj_lHNd8l3KOv3ilcNkqI7G4CxkJAh0.
- Preview deployments require Vercel SSO. The official production alias is https://memovya.vercel.app.
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
- PR #1 was merged into main successfully. Merge commit: d5d8268148823ffb42de4d88bd584952f7ab6241.
- Production deployment for the existing Vercel project memovya: deployment dpl_j3cTPR6Tb7r44ssHq4SPa7MvxkdR, commit d5d8268148823ffb42de4d88bd584952f7ab6241, state READY. Official alias memovya.vercel.app is attached to this deployment.
- Build verified: Next.js compiled successfully, TypeScript completed, static pages generated 8/8, routes /, /auth/callback, /auth/signout, /dashboard, /login and /signup generated; Vercel deployment reached READY.
- Runtime error query for the last hour returned no runtime errors.
- Homepage has distinct Se connecter and S'inscrire actions; signup routes to /signup and login to /login.
- No live signup/login test has been completed because no test account has been created.
- User reports Supabase Confirm email is disabled; the current dashboard setting has not been independently read back. A real signup test must confirm that signUp returns a session immediately.
- Google OAuth has not been configured or end-to-end tested.
- Storage schema, private bucket, owner-scoped Storage RLS, per-user quota reservation and dashboard file operations are deployed. End-to-end upload/download/delete tests with an authenticated test account remain pending.\n- Storage backup/restore and stale pending-upload cleanup are not implemented.\n- Three-level password recovery is not yet implemented; do not claim account recovery is active.

## Next actions
1. Perform an end-to-end email signup/login test with a user-approved test account; confirm immediate session creation and dashboard access.
2. Configure Google OAuth in Google Cloud and Supabase; allow-list https://memovya.vercel.app/auth/callback, then test account selection and session creation.
3. Implement and secure profiles/storage schema, private Storage bucket, file/folder operations, server-side 2 GB quota enforcement, and restore.
4. Test cross-user isolation, upload/download, deletion/restore and backup recovery before storing real user files.
5. Implement sharing, trash, audit and admin controls after the core storage foundation is secure.

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
