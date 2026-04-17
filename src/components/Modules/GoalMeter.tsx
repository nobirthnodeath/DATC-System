import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { GoalMeterModule } from "@/engine/types"

type Props = {
  module: Extract<GoalMeterModule, { enabled: true }>
  compact?: boolean
}

function formatDollars(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export function GoalMeter({ module, compact = false }: Props) {
  const pct = Math.min(100, Math.round((module.current / module.target) * 100))
  const [renderedPct, setRenderedPct] = useState(0)

  // Animate fill from 0 → pct on mount / whenever pct changes. This is a
  // deliberate "kick the width after first paint" so CSS transitions run.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenderedPct(0)
    const t = window.setTimeout(() => setRenderedPct(pct), 30)
    return () => window.clearTimeout(t)
  }, [pct])

  const label =
    module.display === "percent"
      ? `${pct}% of goal reached`
      : `${formatDollars(module.current)} of ${formatDollars(module.target)} raised`

  return (
    <div className={cn("w-full", compact ? "space-y-1" : "space-y-2")}>
      <div
        className={cn(
          "flex items-baseline justify-between",
          compact ? "text-xs" : "text-sm",
        )}
      >
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{pct}%</span>
      </div>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          compact ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${renderedPct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  )
}
