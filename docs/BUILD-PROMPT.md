# 999979.com — Phase-wise Build Prompt

Run each phase as its own prompt, in order. Each phase ends with a **Definition of Done (DoD)**. Do not start the next phase until the current DoD passes.

---

## PHASE 0 — Context block (paste at the top of every phase)

> You are building **999979.com — "Forever Gold"**, a static, GitHub-Pages-free-plan website.
>
> **Concept.** 9999 means four-nines pure gold (Au 99.99). It also reads 久久久久, "forever". 79 is gold's atomic number (Au). 999979 is a prime number. The site is the friendliest 9999-gold hub: live prices, purity and hallmark decoding, calculators, Chinese gold culture, lucky numbers, and a high-converting "Get the best offer for your gold" lead engine.
>
> **Hard rules**
> 1. Pure HTML, CSS and vanilla JS. No server and no build step on the host. Must run on GitHub Pages (free).
> 2. **Top banner on every page:** "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linking to `https://web.works/contact`.
> 3. **One inbox only.** Every form and email link goes to the owner's single address. That address must **never** appear in HTML, visible text, `mailto:` hrefs in markup, sitemap, README or meta. Store it obfuscated in JS (XOR-encoded char codes). Decode it at runtime only for (a) the FormSubmit AJAX endpoint and (b) "Email us" links that build a `mailto:` on click.
> 4. No use of "999979" as a claimed trademark. Include a Trademark and Copyright Disclosure page, plus a financial disclaimer: the site is educational, not investment advice.
> 5. Brand palette: imperial red `#B3121F`, gold `#C9A227` / `#E6C200`, rice-paper cream `#FFF8E7`, ink `#1A1410`, jade `#0E8F6A` for "lucky" badges. Dark "lacquer" mode `#120D0A`.
> 6. Fonts: Playfair Display (display), Inter (body), Noto Serif SC (hanzi).
> 7. Mobile-first, WCAG AA contrast, Lighthouse ≥ 90 on every category.

---

## PHASE 1 — Foundation and design system

**Prompt:** Create the repo skeleton:

- `/assets/css/style.css`: design tokens, light/dark themes, and components (buttons, cards, badges, tables, forms, stepper, toast, modal, ticker, ad slot, cookie bar).
- `/assets/js/config.js`: the single place for AdSense IDs, donation links, YouTube IDs, affiliate tags and the obfuscated inbox.
- `/assets/js/app.js`: nav, theme toggle, forms and all tools.
- `build.py`: wraps `src/*.html` bodies in a shared layout with the head, SEO/OG/JSON-LD, top interest banner, header, mega-nav and footer. It also writes `sitemap.xml`.
- `robots.txt`, `ads.txt`, `manifest.webmanifest`, `.nojekyll`, `404.html`, and an SVG favicon and logo (a gold "9999" ingot with a small "79 Au" tile).

**DoD:** `python3 build.py` produces valid pages. Every page shows the top banner. a text search for the inbox address across all files returns nothing.

---

## PHASE 2 — Core money tools

1. **Live gold price** (`gold-price.html`)
   - Pull XAU and XAG from `api.gold-api.com` and FX from `open.er-api.com`.
   - Show the price per troy oz, gram, kg, tael (Chinese market 50 g, HK 37.429 g) and tola (11.6638 g).
   - Cover karats 24K/22K/21K/18K/14K/10K and purities 9999/999/990/916/750/585/375.
   - Offer a 12-currency selector: USD, CNY, HKD, TWD, SGD, MYR, INR, CAD, GBP, EUR, AUD, AED.
   - If a feed fails, fall back to a dated reference price and label it clearly.
2. **Gold value calculator** (`calculator.html`)
   - Inputs: weight, unit, purity, currency.
   - Outputs: melt value, typical buyer offer band (70–90 %), and the resulting "hidden margin".
   - End with a CTA: "Get competing offers →".
3. **Purity and hallmark decoder** (`purity.html`)
   - Type a stamp (e.g. `足金999`, `Au750`, `916`, `18K`, `9999`). Return the fineness ‰, the karat equivalent, its meaning under Chinese GB 11887 and international norms, and cautions (e.g. "万足金 is not a national jewellery grade").
4. **Number analyzer** (`lucky-numbers.html`)
   - Input any phone number, plate, price or date.
   - Return a digit-by-digit homophone reading, a pair analysis (88, 99, 168, 520, 1314, 14, 74…), a luck score out of 100, and a prime check.

**DoD:** each tool works offline with the fallback price and passes 10 manual test cases.

---

## PHASE 3 — LEAD GENERATION ENGINE (highest priority)

**Prompt:** Build `get-offers.html` as a 4-step, progress-bar form with a trust sidebar and FAQ schema.

- **Step 1, intent:** Sell gold · Buy bullion/coins · Gold IRA/retirement · Gold loan · Wedding/zodiac jewellery · Appraisal.
- **Step 2, item details:** type, approximate weight + unit, purity/stamp, and "I don't know" helpers.
- **Step 3, location and timeline:** country, city, "When?" (today / this week / this month / researching).
- **Step 4, contact:** name, email, phone, preferred contact (call/WhatsApp/email/WeChat), consent checkbox.

**Requirements**
- Pre-fill from calculator results via URL params (`?weight=50&unit=g&purity=999`).
- Include a honeypot field, send over AJAX to FormSubmit with `_subject`, and show a success screen with a reference ID.
- Place a sticky mobile CTA bar "Get my best offer" on every page, plus inline CTAs after every tool result and at 30 % / 70 % of long articles.
- Add micro-trust signals: "Free · No obligation · 60 seconds · We never sell your data without consent".

**DoD:** the form validates each step, works with the keyboard alone, and submits successfully after one-time FormSubmit activation.

---

## PHASE 4 — Content hub and SEO

- Pages:
  - `meaning.html` (what 999979 means)
  - `chinese-gold-culture.html` (三金五金, dragon-phoenix bangles, 长命锁, gold beans, Caishen Day)
  - `zodiac-gold.html` (birth year → animal, element, lucky numbers, gold gift ideas)
  - `gold-calendar.html` (auspicious buying dates)
  - `market.html` (China and world gold dashboard with inline SVG charts)
  - `invest.html` (bars, coins, ETFs, accounts, IRAs, storage)
- Blog index plus pillar posts: "999979 meaning", "Why China keeps buying gold", "足金 vs 千足金 vs 9999", "Chinese wedding gold guide".
- For every page: unique title and description, canonical link, OG/Twitter tags, JSON-LD (WebSite, Organization, FAQPage, BreadcrumbList), and a "Last updated" line.
- `sitemap.xml` is generated automatically.

**DoD:** every page has unique meta and at least 3 internal links. FAQ JSON-LD validates.

---

## PHASE 5 — Monetization layer

- **AdSense:** `config.adsense.enabled` gates loading until cookie consent. Use responsive `<ins>` slots: after the hero, mid-content, above the footer and in the sidebar. While ads are disabled, each slot shows a **"Sponsor this spot"** house ad that links to `advertise.html`.
- **YouTube:** `videos.html` uses a lite-embed (a thumbnail, with the iframe loaded on click via youtube-nocookie) driven by `config.youtube.featured`, plus a channel subscribe CTA.
- **Affiliates:** product cards (bullion, test kits, scales, storage, jewellery) with `rel="sponsored nofollow"` and an affiliate disclosure.
- **Advertise:** `advertise.html` with Bronze, Silver, Gold and Title-sponsor packages, audience stats placeholders and an inquiry form.

---

## PHASE 6 — Community, donations, contests, hiring

- **Support** (`support.html`)
  - Tiers: Supporter $9, Patron $29, Gold Patron $99, Custom.
  - Allocation bars: Operations 35 %, Promotion & marketing 20 %, Hiring talent 20 %, Contests & prizes 15 %, Content 10 %.
  - Buttons for Ko-fi / Buy Me a Coffee / PayPal / Stripe / GitHub Sponsors come from config. If a link is empty, the button falls back to a pledge form.
- **Contests** (`contests.html`): "Golden Guess" (predict the gold price on the last trading day of the month, closest wins), "My Family Gold Story" (story/photo), "Referral Gold Bean draw". Include a live countdown, entry form, rules and a sponsor-a-prize form.
- **Careers** (`careers.html`): openings for a gold market writer (EN/中文), short-video editor, SEO lead, partnerships manager, translators, and a freelance developer. Include an application form.
- **Daily Gold Fortune** (`fortune.html`): zodiac plus date gives a seeded lucky number, lucky colour and a "gold mood" score, with a downloadable canvas share card.

---

## PHASE 7 — Trust, legal, performance, launch

- Legal pages: About, Contact, Privacy (cookies, AdSense, FormSubmit), Terms, Disclaimer (financial + **Trademark & Copyright Disclosure**), and 404.
- Performance: no framework, deferred JS, `font-display: swap`, lazy iframes, inline SVG graphics.
- Accessibility: skip link, focus rings, aria-live regions for tool results, `prefers-reduced-motion`.
- **Deploy:** push to `main`. In GitHub Pages, deploy from branch `main` / root. Live at `https://<user>.github.io/999979-com/`. For a custom domain, add a `CNAME` file and the A records 185.199.108–111.153.

**DoD**
- Lighthouse ≥ 90 on all categories.
- No console errors.
- The email string is absent from every file except as an encoded array.
- Every form reaches the inbox.

---

## PHASE 8 — Growth roadmap (post-launch)

1. Programmatic SEO:
   - "Gold price per gram in {city}" for 50 cities.
   - "{karat} gold price in {currency}" pages.
   - "What does {stamp} mean" pages.
2. Chinese (简体/繁體) mirror with hreflang.
3. Email automation: a daily price email through a free-tier ESP.
4. Sell lead inventory to 3–5 buyers per region. Add a partner portal.
5. YouTube Shorts: a daily 20-second "Gold today in ¥ ₹ C$ + lucky number".
6. Add a Gold/Silver ratio page, a Silver 999 hub and a Platinum hub.
