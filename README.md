# LTO Exam Practice

A free, installable practice app for the Philippine LTO (Land Transportation Office) written driver's exam. Built as a portfolio project during an OJT placement at LTO Regional Office IV-A.

**Live app:** [lto-exam-app.vercel.app](https://lto-exam-app.vercel.app)

## Features

- **Practice Mode** — answer questions one at a time with instant feedback and an explanation for each answer, filterable by category
- **Mock Exam** — a timed exam (scaled to how many questions you choose) scored against the real 75% LTO passing threshold, with a full per-question review at the end
- **Sign Flashcards** — flip through Philippine road signs to learn their names and meanings
- **Exam History** — past mock exam attempts with date, score, and pass/fail, synced to your account when signed in (or saved locally on this device as a guest)
- **Google sign-in** — sign in to sync your exam history across devices
- **Installable PWA** — install it to your phone or desktop home screen; works offline for previously loaded content

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Postgres database + Auth)
- [Vercel](https://vercel.com/) for hosting
- Manrope (display) + Inter (body) via `next/font/google`

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Supabase](https://supabase.com/) project with:
  - a `questions` table (`category`, `question`, `choices` as jsonb, `correct_index`, `explanation`)
  - a `signs` table (`name`, `meaning`)
  - an `attempts` table (`user_id`, `category`, `score`, `total`, `percentage`, `passed`) with row-level security scoped to the signed-in user
  - Google sign-in enabled under Authentication

### Setup

```bash
git clone https://github.com/AtillanoMarkBeaver/lto-exam-app.git
cd lto-exam-app
npm install
```

Create a `.env.local` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Home
│   ├── practice/         # Practice Mode
│   ├── exam/              # Mock Exam
│   ├── flashcards/       # Sign Flashcards
│   ├── history/          # Exam History
│   └── manifest.ts       # PWA manifest
└── lib/
    ├── supabase.ts       # Supabase client
    ├── Loading.tsx       # Shared loading spinner
    └── sw-register.tsx   # Service worker registration
```

## Deployment

The live site deploys automatically to Vercel on every push to `main`. Supabase environment variables are configured in the Vercel project settings.
