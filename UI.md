# UI.md — Demo Interface Design

This document describes the demo’s UI: what components exist, how they’re laid out, and how interactions work. This is a proof-of-concept demo, not a production app — prioritize clarity of the system concept over visual polish.

-----

## Overall Layout

Split-screen layout, side by side on desktop:

```
┌─────────────────────────┬──────────────────────────────────┐
│                         │                                  │
│     CONTROL PANEL       │        DONATION ASK              │
│     (left, ~360px)      │        (right, fluid)            │
│                         │                                  │
│  Select user            │   [Rendered donation experience  │
│  Select surface         │    updates in real time as       │
│  Select content context │    controls change]              │
│  Select entry source    │                                  │
│                         │                                  │
│  ── System Log ──       │                                  │
│  Shows scoring and      │                                  │
│  decision reasoning     │                                  │
│                         │                                  │
└─────────────────────────┴──────────────────────────────────┘
```

On mobile, stack vertically: control panel on top, donation ask below.

-----

## Control Panel

The left panel. This is the “god mode” — lets the viewer simulate different scenarios by changing inputs.

### Controls (top to bottom):

**User selector**

- Dropdown or segmented control.
- Options: Anonymous Visitor, Alex M. (car enthusiast), Patricia W. (Leadership Circle), James R. (lapsed donor).
- Show a small info line below the selector with key attributes: “Known · avg $75 · interests: autos, baby · active” so the viewer understands what the system knows about this user.

**Surface selector**

- Segmented control (3 options): Full Page, Sidebar, Modal.
- Switching this changes the layout/size of the donation ask on the right.

**Content context selector**

- Dropdown.
- Options: Cars article, Baby article, CR Homepage, Right to Repair petition, Washing Machines article.

**Entry source selector**

- Dropdown.
- Options: Organic, Email (EOY), Email (Leadership), Email (Cars), Paid Social.

### System Log (below the controls):

A small scrollable area that shows what the decision logic did. Updated every time a control changes. This is what makes the demo educational rather than just visual.

Format:

```
── Decision Log ──

Filtering:
  ✓ Evergreen — eligible
  ✓ EOY 2026 — eligible
  ✓ Cars 2026 — eligible (interest match: autos)
  ✗ Leadership Upgrade — excluded (user not in cohort)

Scoring:
  Evergreen ········· 0
  EOY 2026 ·········· 10  (priority: high)
  Cars 2026 ········· 50  (interest: +25, context: +20, priority: +5)

Winner: Cars 2026 (score: 50)

Personalization:
  Amount bumping: avg donation $75 → defaults adjusted
  Lifecycle: active → no CTA modification
```

The log should update in real time. It’s the “show your work” that helps engineers and stakeholders understand the system’s reasoning.

-----

## Donation Ask (Right Panel)

The main visual — the rendered donation experience. This changes based on the winning campaign AND the selected surface.

### Three layout variants:

**Full Page layout:**

- Card-like container, generous padding, full width of the right panel.
- Visible elements (if enabled by campaign + surface rules):
  - Headline (large)
  - Body copy
  - Goal meter (animated progress bar with label)
  - Amount selector (all options, with itemized labels if applicable)
  - Impact framing copy
  - Social proof line
  - Recurring ask toggle
  - CTA button (large, prominent)
  - “Payment form” placeholder (just a grayed-out box labeled “Payment form would appear here” — we’re not building a real form)

**Sidebar layout:**

- Narrow card (~300px), compact spacing.
- Visible elements:
  - Headline (smaller)
  - Top 3 amounts only (compact buttons)
  - Social proof (one line, small text)
  - CTA button
  - No body copy, no goal meter (unless flagged), no impact framing, no recurring ask, no payment form.

**Modal layout:**

- Centered card with overlay/backdrop effect, medium width (~480px).
- Visible elements:
  - Headline
  - Short body copy (truncated if long)
  - Goal meter if enabled
  - Full amount selector
  - Impact framing
  - Social proof
  - Recurring ask toggle
  - CTA button
  - Small “×” close button in corner (non-functional, just for visual accuracy)

### Transition behavior:

When any control changes, the donation ask should update with a brief, subtle transition (fade or slide) so the change feels intentional, not jarring. The viewer should be able to see “something changed” even if they’re looking at the controls.

-----

## Module Components

Each module is a small, self-contained component. They’re shown or hidden based on the campaign’s module settings AND the surface adaptation rules (see SYSTEM.md).

### Goal Meter

- Horizontal progress bar.
- Shows current amount toward target.
- Label: “$347,000 of $500,000 raised” or “67% of goal reached” depending on campaign’s `display` setting.
- Animate the fill on render.

### Amount Selector

- Row of buttons (or a grid for itemized).
- **Preset mode:** buttons show dollar amounts. One is pre-selected (the `default_selected` or the personalized default).
- **Itemized mode:** buttons show dollar amount AND the impact label below. Example:
  
  ```
  ┌──────────────────────┐
  │        $50            │
  │  funds a car seat     │
  │  crash test           │
  └──────────────────────┘
  ```
- Include a small “Other amount” text input at the end.

### Social Proof

- Single line of text with a subtle icon (people icon or heart).
- Example: “12,481 people donated this year” or “Sarah from Portland donated $100 today”

### Impact Framing

- Short paragraph below the amounts, styled as a callout or highlighted text.
- Uses the campaign’s `impact_framing.copy`.

### Recurring Ask

- Toggle switch with label: “Make it monthly” (or campaign-specific prompt).
- Pre-toggled ON if user lifecycle is `recurring_donor`.

### CTA Button

- Large button, full width.
- Text from campaign’s `messaging.cta`.
- Non-functional in the demo (no actual submission). Can show a toast/snackbar “This is a demo — no payment will be processed” on click.

-----

## Visual Design Notes

- Keep it clean and functional. This is a demo, not a CR-branded product. Neutral colors, clear hierarchy, readable type.
- Use a light background for the right panel, slightly darker/muted background for the control panel so they read as distinct zones.
- The donation ask should feel like a real product mockup, not a wireframe. But don’t spend time on pixel-perfection — clarity of the concept matters more.
- The system log should feel like a developer console — monospace font, muted colors, compact.
- Color-code the campaign names consistently across the control panel and donation ask (e.g., Evergreen = gray, EOY = gold, Cars = blue, Leadership = purple) so viewers can visually track which campaign won.

-----

## Key Interaction Scenarios to Verify

After building, verify these scenarios work correctly:

1. **Anonymous user, Homepage, Full Page, Organic** → Evergreen campaign, default amounts, social proof visible, no personalization.
1. **Alex M., Cars article, Sidebar, Organic** → Cars campaign wins (interest + context match), compact sidebar layout, itemized amounts, no goal meter.
1. **Patricia W., Washing Machines article, Full Page, Email (Leadership)** → Leadership campaign wins (cohort match + email entry source), full layout, goal meter visible, amounts bumped high, recurring pre-toggled.
1. **Patricia W., Cars article, Sidebar, Organic** → Leadership campaign still wins (cohort > content context), but now in sidebar layout — compact, goal meter visible (campaign has `show_on_sidebar: true`).
1. **James R., Baby article, Modal, Organic** → What wins? No baby-specific campaign exists, so likely Evergreen or EOY. Lapsed lifecycle adds urgency to CTA. Amounts NOT bumped (avg is $50, within default range).
1. **Switch the Leadership campaign delivery scope to `direct_only`** → Patricia W. on sidebar should now NOT see it; falls back to next best match.
