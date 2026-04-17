import { Sparkles } from "lucide-react"
import type { ImpactFramingModule } from "@/engine/types"

type Props = {
  module: Extract<ImpactFramingModule, { enabled: true }>
}

export function ImpactFraming({ module }: Props) {
  return (
    <div className="flex gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
      <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-foreground/80">{module.copy}</p>
    </div>
  )
}
