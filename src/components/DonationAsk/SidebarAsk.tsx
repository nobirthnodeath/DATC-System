import { AmountSelector } from "@/components/Modules/AmountSelector"
import { CTA } from "@/components/Modules/CTA"
import { GoalMeter } from "@/components/Modules/GoalMeter"
import { SocialProof } from "@/components/Modules/SocialProof"
import { CampaignHeader } from "./CampaignHeader"
import type { ResolvedAsk } from "@/engine/types"

type Props = { ask: ResolvedAsk }

export function SidebarAsk({ ask }: Props) {
  const { campaign, messaging, modules, amounts } = ask
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <aside className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="space-y-3">
          <CampaignHeader campaign={campaign} compact />
          <h2 className="text-base font-semibold leading-snug">
            {messaging.headline}
          </h2>
          {modules.goal_meter && (
            <GoalMeter module={modules.goal_meter} compact />
          )}
          <AmountSelector amounts={amounts} compact />
          {modules.social_proof && (
            <SocialProof module={modules.social_proof} compact />
          )}
          <CTA label={messaging.cta} linksOut={ask.cta_links_out} size="default" />
        </div>
      </aside>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        Simulated sidebar widget
      </p>
    </div>
  )
}
