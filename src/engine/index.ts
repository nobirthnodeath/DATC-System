import { filterCampaigns, isEvergreen } from "./filter"
import { pickWinner, scoreCampaigns } from "./score"
import { adapt } from "./adapt"
import { personalize } from "./personalize"
import type {
  Campaign,
  DecisionLog,
  ResolveInput,
  ResolveOutput,
  ResolvedAsk,
} from "./types"

export function resolve(input: ResolveInput): ResolveOutput {
  const now = input.now ?? new Date()
  const { user, surface, contentContext, entrySource, campaigns } = input

  // --- Step 1: Filter ---
  const filtering = filterCampaigns({
    campaigns,
    user,
    surface,
    contentContext,
    entrySource,
    now,
  })

  let eligible = campaigns.filter(
    (c) => filtering.find((f) => f.campaign_id === c.id)?.passed,
  )

  // Fallback: if nothing passed, use evergreen (always expected to pass).
  if (eligible.length === 0) {
    const evergreen = campaigns.find(isEvergreen)
    if (!evergreen) {
      throw new Error(
        "No eligible campaigns and no evergreen fallback in campaigns list",
      )
    }
    eligible = [evergreen]
  }

  // --- Step 2: Score ---
  const scoring = scoreCampaigns(eligible, {
    user,
    contentContext,
    entrySource,
  })
  const winner = pickWinner(scoring, eligible) ?? eligible[0]

  // --- Step 3: Adapt ---
  const adaptation = adapt(winner, surface)

  // --- Step 4: Personalize ---
  const personalized = personalize(adaptation, winner, user)

  const log: DecisionLog = {
    filtering,
    scoring: sortScoringForLog(scoring, winner),
    winner_id: winner.id,
    adaptation: adaptation.notes,
    personalization: personalized.personalization,
  }

  const resolvedAsk: ResolvedAsk = {
    campaign: winner,
    surface,
    messaging: personalized.messaging,
    amounts: personalized.amounts,
    modules: personalized.modules,
    show_payment_form: personalized.show_payment_form,
    cta_links_out: personalized.cta_links_out,
    log,
  }

  return { resolvedAsk, decisionLog: log }
}

function sortScoringForLog(
  scoring: ReturnType<typeof scoreCampaigns>,
  winner: Campaign,
) {
  return [...scoring].sort((a, b) => {
    if (a.campaign_id === winner.id) return -1
    if (b.campaign_id === winner.id) return 1
    return b.score - a.score
  })
}

export type { ResolveInput, ResolveOutput } from "./types"
