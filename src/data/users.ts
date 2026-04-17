import type { User } from "@/engine/types"

export const users: User[] = [
  {
    id: "anonymous",
    name: "Anonymous Visitor",
    is_known: false,
    avg_donation: null,
    interests: [],
    cohorts: [],
    lifecycle: "new",
    exposure_history: {},
  },
  {
    id: "car_enthusiast",
    name: "Alex M.",
    is_known: true,
    avg_donation: 75,
    interests: ["autos", "baby_products"],
    cohorts: [],
    lifecycle: "active",
    exposure_history: {
      cars_2026: { count: 0, last_seen: null },
    },
  },
  {
    id: "leadership_member",
    name: "Patricia W.",
    is_known: true,
    avg_donation: 500,
    interests: ["autos", "health"],
    cohorts: ["leadership_circle"],
    lifecycle: "recurring_donor",
    exposure_history: {
      leadership_upgrade: { count: 1, last_seen: "2026-04-10" },
    },
  },
  {
    id: "lapsed_donor",
    name: "James R.",
    is_known: true,
    avg_donation: 50,
    interests: ["baby_products"],
    cohorts: [],
    lifecycle: "lapsed",
    exposure_history: {},
  },
]
