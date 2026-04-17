import { cn } from "@/lib/utils"
import { campaignColor } from "@/lib/campaignColors"
import type { DecisionLog } from "@/engine/types"

type Props = {
  log: DecisionLog
}

export function SystemLog({ log }: Props) {
  const winnerScore = log.scoring.find((s) => s.campaign_id === log.winner_id)

  return (
    <div className="rounded-lg border bg-muted/40 font-mono text-xs text-foreground/90">
      <header className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Decision Log
        </h2>
      </header>
      <div className="max-h-[340px] space-y-3 overflow-y-auto p-3 leading-5">
        <Section title="Filtering">
          {log.filtering.map((f) => (
            <LogLine key={f.campaign_id}>
              <span className={f.passed ? "text-emerald-600" : "text-rose-600"}>
                {f.passed ? "✓" : "✗"}
              </span>{" "}
              <CampaignSwatch id={f.campaign_id} />
              <span className="text-foreground">{f.campaign_name}</span>
              {f.reason && (
                <span className="text-muted-foreground"> — {f.reason}</span>
              )}
            </LogLine>
          ))}
        </Section>

        <Section title="Scoring">
          {log.scoring.map((s) => {
            const breakdown = s.signals
              .map((sig) => `+${sig.points} ${sig.label}`)
              .join(", ")
            const isWinner = s.campaign_id === log.winner_id
            return (
              <LogLine
                key={s.campaign_id}
                className={cn(isWinner && "font-semibold text-foreground")}
              >
                <CampaignSwatch id={s.campaign_id} />
                <span
                  className={cn(
                    "inline-block w-44 truncate align-middle",
                    isWinner ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.campaign_name}
                </span>
                <span className="inline-block w-10 text-right tabular-nums">
                  {s.score}
                </span>
                {breakdown && (
                  <span className="ml-2 text-muted-foreground">
                    ({breakdown})
                  </span>
                )}
              </LogLine>
            )
          })}
        </Section>

        <Section title="Winner">
          {winnerScore ? (
            <LogLine>
              <CampaignSwatch id={winnerScore.campaign_id} />
              <span className="font-semibold text-foreground">
                {winnerScore.campaign_name}
              </span>
              <span className="text-muted-foreground">
                {" "}
                (score {winnerScore.score})
              </span>
            </LogLine>
          ) : (
            <LogLine>
              <span className="text-muted-foreground">(none)</span>
            </LogLine>
          )}
        </Section>

        <Section title="Adaptation">
          {log.adaptation.length === 0 ? (
            <LogLine>
              <span className="text-muted-foreground">(none)</span>
            </LogLine>
          ) : (
            log.adaptation.map((note, i) => (
              <LogLine key={i}>
                <span className="text-muted-foreground">- </span>
                {note}
              </LogLine>
            ))
          )}
        </Section>

        <Section title="Personalization">
          {log.personalization.length === 0 ? (
            <LogLine>
              <span className="text-muted-foreground">(none)</span>
            </LogLine>
          ) : (
            log.personalization.map((p, i) => (
              <LogLine key={i}>
                <span className="text-muted-foreground">- </span>
                <span className="text-foreground">{p.label}:</span>{" "}
                <span className="text-muted-foreground">{p.detail}</span>
              </LogLine>
            ))
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </section>
  )
}

function LogLine({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("leading-5", className)}>{children}</div>
}

function CampaignSwatch({ id }: { id: string }) {
  const color = campaignColor(id)
  return (
    <span
      className={cn(
        "mr-1 inline-block h-2 w-2 translate-y-[-1px] rounded-full align-middle",
        color.dot,
      )}
      aria-hidden="true"
    />
  )
}
