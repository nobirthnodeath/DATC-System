# CLAUDE.md — Project Instructions

## Project Overview

This is an interactive demo for the Donation ATC (Adaptive Touchpoint Campaign) System. It’s a proof-of-concept, not a production app. Read `README.md` for the full overview.

## Tech Stack

- React + TypeScript (Vite scaffold)
- Tailwind CSS for all styling
- shadcn/ui for UI components (buttons, cards, selects, toggles, badges, separator)
- No backend, no API calls, no database
- All data is hardcoded seed data in `src/data/`

## Coding Conventions

- Use TypeScript for all files (`.ts` and `.tsx`)
- Use functional components with hooks
- Keep components small and focused — one component per file
- Use Tailwind utility classes inline. Do NOT create separate CSS files.
- Use shadcn/ui components wherever possible (Button, Card, Select, Switch, Badge, etc.)
- Import shadcn/ui from `@/components/ui/`
- Use `cn()` utility from `@/lib/utils` for conditional class merging

## Project Structure

```
src/
  data/           # Seed data as TypeScript files
    campaigns.ts
    users.ts
    surfaces.ts
    contexts.ts
    entrySources.ts
  engine/         # Decision logic
    index.ts      # Main resolve() function
    filter.ts     # Step 1: Filter campaigns
    score.ts      # Step 2: Score campaigns
    adapt.ts      # Step 3: Adapt to surface
    personalize.ts # Step 4: Personalize for user
    types.ts      # Shared TypeScript types
  components/
    ControlPanel/
    DonationAsk/
    Modules/      # GoalMeter, AmountSelector, SocialProof, ImpactFraming, RecurringAsk
    SystemLog/
  App.tsx
```

## Key Reference Docs

- `SYSTEM.md` — Decision logic rules (filtering, scoring, adaptation, personalization)
- `DATA.md` — All seed data (campaigns, users, surfaces, contexts, entry sources)
- `UI.md` — Component specs, layout, interactions, verification scenarios

## Do’s

- Read the relevant doc before building each piece (SYSTEM.md for engine, DATA.md for data, UI.md for components)
- Keep the decision engine pure — it takes inputs and returns a result object, no side effects
- Make the system log output part of the engine’s return value (not a UI concern)
- Use transitions/animations sparingly — subtle fade on donation ask changes
- Make the control panel and donation ask side by side on desktop, stacked on mobile
- Type everything — create shared types in `engine/types.ts` and import them everywhere

## Don’ts

- Don’t install a state management library — React useState and useReducer are sufficient
- Don’t create separate CSS/SCSS files — Tailwind only
- Don’t build a real payment form — just a placeholder
- Don’t over-engineer — this is a demo, not production code
- Don’t use `any` type — define proper interfaces
- Don’t fetch data from anywhere — everything is imported from `src/data/`
