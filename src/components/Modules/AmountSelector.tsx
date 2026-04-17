import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ResolvedAmounts } from "@/engine/types"

type Props = {
  amounts: ResolvedAmounts
  compact?: boolean
}

export function AmountSelector({ amounts, compact = false }: Props) {
  const [selected, setSelected] = useState<number | "other">(
    amounts.default_selected,
  )
  const [other, setOther] = useState("")

  const isItemized = amounts.type === "itemized"

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div
        className={cn(
          "grid gap-2",
          isItemized && !compact
            ? "grid-cols-1 sm:grid-cols-3"
            : compact
              ? "grid-cols-3"
              : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {amounts.values.map((value) => {
          const active = selected === value
          const label = isItemized
            ? amounts.itemized_labels?.[String(value)]
            : undefined
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={cn(
                "rounded-md border bg-background px-3 text-left transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-input hover:border-foreground/30",
                isItemized && !compact
                  ? "py-3"
                  : compact
                    ? "py-2 text-center"
                    : "py-2.5 text-center",
              )}
              aria-pressed={active}
            >
              <div
                className={cn(
                  "font-semibold tabular-nums",
                  isItemized && !compact ? "text-lg" : "",
                  compact ? "text-sm" : "text-base",
                )}
              >
                ${value.toLocaleString()}
              </div>
              {label && (
                <div className="mt-1 text-xs leading-snug text-muted-foreground">
                  {label}
                </div>
              )}
            </button>
          )
        })}
      </div>
      {!compact && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border px-3 py-2 transition-colors",
            selected === "other"
              ? "border-primary ring-1 ring-primary"
              : "border-input",
          )}
        >
          <span className="text-sm text-muted-foreground">Other</span>
          <span className="text-sm text-muted-foreground">$</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="amount"
            value={other}
            onFocus={() => setSelected("other")}
            onChange={(e) => setOther(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      )}
    </div>
  )
}
