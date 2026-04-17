// Consistent campaign palette used across the control panel, donation ask,
// and system log per UI.md's visual-tracking guidance.

type CampaignColor = {
  /** Short color name for badges (e.g., "Gold"). */
  name: string
  /** Tailwind classes for a tinted badge background. */
  badge: string
  /** Tailwind classes for a small inline dot. */
  dot: string
}

const PALETTE: Record<string, CampaignColor> = {
  evergreen: {
    name: "gray",
    badge: "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20",
    dot: "bg-zinc-500",
  },
  eoy_2026: {
    name: "gold",
    badge: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
    dot: "bg-amber-500",
  },
  cars_2026: {
    name: "blue",
    badge: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
    dot: "bg-sky-500",
  },
  leadership_upgrade: {
    name: "purple",
    badge: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
    dot: "bg-violet-500",
  },
}

const FALLBACK: CampaignColor = {
  name: "gray",
  badge: "bg-muted text-muted-foreground ring-border",
  dot: "bg-muted-foreground",
}

export function campaignColor(id: string): CampaignColor {
  return PALETTE[id] ?? FALLBACK
}
