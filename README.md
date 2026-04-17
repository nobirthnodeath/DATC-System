# Donation ATC System — Interactive Demo

## What this is

A proof-of-concept demo for the Consumer Reports Donation ATC (Adaptive Touchpoint Campaign) System. This system makes every donation ask across CR more relevant and compelling by matching the right campaign to the right user on the right surface.

Fundraisers author campaigns with a simple setup — audience, messaging, amounts, optional modules like goal meters. The system figures out which campaign to show to which user, on which surface, based on context and user data. It adapts automatically — the same campaign can look different on a full checkout page vs. an article sidebar. Fundraisers don’t have to think about per-surface layouts, conflicts between campaigns, or frequency management.

## What the demo does

This is NOT a production app. It’s an interactive demo that illustrates the system concept for stakeholders and engineers. There is no backend, no live data, no real payments.

The demo has two parts:

1. **A control panel** where you can switch between different simulated users, surfaces (full page, sidebar, modal), and content contexts (cars article, baby article, homepage, etc.). Think of this as the “god mode” view that lets you see how the system behaves under different conditions.
1. **A donation ask component** that updates in real time as you change the controls. It shows the winning campaign’s messaging, amounts, and active modules — rendered appropriately for the selected surface.

The goal: someone watching the demo should be able to say “oh, I get it — when I switch from an anonymous user to a Leadership Circle member, the ask changes. When I switch from the full page to the sidebar, the layout adapts. When I switch to a cars article, the cars campaign wins.”

## Tech stack

- **React** (Vite scaffold)
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components (buttons, cards, selects, toggles, badges)
- **No backend** — all data is hardcoded seed data, all logic runs client-side
- **Deploy via GitHub Pages** (GitHub Actions)

## Project structure

```
src/
  data/           # Seed data (campaigns, users, surfaces, contexts)
  engine/         # Decision logic (scoring, matching, personalization)
  components/     # UI components
    ControlPanel/ # User/surface/context switcher
    DonationAsk/  # The rendered donation experience
    Modules/      # Goal meter, social proof, impact framing, etc.
  App.jsx         # Main layout: control panel + donation ask side by side
```

## Key docs

- `SYSTEM.md` — How the decision logic works (scoring, matching, personalization rules)
- `DATA.md` — All seed data (campaigns, users, surfaces, content contexts)
- `UI.md` — Component breakdown and interaction design
