import type { Surface } from "@/engine/types"

export const surfaces: Surface[] = [
  {
    id: "full_page",
    label: "Full Checkout Page",
    layout: "full",
    description:
      "Dedicated donation page. All modules visible. Inline payment form.",
  },
  {
    id: "sidebar",
    label: "Article Sidebar",
    layout: "compact",
    description:
      "Compact widget in article/petition sidebar. Headline only, top 3 amounts, CTA links to full page.",
  },
  {
    id: "modal",
    label: "Modal / Overlay",
    layout: "medium",
    description:
      "Overlay dialog. Headline + short body. Full amounts. CTA links out or submits inline.",
  },
]
