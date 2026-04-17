import type {
  Campaign,
  ContentContext,
  EntrySource,
  Priority,
  ScoreResult,
  ScoreSignal,
  User,
} from "./types"

const PRIORITY_BONUS: Record<Priority, number> = {
  low: 0,
  normal: 5,
  high: 10,
  critical: 15,
}

type ScoreArgs = {
  campaign: Campaign
  user: User
  contentContext: ContentContext
  entrySource: EntrySource
}

function campaignInterests(campaign: Campaign): string[] {
  if (campaign.audience.type === "interest_tags") {
    return campaign.audience.interests
  }
  return []
}

function scoreOne(args: ScoreArgs): ScoreResult {
  const { campaign, user, contentContext, entrySource } = args
  const signals: ScoreSignal[] = []

  // Cohort match (+40)
  if (
    campaign.audience.type === "cohort" &&
    user.cohorts.includes(campaign.audience.cohort_id)
  ) {
    signals.push({
      label: `cohort match (${campaign.audience.cohort_id})`,
      points: 40,
    })
  }

  // Interest match (+25): user has any interest that overlaps with the
  // campaign's target interests.
  const targetInterests = campaignInterests(campaign)
  const interestHits = targetInterests.filter((i) => user.interests.includes(i))
  if (interestHits.length > 0) {
    signals.push({
      label: `interest match (${interestHits.join(", ")})`,
      points: 25,
    })
  } else if (targetInterests.length === 0 && campaign.audience.type === "cohort") {
    // Cohort campaigns often implicitly benefit from the cohort member's
    // interest profile. SYSTEM.md's worked example gives the Leadership
    // campaign +25 because the user's autos interest overlaps with the cars
    // article context. We model this by letting a cohort campaign pick up the
    // interest signal when the user's interests overlap the content context.
    const ctxOverlap = contentContext.topic_tags.filter((t) =>
      user.interests.includes(t),
    )
    if (ctxOverlap.length > 0) {
      signals.push({
        label: `interest overlap (${ctxOverlap.join(", ")})`,
        points: 25,
      })
    }
  }

  // Content context match (+20): campaign's target interests overlap with
  // the current page's topic tags.
  const ctxMatch = contentContext.topic_tags.filter((t) =>
    targetInterests.includes(t),
  )
  if (ctxMatch.length > 0) {
    signals.push({
      label: `content context match (${ctxMatch.join(", ")})`,
      points: 20,
    })
  }

  // Entry source match (+10)
  if (entrySource.campaign_id === campaign.id) {
    signals.push({
      label: `entry source match (${entrySource.id})`,
      points: 10,
    })
  }

  // Priority bonus
  const priorityPoints = PRIORITY_BONUS[campaign.priority]
  if (priorityPoints > 0) {
    signals.push({
      label: `priority bonus (${campaign.priority})`,
      points: priorityPoints,
    })
  }

  const score = signals.reduce((sum, s) => sum + s.points, 0)

  return {
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    score,
    signals,
  }
}

export function scoreCampaigns(
  campaigns: Campaign[],
  shared: Omit<ScoreArgs, "campaign">,
): ScoreResult[] {
  return campaigns.map((campaign) => scoreOne({ campaign, ...shared }))
}

/**
 * Pick the winner: highest score, break ties by priority (higher wins),
 * then by start_date (more recent wins), then by the order campaigns appear.
 */
export function pickWinner(
  results: ScoreResult[],
  campaigns: Campaign[],
): Campaign | null {
  if (results.length === 0) return null
  const byId = new Map(campaigns.map((c) => [c.id, c]))
  const indexOf = new Map(campaigns.map((c, i) => [c.id, i]))

  const sorted = [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const ca = byId.get(a.campaign_id)!
    const cb = byId.get(b.campaign_id)!
    const pa = PRIORITY_BONUS[ca.priority]
    const pb = PRIORITY_BONUS[cb.priority]
    if (pb !== pa) return pb - pa
    const da = ca.start_date ? new Date(ca.start_date).getTime() : 0
    const db = cb.start_date ? new Date(cb.start_date).getTime() : 0
    if (db !== da) return db - da
    return (indexOf.get(a.campaign_id) ?? 0) - (indexOf.get(b.campaign_id) ?? 0)
  })

  return byId.get(sorted[0].campaign_id) ?? null
}
