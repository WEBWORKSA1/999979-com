/* 999979.com — site configuration. Edit this file only; no rebuild needed. */
window.SITE_CONFIG = {
  siteName: "999979.com",
  siteUrl: "https://999979.com",
  interestUrl: "https://web.works/contact",

  /* Single inbox — stored encoded (never written in plain text anywhere on the site). Do not edit unless changing inbox. */
  _m: [34, 32, 44, 97, 35, 38, 46, 34, 40, 15, 126, 46, 60, 36, 61, 32, 56, 45, 42, 56],
  _k: 79,
  /* Optional: after activating FormSubmit, paste the random alias it emails you (hides inbox from network requests too). */
  formAlias: "",

  /* Google AdSense — set enabled:true after approval. Ads only load after cookie consent. */
  adsense: {
    enabled: false,
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    slots: { top: "", mid: "", side: "", bottom: "" }
  },

  /* Donations — paste your links. Empty = falls back to the pledge form. */
  donate: {
    kofi: "",
    buymeacoffee: "",
    paypal: "",
    stripe: "",
    githubSponsors: "https://github.com/sponsors/webworksa1",
    patreon: ""
  },

  /* YouTube — channel + featured video IDs (11-char IDs). */
  youtube: {
    channelUrl: "https://www.youtube.com/results?search_query=9999+gold+price",
    featured: [
      /* { id: "XXXXXXXXXXX", title: "Gold price today explained" } */
    ]
  },

  /* Affiliates */
  affiliate: { amazonTag: "" },

  /* Social */
  social: { youtube: "", x: "", instagram: "", tiktok: "", facebook: "", pinterest: "", wechat: "" },

  /* Fallback reference prices (USD per troy oz) if live feeds fail. */
  fallback: { XAU: 4160, XAG: 61, date: "2026-09-29" },

  /* Donation goal (display) */
  goal: { target: 9999, raised: 0, currency: "USD" }
};
