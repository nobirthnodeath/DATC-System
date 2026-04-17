// Shared types for the Donation ATC decision engine and demo data.
// Field names mirror the JSON in DATA.md so seed data reads 1:1.

export type Priority = "low" | "normal" | "high" | "critical"

export type DeliveryScope = "everywhere" | "direct_only" | "specific_surfaces"

export type CampaignStatus = "active" | "paused" | "archived"

export type AudienceEveryone = { type: "everyone" }
export type AudienceInterestTags = { type: "interest_tags"; interests: string[] }
export type AudienceCohort = { type: "cohort"; cohort_id: string }
export type Audience = AudienceEveryone | AudienceInterestTags | AudienceCohort

export type MessagingVariant = {
  headline: string
  body: string
  cta: string
}

export type Messaging = {
  default: MessagingVariant
} & {
  [variantKey: string]: MessagingVariant
}

export type PresetAmounts = {
  type: "preset"
  values: number[]
  default_selected: number
}

export type ItemizedAmounts = {
  type: "itemized"
  values: number[]
  default_selected: number
  itemized_labels: Record<string, string>
}

export type Amounts = PresetAmounts | ItemizedAmounts

export type GoalMeterModule =
  | { enabled: false }
  | {
      enabled: true
      target: number
      current: number
      display: "dollars" | "percent"
      show_on_sidebar: boolean
    }

export type SocialProofModule =
  | { enabled: false }
  | {
      enabled: true
      display: "donor_count" | "recent_donors"
      value: string
    }

export type ImpactFramingModule =
  | { enabled: false }
  | { enabled: true; copy: string }

export type RecurringAskModule =
  | { enabled: false }
  | { enabled: true; prompt: string }

export type CampaignModules = {
  goal_meter: GoalMeterModule
  social_proof: SocialProofModule
  impact_framing: ImpactFramingModule
  recurring_ask: RecurringAskModule
}

export type FrequencyCap = {
  max_exposures: number
  exposure_window_days: number
}

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  start_date: string | null
  end_date: string | null
  audience: Audience
  delivery_scope: DeliveryScope
  /** Only used when delivery_scope === "specific_surfaces". */
  allowed_surfaces?: SurfaceId[]
  priority: Priority
  messaging: Messaging
  amounts: Amounts
  modules: CampaignModules
  frequency_cap: FrequencyCap
}

export type Lifecycle = "new" | "active" | "lapsed" | "recurring_donor"

export type ExposureRecord = {
  count: number
  last_seen: string | null
}

export type User = {
  id: string
  name: string
  is_known: boolean
  avg_donation: number | null
  interests: string[]
  cohorts: string[]
  lifecycle: Lifecycle
  exposure_history: Record<string, ExposureRecord>
}

export type SurfaceId = "full_page" | "sidebar" | "modal"

export type Surface = {
  id: SurfaceId
  label: string
  layout: "full" | "compact" | "medium"
  description: string
}

export type PageType = "article" | "homepage" | "petition"

export type ContentContext = {
  id: string
  label: string
  topic_tags: string[]
  page_type: PageType
}

export type EntrySource = {
  id: string
  label: string
  /** If set, the user arrived via this campaign's channel. */
  campaign_id: string | null
}

// ---------- Engine input / output ----------

export type ResolveInput = {
  user: User
  surface: Surface
  context: ContentContext
  entry_source: EntrySource
  campaigns: Campaign[]
  /** Optional: override "now" for deterministic demos. */
  now?: Date
}

export type FilterResult = {
  campaign_id: string
  campaign_name: string
  passed: boolean
  reason?: string
}

export type ScoreSignal = {
  label: string
  points: number
}

export type ScoreResult = {
  campaign_id: string
  campaign_name: string
  score: number
  signals: ScoreSignal[]
}

export type PersonalizationNote = {
  label: string
  detail: string
}

export type DecisionLog = {
  filtering: FilterResult[]
  scoring: ScoreResult[]
  winner_id: string | null
  adaptation: string[]
  personalization: PersonalizationNote[]
}

export type ResolvedAmounts = {
  type: "preset" | "itemized"
  values: number[]
  default_selected: number
  itemized_labels?: Record<string, string>
}

export type ResolvedModules = {
  goal_meter: Extract<GoalMeterModule, { enabled: true }> | null
  social_proof: Extract<SocialProofModule, { enabled: true }> | null
  impact_framing: Extract<ImpactFramingModule, { enabled: true }> | null
  recurring_ask:
    | (Extract<RecurringAskModule, { enabled: true }> & { default_on: boolean })
    | null
}

export type ResolvedAsk = {
  campaign: Campaign
  surface: Surface
  messaging: MessagingVariant
  amounts: ResolvedAmounts
  modules: ResolvedModules
  /** True if this surface renders the inline payment form. */
  show_payment_form: boolean
  /** True if the CTA should link out to full_page rather than submit inline. */
  cta_links_out: boolean
  log: DecisionLog
}
