import { X } from "lucide-react"
import { AmountSelector } from "@/components/Modules/AmountSelector"
import { CTA } from "@/components/Modules/CTA"
import { GoalMeter } from "@/components/Modules/GoalMeter"
import { ImpactFraming } from "@/components/Modules/ImpactFraming"
import { RecurringAsk } from "@/components/Modules/RecurringAsk"
import { SocialProof } from "@/components/Modules/SocialProof"
import { CampaignHeader } from "./CampaignHeader"
import type { ResolvedAsk } from "@/engine/types"

type Props = { ask: ResolvedAsk }

function truncate(text: string, max = 220): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + "…"
}

export function ModalAsk({ ask }: Props) {
  const { campaign, messaging, modules, amounts } = ask
  return (
    <div className="relative flex min-h-[480px] items-center justify-center rounded-xl bg-foreground/40 p-6 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[480px] rounded-xl border bg-card p-6 shadow-xl">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="space-y-4">
          <CampaignHeader campaign={campaign} />
          <header className="space-y-2">
            <h2 className="text-xl font-semibold leading-tight">
              {messaging.headline}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {truncate(messaging.body)}
            </p>
          </header>
          {modules.goal_meter && <GoalMeter module={modules.goal_meter} />}
          <AmountSelector amounts={amounts} />
          {modules.impact_framing && (
            <ImpactFraming module={modules.impact_framing} />
          )}
          {modules.recurring_ask && (
            <RecurringAsk module={modules.recurring_ask} />
          )}
          {modules.social_proof && <SocialProof module={modules.social_proof} />}
          <CTA label={messaging.cta} linksOut={ask.cta_links_out} size="lg" />
        </div>
      </div>
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-white/80">
        Simulated modal / overlay
      </p>
    </div>
  )
}
