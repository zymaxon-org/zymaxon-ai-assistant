

# Vivesa Escrow Demo Page

## Overview
Create a dedicated `/vivesa-demo` page showcasing how the Vivesa Paystack escrow system works, with three main sections: an interactive step-by-step demo, an animated transaction flow visualization, and a downloadable whitepaper PDF.

## Route
Add `/vivesa-demo` route in `App.tsx`

## Page Structure

```text
┌─────────────────────────────────────────┐
│  Header (back to home + Zymaxon logo)   │
├─────────────────────────────────────────┤
│  HERO SECTION                           │
│  "Vivesa Escrow System"                 │
│  Subtitle + Download Whitepaper CTA     │
├─────────────────────────────────────────┤
│  ANIMATED FLOW SECTION                  │
│  Visual diagram showing:                │
│  Buyer → DVA Payment → Hold →           │
│  Delivery Confirm → Release to Seller   │
│  (Auto-animating with step highlights)  │
├─────────────────────────────────────────┤
│  INTERACTIVE DEMO SECTION               │
│  Mock transaction simulator:            │
│  - Select product type (Marketplace/    │
│    Services/Properties)                 │
│  - Step through escrow states           │
│  - See fund flow at each stage          │
│  - Commission split visualization       │
├─────────────────────────────────────────┤
│  FEATURES GRID                          │
│  6 cards: DVA, Auto-release, Disputes,  │
│  Milestones, Splits, Refunds            │
├─────────────────────────────────────────┤
│  DOWNLOAD SECTION                       │
│  Whitepaper PDF (generated client-side  │
│  with jspdf) + Pitch Deck link          │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

## Files to Create

1. **`src/pages/VivesaDemo.tsx`** — Main page component with all sections
2. **`src/components/vivesa-demo/DemoHero.tsx`** — Hero with gradient background and CTAs
3. **`src/components/vivesa-demo/EscrowFlowAnimation.tsx`** — Animated SVG/CSS diagram showing the 5-step escrow flow (Buyer pays → DVA holds → Delivery confirmed → Funds released → Commission split). Uses CSS animations with `useInView` for trigger
4. **`src/components/vivesa-demo/InteractiveDemo.tsx`** — Tabbed interface (Marketplace / Services / Properties) with a step-by-step state machine. Each tab shows a mock transaction progressing through states: Created → Funded → In Progress → Delivered → Released. Includes mock amounts, commission breakdowns, and timer displays
5. **`src/components/vivesa-demo/FeaturesGrid.tsx`** — 6 feature cards with icons (Shield, Clock, AlertTriangle, Milestone, Split, RefreshCw) describing escrow capabilities
6. **`src/components/vivesa-demo/DownloadSection.tsx`** — Download whitepaper button (generates PDF via jspdf with escrow architecture summary) + link to existing pitch deck

## Files to Modify

1. **`src/App.tsx`** — Add `/vivesa-demo` route
2. **`src/components/sections/Products.tsx`** or **`src/components/sections/Hero.tsx`** — Add a link/button to the demo page from the homepage

## Technical Details

- **Interactive Demo state machine**: React `useState` cycling through escrow states with mock data (product name, price, buyer/seller names, timestamps)
- **Flow animation**: CSS keyframe animations on connected nodes, triggered by `useInView` hook (already exists in project)
- **PDF generation**: Reuse existing `jspdf` dependency to generate a 4-page whitepaper covering: escrow overview, transaction flow, commission structure, and security features
- **Styling**: Dark theme consistent with pitch deck (`#0D0D2B` background), using existing design tokens and Tailwind classes
- **Navigation**: Back button to homepage, link from homepage Products section

