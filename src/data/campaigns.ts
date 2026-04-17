import type { Campaign } from "@/engine/types"

export const campaigns: Campaign[] = [
  {
    id: "evergreen",
    name: "Support Consumer Reports",
    status: "active",
    start_date: null,
    end_date: null,
    audience: { type: "everyone" },
    delivery_scope: "everywhere",
    priority: "low",
    messaging: {
      default: {
        headline: "Support Independent Testing",
        body: "Your donation keeps Consumer Reports independent and free from advertiser influence. We test thousands of products every year so you don't have to guess.",
        cta: "Donate Now",
      },
    },
    amounts: {
      type: "preset",
      values: [25, 50, 100, 250],
      default_selected: 50,
    },
    modules: {
      goal_meter: { enabled: false },
      social_proof: {
        enabled: true,
        display: "donor_count",
        value: "12,481 people donated this year",
      },
      impact_framing: { enabled: false },
      recurring_ask: { enabled: true, prompt: "Make it monthly" },
    },
    frequency_cap: { max_exposures: 10, exposure_window_days: 7 },
  },
  {
    id: "eoy_2026",
    name: "End of Year Giving 2026",
    status: "active",
    start_date: "2026-11-15",
    end_date: "2026-12-31",
    audience: { type: "everyone" },
    delivery_scope: "everywhere",
    priority: "high",
    messaging: {
      default: {
        headline: "Make Your Year-End Gift Count",
        body: "Before the year ends, help us protect consumers in 2027. Every dollar funds independent research, testing, and advocacy that keeps you and your family safe.",
        cta: "Give Before Dec 31",
      },
    },
    amounts: {
      type: "preset",
      values: [50, 100, 250, 500],
      default_selected: 100,
    },
    modules: {
      goal_meter: {
        enabled: true,
        target: 500000,
        current: 347000,
        display: "dollars",
        show_on_sidebar: false,
      },
      social_proof: {
        enabled: true,
        display: "recent_donors",
        value: "Sarah from Portland donated $100 today",
      },
      impact_framing: {
        enabled: true,
        copy: "Your gift funds independent testing of the products your family relies on every day.",
      },
      recurring_ask: {
        enabled: true,
        prompt: "Make it monthly and double your impact",
      },
    },
    frequency_cap: { max_exposures: 5, exposure_window_days: 3 },
  },
  {
    id: "cars_2026",
    name: "Help Us Test the Cars You Drive",
    status: "active",
    start_date: "2026-03-01",
    end_date: "2026-08-31",
    audience: { type: "interest_tags", interests: ["autos"] },
    delivery_scope: "everywhere",
    priority: "normal",
    messaging: {
      default: {
        headline: "Help Us Test the Cars You Drive",
        body: "Our auto team purchases and tests every vehicle — no manufacturer freebies. Your donation keeps our car ratings honest and independent.",
        cta: "Fund a Test",
      },
    },
    amounts: {
      type: "itemized",
      values: [50, 100, 250],
      default_selected: 100,
      itemized_labels: {
        "50": "$50 funds a child car seat crash test",
        "100": "$100 funds a full tire performance evaluation",
        "250": "$250 funds a week of real-world vehicle reliability tracking",
      },
    },
    modules: {
      goal_meter: { enabled: false },
      social_proof: {
        enabled: true,
        display: "donor_count",
        value: "2,340 auto enthusiasts have donated",
      },
      impact_framing: {
        enabled: true,
        copy: "Every dollar goes directly to independent vehicle testing — no ads, no sponsors, no bias.",
      },
      recurring_ask: { enabled: false },
    },
    frequency_cap: { max_exposures: 4, exposure_window_days: 7 },
  },
  {
    id: "leadership_upgrade",
    name: "Join the President's Circle",
    status: "active",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    audience: { type: "cohort", cohort_id: "leadership_circle" },
    delivery_scope: "everywhere",
    priority: "high",
    messaging: {
      default: {
        headline: "You're Already Making a Difference — Go Further",
        body: "As a Leadership Circle member, your support has been extraordinary. President's Circle members unlock our highest level of impact — funding multi-year investigations that protect millions of consumers.",
        cta: "Upgrade Your Giving",
      },
    },
    amounts: {
      type: "preset",
      values: [500, 1000, 2500, 5000],
      default_selected: 1000,
    },
    modules: {
      goal_meter: {
        enabled: true,
        target: 200000,
        current: 134000,
        display: "dollars",
        show_on_sidebar: true,
      },
      social_proof: {
        enabled: true,
        display: "donor_count",
        value: "47 members have upgraded this quarter",
      },
      impact_framing: {
        enabled: true,
        copy: "President's Circle funding made our 2-year investigation into auto insurance pricing possible.",
      },
      recurring_ask: { enabled: true, prompt: "Sustain your impact monthly" },
    },
    frequency_cap: { max_exposures: 3, exposure_window_days: 14 },
  },
]
