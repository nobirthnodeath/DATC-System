import { Badge } from "@/components/ui/badge"
import { campaignColor } from "@/lib/campaignColors"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/engine/types"

type Props = {
  campaign: Campaign
  compact?: boolean
}

export function CampaignHeader({ campaign, compact = false }: Props) {
  const color = campaignColor(campaign.id)
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        compact ? "text-[10px]" : "text-xs",
      )}
    >
      <span
        className={cn("h-2 w-2 shrink-0 rounded-full", color.dot)}
        aria-hidden="true"
      />
      <Badge
        className={cn(
          "uppercase tracking-wide",
          color.badge,
          compact && "py-0 text-[10px]",
        )}
      >
        {campaign.name}
      </Badge>
    </div>
  )
}
