// Walks through the 6 scenarios from UI.md's "Key Interaction Scenarios to
// Verify". Prints a concise PASS/FAIL line for each expectation.
// Usage: npx tsx src/engine/verify.ts

import { resolve } from "./index"
import { campaigns } from "../data/campaigns"
import { users } from "../data/users"
import { surfaces } from "../data/surfaces"
import { contexts } from "../data/contexts"
import { entrySources } from "../data/entrySources"
import type {
  Campaign,
  ContentContext,
  EntrySource,
  Surface,
  SurfaceId,
  User,
} from "./types"

const NOW = new Date("2026-04-17T12:00:00Z")

function must<T extends { id: string }>(list: T[], id: string): T {
  const hit = list.find((x) => x.id === id)
  if (!hit) throw new Error(`missing ${id}`)
  return hit
}

function runScenario(params: {
  userId: string
  surfaceId: SurfaceId
  contextId: string
  entrySourceId: string
  campaignOverrides?: Campaign[]
}) {
  const cs = params.campaignOverrides ?? campaigns
  return resolve({
    user: must(users, params.userId) as User,
    surface: must(surfaces, params.surfaceId) as Surface,
    contentContext: must(contexts, params.contextId) as ContentContext,
    entrySource: must(entrySources, params.entrySourceId) as EntrySource,
    campaigns: cs,
    now: NOW,
  })
}

let fails = 0
function expect(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) fails++
  console.log(
    `  ${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `\n        expected: ${JSON.stringify(expected)}\n        actual:   ${JSON.stringify(actual)}`}`,
  )
}

// ---------- Scenario 1 ----------
console.log("\nScenario 1: Anonymous / Homepage / Full Page / Organic")
{
  const { resolvedAsk } = runScenario({
    userId: "anonymous",
    surfaceId: "full_page",
    contextId: "homepage",
    entrySourceId: "organic",
  })
  expect("winner = evergreen", resolvedAsk.campaign.id, "evergreen")
  expect(
    "default amounts preserved",
    resolvedAsk.amounts.values,
    [25, 50, 100, 250],
  )
  expect(
    "social proof visible",
    !!resolvedAsk.modules.social_proof,
    true,
  )
  expect(
    "no impact framing (campaign off)",
    resolvedAsk.modules.impact_framing,
    null,
  )
  expect("CTA unchanged (new lifecycle)", resolvedAsk.messaging.cta, "Donate Now")
  expect("payment form shown", resolvedAsk.show_payment_form, true)
}

// ---------- Scenario 2 ----------
console.log("\nScenario 2: Alex M. / Cars article / Sidebar / Organic")
{
  const { resolvedAsk } = runScenario({
    userId: "car_enthusiast",
    surfaceId: "sidebar",
    contextId: "cars_article",
    entrySourceId: "organic",
  })
  expect("winner = cars_2026", resolvedAsk.campaign.id, "cars_2026")
  expect("amounts type itemized", resolvedAsk.amounts.type, "itemized")
  expect("no goal meter (campaign off)", resolvedAsk.modules.goal_meter, null)
  expect(
    "sidebar: no impact framing",
    resolvedAsk.modules.impact_framing,
    null,
  )
  expect(
    "sidebar: no recurring ask",
    resolvedAsk.modules.recurring_ask,
    null,
  )
  expect(
    "sidebar: amount count ≤ 3",
    resolvedAsk.amounts.values.length <= 3,
    true,
  )
  expect("CTA links out", resolvedAsk.cta_links_out, true)
}

// ---------- Scenario 3 ----------
console.log(
  "\nScenario 3: Patricia W. / Washing Machines / Full Page / Email (Leadership)",
)
{
  const { resolvedAsk, decisionLog } = runScenario({
    userId: "leadership_member",
    surfaceId: "full_page",
    contextId: "washing_machines_article",
    entrySourceId: "email_leadership",
  })
  expect(
    "winner = leadership_upgrade",
    resolvedAsk.campaign.id,
    "leadership_upgrade",
  )
  const signals =
    decisionLog.scoring.find((s) => s.campaign_id === "leadership_upgrade")
      ?.signals.map((s) => s.label) ?? []
  expect(
    "cohort match present",
    signals.some((l) => l.startsWith("cohort match")),
    true,
  )
  expect(
    "entry source match present",
    signals.some((l) => l.startsWith("entry source match")),
    true,
  )
  expect("goal meter visible", !!resolvedAsk.modules.goal_meter, true)
  expect(
    "recurring toggle default ON (recurring_donor)",
    resolvedAsk.modules.recurring_ask?.default_on,
    true,
  )
}

// ---------- Scenario 4 ----------
console.log(
  "\nScenario 4: Patricia W. / Cars article / Sidebar / Organic",
)
{
  const { resolvedAsk } = runScenario({
    userId: "leadership_member",
    surfaceId: "sidebar",
    contextId: "cars_article",
    entrySourceId: "organic",
  })
  expect(
    "winner = leadership_upgrade (cohort > context)",
    resolvedAsk.campaign.id,
    "leadership_upgrade",
  )
  expect(
    "sidebar: goal meter still visible (show_on_sidebar=true)",
    !!resolvedAsk.modules.goal_meter,
    true,
  )
  expect("CTA links out", resolvedAsk.cta_links_out, true)
}

// ---------- Scenario 5 ----------
console.log(
  "\nScenario 5: James R. (lapsed) / Baby article / Modal / Organic",
)
{
  const { resolvedAsk, decisionLog } = runScenario({
    userId: "lapsed_donor",
    surfaceId: "modal",
    contextId: "baby_article",
    entrySourceId: "organic",
  })
  expect(
    "winner is evergreen (no baby campaign, EOY out of date window)",
    resolvedAsk.campaign.id,
    "evergreen",
  )
  expect(
    "lapsed lifecycle adds urgency prefix to CTA",
    resolvedAsk.messaging.cta.startsWith("We miss you"),
    true,
  )
  expect(
    "no amount bumping (avg $50 = lowest preset)",
    resolvedAsk.amounts.values,
    [25, 50, 100, 250],
  )
  const lapsedNote = decisionLog.personalization.find(
    (p) => p.label === "lifecycle: lapsed",
  )
  expect("personalization log records lapsed", !!lapsedNote, true)
}

// ---------- Scenario 6 ----------
console.log(
  "\nScenario 6: Leadership scope=direct_only, Patricia on sidebar/organic",
)
{
  const patched = campaigns.map((c) =>
    c.id === "leadership_upgrade"
      ? ({ ...c, delivery_scope: "direct_only" } as Campaign)
      : c,
  )
  const { resolvedAsk, decisionLog } = runScenario({
    userId: "leadership_member",
    surfaceId: "sidebar",
    contextId: "cars_article",
    entrySourceId: "organic",
    campaignOverrides: patched,
  })
  expect(
    "Leadership excluded by direct_only",
    decisionLog.filtering.find((f) => f.campaign_id === "leadership_upgrade")
      ?.passed,
    false,
  )
  expect(
    "falls back to next best (cars_2026)",
    resolvedAsk.campaign.id,
    "cars_2026",
  )
}

console.log(
  `\n${fails === 0 ? "✓ All scenarios passed" : `✗ ${fails} failure(s)`}`,
)
if (fails > 0) process.exitCode = 1
