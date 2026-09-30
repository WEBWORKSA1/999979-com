# 999979.com — Forever Gold · 9999 Pure Gold + Au (Element 79)

A static, free-GitHub-Pages website. It offers live 9999 gold prices in 12 currencies and every unit, a gold value calculator, a purity and hallmark decoder (足金 / 千足金 / 9999 / 750 / 916), Chinese gold culture guides, a lucky-number analyzer, a zodiac gold finder, a daily fortune share-card, a gold calendar, and a high-converting **"Get the best offer for your gold"** lead engine. It earns through lead generation, AdSense, YouTube, affiliates, sponsorships, contests and donations.

- **Research, idea and business case:** [`docs/RESEARCH.md`](docs/RESEARCH.md), including a 36-site competitor audit.
- **Phase-wise build prompt:** [`docs/BUILD-PROMPT.md`](docs/BUILD-PROMPT.md)
- **Pages (29):**
  - Home
  - Tools and reference: Live Gold Price, Calculator, Purity Decoder, Market Dashboard, Invest Guide, 999979 Meaning, Chinese Gold Culture, Lucky Numbers, Zodiac Gold, Daily Fortune, Gold Calendar
  - Lead gen: Get Offers
  - Media: Videos, Blog (+4 posts)
  - Community: Contests, Support/Donate, Careers, Advertise/Partner, Contact, About
  - Legal: Privacy, Terms, Disclaimer & Trademark/Copyright Disclosure, 404

## Edit & rebuild
Run `python3 extract_src.py` first. It regenerates the editable `src/*.html` page bodies from the built pages. Page bodies then live in `src/*.html`. The shared layout (head/SEO, top interest banner, ticker, nav, footer) lives in `build.py`.
```bash
python3 build.py   # regenerates root *.html, sitemap.xml, robots.txt
```
Commit the generated files. GitHub Pages serves the repo root; `.nojekyll` is included.

## Go-live checklist (`assets/js/config.js` — no rebuild needed)
1. **Forms.** Every form posts through FormSubmit to the single owner inbox. The inbox is stored XOR-encoded and never appears in HTML or text. **Submit any form once**, then click *Activate* in the FormSubmit email. Optionally, paste the random alias FormSubmit gives you into `formAlias`.
2. **AdSense.** After approval, set `adsense.enabled: true`, `client` and the `slots`, and add your line to `ads.txt`. Ads load only after cookie consent. Until then, the slots show "Sponsor this spot" house ads.
3. **Donations.** Paste your Ko-fi, Buy Me a Coffee, PayPal, Stripe Payment Link or Patreon URLs. Empty buttons fall back to the pledge form.
4. **YouTube.** Set `social.youtube` and `youtube.featured` (video IDs).
5. **Donation goal.** Update `goal.raised`.

## Publish on GitHub Pages (free)
Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
Live URL: `https://webworksa1.github.io/999979-com/`

### Custom domain (999979.com)
1. At your registrar, add A records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, and a CNAME record `www` → `webworksa1.github.io`.
2. Add a `CNAME` file containing `999979.com`, then set `BASE = "https://999979.com/"` in `build.py` and rebuild.
3. In Settings → Pages, enter the domain and tick *Enforce HTTPS*.

## Legal
Original content and code © 999979.com. "999979" is used as a descriptive domain name in its generic numeric, scientific and cultural sense, and no trademark is claimed. See `disclaimer.html`.
Interested in this website, domain, sponsorship, advertising or partnership? → https://web.works/contact
