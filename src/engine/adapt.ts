import type {
  Campaign,
  MessagingVariant,
  ResolvedAmounts,
  ResolvedModules,
  Surface,
} from "./types"

export type Adaptation = {
  messaging: MessagingVariant
  amounts: ResolvedAmounts
  modules: ResolvedModules
  show_payment_form: boolean
  cta_links_out: boolean
  notes: string[]
}

export function adapt(campaign: Campaign, surface: Surface): Adaptation {
  const notes: string[] = []
  const messaging = campaign.messaging.default

  const amounts = adaptAmounts(campaign, surface, notes)
  const modules = adaptModules(campaign, surface, notes)

  let show_payment_form = false
  let cta_links_out = false

  switch (surface.id) {
    case "full_page":
      show_payment_form = true
      notes.push("full_page: all enabled modules shown, inline payment form")
      break
    case "sidebar":
      show_payment_form = false
      cta_links_out = true
      notes.push(
        "sidebar: compact layout, headline only, top 3 amounts, CTA links to full page",
      )
      break
    case "modal":
      show_payment_form = false
      cta_links_out = true
      notes.push("modal: medium layout, full amounts, CTA links to full page")
      break
  }

  return {
    messaging,
    amounts,
    modules,
    show_payment_form,
    cta_links_out,
    notes,
  }
}

function adaptAmounts(
  campaign: Campaign,
  surface: Surface,
  notes: string[],
): ResolvedAmounts {
  const base: ResolvedAmounts = {
    type: campaign.amounts.type,
    values: [...campaign.amounts.values],
    default_selected: campaign.amounts.default_selected,
    ...(campaign.amounts.type === "itemized"
      ? { itemized_labels: { ...campaign.amounts.itemized_labels } }
      : {}),
  }

  if (surface.id === "sidebar" && base.values.length > 3) {
    const trimmed = base.values.slice(0, 3)
    notes.push(
      `sidebar: amount ladder trimmed to top 3 (${trimmed.join(", ")})`,
    )
    const defaultInRange = trimmed.includes(base.default_selected)
      ? base.default_selected
      : trimmed[Math.floor(trimmed.length / 2)]
    return {
      ...base,
      values: trimmed,
      default_selected: defaultInRange,
    }
  }

  return base
}

function adaptModules(
  campaign: Campaign,
  surface: Surface,
  notes: string[],
): ResolvedModules {
  const modules: ResolvedModules = {
    goal_meter: null,
    social_proof: null,
    impact_framing: null,
    recurring_ask: null,
  }

  // Goal meter
  if (campaign.modules.goal_meter.enabled) {
    const showOnSidebar = campaign.modules.goal_meter.show_on_sidebar
    if (surface.id === "sidebar" && !showOnSidebar) {
      notes.push("sidebar: goal meter hidden (show_on_sidebar=false)")
    } else {
      modules.goal_meter = campaign.modules.goal_meter
    }
  }

  // Social proof: shown on every surface when enabled
  if (campaign.modules.social_proof.enabled) {
    modules.social_proof = campaign.modules.social_proof
  }

  // Impact framing: hidden on sidebar
  if (campaign.modules.impact_framing.enabled) {
    if (surface.id === "sidebar") {
      notes.push("sidebar: impact framing hidden")
    } else {
      modules.impact_framing = campaign.modules.impact_framing
    }
  }

  // Recurring ask: hidden on sidebar
  if (campaign.modules.recurring_ask.enabled) {
    if (surface.id === "sidebar") {
      notes.push("sidebar: recurring ask hidden")
    } else {
      modules.recurring_ask = {
        ...campaign.modules.recurring_ask,
        default_on: false,
      }
    }
  }

  return modules
}
