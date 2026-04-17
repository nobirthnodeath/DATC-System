import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SocialProofModule } from "@/engine/types"

type Props = {
  module: Extract<SocialProofModule, { enabled: true }>
  compact?: boolean
}

export function SocialProof({ module, compact = false }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-muted-foreground",
        compact ? "text-xs" : "text-sm",
      )}
    >
      <Users className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden="true" />
      <span>{module.value}</span>
    </div>
  )
}
