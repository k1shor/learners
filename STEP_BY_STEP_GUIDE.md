# E-LearnersHub: Step-by-Step Completion Guide

This guide explains the remaining work in order. Complete each phase before moving to the next.

## Current Status

- [x] Project dependencies and scripts reviewed
- [x] SQLite database and authentication API implemented
- [x] Password recovery API and UI implemented
- [x] Login and signup UI implemented
- [x] Authentication routes added
- [x] Real session restoration added through `/api/auth/me`
- [x] Login, logout, and `onAuthenticated` session state connected
- [x] `.env.example` no longer contains a hardcoded weak admin key
- [ ] Production environment file created locally
- [ ] Runtime workflows verified in the browser
- [ ] Final README and deployment checklist reviewed

## 1. Prepare the local environment

1. Open a terminal in the project folder.
2. Copy `.env.example` to `.env`.
3. Leave `ADMIN_API_KEY` empty for local development.
4. Install dependencies:

```powershell
npm install
```

No SMTP values are required for local password recovery; the development reset link will appear in the UI and server output.

## 2. Start the application

Run:

```powershell
npm run dev
```

This starts:

- Vite at `http://localhost:5173`
- the Express API at `http://127.0.0.1:3001`

Keep both processes running during browser testing.

## 3. Test account creation

1. Open `http://localhost:5173/signup`.
2. Enter a name, valid email, and password of at least 8 characters.
3. Submit the form.
4. Confirm that the header shows the account name.
5. Refresh the page.
6. Confirm that `/api/auth/me` restores the session and the account name remains visible.

## 4. Test sign-in and logout

1. Log out from the header.
2. Open `http://localhost:5173/login`.
3. Sign in with the account created in step 3.
4. Confirm that authentication succeeds.
5. Log out again and confirm that the session is cleared.

## 5. Test password recovery

1. Open `http://localhost:5173/forgot-password`.
2. Submit the account email used above.
3. Open the development reset link shown in the UI.
4. Choose a new password.
5. Return to sign-in and log in with the new password.

In production, configure SMTP and do not expose the development reset link.

## 6. Test learner workflows

Verify these routes:

- `/` — homepage and course discovery
- `/tasks` — task progress and persistence
- `/certificates` — certificate generation
- `/payments` — payment information
- `/referrals` — referral content
- `/admin/students` — student directory and account controls
- `/admin/instructors` — instructor directory and edits
- `/admin/courses` — course management
- `/admin/classes` — class scheduling

For each workflow, confirm:

- Loading, empty, success, and error states are understandable.
- Page actions update the API or browser state.
- Refreshing does not remove expected local/API state.
- Destructive actions ask for confirmation before making changes.

## 7. Seed optional demo data

Run only in a local/development database:

```powershell
node server/seed-demo-students.js
node server/seed-demo-instructors.js
```

Demo users use reserved `.example.test` addresses and generated passwords, so create your own account for browser sign-in testing.

## 8. Validate code quality

Run:

```powershell
npm run lint
npm run build
```

Both commands must complete successfully. Fix any new lint or build errors before continuing.

## 9. Configure production

Create a secure `.env` outside source control or in the deployment environment.

Set:

```dotenv
NODE_ENV=production
PORT=3001
APP_BASE_URL=https://your-domain.example
ADMIN_API_KEY=<random-key-at-least-32-characters>
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
SMTP_FROM=<from-address>
DATABASE_PATH=<persistent-database-path>
```

Generate a key with PowerShell:

```powershell
-join ((1..48) | ForEach-Object { '{0:X2}' -f (Get-Random -Minimum 0 -Maximum 256) })
```

Never commit `.env` or reuse the key in client-side code.

## 10. Build and run production locally

```powershell
npm run build
$env:NODE_ENV="production"
node server/index.js
```

Open the server URL and verify that `/api/health`, `/login`, and `/reset-password` are reachable. Stop with `Ctrl+C` afterward.

## 11. Final submission checks

- [ ] No real secrets or passwords are committed
- [ ] `.env.example` contains only placeholders
- [ ] Login, signup, reset, and logout work
- [ ] Sessions survive refresh
- [ ] Disabled accounts cannot sign in
- [ ] Demo data is clearly separated from real data
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] All main learner and admin workflows are manually checked
- [ ] README setup instructions match the current project
- [ ] Production SMTP and persistent SQLite storage are configured
