# DATA.md — Seed Data

All data for the demo is hardcoded. No backend, no API calls. This document defines every object the demo uses. When building, these should be created as structured data files (TypeScript objects or JSON) in `src/data/`.

-----

## Campaigns

Four campaigns that exercise the key system behaviors.

### Campaign 1: Evergreen

The fallback. Always running, always eligible, lowest priority. Generic CR donation ask.

```json
{
  "id": "evergreen",
  "name": "Support Consumer Reports",
  "status": "active",
  "start_date": null,
  "end_date": null,
  "audience": {
    "type": "everyone"
  },
  "delivery_scope": "everywhere",
  "priority": "low",
  "messaging": {
    "default": {
      "headline": "Support Independent Testing",
      "body": "Your donation keeps Consumer Reports independent and free from advertiser influence. We test thousands of products every year so you don't have to guess.",
      "cta": "Donate Now"
    }
  },
  "amounts": {
    "type": "preset",
    "values": [25, 50, 100, 250],
    "default_selected": 50
  },
  "modules": {
    "goal_meter": { "enabled": false },
    "social_proof": {
      "enabled": true,
      "display": "donor_count",
      "value": "12,481 people donated this year"
    },
    "impact_framing": { "enabled": false },
    "recurring_ask": {
      "enabled": true,
      "prompt": "Make it monthly"
    }
  },
  "frequency_cap": {
    "max_exposures": 10,
    "exposure_window_days": 7
  }
}
```

### Campaign 2: End of Year 2026

Broad tentpole campaign. Applies to everyone but with stronger messaging and a goal meter. High priority so it beats evergreen during its run.

```json
{
  "id": "eoy_2026",
  "name": "End of Year Giving 2026",
  "status": "active",
  "start_date": "2026-11-15",
  "end_date": "2026-12-31",
  "audience": {
    "type": "everyone"
  },
  "delivery_scope": "everywhere",
  "priority": "high",
  "messaging": {
    "default": {
      "headline": "Make Your Year-End Gift Count",
      "body": "Before the year ends, help us protect consumers in 2027. Every dollar funds independent research, testing, and advocacy that keeps you and your family safe.",
      "cta": "Give Before Dec 31"
    }
  },
  "amounts": {
    "type": "preset",
    "values": [50, 100, 250, 500],
    "default_selected": 100
  },
  "modules": {
    "goal_meter": {
      "enabled": true,
      "target": 500000,
      "current": 347000,
      "display": "dollars",
      "show_on_sidebar": false
    },
    "social_proof": {
      "enabled": true,
      "display": "recent_donors",
      "value": "Sarah from Portland donated $100 today"
    },
    "impact_framing": {
      "enabled": true,
      "copy": "Your gift funds independent testing of the products your family relies on every day."
    },
    "recurring_ask": {
      "enabled": true,
      "prompt": "Make it monthly and double your impact"
    }
  },
  "frequency_cap": {
    "max_exposures": 5,
    "exposure_window_days": 3
  }
}
```

### Campaign 3: Cars Campaign

Targeted campaign for auto-interested users. Content-context aware — scores higher on car-related articles. Uses itemized impact framing.

```json
{
  "id": "cars_2026",
  "name": "Help Us Test the Cars You Drive",
  "status": "active",
  "start_date": "2026-03-01",
  "end_date": "2026-08-31",
  "audience": {
    "type": "interest_tags",
    "interests": ["autos"]
  },
  "delivery_scope": "everywhere",
  "priority": "normal",
  "messaging": {
    "default": {
      "headline": "Help Us Test the Cars You Drive",
      "body": "Our auto team purchases and tests every vehicle — no manufacturer freebies. Your donation keeps our car ratings honest and independent.",
      "cta": "Fund a Test"
    }
  },
  "amounts": {
    "type": "itemized",
    "values": [50, 100, 250],
    "default_selected": 100,
    "itemized_labels": {
      "50": "$50 funds a child car seat crash test",
      "100": "$100 funds a full tire performance evaluation",
      "250": "$250 funds a week of real-world vehicle reliability tracking"
    }
  },
  "modules": {
    "goal_meter": { "enabled": false },
    "social_proof": {
      "enabled": true,
      "display": "donor_count",
      "value": "2,340 auto enthusiasts have donated"
    },
    "impact_framing": {
      "enabled": true,
      "copy": "Every dollar goes directly to independent vehicle testing — no ads, no sponsors, no bias."
    },
    "recurring_ask": {
      "enabled": false
    }
  },
  "frequency_cap": {
    "max_exposures": 4,
    "exposure_window_days": 7
  }
}
```

### Campaign 4: Leadership Circle → President’s Circle

Targeted cohort campaign. High priority. Aimed at upgrading existing high-value donors. Can be toggled between `everywhere` and `direct_only` to demonstrate the delivery scope feature.

```json
{
  "id": "leadership_upgrade",
  "name": "Join the President's Circle",
  "status": "active",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "audience": {
    "type": "cohort",
    "cohort_id": "leadership_circle"
  },
  "delivery_scope": "everywhere",
  "priority": "high",
  "messaging": {
    "default": {
      "headline": "You're Already Making a Difference — Go Further",
      "body": "As a Leadership Circle member, your support has been extraordinary. President's Circle members unlock our highest level of impact — funding multi-year investigations that protect millions of consumers.",
      "cta": "Upgrade Your Giving"
    }
  },
  "amounts": {
    "type": "preset",
    "values": [500, 1000, 2500, 5000],
    "default_selected": 1000
  },
  "modules": {
    "goal_meter": {
      "enabled": true,
      "target": 200000,
      "current": 134000,
      "display": "dollars",
      "show_on_sidebar": true
    },
    "social_proof": {
      "enabled": true,
      "display": "donor_count",
      "value": "47 members have upgraded this quarter"
    },
    "impact_framing": {
      "enabled": true,
      "copy": "President's Circle funding made our 2-year investigation into auto insurance pricing possible."
    },
    "recurring_ask": {
      "enabled": true,
      "prompt": "Sustain your impact monthly"
    }
  },
  "frequency_cap": {
    "max_exposures": 3,
    "exposure_window_days": 14
  }
}
```

-----

## Users

Four user profiles that exercise different system behaviors.

### User 1: Anonymous Visitor

Unknown user. No history, no interests, no cohort. The system has nothing to personalize with.

```json
{
  "id": "anonymous",
  "name": "Anonymous Visitor",
  "is_known": false,
  "avg_donation": null,
  "interests": [],
  "cohorts": [],
  "lifecycle": "new",
  "exposure_history": {}
}
```

### User 2: Car Enthusiast

Known user, moderate donor, strong auto interest. Should trigger the cars campaign on car-related content.

```json
{
  "id": "car_enthusiast",
  "name": "Alex M.",
  "is_known": true,
  "avg_donation": 75,
  "interests": ["autos", "baby_products"],
  "cohorts": [],
  "lifecycle": "active",
  "exposure_history": {
    "cars_2026": { "count": 0, "last_seen": null }
  }
}
```

### User 3: Leadership Circle Member

High-value known donor. Member of the Leadership Circle cohort. Should trigger the upgrade campaign almost everywhere.

```json
{
  "id": "leadership_member",
  "name": "Patricia W.",
  "is_known": true,
  "avg_donation": 500,
  "interests": ["autos", "health"],
  "cohorts": ["leadership_circle"],
  "lifecycle": "recurring_donor",
  "exposure_history": {
    "leadership_upgrade": { "count": 1, "last_seen": "2026-04-10" }
  }
}
```

### User 4: Lapsed Donor

Previously donated but hasn’t in over a year. Known interests but no cohort. Should trigger lifecycle-based personalization (urgency language, “we miss you”).

```json
{
  "id": "lapsed_donor",
  "name": "James R.",
  "is_known": true,
  "avg_donation": 50,
  "interests": ["baby_products"],
  "cohorts": [],
  "lifecycle": "lapsed",
  "exposure_history": {}
}
```

-----

## Content Contexts

Simulated page contexts that affect campaign scoring.

```json
[
  {
    "id": "cars_article",
    "label": "Article: Best Reliable Used Cars for 2026",
    "topic_tags": ["autos"],
    "page_type": "article"
  },
  {
    "id": "baby_article",
    "label": "Article: Safest Strollers and Car Seats",
    "topic_tags": ["baby_products"],
    "page_type": "article"
  },
  {
    "id": "homepage",
    "label": "CR Homepage",
    "topic_tags": [],
    "page_type": "homepage"
  },
  {
    "id": "petition",
    "label": "Petition: Right to Repair",
    "topic_tags": ["advocacy"],
    "page_type": "petition"
  },
  {
    "id": "washing_machines_article",
    "label": "Article: Best Washing Machines",
    "topic_tags": ["appliances"],
    "page_type": "article"
  }
]
```

-----

## Surfaces

```json
[
  {
    "id": "full_page",
    "label": "Full Checkout Page",
    "layout": "full",
    "description": "Dedicated donation page. All modules visible. Inline payment form."
  },
  {
    "id": "sidebar",
    "label": "Article Sidebar",
    "layout": "compact",
    "description": "Compact widget in article/petition sidebar. Headline only, top 3 amounts, CTA links to full page."
  },
  {
    "id": "modal",
    "label": "Modal / Overlay",
    "layout": "medium",
    "description": "Overlay dialog. Headline + short body. Full amounts. CTA links out or submits inline."
  }
]
```

-----

## Entry Sources

```json
[
  {
    "id": "organic",
    "label": "Organic / Direct",
    "campaign_id": null
  },
  {
    "id": "email_eoy",
    "label": "Email: End of Year Campaign",
    "campaign_id": "eoy_2026"
  },
  {
    "id": "email_leadership",
    "label": "Email: Leadership Circle Upgrade",
    "campaign_id": "leadership_upgrade"
  },
  {
    "id": "email_cars",
    "label": "Email: Cars Campaign",
    "campaign_id": "cars_2026"
  },
  {
    "id": "paid_social",
    "label": "Paid Social Ad",
    "campaign_id": null
  }
]
```
