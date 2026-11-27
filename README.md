# E-LearnersHub

A React, Vite, Express, and SQLite learning platform for courses, tasks, certificates, payments, referrals, and administration.

## Features

- Learner registration, sign-in, session restoration, logout, and password recovery
- Course catalog, course details, task progress, certificates, payments, and referrals
- Student, instructor, course, and class administration
- SQLite persistence with WAL mode
- Development and production API security, session cookies, and password hashing

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env`.
3. Leave `ADMIN_API_KEY` empty while running locally.
4. Start the frontend and API:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:5173`. The API runs on `http://127.0.0.1:3001`.

## Authentication

- Signup: `/signup`
- Sign-in: `/login`
- Forgot password: `/forgot-password`
- Reset password: `/reset-password?token=<token>`

Local password recovery creates a development-only reset link in the UI and server console. Production requires SMTP settings and `NODE_ENV=production`.

## Demo data

The demo student and instructor scripts are optional and intended for local development:

```powershell
node server/seed-demo-students.js
node server/seed-demo-instructors.js
```

Demo student passwords are randomly generated and are not documented as reusable accounts. Create a normal account through `/signup` for authentication testing.

## Database

The default SQLite database is stored in `server/data/learners.sqlite`. Set `DATABASE_PATH` to use a different location. In production, use persistent storage so database files survive deployment restarts.

## Quality checks

```powershell
npm run lint
npm run build
```

## Production configuration

Set these values in the deployment environment:

```dotenv
NODE_ENV=production
PORT=3001
APP_BASE_URL=https://your-domain.example
ADMIN_API_KEY=<random-key-at-least-32-characters>
DATABASE_PATH=<persistent-database-path>
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
SMTP_FROM=<from-address>
```

Never commit `.env` or a real admin key.

For the complete ordered completion checklist, see `STEP_BY_STEP_GUIDE.md`.
