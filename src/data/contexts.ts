import type { ContentContext } from "@/engine/types"

export const contexts: ContentContext[] = [
  {
    id: "cars_article",
    label: "Article: Best Reliable Used Cars for 2026",
    topic_tags: ["autos"],
    page_type: "article",
  },
  {
    id: "baby_article",
    label: "Article: Safest Strollers and Car Seats",
    topic_tags: ["baby_products"],
    page_type: "article",
  },
  {
    id: "homepage",
    label: "CR Homepage",
    topic_tags: [],
    page_type: "homepage",
  },
  {
    id: "petition",
    label: "Petition: Right to Repair",
    topic_tags: ["advocacy"],
    page_type: "petition",
  },
  {
    id: "washing_machines_article",
    label: "Article: Best Washing Machines",
    topic_tags: ["appliances"],
    page_type: "article",
  },
]
