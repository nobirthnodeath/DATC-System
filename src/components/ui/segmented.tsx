import * as React from "react"
import { cn } from "@/lib/utils"

type Option<T extends string> = {
  value: T
  label: React.ReactNode
}

type SegmentedProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  className?: string
  "aria-label"?: string
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-md bg-muted p-1 text-sm",
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded px-3 py-1.5 transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-background text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { Segmented }
