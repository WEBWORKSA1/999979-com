#!/usr/bin/env python3
"""999979.com static builder.
Wraps every src/<page>.html body in the shared layout and writes /<page>.html + sitemap.xml.
Usage:  python3 build.py
Change BASE to "https://999979.com/" once the custom domain (CNAME) is live.
"""
import datetime, json, os, html

BASE = "https://webworksa1.github.io/999979-com/"
SITE = "999979.com"
TODAY = datetime.date.today().isoformat()
INTEREST = "https://web.works/contact"
ROOT = os.path.dirname(os.path.abspath(__file__))

# slug, title, description, section (breadcrumb), priority
PAGES = [
    ("index", "999979 · Forever Gold — Live 9999 Gold Price, Purity Decoder & Best Offers", "Live 9999 gold prices in every currency and unit, a hallmark and purity decoder, gold value calculators, Chinese gold culture and competing offers for your gold.", "", "1.0"),
    ("meaning", "What Does 999979 Mean? 9999 Pure Gold + Element 79", "999979 decoded: 9999 = four-nines pure gold and 久久久久 'forever', 79 = gold's atomic number (Au). Plus: why 999979 is a prime number.", "Culture", "0.9"),
    ("gold-price", "Gold Price Today per Gram, Tael, Tola & Ounce — 12 Currencies", "Live gold price per gram, tael (两), tola, troy ounce and kilogram for 9999, 999, 990, 22K, 18K and 14K in USD, CNY, HKD, INR, CAD and more.", "Gold", "0.95"),
    ("calculator", "Gold Value Calculator — What Is My Gold Worth?", "Calculate the melt value of any gold by weight and purity, compare typical buyer offers and see how much you could lose by selling in the wrong place.", "Gold", "0.95"),
    ("purity", "Gold Purity & Hallmark Decoder — 足金, 千足金, 9999, 750, 916, 18K", "Decode any gold stamp: 足金999, 千足金, Au750, 916, 18K, GP/GF. Understand China's GB 11887 purity grades and international hallmarks.", "Gold", "0.9"),
    ("get-offers", "Get the Best Offer for Your Gold — Free, 60 Seconds", "Selling gold, buying bullion, opening a gold IRA, taking a gold loan or ordering wedding gold? Tell us once and get matched with competing offers.", "Offers", "1.0"),
    ("market", "China & World Gold Market Dashboard 2026", "Key gold market numbers: China's 1,003-tonne 2025 demand, bar & coin boom, ETF surge, PBoC buying streak and record 2026 prices.", "Gold", "0.8"),
    ("invest", "How to Invest in Gold — Bars, Coins, ETFs, Accounts & IRAs", "A plain-English guide to owning gold: physical bars and coins, gold beans, ETFs, bank gold accounts, gold IRAs, storage, premiums and risks.", "Gold", "0.8"),
    ("chinese-gold-culture", "Gold in Chinese Culture — Weddings, 三金五金, Gold Beans & Zodiac Gold", "Why Chinese families give gold: wedding 三金/五金 sets, dragon-phoenix bangles, newborn longevity locks, gold beans, Caishen Day and more.", "Culture", "0.85"),
    ("lucky-numbers", "Chinese Lucky Number Analyzer — Score Any Phone, Plate or Price", "Score any number for Chinese luck: digit homophones, lucky combinations like 88, 168, 518, 9999, cautions like 14 and 74, and prime checks.", "Culture", "0.85"),
    ("zodiac-gold", "Chinese Zodiac Gold Gift Finder — Lucky Numbers & Colours", "Find your Chinese zodiac animal and element, lucky numbers and colours, and the ideal gold gift for every sign.", "Culture", "0.8"),
    ("fortune", "Daily Gold Fortune — Lucky Number & Shareable Card", "Your free daily gold fortune by zodiac: lucky number, colour, wealth direction and a gold tip — download a shareable card.", "Culture", "0.7"),
    ("gold-calendar", "Auspicious Gold-Buying Calendar 2026–2027", "The luckiest dates to buy gold by number symbolism and festivals: Caishen Day, 9/9, Qixi, Double Ninth, Singles' Day and more.", "Culture", "0.75"),
    ("videos", "Gold Videos — Prices, Purity, Culture & How-To", "Watch short videos on gold prices, purity marks, testing gold at home, Chinese wedding gold and central-bank buying.", "Media", "0.6"),
    ("blog", "Forever Gold Blog — Gold Guides & Chinese Culture", "Guides on gold prices, purity, investing and Chinese gold culture from 999979.com.", "Blog", "0.8"),
    ("blog-999979-meaning", "999979 Meaning: Forever Gold in Six Digits", "A deep dive into 999979 — four nines, element 79, 久久久久, 起久 and a prime number.", "Blog", "0.7"),
    ("blog-why-china-buys-gold", "Why China Keeps Buying Gold (2026 Update)", "China's households, investors and central bank are all buying gold. The numbers and the reasons behind the 2025–2026 gold rush.", "Blog", "0.7"),
    ("blog-zujin-vs-qianzujin-vs-9999", "足金 vs 千足金 vs 9999 Gold — What's the Difference?", "The difference between 足金 (990), 千足金 (999) and 9999 'four-nines' gold, and what to check before you buy or sell.", "Blog", "0.7"),
    ("blog-chinese-wedding-gold", "Chinese Wedding Gold Guide — 三金, 五金 & Dragon-Phoenix Bangles", "What gold a Chinese wedding needs, typical weights, budgeting at 2026 prices and how to buy smart.", "Blog", "0.7"),
    ("contests", "Contests & Prizes — Golden Guess & Family Gold Stories", "Enter free contests: predict the month-end gold price, share your family gold story, and win prizes. Sponsors welcome.", "Community", "0.7"),
    ("support", "Support 999979.com — Donate & Become a Gold Patron", "Keep free gold tools running. Support operations, promotion, hiring talent, contests and prizes.", "Community", "0.6"),
    ("careers", "Careers — Join the 999979.com Team", "Open roles for gold-market writers, video editors, SEO, partnerships and translators. Remote and freelance.", "Community", "0.5"),
    ("advertise", "Advertise, Sponsor or Partner with 999979.com", "Reach gold buyers, sellers and investors. Sponsorship packages, display ads, newsletter placements and lead partnerships.", "Community", "0.7"),
    ("contact", "Contact 999979.com", "Questions, partnerships, press or feedback — send us a message.", "", "0.5"),
    ("about", "About 999979.com — Forever Gold", "Who we are, our editorial standards and how 999979.com makes money.", "", "0.4"),
    ("privacy", "Privacy Policy", "How 999979.com collects, uses and protects information, including cookies, advertising and form submissions.", "Legal", "0.3"),
    ("terms", "Terms of Use", "Terms governing the use of 999979.com.", "Legal", "0.3"),
    ("disclaimer", "Disclaimer, Trademark & Copyright Disclosure", "Financial disclaimer, affiliate disclosure and trademark & copyright notice for 999979.com.", "Legal", "0.3"),
    ("404", "Page Not Found", "This page could not be found.", "", None),
]

NAV = """
<nav class="nav" id="nav" aria-label="Main">
  <div class="has-menu"><button class="dd" aria-haspopup="true">Gold ▾</button>
    <div class="menu">
      <a href="gold-price.html">💹 Live Gold Price</a><a href="calculator.html">🧮 Gold Value Calculator</a><a href="purity.html">🔍 Purity &amp; Hallmark Decoder</a><a href="market.html">📊 Market Dashboard</a><a href="invest.html">🏦 How to Invest</a>
    </div></div>
  <div class="has-menu"><button class="dd" aria-haspopup="true">Culture ▾</button>
    <div class="menu">
      <a href="meaning.html">✨ What 999979 Means</a><a href="chinese-gold-culture.html">🧧 Chinese Gold Culture</a><a href="lucky-numbers.html">🔢 Lucky Number Analyzer</a><a href="zodiac-gold.html">🐉 Zodiac Gold</a><a href="fortune.html">🥠 Daily Gold Fortune</a><a href="gold-calendar.html">📅 Gold Calendar</a>
    </div></div>
  <a href="blog.html">Blog</a>
  <a href="videos.html">Videos</a>
  <div class="has-menu"><button class="dd" aria-haspopup="true">Community ▾</button>
    <div class="menu">
      <a href="contests.html">🏆 Contests &amp; Prizes</a><a href="support.html">❤️ Support / Donate</a><a href="careers.html">💼 Careers</a><a href="advertise.html">📣 Advertise &amp; Sponsor</a><a href="contact.html">✉️ Contact</a>
    </div></div>
  <a class="btn btn-gold btn-sm" href="get-offers.html" style="margin-left:6px">Get Best Offer</a>
</nav>"""

FOOTER = """
<div class="container"><div class="ad-slot" data-ad="bottom"></div></div>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html" style="color:#F4EBDD"><img src="assets/img/logo.svg" alt="" width="40" height="40"><span><b>999979</b><small style="color:#A8998A">Forever Gold</small></span></a>
        <p style="margin-top:12px">9999 pure gold + Au, element 79. Free gold tools, honest guides and competing offers — forever.</p>
        <p class="small"><a href="__INTEREST__" target="_blank" rel="noopener">Interested in this website or domain? →</a></p>
      </div>
      <div><h4>Gold tools</h4><ul><li><a href="gold-price.html">Live gold price</a></li><li><a href="calculator.html">Value calculator</a></li><li><a href="purity.html">Purity decoder</a></li><li><a href="market.html">Market dashboard</a></li><li><a href="invest.html">Invest in gold</a></li></ul></div>
      <div><h4>Culture</h4><ul><li><a href="meaning.html">999979 meaning</a></li><li><a href="chinese-gold-culture.html">Chinese gold culture</a></li><li><a href="lucky-numbers.html">Lucky numbers</a></li><li><a href="zodiac-gold.html">Zodiac gold</a></li><li><a href="fortune.html">Gold fortune</a></li><li><a href="gold-calendar.html">Gold calendar</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="get-offers.html">Get offers</a></li><li><a href="advertise.html">Advertise</a></li><li><a href="support.html">Support us</a></li><li><a href="contests.html">Contests</a></li><li><a href="careers.html">Careers</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div>
        <h4>Daily gold + lucky number</h4>
        <p class="small">One short email: today's 9999 price in your currency and a lucky number. Free, unsubscribe anytime.</p>
        <form class="form" data-form="Newsletter signup" data-ok="You're subscribed — welcome to Forever Gold!">
          <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="sr" for="nl-email" style="position:absolute;left:-9999px">Email</label>
          <input id="nl-email" type="email" name="email" required placeholder="you@example.com" autocomplete="email">
          <select name="currency" aria-label="Currency"><option>USD</option><option>CNY</option><option>HKD</option><option>INR</option><option>CAD</option><option>SGD</option><option>MYR</option><option>GBP</option><option>EUR</option><option>AUD</option></select>
          <button class="btn btn-gold" type="submit">Subscribe free</button>
          <div class="form-msg" role="status" aria-live="polite"></div>
        </form>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span data-year></span> 999979.com · Original content &amp; code. All rights reserved.</span>
      <span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="disclaimer.html">Disclaimer &amp; Trademark</a> · <a href="sitemap.xml">Sitemap</a></span>
    </div>
    <p class="small" style="color:#8C7D6E;margin-top:12px">Educational content only — not financial, investment or tax advice. Prices may be delayed. "999979" is used as a descriptive domain name in its generic numeric and cultural sense; no trademark claim is made. Third-party names belong to their owners.</p>
  </div>
</footer>
<div class="sticky-cta"><a class="btn btn-gold" href="get-offers.html">💰 Get my best gold offer</a></div>
<div class="cookie" role="dialog" aria-label="Cookie consent">
  <div><b>Cookies &amp; ads.</b> We use essential storage and, with your consent, advertising cookies (Google AdSense) to keep this site free. <a href="privacy.html">Privacy</a></div>
  <div class="btns"><button class="btn btn-gold btn-sm" data-consent="yes">Accept</button><button class="btn btn-ghost btn-sm" data-consent="no">Essential only</button></div>
</div>
<script src="assets/js/config.js"></script>
<script src="assets/js/app.js" defer></script>
"""

def layout(slug, title, desc, section, body):
    url = BASE + ("" if slug == "index" else slug + ".html")
    ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": SITE, "alternateName": "Forever Gold", "url": BASE},
          {"@context": "https://schema.org", "@type": "Organization", "name": SITE, "url": BASE, "logo": BASE + "assets/img/logo.svg"}]
    if slug != "index":
        items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": BASE}]
        if section:
            items.append({"@type": "ListItem", "position": 2, "name": section})
        items.append({"@type": "ListItem", "position": len(items) + 1, "name": title.split(" — ")[0], "item": url})
        ld.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items})
    robots = "noindex" if slug == "404" else "index,follow,max-image-preview:large"
    t = html.escape(title, quote=True); d = html.escape(desc, quote=True)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{d}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#B3121F">
<meta property="og:type" content="website"><meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{t}"><meta property="og:description" content="{d}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}assets/img/og.svg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{d}"><meta name="twitter:image" content="{BASE}assets/img/og.svg">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="assets/img/logo.svg"><link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@600;700&family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="interest" role="note">Contact, if you are interested in this <a href="{INTEREST}" target="_blank" rel="noopener">website / domain name / Sponsorship / Advertisement / Partnership →</a></div>
<div class="ticker" aria-label="Gold price ticker"><div class="row" data-ticker><span>Loading live gold prices…</span></div></div>
<header class="site-header"><div class="container bar">
  <a class="brand" href="index.html" aria-label="999979 Forever Gold home"><img src="assets/img/logo.svg" alt="" width="40" height="40"><span><b>999979</b><small>Forever Gold · 久久久久</small></span></a>
  {NAV}
  <div class="hdr-actions"><button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">◐</button><button class="icon-btn burger" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button></div>
</div></header>
<main id="main">
{body}
</main>
{FOOTER.replace("__INTEREST__", INTEREST)}
</body>
</html>
"""

def main():
    urls = []
    for slug, title, desc, section, prio in PAGES:
        src = os.path.join(ROOT, "src", slug + ".html")
        with open(src, encoding="utf-8") as fh:
            body = fh.read().replace("{{UPDATED}}", TODAY)
        with open(os.path.join(ROOT, slug + ".html"), "w", encoding="utf-8") as fh:
            fh.write(layout(slug, title, desc, section, body))
        if prio:
            urls.append((BASE + ("" if slug == "index" else slug + ".html"), prio))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><priority>{p}</priority></url>" for u, p in urls]
    sm.append("</urlset>")
    with open(os.path.join(ROOT, "sitemap.xml"), "w") as fh:
        fh.write("\n".join(sm) + "\n")
    with open(os.path.join(ROOT, "robots.txt"), "w") as fh:
        fh.write(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
    print(f"Built {len(PAGES)} pages")

if __name__ == "__main__":
    main()
