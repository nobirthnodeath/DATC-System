import type {
  Campaign,
  ContentContext,
  EntrySource,
  FilterResult,
  Surface,
  User,
} from "./types"

type FilterArgs = {
  campaigns: Campaign[]
  user: User
  surface: Surface
  contentContext: ContentContext
  entrySource: EntrySource
  now: Date
}

// An "email entry source" is one whose id starts with "email_".
// Per SYSTEM.md, direct_only campaigns require full_page + email entry.
function isEmailEntry(entrySource: EntrySource): boolean {
  return entrySource.id.startsWith("email_")
}

function exclude(
  campaign: Campaign,
  reason: string,
): FilterResult & { passed: false } {
  return {
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    passed: false,
    reason,
  }
}

function pass(campaign: Campaign, reason?: string): FilterResult {
  return {
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    passed: true,
    reason,
  }
}

function checkCampaign(
  campaign: Campaign,
  args: FilterArgs,
): FilterResult {
  const { user, surface, entrySource, now } = args

  if (campaign.end_date && new Date(campaign.end_date) < now) {
    return exclude(campaign, `ended on ${campaign.end_date}`)
  }
  if (campaign.start_date && new Date(campaign.start_date) > now) {
    return exclude(campaign, `starts on ${campaign.start_date}`)
  }

  switch (campaign.delivery_scope) {
    case "everywhere":
      break
    case "direct_only": {
      const ok = surface.id === "full_page" && isEmailEntry(entrySource)
      if (!ok) {
        return exclude(
          campaign,
          "direct_only requires full_page + email entry source",
        )
      }
      break
    }
    case "specific_surfaces": {
      const allowed = campaign.allowed_surfaces ?? []
      if (!allowed.includes(surface.id)) {
        return exclude(
          campaign,
          `surface ${surface.id} not in allowed list [${allowed.join(", ")}]`,
        )
      }
      break
    }
  }

  switch (campaign.audience.type) {
    case "everyone":
      break
    case "cohort": {
      const cohortId = campaign.audience.cohort_id
      if (!user.cohorts.includes(cohortId)) {
        return exclude(campaign, `user not in cohort ${cohortId}`)
      }
      break
    }
    case "interest_tags": {
      const targets = campaign.audience.interests
      const overlap = targets.some((t) => user.interests.includes(t))
      if (!overlap) {
        return exclude(
          campaign,
          `user has no matching interest in [${targets.join(", ")}]`,
        )
      }
      break
    }
  }

  const exposure = user.exposure_history[campaign.id]
  if (exposure && exposure.count > campaign.frequency_cap.max_exposures) {
    const windowStart = new Date(now)
    windowStart.setDate(
      windowStart.getDate() - campaign.frequency_cap.exposure_window_days,
    )
    const lastSeen = exposure.last_seen ? new Date(exposure.last_seen) : null
    if (lastSeen && lastSeen >= windowStart) {
      return exclude(
        campaign,
        `frequency cap: seen ${exposure.count}× in last ${campaign.frequency_cap.exposure_window_days}d (max ${campaign.frequency_cap.max_exposures})`,
      )
    }
  }

  return pass(campaign, explainMatch(campaign, user, args.contentContext))
}

function explainMatch(
  campaign: Campaign,
  user: User,
  contentContext: ContentContext,
): string | undefined {
  const notes: string[] = []
  if (campaign.audience.type === "cohort") {
    notes.push(`cohort match: ${campaign.audience.cohort_id}`)
  }
  if (campaign.audience.type === "interest_tags") {
    const hit = campaign.audience.interests.filter((i) =>
      user.interests.includes(i),
    )
    if (hit.length) notes.push(`interest match: ${hit.join(", ")}`)
  }
  const ctx = contentContext.topic_tags.filter(
    (t) =>
      campaign.audience.type === "interest_tags" &&
      campaign.audience.interests.includes(t),
  )
  if (ctx.length) notes.push(`context match: ${ctx.join(", ")}`)
  return notes.length ? notes.join("; ") : undefined
}

export function filterCampaigns(args: FilterArgs): FilterResult[] {
  return args.campaigns.map((c) => checkCampaign(c, args))
}

export function isEvergreen(campaign: Campaign): boolean {
  return campaign.id === "evergreen"
}
