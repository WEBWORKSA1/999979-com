/* 999979.com — Forever Gold · app.js (vanilla, no dependencies) */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var OZ = 31.1034768;

  /* ---------- Inbox (decoded at runtime only) ---------- */
  function inbox() { return (C._m || []).slice().reverse().map(function (c) { return String.fromCharCode(c ^ C._k); }).join(""); }
  function endpoint() { return "https://formsubmit.co/ajax/" + (C.formAlias || inbox()); }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- Theme + nav ---------- */
  function initChrome() {
    var saved = store.get("theme"); if (saved) document.documentElement.setAttribute("data-theme", saved);
    var tb = $("[data-theme-toggle]");
    if (tb) tb.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!cur) cur = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var nx = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nx); store.set("theme", nx);
    });
    var bg = $(".burger"), nav = $(".nav");
    if (bg && nav) bg.addEventListener("click", function () { var o = nav.classList.toggle("open"); bg.setAttribute("aria-expanded", o); });
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav a").forEach(function (a) { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });
    $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
    /* Hidden-address mail links */
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-mail]"); if (!a) return;
      e.preventDefault();
      var subj = a.getAttribute("data-mail") || "Inquiry from 999979.com";
      window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(subj);
    });
  }

  /* ---------- Forms (FormSubmit AJAX) ---------- */
  function initForms() {
    $$("form[data-form]").forEach(function (f) {
      f.setAttribute("novalidate", "");
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        if (f.hasAttribute("data-stepper") && !stepValid(f, $$(".step", f).length - 1)) return;
        if (!f.checkValidity()) { f.reportValidity(); return; }
        var hp = f.querySelector("[name=_honey]"); if (hp && hp.value) return;
        var msg = f.querySelector(".form-msg"), btn = f.querySelector("[type=submit]");
        var data = {}; new FormData(f).forEach(function (v, k) { if (k === "_honey") return; data[k] = data[k] ? data[k] + ", " + v : v; });
        var ref = "G" + Date.now().toString(36).toUpperCase().slice(-6);
        data._subject = "[999979.com] " + (f.getAttribute("data-form") || "Form") + " · " + ref;
        data._template = "table"; data._captcha = "false"; data.reference = ref; data.page = location.href;
        if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
        fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            if (!res.ok || res.j.success === "false" || res.j.success === false) throw new Error(res.j.message || "Send failed");
            var ok = f.getAttribute("data-ok") || "Thank you! We received your submission.";
            if (msg) { msg.className = "form-msg ok"; msg.textContent = ok + " Reference: " + ref; }
            f.reset(); if (f.hasAttribute("data-stepper")) goStep(f, 0);
            toast("Sent ✓  Ref " + ref);
          })
          .catch(function () {
            if (msg) { msg.className = "form-msg err"; msg.innerHTML = "Sorry, that didn't go through. Please try again in a minute, or <a href='#' data-mail='999979.com inquiry " + ref + "'>email us</a>."; }
          })
          .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
      });
    });
  }

  /* ---------- Multi-step lead form ---------- */
  function stepValid(f, i) {
    var st = $$(".step", f)[i]; if (!st) return true;
    var ok = true;
    $$("input,select,textarea", st).forEach(function (el) { if (ok && !el.checkValidity()) { el.reportValidity(); ok = false; } });
    var req = $$("[data-req-group]", st);
    req.forEach(function (g) { if (ok && !$("input:checked", g)) { toast("Please choose an option"); ok = false; } });
    return ok;
  }
  function goStep(f, i) {
    var steps = $$(".step", f); steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    $$(".steps i", f).forEach(function (b, k) { b.classList.toggle("on", k <= i); });
    f._i = i; var lab = $("[data-step-label]", f); if (lab) lab.textContent = "Step " + (i + 1) + " of " + steps.length;
  }
  function initStepper() {
    $$("form[data-stepper]").forEach(function (f) {
      goStep(f, 0);
      f.addEventListener("click", function (e) {
        if (e.target.matches("[data-next]")) { e.preventDefault(); if (stepValid(f, f._i)) { goStep(f, f._i + 1); f.scrollIntoView({ behavior: "smooth", block: "start" }); } }
        if (e.target.matches("[data-prev]")) { e.preventDefault(); goStep(f, Math.max(0, f._i - 1)); }
      });
      /* Prefill from URL */
      var p = new URLSearchParams(location.search);
      p.forEach(function (v, k) {
        var el = f.querySelector("[name='" + k + "']");
        if (!el) return;
        if (el.type === "radio" || el.type === "checkbox") { var r = f.querySelector("[name='" + k + "'][value='" + v + "']"); if (r) r.checked = true; }
        else el.value = v;
      });
    });
  }

  /* ---------- Prices ---------- */
  var PRICES = null;
  function getPrices() {
    if (PRICES) return PRICES;
    var fb = C.fallback || { XAU: 4160, XAG: 61, date: "" };
    var cache = null; try { cache = JSON.parse(sessionStorage.getItem("px") || "null"); } catch (e) {}
    if (cache && Date.now() - cache.t < 5 * 60 * 1000) { PRICES = Promise.resolve(cache); return PRICES; }
    function j(u) { return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }
    PRICES = Promise.all([
      j("https://api.gold-api.com/price/XAU").catch(function () { return null; }),
      j("https://api.gold-api.com/price/XAG").catch(function () { return null; }),
      j("https://open.er-api.com/v6/latest/USD").catch(function () { return null; })
    ]).then(function (r) {
      var o = {
        t: Date.now(),
        xau: r[0] && r[0].price ? r[0].price : fb.XAU,
        xag: r[1] && r[1].price ? r[1].price : fb.XAG,
        live: !!(r[0] && r[0].price),
        at: r[0] && (r[0].updatedAt || r[0].lastUpdated) ? (r[0].updatedAt || r[0].lastUpdated) : fb.date,
        fx: r[2] && r[2].rates ? r[2].rates : { USD: 1, CNY: 7.12, HKD: 7.78, TWD: 30.5, SGD: 1.29, MYR: 4.22, INR: 88.5, CAD: 1.39, GBP: 0.75, EUR: 0.86, AUD: 1.52, AED: 3.6725, JPY: 148 }
      };
      try { sessionStorage.setItem("px", JSON.stringify(o)); } catch (e) {}
      return o;
    });
    return PRICES;
  }
  var CUR = { USD: "$", CNY: "¥", HKD: "HK$", TWD: "NT$", SGD: "S$", MYR: "RM", INR: "₹", CAD: "C$", GBP: "£", EUR: "€", AUD: "A$", AED: "AED ", JPY: "JP¥" };
  function money(v, cur, d) {
    if (d === undefined) d = v >= 1000 ? 0 : 2;
    return (CUR[cur] || cur + " ") + Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  var UNITS = { g: 1, kg: 1000, ozt: OZ, "tael-cn": 50, "tael-hk": 37.429, "tael-tw": 37.5, tola: 11.6638, mace: 3.7429 };
  var UNIT_LABEL = { g: "gram", kg: "kilogram", ozt: "troy ounce", "tael-cn": "tael 两 (CN, 50 g)", "tael-hk": "tael 両 (HK, 37.429 g)", "tael-tw": "tael 台两 (TW, 37.5 g)", tola: "tola (11.6638 g)", mace: "mace 錢 (3.7429 g)" };
  var PURITY = [
    { k: "9999", f: 0.9999, n: "Four-nines · 99.99% · 24K investment bar (万足金 is a trade term)" },
    { k: "999", f: 0.999, n: "千足金 · 99.9% · 24K" },
    { k: "990", f: 0.990, n: "足金 · 99.0% · 24K jewellery" },
    { k: "916", f: 0.916, n: "22K · 91.6%" },
    { k: "875", f: 0.875, n: "21K · 87.5%" },
    { k: "750", f: 0.750, n: "18K · 75.0%" },
    { k: "585", f: 0.585, n: "14K · 58.5%" },
    { k: "417", f: 0.417, n: "10K · 41.7%" },
    { k: "375", f: 0.375, n: "9K · 37.5%" }
  ];

  function initTicker() {
    var tk = $("[data-ticker]"); if (!tk) return;
    getPrices().then(function (p) {
      var g = p.xau / OZ, cny = p.fx.CNY || 7.1;
      tk.innerHTML =
        "<span>Gold <b>" + money(p.xau, "USD", 2) + "</b>/oz</span>" +
        "<span>9999 <b>" + money(g * cny * 0.9999, "CNY", 2) + "</b>/g</span>" +
        "<span>24K <b>" + money(g, "USD", 2) + "</b>/g</span>" +
        "<span>Silver <b>" + money(p.xag, "USD", 2) + "</b>/oz</span>" +
        "<span>Gold/Silver <b>" + (p.xau / p.xag).toFixed(1) + "</b></span>" +
        "<span>" + (p.live ? "● Live" : "Reference " + p.at) + " · <a href='gold-price.html' style='color:#FFE680'>Full prices →</a></span>";
    });
    $$("[data-spot]").forEach(function (el) {
      getPrices().then(function (p) {
        var cur = el.getAttribute("data-cur") || "USD", unit = el.getAttribute("data-unit") || "ozt", pur = parseFloat(el.getAttribute("data-pur") || "1");
        el.textContent = money(p.xau / OZ * UNITS[unit] * pur * (p.fx[cur] || 1), cur, 2);
      });
    });
    $$("[data-spot-time]").forEach(function (el) { getPrices().then(function (p) { el.textContent = p.live ? "Live · " + new Date(p.at).toLocaleString() : "Reference price (" + p.at + ") — live feed unavailable"; }); });
  }

  function initPriceTable() {
    var box = $("[data-price-table]"); if (!box) return;
    var sel = $("[data-price-cur]");
    var saved = store.get("cur"); if (saved && sel) sel.value = saved;
    function draw() {
      getPrices().then(function (p) {
        var cur = sel ? sel.value : "USD"; store.set("cur", cur);
        var rate = p.fx[cur] || 1, g = p.xau / OZ * rate;
        var units = ["g", "ozt", "tael-cn", "tael-hk", "tola", "kg"];
        var h = "<table><thead><tr><th>Purity</th>" + units.map(function (u) { return "<th class='num'>per " + UNIT_LABEL[u].split(" (")[0] + "</th>"; }).join("") + "</tr></thead><tbody>";
        PURITY.forEach(function (x) {
          h += "<tr><td><b>" + x.k + "</b><br><span class='small muted'>" + x.n + "</span></td>" + units.map(function (u) { return "<td class='num'>" + money(g * UNITS[u] * x.f, cur) + "</td>"; }).join("") + "</tr>";
        });
        h += "<tr><td><b>Silver 999</b></td>" + units.map(function (u) { return "<td class='num'>" + money(p.xag / OZ * rate * UNITS[u] * 0.999, cur) + "</td>"; }).join("") + "</tr>";
        box.innerHTML = h + "</tbody></table>";
        var head = $("[data-price-head]");
        if (head) head.innerHTML = "<div class='stat'>" + money(p.xau * rate, cur, 2) + "<small>Gold per troy ounce (" + cur + ")</small></div>";
      });
    }
    if (sel) sel.addEventListener("change", draw); draw();
  }

  /* ---------- Gold value calculator ---------- */
  function initCalc() {
    var f = $("form[data-calc]"); if (!f) return;
    var out = $("[data-calc-out]");
    function run(e) {
      if (e) e.preventDefault();
      var w = parseFloat(f.weight.value), unit = f.unit.value, pur = parseFloat(f.purity.value), cur = f.currency.value;
      if (!(w > 0)) { out.innerHTML = ""; return; }
      getPrices().then(function (p) {
        var grams = w * UNITS[unit], fine = grams * pur, v = fine * p.xau / OZ * (p.fx[cur] || 1);
        var bands = [["Pawn / cash-for-gold", 0.55, 0.75], ["Local jeweller", 0.70, 0.85], ["Refiner / bullion dealer", 0.85, 0.97]];
        var q = "get-offers.html?intent=sell&weight=" + w + "&unit=" + unit + "&purity=" + f.purity.options[f.purity.selectedIndex].text.split(" ")[0];
        out.innerHTML =
          "<div class='eyebrow'>Melt value</div><div class='big-num'>" + money(v, cur, 2) + "</div>" +
          "<p class='small muted'>" + grams.toFixed(3) + " g total · " + fine.toFixed(3) + " g fine gold · spot " + money(p.xau * (p.fx[cur] || 1), cur, 2) + "/oz " + (p.live ? "(live)" : "(reference)") + "</p>" +
          "<div class='table-wrap'><table><thead><tr><th>Typical buyer</th><th class='num'>Offer range</th><th class='num'>You could lose</th></tr></thead><tbody>" +
          bands.map(function (b) { return "<tr><td>" + b[0] + "</td><td class='num'>" + money(v * b[1], cur) + " – " + money(v * b[2], cur) + "</td><td class='num'>" + money(v * (1 - b[2]), cur) + "+</td></tr>"; }).join("") +
          "</tbody></table></div><p class='small muted' style='margin-top:8px'>Ranges are typical industry estimates, not quotes.</p>" +
          "<a class='btn btn-gold' style='margin-top:10px' href='" + q + "'>Get competing offers for this gold →</a>";
      });
    }
    f.addEventListener("submit", run); f.addEventListener("input", run); run();
  }

  /* ---------- Purity / hallmark decoder ---------- */
  function decodeStamp(s) {
    var raw = (s || "").trim(); if (!raw) return null;
    var u = raw.toUpperCase().replace(/\s+/g, "");
    var notes = [], fin = null, label = "";
    if (/万足金/.test(raw)) { fin = 999.9; label = "万足金 (trade term)"; notes.push("\"万足金\" (ten-thousand-fine) is a marketing term. China's jewellery standard GB 11887 recognises 足金 (≥990‰) and 千足金 (≥999‰); 99.99% is typical of investment bars (e.g. SGE Au99.99)."); }
    else if (/千足金/.test(raw)) { fin = 999; label = "千足金"; notes.push("千足金 = at least 999‰ gold under China's GB 11887."); }
    else if (/足金/.test(raw)) { var m = u.match(/(\d{3,4})/); fin = m ? (m[1].length === 4 ? m[1] / 10 : +m[1]) : 990; label = "足金"; notes.push("足金 = at least 990‰ gold under China's GB 11887. A number after it (e.g. 足金999) states the declared fineness."); }
    else if (/(\d{1,2})K/.test(u) || /(\d{1,2})KT/.test(u)) { var k = +u.match(/(\d{1,2})K/)[1]; fin = Math.round(k / 24 * 1000 * 10) / 10; label = k + "K"; if (k === 24) { fin = 999; notes.push("24K normally means ≥ 99.9% in most markets."); } }
    else if (/AU\s?(\d{3,4})/.test(u)) { var a = u.match(/AU(\d{3,4})/)[1]; fin = a.length === 4 ? a / 10 : +a; label = "Au" + a; }
    else if (/PT|铂/.test(u)) { label = "Platinum"; notes.push("Pt / 铂 marks platinum, not gold."); }
    else if (/S\d{3}|925|银/.test(u) && !/AU/.test(u)) { label = "Silver"; fin = null; notes.push("925 / S925 / 银 usually indicate sterling silver, not gold."); }
    else if (/^(\d{3,4})$/.test(u)) { var n = u; fin = n.length === 4 ? n / 10 : +n; label = n; }
    if (/GP|GF|GEP|HGE|RGP|包金|镀金/.test(u + raw)) { notes.push("⚠ GP / GF / HGE / RGP / 镀金 / 包金 mean gold-plated or gold-filled — only a thin gold layer. Melt value is tiny."); label = label || "Plated"; }
    if (/\b(18|14|10|9)K\b/.test(u) === false && fin && fin < 999 && fin > 300 && !notes.length) notes.push("Common international millesimal fineness mark.");
    return { raw: raw, fin: fin, label: label || raw, k: fin ? Math.round(fin / 1000 * 24 * 10) / 10 : null, notes: notes };
  }
  function initPurity() {
    var f = $("form[data-purity]"); if (!f) return;
    var out = $("[data-purity-out]");
    function run(e) {
      if (e) e.preventDefault();
      var r = decodeStamp(f.stamp.value);
      if (!r) { out.innerHTML = ""; return; }
      if (!r.fin) { out.innerHTML = "<b>" + r.label + "</b><p>" + (r.notes.join("<br>") || "We couldn't read that stamp. Try formats like 足金999, 750, 18K, Au9999 or 916.") + "</p>"; return; }
      out.innerHTML = "<div class='eyebrow'>Decoded</div><div class='big-num'>" + r.fin + "‰</div>" +
        "<dl class='kv' style='margin-top:10px'><dt>Stamp</dt><dd>" + r.raw.replace(/</g, "&lt;") + "</dd><dt>Reads as</dt><dd>" + r.label + "</dd><dt>Gold content</dt><dd>" + (r.fin / 10).toFixed(2) + "%</dd><dt>Karat equivalent</dt><dd>" + r.k + "K</dd></dl>" +
        (r.notes.length ? "<p class='note' style='margin-top:10px'>" + r.notes.join("<br>") + "</p>" : "") +
        "<a class='btn btn-gold btn-sm' style='margin-top:10px' href='calculator.html?purity=" + r.fin / 1000 + "'>Value this piece →</a>";
    }
    f.addEventListener("submit", run);
    $$("[data-stamp]").forEach(function (b) { b.addEventListener("click", function () { f.stamp.value = b.getAttribute("data-stamp"); run(); }); });
  }

  /* ---------- Number analyzer ---------- */
  var DIG = {
    0: ["零", "líng", "wholeness / zero", 0], 1: ["一", "yī", "unity, first", 1], 2: ["二", "èr", "pairs, harmony", 2], 3: ["三", "sān", "life (生, Cantonese)", 1],
    4: ["四", "sì", "sounds like 死 death", -8], 5: ["五", "wǔ", "me (我) / none (无)", 0], 6: ["六", "liù", "smooth flow (流)", 5],
    7: ["七", "qī", "rise (起), Qixi love", 1], 8: ["八", "bā", "prosper (发)", 8], 9: ["九", "jiǔ", "long-lasting (久)", 6]
  };
  var PAIRS = [
    ["9999", "四个九 — four-nines pure gold; 久久久久 forever", 12], ["8888", "发发发发 — quadruple fortune", 12], ["999", "久久久 — everlasting", 6], ["888", "发发发 — triple fortune", 8],
    ["1688", "一路发发 — prosper all the way", 8], ["168", "一路发 — fortune all the way", 6], ["518", "我要发 — I will prosper", 5], ["918", "就要发 — about to prosper", 4],
    ["1314", "一生一世 — a lifetime", 5], ["520", "我爱你 — I love you", 4], ["666", "六六大顺 — everything smooth", 6], ["79", "起久 rise & last · Au = element 79", 4],
    ["99", "久久 — forever", 4], ["88", "双发 — double fortune", 5], ["66", "顺顺 — smooth", 3], ["28", "易发 — easy fortune (Cantonese)", 3], ["58", "我发 — I prosper", 2],
    ["14", "要死 — caution", -8], ["74", "气死 — caution", -6], ["250", "二百五 — 'fool', caution", -6], ["44", "死死 — caution", -10], ["514", "我要死 — caution", -8]
  ];
  function isPrime(n) { if (n < 2 || n > 9007199254740991) return false; if (n % 2 === 0) return n === 2; for (var i = 3; i * i <= n; i += 2) if (n % i === 0) return false; return true; }
  function analyze(str) {
    var d = (str || "").replace(/\D/g, ""); if (!d) return null;
    var sum = 0; d.split("").forEach(function (c) { sum += DIG[c][3]; });
    var score = 50 + (sum / d.length) * 5, hits = [], used = d;
    PAIRS.forEach(function (p) { if (used.indexOf(p[0]) > -1) { hits.push(p); score += p[2]; used = used.split(p[0]).join("|"); } });
    var n = d.length <= 15 ? parseInt(d, 10) : NaN, prime = !isNaN(n) && isPrime(n);
    if (prime) score += 3;
    if (/^(\d)\1+$/.test(d)) score += 6;
    score = Math.max(1, Math.min(100, Math.round(score)));
    var ds = 0; d.split("").forEach(function (c) { ds += +c; }); var root = ds; while (root > 9) root = String(root).split("").reduce(function (a, b) { return a + +b; }, 0);
    return { d: d, score: score, hits: hits, prime: prime, sum: ds, root: root };
  }
  function initAnalyzer() {
    $$("form[data-analyzer]").forEach(function (f) {
      var out = f.parentNode.querySelector("[data-analyzer-out]");
      function run(e) {
        if (e) e.preventDefault();
        var r = analyze(f.num.value); if (!r) { out.innerHTML = ""; return; }
        var verdict = r.score >= 85 ? "Extremely auspicious" : r.score >= 70 ? "Very lucky" : r.score >= 55 ? "Lucky" : r.score >= 40 ? "Neutral" : "Caution";
        out.innerHTML = "<div class='eyebrow'>Luck score</div><div class='big-num'>" + r.score + "<span class='small muted'>/100 · " + verdict + "</span></div>" +
          "<div class='meter' aria-hidden='true'><i style='width:" + r.score + "%'></i></div>" +
          "<div class='digits'>" + r.d.slice(0, 20).split("").map(function (c) { var x = DIG[c]; return "<div class='digit " + (x[3] >= 5 ? "lucky" : x[3] < 0 ? "caution" : "") + "'><b>" + c + "</b><span class='hz'>" + x[0] + "</span><small>" + x[1] + "</small></div>"; }).join("") + "</div>" +
          (r.hits.length ? "<h4 style='margin:12px 0 6px'>Combinations found</h4><ul>" + r.hits.map(function (h) { return "<li><b>" + h[0] + "</b> — " + h[1] + " <span class='badge " + (h[2] > 0 ? "jade" : "red") + "'>" + (h[2] > 0 ? "+" : "") + h[2] + "</span></li>"; }).join("") + "</ul>" : "") +
          "<p class='small'>Digit sum " + r.sum + " → root " + r.root + (r.prime ? " · <b>Prime number</b> (indivisible — like 999979)" : "") + "</p>" +
          "<p class='small muted'>For cultural fun and education — not a prediction.</p>";
      }
      f.addEventListener("submit", run);
      if (f.num.value) run();
    });
  }

  /* ---------- Zodiac ---------- */
  var ZOD = [
    ["Rat", "鼠", "🐀", [2, 3], "blue, gold, green", "Gold coin pendant or 'money rat' charm"],
    ["Ox", "牛", "🐂", [1, 4], "white, yellow, green", "Solid gold bangle — steady, lasting wealth"],
    ["Tiger", "虎", "🐅", [1, 3, 4], "blue, grey, orange", "Bold gold ring or tiger-eye gold bracelet"],
    ["Rabbit", "兔", "🐇", [3, 4, 6], "red, pink, purple, blue", "Delicate gold earrings or a moon-rabbit charm"],
    ["Dragon", "龙", "🐉", [1, 6, 7], "gold, silver, grey", "Dragon-phoenix bangle (龙凤镯) or gold dragon bar"],
    ["Snake", "蛇", "🐍", [2, 8, 9], "black, red, yellow", "Gold snake chain or 8-gram gold bean set"],
    ["Horse", "马", "🐎", [2, 3, 7], "yellow, green", "Gold horse charm — '马上发财' (instant fortune)"],
    ["Goat", "羊", "🐐", [2, 7], "brown, red, purple", "Gold 'three rams bring prosperity' (三羊开泰) pendant"],
    ["Monkey", "猴", "🐒", [1, 7, 8], "white, blue, gold", "Gold peach-and-monkey longevity charm"],
    ["Rooster", "鸡", "🐓", [5, 7, 8], "gold, brown, yellow", "Gold rooster pendant or 999 gold ring"],
    ["Dog", "狗", "🐕", [3, 4, 9], "red, green, purple", "Gold paw charm or 9-gram 'forever' gold bar"],
    ["Pig", "猪", "🐖", [2, 5, 8], "yellow, grey, brown, gold", "Gold 'lucky pig' charm or gold bean jar"]
  ];
  var ELEM = ["Metal", "Metal", "Water", "Water", "Wood", "Wood", "Fire", "Fire", "Earth", "Earth"];
  function zodiacOf(y) { return ZOD[((y - 4) % 12 + 12) % 12]; }
  function initZodiac() {
    var f = $("form[data-zodiac]"); if (!f) return;
    var out = $("[data-zodiac-out]");
    function show(y) {
      var z = zodiacOf(y), el = ELEM[((y % 10) + 10) % 10];
      out.innerHTML = "<div style='display:flex;gap:16px;align-items:center;flex-wrap:wrap'><div style='font-size:3.4rem'>" + z[2] + "</div><div><div class='eyebrow'>" + y + " · " + el + " " + z[0] + "</div><div class='big-num'><span class='hz'>" + z[1] + "</span> " + z[0] + "</div></div></div>" +
        "<dl class='kv' style='margin-top:12px'><dt>Lucky numbers</dt><dd>" + z[3].join(", ") + "</dd><dt>Lucky colours</dt><dd>" + z[4] + "</dd><dt>Element</dt><dd>" + el + "</dd><dt>Gold gift idea</dt><dd>" + z[5] + "</dd></dl>" +
        "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-top:12px'><a class='btn btn-gold btn-sm' href='get-offers.html?intent=jewellery'>Get zodiac jewellery quotes</a><a class='btn btn-ghost btn-sm' href='fortune.html?z=" + z[0] + "'>Today's gold fortune →</a></div>";
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var y = parseInt(f.year.value, 10); if (!(y > 1900 && y < 2100)) { toast("Enter a year 1901–2099"); return; }
      if (f.early && f.early.checked) y -= 1; show(y);
    });
    $$(".zodiac-grid button").forEach(function (b, i) {
      b.addEventListener("click", function () {
        $$(".zodiac-grid button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true");
        var y = new Date().getFullYear(); while (zodiacOf(y)[0] !== ZOD[i][0]) y--; show(y);
      });
    });
  }

  /* ---------- Daily gold fortune + share card ---------- */
  function seeded(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var TIPS = ["Check the hallmark before you pay — 足金 means ≥990‰.", "Buy on a quiet weekday; premiums are often lower than on festival days.", "Keep receipts — they raise resale offers.", "Compare at least three buyers before selling.", "Small gold beans (1 g) are an easy way to dollar-cost average.", "Store gold away from sulphur and perfumes.", "Weigh at home with a 0.01 g scale before visiting a buyer.", "Ask for the price per gram AND the making charge separately.", "A prime moment: patience beats panic selling.", "Gift gold in 9s — 久久 means forever."];
  var COLORS = [["Imperial red", "#B3121F"], ["Pure gold", "#C9A227"], ["Jade green", "#0E8F6A"], ["Ivory", "#F4EBDD"], ["Lacquer black", "#1A1410"], ["Peach blossom", "#E8A0A0"], ["Sky blue", "#3F7CC0"], ["Amber", "#E08A1E"]];
  var DIRS = ["East", "South-East", "South", "South-West", "West", "North-West", "North", "North-East"];
  function initFortune() {
    var f = $("form[data-fortune]"); if (!f) return;
    var out = $("[data-fortune-out]"), cv = $("#fortune-card");
    var pz = new URLSearchParams(location.search).get("z"); if (pz) f.animal.value = pz;
    f.date.value = new Date().toISOString().slice(0, 10);
    function run(e) {
      if (e) e.preventDefault();
      var r = seeded(f.animal.value + f.date.value + "999979");
      var pool = [8, 9, 6, 2, 3, 1, 5, 7, 0], num = "" + pool[Math.floor(r() * 4)] + pool[Math.floor(r() * 9)];
      var stars = 3 + Math.floor(r() * 3), col = COLORS[Math.floor(r() * COLORS.length)], dir = DIRS[Math.floor(r() * 8)], tip = TIPS[Math.floor(r() * TIPS.length)];
      var zz = ZOD.filter(function (z) { return z[0] === f.animal.value; })[0] || ZOD[0];
      out.innerHTML = "<div class='eyebrow'>" + f.date.value + " · " + zz[0] + " " + zz[1] + "</div><div class='big-num'>Lucky number " + num + "</div>" +
        "<dl class='kv' style='margin-top:10px'><dt>Gold mood</dt><dd>" + "★★★★★".slice(0, stars) + "☆☆☆☆☆".slice(0, 5 - stars) + "</dd><dt>Lucky colour</dt><dd><span style='display:inline-block;width:12px;height:12px;border-radius:3px;background:" + col[1] + ";vertical-align:middle'></span> " + col[0] + "</dd><dt>Wealth direction</dt><dd>" + dir + "</dd><dt>Gold tip</dt><dd>" + tip + "</dd></dl>";
      if (cv && cv.getContext) {
        var x = cv.getContext("2d"), W = cv.width, H = cv.height, g = x.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#8E0E18"); g.addColorStop(1, "#C8102E"); x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.strokeStyle = "#E6C200"; x.lineWidth = 14; x.strokeRect(30, 30, W - 60, H - 60);
        x.fillStyle = "#FFE680"; x.textAlign = "center";
        x.font = "600 34px Inter, sans-serif"; x.fillText("MY GOLD FORTUNE · " + f.date.value, W / 2, 120);
        x.font = "700 120px 'Noto Serif SC', serif"; x.fillText(zz[1], W / 2, 290);
        x.font = "700 64px 'Playfair Display', serif"; x.fillText(zz[0], W / 2, 370);
        x.font = "700 220px 'Playfair Display', serif"; x.fillText(num, W / 2, 620);
        x.font = "600 44px Inter, sans-serif"; x.fillStyle = "#fff"; x.fillText("★".repeat(stars) + "☆".repeat(5 - stars) + "  ·  " + col[0] + "  ·  " + dir, W / 2, 730);
        x.font = "500 30px Inter, sans-serif"; wrap(x, tip, W / 2, 810, W - 180, 40);
        x.fillStyle = "#FFE680"; x.font = "700 40px 'Playfair Display', serif"; x.fillText("999979.com · Forever Gold", W / 2, H - 80);
      }
    }
    function wrap(x, t, cx, y, mw, lh) { var w = t.split(" "), l = ""; for (var i = 0; i < w.length; i++) { var tt = l + w[i] + " "; if (x.measureText(tt).width > mw && l) { x.fillText(l, cx, y); l = w[i] + " "; y += lh; } else l = tt; } x.fillText(l, cx, y); }
    f.addEventListener("submit", run); f.addEventListener("change", run); run();
    var dl = $("[data-fortune-dl]"); if (dl && cv) dl.addEventListener("click", function () { var a = document.createElement("a"); a.download = "999979-gold-fortune.png"; a.href = cv.toDataURL("image/png"); a.click(); });
    var sh = $("[data-fortune-share]"); if (sh) sh.addEventListener("click", function () {
      var t = "My gold fortune today on 999979.com ✨"; if (navigator.share) navigator.share({ title: "Gold fortune", text: t, url: location.href }).catch(function () {});
      else { try { navigator.clipboard.writeText(t + " " + location.href); toast("Link copied"); } catch (e) {} }
    });
  }

  /* ---------- Auspicious gold-buying calendar ---------- */
  var FEST = {
    "2026-02-17": "Lunar New Year · Year of the Horse", "2026-02-21": "Caishen Day 财神日 (God of Wealth)", "2026-05-20": "520 · 'I love you' day", "2026-08-19": "Qixi 七夕 · Chinese Valentine's",
    "2026-09-09": "9/9 · 久久 forever", "2026-09-25": "Mid-Autumn Festival", "2026-10-18": "Double Ninth 重阳节", "2026-11-06": "Dhanteras (gold-buying day, India)", "2026-11-11": "Singles' Day 11.11 sales",
    "2027-02-06": "Lunar New Year · Year of the Goat", "2027-02-10": "Caishen Day 财神日", "2027-05-20": "520 · 'I love you' day", "2027-08-08": "Qixi 七夕 · 8/8 double fortune", "2027-09-09": "9/9 · 久久 forever",
    "2027-09-15": "Mid-Autumn Festival", "2027-10-08": "Double Ninth 重阳节", "2027-11-11": "Singles' Day 11.11 sales"
  };
  function initCalendar() {
    var f = $("form[data-calendar]"); if (!f) return;
    var out = $("[data-calendar-out]");
    var now = new Date(); f.year.value = now.getFullYear(); f.month.value = now.getMonth() + 1;
    function run(e) {
      if (e) e.preventDefault();
      var y = +f.year.value, m = +f.month.value, days = new Date(y, m, 0).getDate(), rows = [];
      for (var d = 1; d <= days; d++) {
        var key = y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0"), s = String(m) + String(d), sc = 50;
        s.split("").forEach(function (c) { sc += DIG[c][3] * 2; });
        if (/88|99|66|168|518/.test(key.replace(/-/g, ""))) sc += 8;
        if (FEST[key]) sc += 15;
        var wd = new Date(y, m - 1, d).getDay();
        rows.push({ key: key, sc: Math.max(5, Math.min(99, sc)), note: FEST[key] || "", wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][wd] });
      }
      rows.sort(function (a, b) { return b.sc - a.sc; });
      out.innerHTML = "<div class='table-wrap'><table><thead><tr><th>Date</th><th>Day</th><th class='num'>Number harmony</th><th>Why</th></tr></thead><tbody>" +
        rows.slice(0, 10).map(function (r) { return "<tr><td><b>" + r.key + "</b></td><td>" + r.wd + "</td><td class='num'>" + r.sc + "</td><td>" + (r.note || "Digit harmony (8 发 · 9 久 · 6 顺)") + "</td></tr>"; }).join("") +
        "</tbody></table></div><p class='small muted' style='margin-top:8px'>Top 10 dates by number symbolism plus festival dates. Cultural guide only — not a traditional almanac reading or financial advice.</p>";
    }
    f.addEventListener("submit", run); f.addEventListener("change", run); run();
  }

  /* ---------- Market charts (inline SVG) ---------- */
  function barChart(el) {
    var data = JSON.parse(el.getAttribute("data-bars")), unit = el.getAttribute("data-unit") || "";
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; })), W = 640, bh = 34, gap = 14, H = data.length * (bh + gap) + 10, lw = 190;
    var s = "<svg viewBox='0 0 " + W + " " + H + "' role='img' aria-label='" + (el.getAttribute("aria-label") || "chart") + "'>";
    data.forEach(function (d, i) {
      var y = i * (bh + gap) + 5, w = (W - lw - 90) * d[1] / max;
      s += "<text x='" + (lw - 10) + "' y='" + (y + bh / 2 + 4) + "' text-anchor='end'>" + d[0] + "</text>" +
        "<rect x='" + lw + "' y='" + y + "' width='" + w + "' height='" + bh + "' rx='6' fill='" + (d[2] || "#C9A227") + "'></rect>" +
        "<text x='" + (lw + w + 8) + "' y='" + (y + bh / 2 + 4) + "' font-weight='600'>" + d[1].toLocaleString() + unit + "</text>";
    });
    el.innerHTML = s + "</svg>";
  }

  /* ---------- Ads (AdSense or house ads) ---------- */
  var HOUSE = [
    ["💰", "Selling gold? Get competing offers in 60 seconds.", "get-offers.html", "Get offers"],
    ["📣", "Reach gold buyers & sellers — sponsor this spot.", "advertise.html", "Advertise"],
    ["🏆", "Golden Guess contest — predict month-end gold, win prizes.", "contests.html", "Enter free"],
    ["❤️", "Keep 999979.com free — become a Gold Patron.", "support.html", "Support"]
  ];
  function consent() { return store.get("consent") === "yes"; }
  function initAds() {
    var slots = $$("[data-ad]"), a = C.adsense || {};
    var useAds = a.enabled && consent() && a.client && a.client.indexOf("XXXX") < 0;
    if (useAds && !$("#adsbygoogle-js")) {
      var s = document.createElement("script"); s.async = true; s.id = "adsbygoogle-js"; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + a.client; document.head.appendChild(s);
    }
    slots.forEach(function (el, i) {
      var pos = el.getAttribute("data-ad");
      if (useAds && a.slots && a.slots[pos]) {
        el.innerHTML = "<div style='width:100%'><span class='lbl'>Advertisement</span><ins class='adsbygoogle' style='display:block' data-ad-client='" + a.client + "' data-ad-slot='" + a.slots[pos] + "' data-ad-format='auto' data-full-width-responsive='true'></ins></div>";
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      } else {
        var h = HOUSE[(i + new Date().getDate()) % HOUSE.length];
        el.innerHTML = "<div><span class='lbl'>Sponsored</span><div class='house'><span style='font-size:1.4rem'>" + h[0] + "</span><span>" + h[1] + "</span><a class='btn btn-gold btn-sm' href='" + h[2] + "'>" + h[3] + "</a></div></div>";
      }
    });
  }
  function initCookie() {
    var c = $(".cookie"); if (!c) return;
    if (!store.get("consent")) c.classList.add("show");
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]"); if (!b) return;
      store.set("consent", b.getAttribute("data-consent")); c.classList.remove("show"); initAds();
    });
  }

  /* ---------- Donations ---------- */
  function initDonate() {
    var d = C.donate || {};
    $$("[data-donate]").forEach(function (b) {
      var k = b.getAttribute("data-donate");
      if (d[k]) { b.href = d[k]; b.target = "_blank"; b.rel = "noopener"; }
      else { b.href = "#pledge"; b.addEventListener("click", function () { var t = $("#pledge [name=method]"); if (t) t.value = b.textContent.trim(); }); }
    });
    $$("[data-tier]").forEach(function (b) {
      b.addEventListener("click", function () { var a = $("#pledge [name=amount]"); if (a) a.value = b.getAttribute("data-tier"); });
    });
    var g = C.goal; var pg = $("[data-goal]");
    if (g && pg) { var pct = Math.min(100, g.raised / g.target * 100); pg.innerHTML = "<div class='progress'><i style='width:" + Math.max(2, pct) + "%'></i></div><p class='small' style='margin-top:6px'><b>" + money(g.raised, g.currency, 0) + "</b> raised of " + money(g.target, g.currency, 0) + " goal</p>"; }
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    $$("[data-countdown]").forEach(function (el) {
      function target() { var n = new Date(); var t = new Date(n.getFullYear(), n.getMonth() + 1, 0, 23, 59, 59); return t; }
      function tick() {
        var ms = target() - new Date(); if (ms < 0) ms = 0;
        var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        el.innerHTML = [[d, "days"], [h, "hrs"], [m, "min"], [s, "sec"]].map(function (x) { return "<div><b>" + String(x[0]).padStart(2, "0") + "</b><small>" + x[1] + "</small></div>"; }).join("");
      }
      tick(); setInterval(tick, 1000);
    });
  }

  /* ---------- Videos (lite embeds) ---------- */
  function initVideos() {
    var box = $("[data-videos]"); if (!box) return;
    var y = C.youtube || {}, list = y.featured || [];
    if (!list.length) {
      var topics = [["Gold price today, explained", "gold price today explained"], ["What does 999.9 gold mean?", "9999 gold purity explained"], ["Chinese wedding gold (三金五金)", "chinese wedding gold jewelry"], ["How to test gold at home", "how to test gold at home"], ["Why central banks buy gold", "why central banks buy gold"], ["Gold beans 金豆 trend", "chinese gold beans trend"]];
      box.innerHTML = topics.map(function (t) { return "<a class='vid-ph card-red' style='text-decoration:none' target='_blank' rel='noopener' href='https://www.youtube.com/results?search_query=" + encodeURIComponent(t[1]) + "'><div><div style='font-size:2rem'>▶</div><b>" + t[0] + "</b><div class='small'>Watch on YouTube</div></div></a>"; }).join("");
      return;
    }
    box.innerHTML = list.map(function (v) { return "<figure style='margin:0'><div class='vid' data-yt='" + v.id + "' role='button' tabindex='0' aria-label='Play: " + v.title + "'><img loading='lazy' alt='' src='https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg'></div><figcaption class='small' style='margin-top:6px'>" + v.title + "</figcaption></figure>"; }).join("");
    function play(el) { el.innerHTML = "<iframe src='https://www.youtube-nocookie.com/embed/" + el.getAttribute("data-yt") + "?autoplay=1' allow='autoplay; encrypted-media; picture-in-picture' allowfullscreen title='YouTube video'></iframe>"; }
    box.addEventListener("click", function (e) { var v = e.target.closest(".vid"); if (v && !v.querySelector("iframe")) play(v); });
    box.addEventListener("keydown", function (e) { var v = e.target.closest(".vid"); if (v && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); play(v); } });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$("[data-tabs]").forEach(function (t) {
      var btns = $$("button", t), panels = btns.map(function (b) { return document.getElementById(b.getAttribute("aria-controls")); });
      btns.forEach(function (b, i) { b.addEventListener("click", function () { btns.forEach(function (x, k) { x.setAttribute("aria-selected", k === i); if (panels[k]) panels[k].hidden = k !== i; }); }); });
    });
  }

  /* ---------- Calculator prefill ---------- */
  function prefillCalc() {
    var f = $("form[data-calc]"); if (!f) return;
    var p = new URLSearchParams(location.search), pur = p.get("purity");
    if (pur) { var best = null; $$("option", f.purity).forEach(function (o) { if (best === null || Math.abs(o.value - pur) < Math.abs(best.value - pur)) best = o; }); if (best) f.purity.value = best.value; }
    if (p.get("weight")) f.weight.value = p.get("weight");
  }

  function prefillForms() {
    var p = new URLSearchParams(location.search);
    $$("form[data-form]:not([data-stepper])").forEach(function (f) {
      p.forEach(function (v, k) { var el = f.querySelector("select[name='" + k + "'],input[name='" + k + "']:not([type=hidden])"); if (el && el.type !== "checkbox" && el.type !== "radio") el.value = v; });
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    prefillForms(); initChrome(); initForms(); initStepper(); initTicker(); initPriceTable(); prefillCalc(); initCalc(); initPurity(); initAnalyzer();
    initZodiac(); initFortune(); initCalendar(); $$("[data-bars]").forEach(barChart); initCookie(); initAds(); initDonate(); initCountdown(); initVideos(); initTabs();
  });
})();
