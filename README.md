# Albion Place Hotel — Mobile-First Redesign Proposal

[![CI](https://github.com/DKon109/Albion-Website/actions/workflows/ci.yml/badge.svg)](https://github.com/DKon109/Albion-Website/actions/workflows/ci.yml)

> **Status:** Independent redesign prototype — **not the official website**.
> The proposal is currently being reviewed with the venue and the external agency
> that maintains the production site.

- **Live prototype:** https://cheery-raindrop-388ad0.netlify.app/
- **Official production site:** https://albionplacehotel.com.au/

---

## Why this exists

The venue's production site works well on desktop, but has several usability
problems on mobile — most critically, the food and lunch menus open as wide
landscape PDFs that are effectively unreadable on a phone. I rebuilt the site
as a working prototype to make each proposed fix concrete, and I'm using it
(together with a narrated before/after walkthrough video) to discuss the
changes with the venue's web vendor.

## The proposal

### 1. Improvements to the current site

| # | Problem on the production site | Fix implemented in this prototype |
|---|---|---|
| 1 | Boxes and buttons rendered at inconsistent sizes | Consistent layout system and button sizing |
| 2 | A redundant "Book a table" button inside the EAT section | Removed — EAT now holds only Food Menu / Lunch Specials |
| 3 | **(Critical)** Food & lunch menus open as wide PDFs — tiny and zoomed on mobile | Device-aware menu routing: desktop keeps the PDF, mobile gets a fitted, pinch-zoomable viewer ([menu-view.html](menu-view.html)) |
| 4 | "What's On" promo banners are static | Auto-scrolling carousel — 3-up on desktop, 2-up on mobile, pauses on hover (desktop only) |
| 5 | **(Critical)** The third-party booking page overflows and gets cut off on mobile | Flagged to the vendor with a mobile-friendly booking concept |
| 6 | Oversized "Make a booking" / "Virtual tours" buttons push content down | Both moved into a compact sticky header, plus one clear booking button at the page bottom |
| 7 | Virtual Tour is buried far down the page | Added to the header navigation |

### 2. New additions

| # | Addition | Implementation |
|---|---|---|
| 8 | Live Instagram feed on the homepage | Official `instagram.com/<account>/embed/` endpoint — always current, no API key or token maintenance |
| 9 | Location button with directions | Opens Google Maps directions to 531 George St in one tap |

### 3. Planned (pending assets from the venue)

| # | Item | Blocked on |
|---|---|---|
| 10 | Beer & wine menus alongside the cocktail list | Menu PDFs from the venue |
| 11 | Seasonal "Winter Bar" promo banner in the carousel | Artwork from the venue |

## Technical notes

- **Stack:** vanilla HTML / CSS / JS — no build step, deployable on any static host.
- **Mobile-first CSS** with breakpoints at 820 / 960 / 1080 px; design tokens
  matched to the production brand (`#c9ae66` gold, `#231f20` ink, `#f9f7ef` cream,
  Barlow Condensed + Space Mono).
- **Menu routing** ([scripts.js](scripts.js)): links keep their PDF `href` for
  desktop; below 820 px a click is rerouted to `menu-view.html?menu=food|lunch|cocktails`,
  which fits the menu image to the viewport and returns the user to the section
  they came from on close.
- **SEO:** meta description, Open Graph / Twitter cards, `BarOrPub` JSON-LD
  structured data (address, hours, geo), `sitemap.xml`, `robots.txt`. Canonical
  URLs intentionally point at the official domain so this prototype never
  competes with the production site in search.

## Running locally

```bash
python3 -m http.server 5174
# open http://localhost:5174/
```

## Project structure

```
index.html        Single-page site (hero, EAT, DRINK, What's On, Functions, Instagram, Contact)
menu-view.html    Mobile menu viewer (?menu=food|lunch|cocktails)
scripts.js        Smooth scrolling, device-aware menu routing, carousel autoplay
styles.css        Design tokens + responsive layout
assets/           Images and menu PDFs
sitemap.xml
robots.txt
```

## Disclaimer

This repository is an **independent redesign proposal** created to demonstrate
and discuss concrete improvements with Albion Place Hotel and its web vendor.
It is not the official website. All brand assets (logo, menus, photography)
belong to Albion Place Hotel and are used here solely in the context of that
proposal.
