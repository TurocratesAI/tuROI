#!/usr/bin/env node
/*
 * Turoi — Full Dossier Generator.
 *
 * Loads index.html in a stubbed browser context, enumerates all product
 * features (regions, sub-profiles, wizard sections, value pillars, AI
 * integration points, evidence library), then runs the calculator against
 * every preloaded fixture and captures real outputs with ASCII-rendered
 * figures. Writes the result to research/turoi_full_dossier.md.
 *
 * Usage: node research/generate_dossier.cjs
 */

const fs = require("fs");
const path = require("path");

// ---------- Browser stubs ----------
const listeners = {};
const stubEl = () => ({
  style: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){return false;} },
  appendChild(){}, removeChild(){}, insertBefore(){}, remove(){},
  setAttribute(){}, getAttribute(){return null;},
  addEventListener(){}, removeEventListener(){},
  querySelector(){return stubEl();}, querySelectorAll(){return [];},
  innerHTML: "", textContent: "", value: "",
  dataset: {}, children: [], parentNode: null,
  focus(){}, click(){}, scrollIntoView(){},
});
global.localStorage = {
  _s: {},
  getItem(k){ return this._s[k] || null; },
  setItem(k,v){ this._s[k] = v; },
  removeItem(k){ delete this._s[k]; },
};
global.document = {
  getElementById: () => stubEl(),
  querySelector: () => stubEl(),
  querySelectorAll: () => [],
  createElement: () => stubEl(),
  body: stubEl(),
  head: stubEl(),
  addEventListener(ev, cb){ listeners[ev] = cb; },
  readyState: "complete",
};
global.location = { search: "?dev=1", hash: "", href: "" };
global.window = { Turoi: null, location: global.location, addEventListener(){}, scrollTo(){}, innerWidth: 1200, innerHeight: 800 };
global.Chart = function(){ return { destroy(){}, update(){}, data:{} }; };
global.Chart.register = () => {};

// ---------- Load the app ----------
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error("no <script> block"); process.exit(1); }
eval(scriptMatch[1]);
if (listeners.DOMContentLoaded) listeners.DOMContentLoaded();
const T = global.window.Turoi;
if (!T) { console.error("Turoi dev handle missing"); process.exit(1); }

// ---------- Helpers ----------
const INR = v => "₹" + Math.round(v).toLocaleString("en-IN");
const USD = v => "$" + Math.round(v).toLocaleString("en-US");
const GBP = v => "£" + Math.round(v).toLocaleString("en-GB");
const EUR = v => "€" + Math.round(v).toLocaleString("en-US");
const fmtCurrency = (v, region) => {
  const r = T.REGIONS[region];
  if (!r) return Math.round(v).toString();
  const n = Math.round(v).toLocaleString(r.locale || "en-US");
  return r.symbol + n;
};
const fmtPct = v => (v * 100).toFixed(1) + "%";
const fmtNum = v => Number(v).toLocaleString("en-US");

// Render a horizontal ASCII bar chart for magnitudes (max width = 40 cells).
function asciiBar(entries, width) {
  width = width || 40;
  if (!entries.length) return "";
  const maxAbs = Math.max(...entries.map(e => Math.abs(e.value)));
  if (maxAbs === 0) return "(all zero)";
  const maxLabel = Math.max(...entries.map(e => e.label.length));
  return entries.map(e => {
    const cells = Math.max(1, Math.round((Math.abs(e.value) / maxAbs) * width));
    const bar = "█".repeat(cells);
    const label = e.label.padEnd(maxLabel);
    const val = e.fmt || fmtNum(Math.round(e.value));
    return `  ${label}  ${bar.padEnd(width)}  ${val}`;
  }).join("\n");
}

// Render an ASCII tornado chart (two-sided bars).
function asciiTornado(entries, width) {
  width = width || 30;
  if (!entries.length) return "";
  const maxAbs = Math.max(...entries.map(e => Math.max(Math.abs(e.up), Math.abs(e.dn))));
  if (maxAbs === 0) return "(no sensitivity)";
  const maxLabel = Math.max(...entries.map(e => e.label.length));
  const zero = " ".repeat(width) + "│" + " ".repeat(width);
  const fmt = v => (v >= 0 ? "+" : "") + Math.round(v / 100000) / 10 + "L";
  return entries.map(e => {
    const upCells = Math.max(0, Math.round((Math.max(0, e.up) / maxAbs) * width));
    const dnCells = Math.max(0, Math.round((Math.max(0, -e.dn) / maxAbs) * width));
    const leftUp = Math.max(0, Math.round((Math.max(0, -e.up) / maxAbs) * width));
    const rightDn = Math.max(0, Math.round((Math.max(0, e.dn) / maxAbs) * width));
    const left = " ".repeat(width - dnCells - leftUp) + "▓".repeat(dnCells) + "▒".repeat(leftUp);
    const right = "▒".repeat(rightDn) + "▓".repeat(upCells) + " ".repeat(width - upCells - rightDn);
    return `  ${e.label.padEnd(maxLabel)}  ${left}│${right}`;
  }).join("\n");
}

// ---------- Document builder ----------
const lines = [];
const h1 = t => { lines.push("# " + t); lines.push(""); };
const h2 = t => { lines.push("## " + t); lines.push(""); };
const h3 = t => { lines.push("### " + t); lines.push(""); };
const h4 = t => { lines.push("#### " + t); lines.push(""); };
const p  = t => { lines.push(t); lines.push(""); };
const hr = () => { lines.push("---"); lines.push(""); };
const code = t => { lines.push("```"); lines.push(t); lines.push("```"); lines.push(""); };
const bullet = items => { items.forEach(i => lines.push("- " + i)); lines.push(""); };

// ============================================================================
// FRONT MATTER
// ============================================================================
lines.push("<!-- Generated by research/generate_dossier.cjs — do not edit by hand. -->");
lines.push("");
h1("Turoi — Full Dossier");
p("_Turocrates AI Private Limited · a reviewable economic instrument for digital pathology adoption._");
p("This document is a complete, self-contained reference for Turoi. It enumerates every feature, every region, every institution profile, every wizard input, every value pillar, every AI-analyst integration point, every citation in the evidence library, and every default assumption — and then walks through six worked case studies against real calculator outputs with ASCII-rendered figures for the value-pillar waterfall and the sensitivity tornado.");
p("It is generated by `research/generate_dossier.cjs`, which loads `index.html` in a stubbed browser context, introspects the product at runtime, and writes this markdown file. Regenerating it is a single command:");
code("node research/generate_dossier.cjs");
p("**Date generated:** " + new Date().toISOString().slice(0, 10));
p("**Regions covered:** " + Object.keys(T.REGIONS).length);
p("**Institution profiles:** " + Object.values(T.REGIONS).reduce((n, r) => n + Object.keys(r.sub_profiles || {}).length, 0));
p("**Evidence entries:** " + Object.keys(T.EVIDENCE).length);
p("**Worked case studies:** 6");
hr();

// ============================================================================
// PART I — PRODUCT OVERVIEW
// ============================================================================
h1("Part I — Product");

h2("1. What Turoi is");
p("Turoi is a single-file browser application that projects the full economic impact of transitioning a pathology operation to a digital slide workflow. It is positioned as a scientific instrument, not a SaaS demo: every default carries a primary-literature citation, every assumption flows through a reviewable ledger, every model adjustment is attributed and reproducible, and every AI-analyst response is logged to an audit trail that can be exported alongside the business case.");
p("Turoi is region-adaptive (eight geographies), institution-native (six institution types spanning government hospitals to national diagnostic chains), and covers eight value pillars for hospital-attached pathology plus five additional pillars exclusive to diagnostic-lab profiles — a market ignored by every existing ROI calculator.");

h2("2. Who it is for");
bullet([
  "**Lab directors** preparing a business case for their hospital CFO or health-system board.",
  "**CEOs of diagnostic chains** evaluating digital pathology as a commercial growth lever, not an IT project.",
  "**Hospital CFOs** who need a defensible NPV range, a payback year, and an explicit attribution of who captures the savings.",
  "**Government administrators** procuring WSI through tender portals who need evidence-sourced cost and benefit estimates.",
  "**Grant committees** assessing funding applications for digital pathology adoption in resource-constrained settings.",
  "**Health economists and reviewers** who want every assumption traceable to a citation.",
]);

h2("3. Design principles");
bullet([
  "**Evidence-first** — every default carries a citation to primary literature; every adjustment is logged with reasoning.",
  "**Reviewable, not just explainable** — the methodology tab surfaces the entire assumptions ledger, filterable and exportable to CSV.",
  "**Region-adaptive** — procurement model, salary scale, reimbursement landscape, and discount rate differ by region; defaults are sourced to region-specific evidence where available.",
  "**Institution-native** — a standalone diagnostic lab does not see OR time or LOS fields, and its ROI narrative is dominated by logistics, commercial growth, and consult revenue scale — not hospital pillars.",
  "**Ultra-smart via AI analyst** — the AI layer actively runs sanity checks, fills gaps, cross-validates inputs across domains, calibrates productivity ramps, powers a what-if chat that can patch state and re-run the projection live, and tailors interpretation to the reading audience.",
  "**Graceful degradation** — without an AI-analyst API key, the calculator still works. AI-analyst interpretation is unlocked when an API key is provided in the settings modal.",
  "**Single-file delivery** — one `index.html`, no build step, no server. Runs locally or drops onto any static host. All state in `localStorage`.",
]);

h2("4. Architecture");
p("The app is a single `index.html` file organized into nine logical sections inside one `<script>` block:");
bullet([
  "**Regions** — `REGIONS` object keyed by ISO region code, each with currency, FX, discount rate, and a dictionary of sub-profiles with full defaults and basis annotations.",
  "**Evidence library** — `EVIDENCE` dictionary of cited papers with authors, journal, DOI, and key findings, keyed by short IDs used throughout the ledger.",
  "**State + ledger** — top-level `state` object persisted to `localStorage`; `ledger` helpers for upsert, user/AI-analyst modification, CSV/JSON export, and filtering.",
  "**Wizard** — declarative `WIZARD_SECTIONS` config with profile-aware visibility; one render function generates the form from the config.",
  "**Calculator** — pure functions returning a results object with year-by-year projection, NPV, payback, ROI, pillar totals, sensitivity, and Monte Carlo bands.",
  "**Charts** — Chart.js 4 renderers for J-curve, waterfall, donut, tornado, year-by-year table.",
  "**AI-analyst API** — seven integration points, all logged to `claude_audit_log` with full prompt and response.",
  "**PDF export** — multi-page jsPDF layout: cover, executive summary, profile, financial projection, pillar deep-dives, sensitivity, roadmap, assumptions appendix, references, disclaimer.",
  "**App controller** — screen router, settings modal, methodology tab, scenario save/compare.",
]);
hr();

// ============================================================================
// PART II — REGIONS & INSTITUTION PROFILES
// ============================================================================
h1("Part II — Regions & Institution Profiles");

h2("2.1 Region coverage");
p("Turoi adapts currency, locale formatting, FX, discount rate, procurement model, salary scale, and reimbursement landscape to the selected region. Each region has one or more institution sub-profiles; all defaults are evidence-sourced per region.");
lines.push("| Region | Currency | Locale | FX → USD | Default discount rate | Sub-profiles |");
lines.push("|---|---|---|---|---|---|");
for (const [rk, r] of Object.entries(T.REGIONS)) {
  const subs = Object.keys(r.sub_profiles || {}).join(", ");
  lines.push(`| ${r.label} | ${r.symbol}${r.currency} | ${r.locale} | ${r.fx_to_usd} | ${fmtPct(r.discount_rate_default)} | ${subs} |`);
}
lines.push("");

h2("2.2 Institution typology");
p("Six institution types span the commercial axis from government teaching hospitals (tender-driven, grade-scaled salary, scheme-based reimbursement) to national diagnostic chains (B2B referral-driven, data monetization, commercial growth as the dominant pillar). Not every region has all six types populated — the ones that do are full first-class profiles, not aliased.");
p("**Hospital-attached profiles (attribution mode: hospital).** Pathology department sits inside a hospital or health system; savings can accrue to the department, to the hospital (OR time, LOS), or to the health system as a whole. Patient-flow and surgical-impact pillars are active.");
bullet([
  "**Government / public hospital pathology** — teaching hospital, medical college, government system (NHS, AIIMS, VA, MoH).",
  "**Academic / private hospital pathology** — university-affiliated private academic centers, large non-profit academic systems.",
  "**Community / corporate hospital pathology** — hospital-attached lab serving a single mid-size community hospital or corporate hospital chain.",
]);
p("**Diagnostic-lab profiles (attribution mode: diagnostic_lab).** No OR, no inpatient beds. Patient-flow and surgical-impact pillars are zeroed. Dominant value drivers are hub-and-spoke logistics, subspecialty routing, commercial growth, consult revenue scalability, and (for national chains) data monetization.");
bullet([
  "**Standalone diagnostic lab** — single-site, independently owned, B2B referral-driven.",
  "**Hyperlocal diagnostic chain** — regional/multi-city chain (~5–50 sites), hub-and-spoke logistics.",
  "**National diagnostic chain** — large-scale reference laboratory networks operating across multiple states or countries.",
]);

h2("2.3 Full sub-profile enumeration");
for (const [rk, r] of Object.entries(T.REGIONS)) {
  h3(`${r.label} (${r.symbol}${r.currency})`);
  for (const [spk, sp] of Object.entries(r.sub_profiles || {})) {
    lines.push(`**${sp.label}** — \`${rk}.${spk}\``);
    lines.push("");
    if (sp.type) lines.push(`- Profile type: \`${sp.type}\``);
    if (sp.attribution_mode) lines.push(`- Attribution mode: \`${sp.attribution_mode}\``);
    if (sp.procurement_model) lines.push(`- Procurement: ${sp.procurement_model}`);
    if (sp.staffing_model) lines.push(`- Staffing model: ${sp.staffing_model}`);
    if (sp.reimbursement_landscape) lines.push(`- Reimbursement: ${sp.reimbursement_landscape}`);
    if (sp.sites_count != null) lines.push(`- Sites: ${sp.sites_count}`);
    if (sp.bed_count != null) lines.push(`- Beds: ${sp.bed_count}`);
    if (Array.isArray(sp.relevant_pillars_hint)) {
      lines.push(`- Dominant pillars: ${sp.relevant_pillars_hint.join(", ")}`);
    }
    lines.push("");
  }
}
hr();

// ============================================================================
// PART III — WIZARD SECTIONS & INPUTS
// ============================================================================
h1("Part III — Wizard Sections & Inputs");

p("The wizard is driven by a declarative `WIZARD_SECTIONS` array. Each section has a set of fields, a pillar-tag badge, and a profile-aware visibility predicate that decides whether to show the section for the selected institution type. Hospital profiles see OR time, patient LOS, frozen section, and burnout sections; diagnostic labs see hub-and-spoke logistics, subspecialty routing, commercial growth, consult revenue scalability, and (for chains) data monetization.");

// Pull wizard sections from the dev handle if exposed; otherwise from source.
// We reparse them from the html at runtime.
const WZ_MATCH = scriptMatch[1].match(/const WIZARD_SECTIONS = \[([\s\S]*?)\n\];/);
if (WZ_MATCH) {
  const body = WZ_MATCH[1];
  const sectionRe = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*eyebrow:\s*"([^"]*)",\s*description:\s*"([^"]+)",\s*pillar_tags:\s*\[([^\]]*)\],\s*visible_when:\s*(\w+)/g;
  const sections = [];
  let mm;
  while ((mm = sectionRe.exec(body))) {
    sections.push({
      id: mm[1], title: mm[2], eyebrow: mm[3], description: mm[4],
      pillar_tags: mm[5].trim(), visible_when: mm[6],
    });
  }
  h2("3.1 All wizard sections");
  p(`Turoi defines **${sections.length}** wizard sections. Sections are shown or hidden based on profile type; a government medical college sees the hospital sections, while a standalone diagnostic lab sees the logistics and commercial sections instead.`);
  lines.push("| # | Section | Eyebrow | Visible when | Pillar tags |");
  lines.push("|---|---|---|---|---|");
  sections.forEach((s, i) => {
    lines.push(`| ${i+1} | **${s.title}** | ${s.eyebrow} | \`${s.visible_when}\` | ${s.pillar_tags} |`);
  });
  lines.push("");
  h2("3.2 Section descriptions");
  sections.forEach((s, i) => {
    h3(`${i+1}. ${s.title}`);
    p(`_${s.eyebrow}_`);
    p(s.description);
  });
}
hr();

// ============================================================================
// PART IV — VALUE PILLARS
// ============================================================================
h1("Part IV — Value Pillars & Formulas");

p("Each pillar is computed per year from ledger values, then summed across the projection horizon. A productivity ramp (25% / 60% / 100% by default for years 1 / 2 / 3+) is applied to pillars that depend on workflow adoption. Hospital-only pillars are zeroed for diagnostic-lab profiles and vice versa.");

h2("4.1 Hospital / universal pillars");

h3("Slide movement & supply chain");
p("Courier savings from eliminated inter-site slide transport, retrieval labor recovered, and transport damage avoided.");
code(`slide_movement = courier_saved
               + retrieval_labor_saved
               + transport_damage_avoided`);

h3("Pathologist productivity");
p("Hours recaptured by removing microscope handling, slide retrieval, and logistical context-switching, valued at the loaded hourly rate. Ramped over the adoption curve.");
code(`productivity = path_hours_saved_year
             * hourly_rate
             * ramp[year]`);

h3("Surgical workflow (frozen section)");
p("OR minutes saved per frozen-section case due to faster digital telepath review, valued at the OR cost per minute. Hospital-only.");
code(`surgical_impact = frozen_section_volume
                * minutes_saved_per_case
                * or_cost_per_minute
                * ramp[year]`);

h3("Patient length of stay");
p("Bed-days saved by earlier discharge enabled by faster pathology turnaround. Hospital-only.");
code(`patient_flow = affected_los_cases_year
             * los_days_saved_per_case
             * bed_cost_per_day
             * ramp[year]`);

h3("Waste reduction & QA");
p("Immunohistochemistry avoided, recuts avoided, lost slides reduced.");
code(`waste_reduction = ihc_avoided * ihc_cost
                + recuts_avoided * recut_cost
                + lost_slides_reduced * restain_cost`);

h3("Workforce sustainability");
p("Burnout-driven attrition avoided, valued at a conservative fraction of the replacement cost of a pathologist. Treated as a soft pillar — fragile in settings where the replacement market does not exist.");
code(`workforce = burnout_risk_score
           * per_physician_replacement_cost
           * probability_factor`);

h3("Physical infrastructure");
p("Archive square footage progressively recoverable as the physical slide file retires.");
code(`infrastructure = sqft_freed * rent_per_sqft_year`);

h3("Risk & compliance");
p("Reduced legal retrievals, faster compliance audits, immutable audit trail value.");
code(`risk_compliance = legal_requests_per_year
                 * delta_cost_per_request
                 + risk_buffer`);

h3("Strategic & consult revenue");
p("Universal strategic line covering inbound consult revenue growth, AI reimbursement, and partnership NPV.");
code(`strategic = consult_growth + ai_reimbursement + partnership_est`);

h2("4.2 Diagnostic-lab-only pillars");

h3("Hub & spoke logistics");
p("For multi-site diagnostic chains, this is the dominant value driver: inter-site courier runs eliminated by digital routing, plus resident/driver hours recovered, plus reduced sample loss.");
code(`hub_spoke_logistics = inter_site_couriers_eliminated * cost_per_run
                    + resident_driver_hours_recovered * hourly_rate
                    + sample_loss_rate * cases_per_year * cost_per_lost_case`);

h3("Subspecialty routing");
p("External subspecialty consults retained in-network via digital telepath, avoiding the referral cost and TAT penalty.");
code(`subspecialty_routing = external_consults_retained
                       * (external_cost - internal_cost)
                     + TAT_penalty_days * cases_per_year * reputation_factor`);

h3("Commercial growth (B2B)");
p("New B2B referring physicians won through digital capability, plus retention uplift from faster TAT on existing volume.");
code(`commercial_growth = new_B2B_referrers
                     * avg_volume_per_referrer
                     * margin_per_case
                     * ramp[year]
                  + retention_uplift_from_TAT
                     * existing_volume
                     * margin_per_case`);

h3("Consult revenue scalability");
p("Projected growth in external consult revenue as the geographic reach constraint is lifted by digital.");
code(`consult_revenue_scale = (projected_consult_volume - baseline)
                        * price_per_consult
                        * ramp[year]`);

h3("Data monetization & AI (chain-only)");
p("Curated WSI datasets monetized via pharma/AI partnerships. Applies only to national chains with enough scale to matter. Flagged as high-uncertainty and subject to regulatory constraints (DPDP Act in India, GDPR in EU, HIPAA in US).");
code(`data_monetization = curated_dataset_value + partnership_deal_npv`);
hr();

// ============================================================================
// PART V — AI ANALYST LAYER
// ============================================================================
h1("Part V — AI-Analyst Integration Points");

p("Turoi uses a Claude-family model as an active reasoning layer, not a cosmetic explanation strip. Seven integration points shape every number the user sees. All seven are logged to an audit trail with redacted API key, and every numeric adjustment flows through the ledger helpers so the change is diffable and reversible.");

const integrations = [
  { n: 1, name: "Region refinement", fn: "refineRegion()",
    when: "After sub-profile selection and free-text description",
    what: "Refines region defaults based on the specific institution description. Adjusts GeM tender discounts, educational licensing discounts, teaching-hospital consult volume, and region-specific regulatory considerations." },
  { n: 2, name: "Pre-estimation review", fn: "preEstimationReview()",
    when: "After wizard completion, before calculator runs",
    what: "The most important integration. Runs sanity checks on every input, fills gaps for skipped sections, cross-validates inputs across domains, surfaces hidden costs and savings, calibrates the productivity ramp, flags region-specific regulatory considerations, runs the edge-case checklist. Returns structured findings (id, category, finding, current_value, suggested_value, reasoning, severity, citations). Rendered as an interactive Accept / Modify / Ignore checklist. User must clear this gate before the calculator runs." },
  { n: 3, name: "Dashboard insight", fn: "dashboardInsight(audience)",
    when: "On dashboard load and when audience changes",
    what: "Returns headline, top drivers, attribution map, weakest link, phased strategy, presentation hook, and institution-specific notes. Audience-aware: a diagnostic-chain CEO gets a commercial-growth frame, a CFO gets cash-flow and payback, a grant committee gets impact and sustainability." },
  { n: 4, name: "Dynamic pillar narrative", fn: "dynamicPillarNarrative(pillar)",
    when: "On demand when a user clicks into any value pillar",
    what: "Generates a 2–3 paragraph narrative specific to this institution explaining why this pillar matters, what the number represents, which assumptions drove it, and what could make it larger or smaller. Cached per pillar." },
  { n: 5, name: "What-if chat", fn: "whatIfChat(message, history)",
    when: "On demand in the advisor panel",
    what: "Chat interface. Can return a narrative plus a state_patch — if a patch is present, the UI applies it, re-runs calculate(), and re-renders the dashboard live. Proactively suggests follow-up what-ifs after each answer." },
  { n: 6, name: "Strengthen case", fn: "strengthenCase()",
    when: "On demand from the advisor panel",
    what: "Reviews current results, identifies the 3 weakest assumptions (lowest confidence × highest NPV impact), and returns a checklist of exactly what data to collect from the user's lab to make each one defensible." },
  { n: 7, name: "PDF executive summary", fn: "pdfExecutiveSummary(audience)",
    when: "During PDF export",
    what: "250–400 word audience-tailored executive summary for the first page of the PDF. Department head / CFO / CEO of diagnostic chain / government administrator / board / grant committee." },
];
integrations.forEach(i => {
  h3(`${i.n}. ${i.name}`);
  p(`\`${i.fn}\``);
  p("**When:** " + i.when);
  p("**What:** " + i.what);
});

h2("Graceful degradation");
p("Every AI-analyst call has a fallback. If the API key is missing or the call fails, the UI shows raw pillar numbers with a banner explaining that AI-analyst interpretation is not available. The calculator itself never depends on the AI analyst for computation — every number on the dashboard can be produced from the ledger alone.");
hr();

// ============================================================================
// PART VI — EVIDENCE LIBRARY
// ============================================================================
h1("Part VI — Evidence Library");

p(`Turoi's evidence library contains ${Object.keys(T.EVIDENCE).length} entries, keyed by short IDs used in the assumptions ledger. Every default value in REGIONS may reference one or more of these citations via its basis record.`);

for (const [key, ev] of Object.entries(T.EVIDENCE)) {
  h3(`\`${key}\``);
  lines.push(`**${ev.authors}** (${ev.year}). *${ev.title}*. ${ev.journal}${ev.vol ? ", " + ev.vol : ""}.${ev.doi ? " DOI: " + ev.doi : ""}`);
  lines.push("");
  if (Array.isArray(ev.key_findings) && ev.key_findings.length) {
    lines.push("**Key findings:**");
    ev.key_findings.forEach(f => lines.push("- " + f));
    lines.push("");
  } else if (Array.isArray(ev.findings)) {
    lines.push("**Key findings:**");
    ev.findings.forEach(f => lines.push("- " + f));
    lines.push("");
  }
}
hr();

// ============================================================================
// PART VII — DEFAULT ASSUMPTIONS REGISTRY
// ============================================================================
h1("Part VII — Default Assumptions Registry");

p("For each region / sub-profile combination, Turoi carries a full set of default values. Each default is paired with a basis record: source, reasoning, confidence level, and a citation ID into the evidence library. This section dumps every default across all regions so the entire assumptions surface is visible in one place.");

p("**Confidence legend:** `high` = established, multi-study support (±10% Monte Carlo spread). `medium` = single study or reasoned estimate (±20%). `low` = heuristic, hand-calibrated (±35%).");

for (const [rk, r] of Object.entries(T.REGIONS)) {
  h2(`${r.label}`);
  for (const [spk, sp] of Object.entries(r.sub_profiles || {})) {
    h3(`${sp.label}`);
    const defaults = sp.defaults || {};
    const basis = sp.basis || {};
    if (!Object.keys(defaults).length) { p("_(no defaults)_"); continue; }
    lines.push("| ID | Default | Source | Confidence | Citation |");
    lines.push("|---|---|---|---|---|");
    for (const [id, val] of Object.entries(defaults)) {
      const b = basis[id] || {};
      let valDisp;
      if (typeof val === "number") {
        if (id.endsWith("_annual") || id.endsWith("_cost") || id.includes("cost_per") || id.includes("salary") || id.includes("rent") || id.includes("per_case") || id.includes("per_day") || id.includes("per_minute") || id.includes("per_sqft")) {
          valDisp = r.symbol + Math.round(val).toLocaleString(r.locale || "en-US");
        } else if (val < 1 && val > 0) {
          valDisp = (val * 100).toFixed(1) + "%";
        } else {
          valDisp = Math.round(val).toLocaleString(r.locale || "en-US");
        }
      } else {
        valDisp = String(val);
      }
      const src = (b.source || "—").replace(/\|/g, "\\|");
      const conf = b.confidence || "—";
      const cite = b.citation_id ? "`" + b.citation_id + "`" : "—";
      lines.push(`| \`${id}\` | ${valDisp} | ${src} | ${conf} | ${cite} |`);
    }
    lines.push("");
  }
}
hr();

// ============================================================================
// PART VIII — WORKED CASE STUDIES
// ============================================================================
h1("Part VIII — Worked Case Studies");

p("Each case below runs the calculator end-to-end against a preloaded fixture, captures the actual outputs, and renders the pillar waterfall and sensitivity tornado as ASCII figures. The numbers in this section are not illustrative — they are the real outputs of `calculate()` at the time this dossier was generated.");

const fixtures = [
  { id: "india_gov",      label: "Indian Government Medical College",        region: "india", profile: "government_medical_college",
    commentary: "Tier-1 government teaching hospital. High volume (180k slides/year), low absolute salary but high FTE count, GeM portal procurement. The ROI case is dominated by workforce sustainability and productivity, with LOS and surgical-impact pillars contributing materially due to the high surgical caseload. Reimbursement is scheme-based (CGHS/state insurance), which constrains the direct revenue pillars." },
  { id: "india_chain",    label: "Indian Hyperlocal Diagnostic Chain",       region: "india", profile: "hyperlocal_diagnostic_chain",
    commentary: "12-site regional chain with a central lab and spoke collection centers. No OR, no beds — patient-flow and surgical-impact pillars are zeroed. The dominant value drivers are hub-and-spoke logistics (the inter-site courier runs eliminated by digital routing) and commercial growth (new B2B referrers won through faster TAT and subspecialty coverage). Pricing pressure from larger national chains is a contextual factor." },
  { id: "india_national", label: "Indian National Diagnostic Chain",         region: "india", profile: "national_diagnostic_chain",
    commentary: "National-scale diagnostic chain. Data monetization pillar is active at this scale. Hub-and-spoke logistics remains significant but the dominant line is commercial growth plus consult revenue scalability, as digital collapses geographic reach constraints on subspecialty reporting." },
  { id: "us_amc",         label: "US Academic Medical Center",               region: "us",    profile: "academic_medical_center",
    commentary: "Benchmark case comparable to published peer-reviewed 5yr NPV analyses. High scanner cost, high salary, high OR cost per minute. The J-curve crossover is later than the Indian cases because the absolute capex is much larger, but total NPV is also larger in absolute terms." },
  { id: "uk_nhs",         label: "UK NHS Trust",                              region: "uk",    profile: "nhs_trust",
    commentary: "Agenda-for-Change salary scale, public-sector procurement, Green-Book-adjacent discount rate. LOS attribution is strong because NHS bed-day costs are well-documented and the hospital has an explicit tariff-based internal cost. Patient-flow pillar is typically larger than at a US equivalent." },
  { id: "us_lab",         label: "US Specialty Standalone Lab",              region: "us",    profile: "standalone_diagnostic_lab",
    commentary: "Derm/GI-focused standalone lab. Diagnostic-lab attribution mode — hospital pillars zero out. Dominant drivers are commercial growth, consult revenue scalability, and subspecialty routing. Capex is smaller than a hospital profile (fewer scanners, single site), and the payback year is typically earlier." },
];

for (const f of fixtures) {
  h2(`${f.label}`);
  p(`_Region: ${f.region} · Sub-profile: ${f.profile} · Fixture key: \`${f.id}\`_`);

  // Seed and calculate.
  try {
    T.seedFixture(f.id);
  } catch (e) {
    p("_Fixture failed to load: " + e.message + "_");
    continue;
  }
  const r = T.state.results;
  if (!r) { p("_Calculator returned no results._"); continue; }
  const region = T.REGIONS[f.region];
  const fc = v => region.symbol + Math.round(v).toLocaleString(region.locale || "en-US");

  // Commentary.
  p(f.commentary);

  // Headline metrics table.
  h3("Headline metrics");
  lines.push("| Metric | Value |");
  lines.push("|---|---|");
  lines.push(`| Horizon | ${r.horizon} years |`);
  lines.push(`| Discount rate | ${fmtPct(r.discount)} |`);
  lines.push(`| Capex (year 0) | ${fc(r.capex)} |`);
  lines.push(`| Opex (year 1, before inflation) | ${fc(r.opexY1)} |`);
  lines.push(`| **NPV** | **${fc(r.npv)}** |`);
  lines.push(`| Monte Carlo 5–95% band | ${fc(r.mc.p5)} — ${fc(r.mc.p95)} |`);
  lines.push(`| Payback year | ${r.paybackYear || "beyond horizon"} |`);
  lines.push(`| ROI | ${r.roiPct.toFixed(0)}% |`);
  lines.push(`| Total savings (horizon) | ${fc(r.totalSavings)} |`);
  lines.push(`| Total cost (horizon) | ${fc(r.totalCost)} |`);
  lines.push(`| Cost per case | ${fc(r.costPerCase)} |`);
  lines.push(`| Productivity hours recaptured / yr | ${Math.round(r.productivityHoursPerYear).toLocaleString()} |`);
  lines.push(`| Attribution mode | \`${r.attribution_mode}\` |`);
  lines.push("");

  // Pillar contribution table + waterfall.
  h3("Value-pillar contribution (aggregated across horizon)");
  const pillars = Object.entries(r.pillarTotals)
    .filter(([_, v]) => v !== 0)
    .sort((a, b) => b[1] - a[1]);
  lines.push("| Pillar | Total over horizon | Share |");
  lines.push("|---|---|---|");
  const totalP = pillars.reduce((a, [, v]) => a + v, 0);
  pillars.forEach(([k, v]) => {
    const label = {
      slide_movement: "Slide movement & supply chain",
      productivity: "Pathologist productivity",
      surgical_impact: "Surgical workflow (frozen section)",
      patient_flow: "Patient length of stay",
      waste_reduction: "Waste reduction & QA",
      workforce: "Workforce sustainability",
      infrastructure: "Physical infrastructure",
      risk_compliance: "Risk & compliance",
      strategic: "Strategic & consult revenue",
      hub_spoke_logistics: "Hub & spoke logistics",
      subspecialty_routing: "Subspecialty routing",
      commercial_growth: "Commercial growth (B2B)",
      consult_revenue_scale: "Consult revenue scalability",
      data_monetization: "Data monetization & AI",
    }[k] || k;
    const share = totalP > 0 ? ((v / totalP) * 100).toFixed(1) + "%" : "—";
    lines.push(`| ${label} | ${fc(v)} | ${share} |`);
  });
  lines.push("");

  h3("Waterfall (ASCII)");
  const bars = pillars.map(([k, v]) => ({
    label: ({
      slide_movement: "Slide movement       ",
      productivity: "Productivity         ",
      surgical_impact: "Surgical workflow    ",
      patient_flow: "Patient LOS          ",
      waste_reduction: "Waste reduction      ",
      workforce: "Workforce            ",
      infrastructure: "Infrastructure       ",
      risk_compliance: "Risk & compliance    ",
      strategic: "Strategic            ",
      hub_spoke_logistics: "Hub & spoke logistics",
      subspecialty_routing: "Subspecialty routing ",
      commercial_growth: "Commercial growth    ",
      consult_revenue_scale: "Consult scale        ",
      data_monetization: "Data monetization    ",
    }[k] || k).trim(),
    value: v,
    fmt: fc(v),
  }));
  code(asciiBar(bars, 38));

  // Year by year projection.
  h3("Year-by-year projection");
  lines.push("| Year | Investment | Savings | Net | Cumulative |");
  lines.push("|---|---|---|---|---|");
  r.years.forEach(y => {
    lines.push(`| ${y.year} | ${fc(y.investment)} | ${fc(y.savings)} | ${fc(y.net)} | ${fc(y.cumulative)} |`);
  });
  lines.push("");

  // Sensitivity tornado.
  h3("Sensitivity analysis (±20% on key inputs)");
  const sens = (r.sensitivity || []).slice(0, 8);
  lines.push("| Input | −20% NPV delta | +20% NPV delta | Magnitude |");
  lines.push("|---|---|---|---|");
  sens.forEach(s => {
    lines.push(`| ${s.label} | ${fc(s.delta_dn)} | ${fc(s.delta_up)} | ${fc(s.magnitude)} |`);
  });
  lines.push("");

  h3("Tornado (ASCII)");
  const torn = sens.map(s => ({ label: s.label.slice(0, 36), up: s.delta_up, dn: s.delta_dn }));
  code(asciiTornado(torn, 26));

  hr();
}

// ============================================================================
// PART IX — APPENDICES
// ============================================================================
h1("Part IX — Appendices");

h2("A. Ledger entry shape");
p("Every value in Turoi — default, user-entered, or AI-adjusted — is stored as a ledger entry with this shape:");
code(`{
  id: "pathologist_salary_annual",
  label: "Pathologist salary (annual)",
  value: 1800000,
  unit: "currency",
  category: "operational",
  domain: "productivity",
  source: "region_default" | "user_input" | "claude_adjusted",
  source_detail: "7th CPC Level 13A midpoint",
  user_modified: false,
  claude_modified: false,
  claude_reasoning: null,
  original_value: null,
  evidence_basis: "Level 13A monthly gross ₹1.31L–2.17L under 7th CPC",
  confidence: "medium",
  verification_status: "unreviewed" | "verified" | "disputed" | "not_applicable",
  notes: "",
  citation_id: "cpc7_india"
}`);

h2("B. Audit log entry shape");
p("Every AI-analyst call — success or failure — is recorded to `state.claude_audit_log`. API keys are redacted. The log is exportable alongside the ledger.");
code(`{
  call: "preEstimationReview",
  timestamp: "2026-04-11T10:34:22.194Z",
  status: "ok" | "error",
  code: 200,
  model: "claude-sonnet-4-20250514",
  tokens_in: 1903,
  tokens_out: 1353,
  prompt_excerpt: "...",       // first 2000 chars, redacted
  response_excerpt: "...",     // first 2000 chars
  error: null
}`);

h2("C. PDF export layout");
bullet([
  "Cover — Turoi wordmark, institution name, date",
  "Executive summary — audience-tailored via `pdfExecutiveSummary()`",
  "Institution profile — region, type, volume, staffing",
  "Financial projection — J-curve + waterfall + key metrics",
  "Value pillar deep-dives — one page per material pillar with narrative, calculation, citations",
  "Sensitivity analysis — tornado + narrative",
  "Implementation roadmap — from the AI analyst",
  "Assumptions appendix — full ledger as a table, grouped by domain",
  "References — from the evidence library",
  "Disclaimer",
]);
p("Separate export: `assumptions_ledger.csv` — structured ledger for reviewer markup. Separate export: AI-analyst audit log — prompt/response pairs for reproducibility.");

h2("D. Known limitations");
bullet([
  "Defaults for some regions (Middle East, SEA, Africa, LatAm) are thinner than India/US/UK/EU and will be strengthened in the research workstream.",
  "Workforce sustainability pillar is fragile in settings where the replacement market for pathologists does not exist — the cost is not 'recruit a replacement' but 'the role stays empty'. The AI analyst flags this in applicable contexts.",
  "Data monetization pillar for national chains is high-uncertainty and subject to DPDP Act (India), GDPR (EU), HIPAA (US) constraints. Defaults are conservative.",
  "Monte Carlo uncertainty bands use triangular sampling with confidence-scaled spreads (±10/20/35%). This does not capture correlations between inputs.",
  "Productivity ramp presets are currently fixed at 25/60/100%. A future version may expose aggressive/moderate/conservative presets based on evidence tier.",
]);

h2("E. How to regenerate this document");
code("node research/generate_dossier.cjs");
p("The generator reads `index.html` at runtime and reflects the live state of the product. Regenerate after any meaningful change to REGIONS, EVIDENCE, WIZARD_SECTIONS, pillar formulas, or fixture definitions.");

// ---------- Write file ----------
const out = lines.join("\n");
const outPath = path.join(__dirname, "turoi_full_dossier.md");
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath}`);
console.log(`  ${out.split("\n").length} lines, ${out.length} chars`);
