import type { Adaptation } from "./adapt"
import type {
  Campaign,
  MessagingVariant,
  PersonalizationNote,
  ResolvedAmounts,
  User,
} from "./types"

export type PersonalizedAsk = Adaptation & {
  messaging: MessagingVariant
  amounts: ResolvedAmounts
  personalization: PersonalizationNote[]
}

export function personalize(
  adaptation: Adaptation,
  campaign: Campaign,
  user: User,
): PersonalizedAsk {
  const notes: PersonalizationNote[] = []

  // 1. Interest-matched messaging variant.
  const messaging = pickMessaging(campaign, user, notes)

  // 2. Amount personalization.
  const amounts = personalizeAmounts(adaptation.amounts, user, notes)

  // 3. Lifecycle adjustments.
  const ctaMessaging = applyLifecycleToCta(messaging, user, notes)

  // 4. Recurring toggle default-on for recurring donors.
  const modules = { ...adaptation.modules }
  if (modules.recurring_ask && user.lifecycle === "recurring_donor") {
    modules.recurring_ask = { ...modules.recurring_ask, default_on: true }
    notes.push({
      label: "recurring toggle",
      detail: "defaulted ON (user lifecycle = recurring_donor)",
    })
  }

  return {
    ...adaptation,
    messaging: ctaMessaging,
    amounts,
    modules,
    personalization: notes,
  }
}

function pickMessaging(
  campaign: Campaign,
  user: User,
  notes: PersonalizationNote[],
): MessagingVariant {
  // Variant keys other than "default" are treated as interest tags, checked
  // in declaration order.
  const variantKeys = Object.keys(campaign.messaging).filter(
    (k) => k !== "default",
  )
  for (const key of variantKeys) {
    if (user.interests.includes(key)) {
      notes.push({
        label: "messaging variant",
        detail: `using variant "${key}" (interest match)`,
      })
      return campaign.messaging[key]
    }
  }
  return campaign.messaging.default
}

function personalizeAmounts(
  amounts: ResolvedAmounts,
  user: User,
  notes: PersonalizationNote[],
): ResolvedAmounts {
  if (user.avg_donation == null) return amounts

  // Itemized amounts keep their values; just re-select the closest option.
  if (amounts.type === "itemized") {
    const closest = closestTo(amounts.values, user.avg_donation)
    if (closest !== amounts.default_selected) {
      notes.push({
        label: "itemized pre-select",
        detail: `selected $${closest} as closest to avg $${user.avg_donation}`,
      })
    }
    return { ...amounts, default_selected: closest }
  }

  // Preset: only bump if avg is strictly higher than the lowest value.
  const lowest = amounts.values[0]
  if (user.avg_donation <= lowest) return amounts

  const middle = amounts.values[Math.floor(amounts.values.length / 2)]
  const factor = user.avg_donation / middle
  if (factor <= 1) return amounts

  const scaled = amounts.values.map((v) => roundNice(v * factor))
  const defaultSelected = closestTo(scaled, user.avg_donation)

  notes.push({
    label: "amount bumping",
    detail: `avg $${user.avg_donation} → ladder scaled ×${factor.toFixed(2)}: [${scaled.map((v) => `$${v}`).join(", ")}]`,
  })

  return {
    ...amounts,
    values: scaled,
    default_selected: defaultSelected,
  }
}

function applyLifecycleToCta(
  messaging: MessagingVariant,
  user: User,
  notes: PersonalizationNote[],
): MessagingVariant {
  switch (user.lifecycle) {
    case "lapsed":
      notes.push({
        label: "lifecycle: lapsed",
        detail: "CTA prefixed with welcome-back language",
      })
      return {
        ...messaging,
        cta: `We miss you — ${messaging.cta}`,
      }
    case "recurring_donor":
      notes.push({
        label: "lifecycle: recurring_donor",
        detail: "no CTA change; recurring toggle defaults ON",
      })
      return messaging
    case "active":
      notes.push({
        label: "lifecycle: active",
        detail: "no CTA modification",
      })
      return messaging
    case "new":
      return messaging
  }
}

function closestTo(values: number[], target: number): number {
  return values.reduce((best, v) =>
    Math.abs(v - target) < Math.abs(best - target) ? v : best,
  )
}

// Round to a human-friendly increment based on magnitude.
function roundNice(n: number): number {
  if (n < 50) return Math.round(n / 5) * 5
  if (n < 250) return Math.round(n / 25) * 25
  if (n < 1000) return Math.round(n / 50) * 50
  if (n < 5000) return Math.round(n / 100) * 100
  return Math.round(n / 500) * 500
}
