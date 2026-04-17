import type { EntrySource } from "@/engine/types"

export const entrySources: EntrySource[] = [
  {
    id: "organic",
    label: "Organic / Direct",
    campaign_id: null,
  },
  {
    id: "email_eoy",
    label: "Email: End of Year Campaign",
    campaign_id: "eoy_2026",
  },
  {
    id: "email_leadership",
    label: "Email: Leadership Circle Upgrade",
    campaign_id: "leadership_upgrade",
  },
  {
    id: "email_cars",
    label: "Email: Cars Campaign",
    campaign_id: "cars_2026",
  },
  {
    id: "paid_social",
    label: "Paid Social Ad",
    campaign_id: null,
  },
]
