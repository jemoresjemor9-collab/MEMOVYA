# MEMOVYA — Project status and continuity

Last updated: 2026-11-16

## Product decisions

- Working name: MEMOVYA (legal clearance still pending).
- Slogan: "Votre espace numérique. Vos souvenirs. Votre avenir."
- Brand colors: blue #2563EB, green #10B981, violet #885CF6, light #F8FAFC.
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
- Preview deployments are protected by Vercel authentication; production deployments are not protected by Vercel SSO.
- Initial deployment created from a GitHub source snapshot: deployment ID dpl_FijS5hyk8FDbJGnvLtFneMNCynk6. Last observed state: BUILDING (npm install had started; final build result not yet verified).
- Temporary deployment URL: https://memovya-2sqit4ya8-jemoresjemor9-6990.vercel.app
- Vercel assigned alias: memovya-jemoresjemor9-6990.vercel.app.
- Attempt to reserve memovya.vercel.app failed: Vercel reports that this domain is already assigned to another project. Do not claim it is available; user must either have the current owner release it or approve an alternative domain.
- Attempt to create Git-linked project failed because the Vercel GitHub App integration is not installed/authorized for the GitHub account/repository.
- User action required: install/authorize Vercel's GitHub App for the GitHub account and grant access to repository jemoresjemor9-collab/MEMOVYA. Then link the repository to the existing Vercel project memovya. Do not create a second project.

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
- app/login/page.tsx — visual sign-in preparation page; fields intentionally disabled until real authentication is implemented.
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
- No local install, lint or production build has run.
- No Vercel deployment exists.
- GitHub auto-deploy connection is not active.
- Supabase Auth is not configured or tested.
- Google OAuth is not configured.
- No database schema or RLS policies exist.
- No private Storage bucket or Storage policies exist.
- No upload/download, quota enforcement, backup, or restore feature exists.

## Immediate next actions

1. User installs/authorizes Vercel GitHub App for the GitHub account and repository MEMOVYA.
2. Link the existing GitHub repository to the existing Vercel project memovya. Do not create another project.
3. Inspect and resolve the currently building deployment; verify the UI before any public launch.
4. Trigger a Git-linked preview deployment and inspect build logs; fix any build errors before moving on.
4. Verify Vercel environment variables are present in production, preview and development.
5. Design and review the initial database schema before applying migrations.
6. Configure Supabase Auth (email/password, verification, password reset, session management); plan Google OAuth after user creates OAuth credentials in Google Cloud.
7. Create private storage bucket and ownership policies only after schema/policy review.
8. Implement quota enforcement (2 GB free) with server-side/database safeguards.
9. Test cross-user isolation, file upload/download, deletion/restore, and backups before allowing real user data.

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
