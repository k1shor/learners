# React + Vite

## Admin student management

During local development, the admin panel opens directly at `/admin/students` without a key. The development API listens only on localhost. In production, the panel requires a private random `ADMIN_API_KEY` of at least 32 characters. Disabled users cannot sign in and their existing sessions are revoked.

Configure `ADMIN_API_KEY` only for production and never use a short or guessable value there.

The instructor directory is at `/admin/instructors`. It contains the five course instructors plus five Nepali demo instructors, lists assigned courses and status, supports profile detail views, and lets admins edit an instructor's name, email, and bio or disable/re-enable the profile. Saved names are reflected on course cards, course details, tasks, and certificates. Run `node server/seed-demo-instructors.js` to add the demo instructor records to an existing local database.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
