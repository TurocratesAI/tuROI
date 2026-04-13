#!/usr/bin/env node
/*
 * Turoi — Claude integration live test harness.
 *
 * Evaluates the Turoi app in a stubbed browser context, seeds a known fixture,
 * runs the calculator, and then invokes each of the 7 Claude integration points
 * against a REAL Anthropic API. Records per-call timing, HTTP status, parse
 * result, and response excerpt.
 *
 * Requires ANTHROPIC_API_KEY in env. Never writes the key to the report.
 *
 * Usage: ANTHROPIC_API_KEY=sk-ant-... node research/claude_test_runner.cjs
 */

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY || API_KEY.length < 10) {
  console.error("ERROR: ANTHROPIC_API_KEY not set in env.");
  process.exit(1);
}

// ----- Load and evaluate the app -----
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("Could not find <script> block in index.html");
  process.exit(1);
}
const js = scriptMatch[1];

// ----- Browser stubs (mirrors test_runner.cjs) -----
const listeners = {};
const stubEl = () => ({
  style: {},
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  appendChild() {}, removeChild() {}, insertBefore() {}, remove() {},
  setAttribute() {}, getAttribute() { return null; },
  addEventListener() {}, removeEventListener() {},
  querySelector() { return stubEl(); },
  querySelectorAll() { return []; },
  innerHTML: "", textContent: "", value: "",
  dataset: {}, children: [], parentNode: null,
  focus() {}, click() {}, scrollIntoView() {},
});
global.localStorage = {
  _s: {},
  getItem(k) { return this._s[k] || null; },
  setItem(k, v) { this._s[k] = v; },
  removeItem(k) { delete this._s[k]; },
};
global.document = {
  getElementById: () => stubEl(),
  querySelector: () => stubEl(),
  querySelectorAll: () => [],
  createElement: () => stubEl(),
  body: stubEl(),
  head: stubEl(),
  addEventListener(ev, cb) { listeners[ev] = cb; },
  readyState: "complete",
};
global.location = { search: "?dev=1", hash: "", href: "" };
global.window = {
  Turoi: null,
  location: global.location,
  addEventListener() {},
  scrollTo() {},
  innerWidth: 1200,
  innerHeight: 800,
};
// Use node's native fetch (Node 18+) — DO NOT stub
global.Chart = function () { return { destroy() {}, update() {}, data: {} }; };
global.Chart.register = () => {};

try {
  eval(js);
} catch (e) {
  console.error("EVAL ERROR:", e.message);
  console.error(e.stack);
  process.exit(1);
}
if (listeners.DOMContentLoaded) {
  try { listeners.DOMContentLoaded(); } catch (e) { console.error("BOOT ERROR:", e.message); }
}
const T = global.window.Turoi;
if (!T) { console.error("Turoi dev handle not exposed."); process.exit(1); }

// ----- Seed a known fixture: India government medical college -----
// The calculator + Claude prompts both need a fully-populated state.
T.state.ledger = [];
T.state.region = "india";
T.state.sub_profile = "government_medical_college";
T.state.institution_description =
  "450-bed tertiary government teaching hospital in a state capital. " +
  "~180k slides/year across histopathology and cytology. 12 faculty pathologists " +
  "under 7th CPC Level 13A. Scanner procurement would go through the GeM portal. " +
  "Reimbursement is CGHS/state insurance + out-of-pocket.";
T.seedLedgerFromProfile("india", "government_medical_college");
T.state.api_key = API_KEY;
T.state.audience = "government_administrator";
T.state.results = T.calculate();
console.log("Seeded. NPV baseline:", T.state.results.npv.toFixed(0));

// ----- Helper: time a Claude call and record outcome -----
async function testCall(name, invoke) {
  const t0 = Date.now();
  let result, error;
  try {
    result = await invoke();
  } catch (e) {
    error = e;
  }
  const elapsed = Date.now() - t0;
  // Pull the latest audit log entry for this call
  const auditLog = T.state.claude_audit_log || [];
  const latest = auditLog.filter(a => a.call && a.call.startsWith(name)).slice(-1)[0];
  return {
    name,
    elapsed_ms: elapsed,
    result,
    error: error ? String(error) : null,
    audit: latest || null,
  };
}

// ----- Run the 7 integration points in sequence -----
(async () => {
  const results = [];

  console.log("\n[1/7] refineRegion…");
  results.push(await testCall("refineRegion", () => T.refineRegion ? T.refineRegion() : invokeByName("refineRegion")));

  console.log("[2/7] preEstimationReview…");
  results.push(await testCall("preEstimationReview", () => invokeByName("preEstimationReview")));

  console.log("[3/7] dashboardInsight…");
  results.push(await testCall("dashboardInsight", () => invokeByName("dashboardInsight")));

  console.log("[4/7] dynamicPillarNarrative(patient_flow)…");
  results.push(await testCall("dynamicPillarNarrative:patient_flow", () => invokeByName("dynamicPillarNarrative", "patient_flow")));

  console.log("[5/7] whatIfChat…");
  // Push a fake prior conversation state since whatIfChat reads chat_history
  T.state.chat_history = [];
  results.push(await testCall("whatIfChat", () => invokeByName("whatIfChat", "What happens to NPV if scanner cost drops 30% due to tender negotiation?")));

  console.log("[6/7] strengthenCase…");
  results.push(await testCall("strengthenCase", () => invokeByName("strengthenCase")));

  console.log("[7/7] pdfExecutiveSummary…");
  results.push(await testCall("pdfExecutiveSummary", () => invokeByName("pdfExecutiveSummary")));

  writeReport(results);
})().catch(e => {
  console.error("FATAL:", e);
  process.exit(1);
});

// ----- Invoke a function by name from the evaluated script scope -----
// The functions are defined at the top level of the eval'd script, so they're
// not automatically attached to `T`. We need to find them via the audit log
// OR we can directly invoke by name using eval.
function invokeByName(fnName, arg) {
  // Since the script was eval'd at module scope, the function names exist as
  // local vars inside that eval. We can access them through a second eval that
  // reuses the same scope. However, node eval creates a separate scope per call.
  // Workaround: attach every Claude integration fn onto window.Turoi so we can
  // call them from here. We patch T at boot-time by eval'ing an attachment.
  if (T[fnName]) return arg !== undefined ? T[fnName](arg) : T[fnName]();
  throw new Error("Function not exposed on T: " + fnName);
}

function writeReport(results) {
  const lines = [];
  lines.push("# Turoi — Claude Integration Live Test Results");
  lines.push("");
  lines.push(`_Generated by \`research/claude_test_runner.cjs\` against real Anthropic API._`);
  lines.push("");
  lines.push(`**Fixture:** India Government Medical College (180k slides, 12 FTE)`);
  lines.push(`**Audience:** government_administrator`);
  lines.push(`**Baseline NPV:** ₹${Math.round(T.state.results.npv).toLocaleString("en-IN")}`);
  lines.push("");
  const okCount = results.filter(r => r.audit && r.audit.status === "ok").length;
  const errCount = results.filter(r => !r.audit || r.audit.status !== "ok").length;
  lines.push(`**Calls run:** ${results.length}`);
  lines.push(`**Successful:** ${okCount}`);
  lines.push(`**Failed:** ${errCount}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const r of results) {
    lines.push(`## ${r.name}`);
    lines.push("");
    lines.push(`- **Elapsed:** ${r.elapsed_ms} ms`);
    if (r.error) lines.push(`- **JS error:** \`${r.error}\``);
    if (r.audit) {
      lines.push(`- **Audit status:** \`${r.audit.status}\``);
      if (r.audit.code) lines.push(`- **HTTP code:** ${r.audit.code}`);
      if (r.audit.tokens_in) lines.push(`- **Tokens in:** ${r.audit.tokens_in}`);
      if (r.audit.tokens_out) lines.push(`- **Tokens out:** ${r.audit.tokens_out}`);
      if (r.audit.model) lines.push(`- **Model:** \`${r.audit.model}\``);
      if (r.audit.error) {
        lines.push("");
        lines.push("**Error detail:**");
        lines.push("```");
        lines.push(r.audit.error.slice(0, 800));
        lines.push("```");
      }
      if (r.audit.response_excerpt) {
        lines.push("");
        lines.push("**Response excerpt (first 2000 chars):**");
        lines.push("```");
        lines.push(r.audit.response_excerpt);
        lines.push("```");
      }
    } else {
      lines.push("- **Audit:** no audit entry captured");
    }

    // Parsed-result inspection
    if (r.result) {
      if (typeof r.result === "string") {
        lines.push("");
        lines.push("**Return value (string, first 400 chars):**");
        lines.push("```");
        lines.push(r.result.slice(0, 400));
        lines.push("```");
      } else if (typeof r.result === "object") {
        try {
          lines.push("");
          lines.push("**Return value (object):**");
          lines.push("```json");
          lines.push(JSON.stringify(r.result, null, 2).slice(0, 1200));
          lines.push("```");
        } catch {}
      }
    }

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // Post-state inspection
  lines.push("## Post-test state inspection");
  lines.push("");
  lines.push(`- **claude_findings recorded:** ${(T.state.claude_findings || []).length}`);
  lines.push(`- **dashboard_insight cached:** ${T.state.dashboard_insight ? "yes" : "no"}`);
  lines.push(`- **claude_narrative_cache entries:** ${Object.keys(T.state.claude_narrative_cache || {}).length}`);
  lines.push(`- **chat_history turns:** ${(T.state.chat_history || []).length}`);
  lines.push(`- **audit_log entries:** ${(T.state.claude_audit_log || []).length}`);
  lines.push(`- **ledger claude_modified entries:** ${T.state.ledger.filter(e => e.claude_modified).length}`);
  lines.push("");

  const out = lines.join("\n");
  fs.writeFileSync(path.join(__dirname, "claude_test_results.md"), out);
  console.log(`\nWrote research/claude_test_results.md`);
  console.log(`Calls: ${results.length} | ok: ${okCount} | failed: ${errCount}`);
}
