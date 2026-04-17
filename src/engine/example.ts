// Runs the "full resolution example" from SYSTEM.md and logs the result.
// Usage: npx tsx src/engine/example.ts

import { resolve } from "./index"
import { campaigns } from "../data/campaigns"
import { users } from "../data/users"
import { surfaces } from "../data/surfaces"
import { contexts } from "../data/contexts"
import { entrySources } from "../data/entrySources"
import type {
  ContentContext,
  EntrySource,
  ResolveOutput,
  Surface,
  User,
} from "./types"

function must<T extends { id: string }>(list: T[], id: string, kind: string): T {
  const hit = list.find((x) => x.id === id)
  if (!hit) throw new Error(`${kind} not found: ${id}`)
  return hit
}

const user: User = must(users, "leadership_member", "user")
const surface: Surface = must(surfaces, "sidebar", "surface")
const contentContext: ContentContext = must(contexts, "cars_article", "context")
const entrySource: EntrySource = must(entrySources, "organic", "entry source")

const result: ResolveOutput = resolve({
  user,
  surface,
  contentContext,
  entrySource,
  campaigns,
  // Pin "now" inside every campaign's active window so none are time-filtered.
  now: new Date("2026-04-17T00:00:00Z"),
})

const { resolvedAsk, decisionLog } = result

console.log("=== SYSTEM.md full resolution example ===\n")
console.log(
  `Inputs: user=${user.name} · surface=${surface.id} · context=${contentContext.id} · entry=${entrySource.id}\n`,
)

console.log("Filtering:")
for (const f of decisionLog.filtering) {
  const mark = f.passed ? "✓" : "✗"
  const note = f.reason ? ` — ${f.reason}` : ""
  console.log(`  ${mark} ${f.campaign_name}${note}`)
}

console.log("\nScoring:")
for (const s of decisionLog.scoring) {
  const breakdown = s.signals
    .map((sig) => `+${sig.points} ${sig.label}`)
    .join(", ")
  console.log(
    `  ${s.campaign_name.padEnd(36, " ")} ${String(s.score).padStart(3, " ")}  (${breakdown || "no signals"})`,
  )
}

console.log(
  `\nWinner: ${resolvedAsk.campaign.name} (score ${decisionLog.scoring.find((s) => s.campaign_id === decisionLog.winner_id)?.score})`,
)

console.log("\nAdaptation:")
for (const a of decisionLog.adaptation) console.log(`  - ${a}`)

console.log("\nPersonalization:")
if (decisionLog.personalization.length === 0) {
  console.log("  (none)")
}
for (const p of decisionLog.personalization) {
  console.log(`  - ${p.label}: ${p.detail}`)
}

console.log("\nResolved ask:")
console.log(`  headline:            ${resolvedAsk.messaging.headline}`)
console.log(`  cta:                 ${resolvedAsk.messaging.cta}`)
console.log(
  `  amounts (${resolvedAsk.amounts.type}):   [${resolvedAsk.amounts.values.map((v) => `$${v}`).join(", ")}]  default=$${resolvedAsk.amounts.default_selected}`,
)
console.log(
  `  goal_meter:          ${resolvedAsk.modules.goal_meter ? `on (${resolvedAsk.modules.goal_meter.current}/${resolvedAsk.modules.goal_meter.target})` : "off"}`,
)
console.log(
  `  social_proof:        ${resolvedAsk.modules.social_proof ? `on (${resolvedAsk.modules.social_proof.value})` : "off"}`,
)
console.log(
  `  impact_framing:      ${resolvedAsk.modules.impact_framing ? "on" : "off"}`,
)
console.log(
  `  recurring_ask:       ${resolvedAsk.modules.recurring_ask ? `on (default_on=${resolvedAsk.modules.recurring_ask.default_on})` : "off"}`,
)
console.log(`  show_payment_form:   ${resolvedAsk.show_payment_form}`)
console.log(`  cta_links_out:       ${resolvedAsk.cta_links_out}`)
