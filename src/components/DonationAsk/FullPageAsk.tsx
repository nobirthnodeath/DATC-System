import { AmountSelector } from "@/components/Modules/AmountSelector"
import { CTA } from "@/components/Modules/CTA"
import { GoalMeter } from "@/components/Modules/GoalMeter"
import { ImpactFraming } from "@/components/Modules/ImpactFraming"
import { RecurringAsk } from "@/components/Modules/RecurringAsk"
import { SocialProof } from "@/components/Modules/SocialProof"
import { Separator } from "@/components/ui/separator"
import { CampaignHeader } from "./CampaignHeader"
import type { ResolvedAsk } from "@/engine/types"

type Props = { ask: ResolvedAsk }

export function FullPageAsk({ ask }: Props) {
  const { campaign, messaging, modules, amounts } = ask

  return (
    <article className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-8 shadow-sm">
      <div className="space-y-6">
        <CampaignHeader campaign={campaign} />

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {messaging.headline}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {messaging.body}
          </p>
        </header>

        {modules.goal_meter && <GoalMeter module={modules.goal_meter} />}

        <Separator />

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Choose your gift
          </h2>
          <AmountSelector amounts={amounts} />
        </div>

        {modules.impact_framing && (
          <ImpactFraming module={modules.impact_framing} />
        )}

        {modules.recurring_ask && (
          <RecurringAsk module={modules.recurring_ask} />
        )}

        {modules.social_proof && <SocialProof module={modules.social_proof} />}

        {ask.show_payment_form && <PaymentFormPlaceholder />}

        <CTA
          label={messaging.cta}
          linksOut={ask.cta_links_out}
          size="xl"
        />
      </div>
    </article>
  )
}

function PaymentFormPlaceholder() {
  return (
    <div className="rounded-md border border-dashed bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
      <div className="font-medium text-foreground/60">Payment form</div>
      <div className="mt-1">
        A real payment form would appear here (name, card, billing address).
      </div>
    </div>
  )
}
