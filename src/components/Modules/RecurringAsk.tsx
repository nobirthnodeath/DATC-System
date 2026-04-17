import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import type { ResolvedModules } from "@/engine/types"

type Props = {
  module: NonNullable<ResolvedModules["recurring_ask"]>
}

export function RecurringAsk({ module }: Props) {
  const [on, setOn] = useState(module.default_on)
  const [lastDefault, setLastDefault] = useState(module.default_on)

  // Re-sync when the resolved default flips (e.g., lifecycle changes).
  if (module.default_on !== lastDefault) {
    setLastDefault(module.default_on)
    setOn(module.default_on)
  }

  return (
    <label className="flex items-center justify-between gap-3 rounded-md border bg-background/50 px-3 py-2.5">
      <span className="text-sm font-medium">{module.prompt}</span>
      <Switch
        checked={on}
        onCheckedChange={setOn}
        aria-label="Make this donation recurring"
      />
    </label>
  )
}
