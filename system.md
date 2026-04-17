# SYSTEM.md — Decision Logic

This document describes how the system decides which campaign to show to a given user on a given surface in a given content context. This is the “brain” of the demo.

-----

## Overview

When a donation ask is about to render, the system runs four steps in order:

1. **Filter** — remove campaigns that aren’t eligible
1. **Score** — rank remaining campaigns by relevance
1. **Adapt** — adjust the winning campaign’s presentation for the surface
1. **Personalize** — tune amounts and copy based on user data

The output is a fully resolved donation ask: which campaign, which messaging variant, which amounts, which modules, rendered for which surface.

-----

## Step 1: Filter

Remove campaigns that can’t show in this context.

Rules (apply in order):

- If the campaign has ended (past its end date), exclude it.
- If the campaign hasn’t started yet, exclude it.
- **Delivery scope check:**
  - If campaign scope is `direct_only` AND the current surface is NOT `full_page` with an email entry source → exclude.
  - If campaign scope is `specific_surfaces` AND the current surface is not in the campaign’s allowed surfaces list → exclude.
  - If campaign scope is `everywhere` → passes (no filter).
- **Audience check:**
  - If the campaign targets a specific cohort (e.g. `leadership_circle`) AND the user is not a member → exclude.
  - If the campaign targets specific interest tags AND the user has none of those interests → exclude.
  - If the campaign audience is `everyone` → passes.
- **Frequency cap check:**
  - If the user has seen this campaign more than `max_exposures` times within the `exposure_window` → exclude.

After filtering, if no campaigns remain, fall back to the evergreen campaign (which should always pass all filters).

-----

## Step 2: Score

Score each remaining campaign on a 0–100 scale. Higher wins. Ties broken by priority.

### Scoring signals (additive):

|Signal                   |Points      |Description                                                                                                                             |
|-------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------|
|**Cohort match**         |+40         |User is a confirmed member of the campaign’s target cohort. This is the strongest signal.                                               |
|**Interest match**       |+25         |User has at least one interest tag that matches the campaign’s target interests.                                                        |
|**Content context match**|+20         |The current page/article topic matches the campaign’s target interests or theme.                                                        |
|**Entry source match**   |+10         |User arrived via a channel associated with this campaign (e.g., clicked an email CTA for this campaign). URL params carry `campaign_id`.|
|**Priority bonus**       |+5 per level|Campaign priority: `low` = +0, `normal` = +5, `high` = +10, `critical` = +15.                                                           |

### Scoring notes:

- The **evergreen campaign** has no cohort, interest, or context targeting, so it typically scores only its priority bonus (usually `low`, so +0). It’s the fallback.
- A **broad campaign** (audience: `everyone`) can still score content context match points if its theme aligns with the current article.
- A **targeted campaign** with a cohort match will almost always outscore a broad campaign, which is the intended behavior.

### Tiebreaker:

If two campaigns have the same score, the one with the higher explicit priority wins. If still tied, the most recently created campaign wins.

-----

## Step 3: Adapt to Surface

The winning campaign’s presentation is adjusted based on the rendering surface. The campaign data stays the same — only the layout and visible modules change.

### Surface adaptation rules:

**`full_page`** (dedicated checkout page):

- All modules enabled by the campaign are shown.
- Full messaging (headline + body).
- Full amount selector with all options.
- Payment form shown inline.

**`sidebar`** (article/petition sidebar widget):

- Compact layout.
- Headline only (body copy hidden or truncated).
- Amount selector shows top 3 options only.
- Goal meter hidden (unless campaign explicitly flags `show_on_sidebar: true`).
- No inline payment form — CTA button links to full page.

**`modal`** (overlay/popup):

- Medium layout.
- Headline + short body.
- Full amount selector.
- Goal meter shown if enabled.
- CTA button links to full page or submits inline (configurable).

### Module visibility by surface:

|Module         |full_page   |sidebar         |modal       |
|---------------|------------|----------------|------------|
|Goal meter     |✅ if enabled|❌ unless flagged|✅ if enabled|
|Social proof   |✅ if enabled|✅ (compact)     |✅ if enabled|
|Impact framing |✅ if enabled|❌               |✅ if enabled|
|Recurring ask  |✅ if enabled|❌               |✅ if enabled|
|Amount selector|Full        |Top 3           |Full        |
|Payment form   |Inline      |Hidden (CTA)    |Optional    |

-----

## Step 4: Personalize

After adaptation, apply user-specific modifications. These override campaign defaults where applicable.

### Personalization rules:

**Amount bumping:**

- If user’s `avg_donation` is known AND is higher than the campaign’s lowest preset amount:
  - Shift the amount ladder up so the middle option is closest to their `avg_donation`.
  - Example: campaign defaults are $25 / $50 / $100. User avg is $200. Personalized ladder becomes $100 / $200 / $400.
- If the campaign uses `itemized` framing, do NOT override the amounts (the specificity of itemization is the point). Instead, pre-select the option closest to their average.

**Interest-matched copy swap:**

- If the campaign has `messaging_variants` keyed by interest, AND the user has a matching interest → use that variant.
- If multiple interests match, use the first match in the campaign’s variant priority order.

**Lifecycle adjustments:**

- If user lifecycle is `lapsed` → add urgency language to CTA (“We miss you” / “Welcome back”).
- If user lifecycle is `recurring_donor` → default the recurring toggle to ON.
- If user lifecycle is `new` → no modifications (use campaign defaults).

-----

## Full resolution example

**Inputs:**

- User: Leadership Circle member, avg donation $500, interests: [autos]
- Surface: sidebar
- Content context: cars article
- Entry source: organic (no email params)
- Active campaigns: Evergreen, EOY 2026, Cars Campaign, Leadership Circle → President’s Circle

**Step 1 — Filter:**

- Evergreen: passes (everyone, everywhere)
- EOY 2026: passes (everyone, everywhere)
- Cars Campaign: passes (interest: autos matches user, everywhere)
- Leadership Circle: passes (cohort matches user, everywhere)

**Step 2 — Score:**

- Evergreen: 0 (no matches, low priority) = **0**
- EOY 2026: 0 (no specific matches) + 10 (high priority) = **10**
- Cars Campaign: 25 (interest match) + 20 (content context: cars article) + 5 (normal priority) = **50**
- Leadership Circle: 40 (cohort match) + 25 (interest overlap — autos is in user profile) + 10 (high priority) = **75**

**Winner: Leadership Circle campaign (75)**

**Step 3 — Adapt:**

- Surface is sidebar → compact layout, headline only, top 3 amounts, no goal meter, CTA button.

**Step 4 — Personalize:**

- User avg donation $500 → bump amount ladder. Campaign defaults $250 / $500 / $1000 → personalized to $500 / $1000 / $2500 (user’s avg is already the campaign’s mid-tier, so shift up one tier).
- No messaging variants to swap (campaign has one messaging set).
- User lifecycle: active recurring → default recurring toggle ON.

**Output:** Sidebar widget showing Leadership Circle → President’s Circle campaign messaging, personalized high-value amounts, recurring toggle pre-selected, compact layout.
