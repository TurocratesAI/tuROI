/*
 * Turoi test runner. Drives index.html via Playwright headless, seeds
 * state.ledger per fixture, runs calculate(), writes JSON results.
 *
 * Usage:
 *   node tests/harness/run.mjs                 # run all fixtures
 *   node tests/harness/run.mjs --fixture TA-1  # run one
 *   node tests/harness/run.mjs --list          # list fixtures
 */

import { chromium } from "playwright";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const INDEX_URL = pathToFileURL(join(REPO_ROOT, "index.html")).href + "?dev=1";
const FIXTURE_DIR = join(REPO_ROOT, "tests", "fixtures");
const RESULT_DIR = join(REPO_ROOT, "tests", "results");

function parseArgs(argv) {
  const args = { fixture: null, list: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--fixture") args.fixture = argv[++i];
    else if (argv[i] === "--list") args.list = true;
  }
  return args;
}

async function loadFixtures(filter) {
  const files = (await readdir(FIXTURE_DIR)).filter(f => f.endsWith(".json")).sort();
  const out = [];
  for (const f of files) {
    const id = f.replace(/\.json$/, "");
    if (filter && id !== filter) continue;
    const raw = await readFile(join(FIXTURE_DIR, f), "utf8");
    out.push({ id, ...JSON.parse(raw) });
  }
  return out;
}

/*
 * Injected into the page before any script runs.
 * Two jobs: (1) clear localStorage so seeded state is pristine,
 * (2) replace Math.random with a seeded mulberry32 so monteCarloNPV
 * is deterministic across runs.
 */
function initScript() {
  try { window.localStorage.clear(); } catch (e) { /* file:// may block */ }
  let a = 0x42c0ffee >>> 0;
  Math.random = function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function runFixture(page, fixture) {
  // Route-block external CDN scripts (chart.js, jspdf, html2canvas).
  // calculate() needs none of them; blocking keeps the harness offline-safe
  // and fast.
  // Note: route is set at context level in main(), not per-fixture.

  // Fresh page load per fixture so state.ledger starts empty.
  await page.goto(INDEX_URL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.Turoi && window.Turoi.state && typeof window.calculate === "function" && typeof window.seedLedgerFromProfile === "function",
    { timeout: 10000 }
  );

  const result = await page.evaluate((fix) => {
    try {
      // Dev-mode exposes state and ledger helpers under window.Turoi
      // (top-level `const` in a classic script is not on `window`).
      const T = window.Turoi;

      // Clean slate
      if (typeof window.resetSession === "function") window.resetSession();
      T.state.ledger = [];
      T.state.region = fix.region;
      T.state.sub_profile = fix.profile;
      T.state.institution_description = fix.description || `Test fixture: ${fix.id}`;

      // Seed profile defaults
      window.seedLedgerFromProfile(fix.region, fix.profile);

      // Apply per-fixture overrides
      if (fix.overrides) {
        for (const [id, value] of Object.entries(fix.overrides)) {
          T.ledger.setUserValue(id, value, id, "override", "operational");
        }
      }

      // Run calculate
      const out = window.calculate();
      if (!out) return { ok: false, error: "calculate() returned null" };

      // Serialize — drop large arrays we don't need for sanity checks.
      return {
        ok: true,
        profile_type: out.profile_type,
        attribution_mode: out.attribution_mode,
        horizon: out.horizon,
        discount: out.discount,
        capex: out.capex,
        opexY1: out.opexY1,
        npv: out.npv,
        paybackYear: out.paybackYear,
        roiPct: out.roiPct,
        totalSavings: out.totalSavings,
        totalCost: out.totalCost,
        costPerCase: out.costPerCase,
        productivityHoursPerYear: out.productivityHoursPerYear,
        pillarTotals: out.pillarTotals,
        years: out.years.map(y => ({
          year: y.year,
          investment: y.investment,
          savings: y.savings,
          net: y.net,
          cumulative: y.cumulative,
          pillars: y.pillars,
        })),
        sensitivity_top5: (out.sensitivity && out.sensitivity.slice ? out.sensitivity.slice(0, 5) : null),
        mc: out.mc ? { p5: out.mc.p5, p50: out.mc.p50, p95: out.mc.p95, samples: out.mc.samples } : null,
        ledger_size: T.state.ledger.length,
      };
    } catch (e) {
      return { ok: false, error: String(e && e.stack || e) };
    }
  }, fixture);

  return result;
}

/*
 * Sanity heuristics. Run against a raw result; return array of
 * { ok, rule, detail } records.
 */
function sanityChecks(r, fixture) {
  const checks = [];
  const push = (ok, rule, detail) => checks.push({ ok, rule, detail });

  if (!r || !r.ok) {
    push(false, "execution", r && r.error || "no result");
    return checks;
  }

  // NPV should not exceed 3x total savings (otherwise we're inventing money)
  push(
    r.npv == null || Math.abs(r.npv) <= 3 * Math.abs(r.totalSavings || 1),
    "npv_bounded_by_savings",
    `npv=${r.npv}, totalSavings=${r.totalSavings}`
  );

  // Payback year must be <= horizon or null
  push(
    r.paybackYear == null || r.paybackYear <= r.horizon,
    "payback_within_horizon",
    `paybackYear=${r.paybackYear}, horizon=${r.horizon}`
  );

  // Conservation: pillar totals should equal sum over years, within 1%
  if (r.pillarTotals && r.years) {
    const pillarSum = Object.values(r.pillarTotals).reduce((a, b) => a + b, 0);
    const yearSum = r.years.slice(1).reduce((a, y) => a + (y.savings || 0), 0);
    const ok = Math.abs(pillarSum - yearSum) <= Math.abs(yearSum) * 0.01 + 1;
    push(ok, "pillar_year_conservation", `pillarSum=${pillarSum}, yearSum=${yearSum}`);
  }

  // Diagnostic-lab profiles must have zero patient_flow and surgical_impact
  if (r.profile_type === "diagnostic_lab") {
    push(
      (r.pillarTotals.patient_flow || 0) === 0,
      "diaglab_no_patient_flow",
      `patient_flow=${r.pillarTotals.patient_flow}`
    );
    push(
      (r.pillarTotals.surgical_impact || 0) === 0,
      "diaglab_no_surgical_impact",
      `surgical_impact=${r.pillarTotals.surgical_impact}`
    );
  }

  // data_monetization must be zero for non-chain profiles
  const isChain = fixture.profile && /chain|reference/i.test(fixture.profile);
  if (!isChain) {
    push(
      (r.pillarTotals.data_monetization || 0) === 0,
      "nonchain_no_data_monetization",
      `data_monetization=${r.pillarTotals.data_monetization}, profile=${fixture.profile}`
    );
  }

  // If fixture declares explicit zero_pillars, enforce them
  if (fixture.expected && fixture.expected.zero_pillars) {
    for (const pk of fixture.expected.zero_pillars) {
      push(
        (r.pillarTotals[pk] || 0) === 0,
        `explicit_zero_${pk}`,
        `${pk}=${r.pillarTotals[pk]}`
      );
    }
  }

  // NPV envelope (literature-anchored expected range)
  if (fixture.expected && fixture.expected.npv_min != null) {
    const { npv_min, npv_max } = fixture.expected;
    push(
      r.npv >= npv_min && r.npv <= npv_max,
      "npv_within_envelope",
      `npv=${r.npv.toExponential(3)}, envelope=[${npv_min}, ${npv_max}]`
    );
  }

  // Payback year envelope
  if (fixture.expected && fixture.expected.payback_year_min != null) {
    const { payback_year_min, payback_year_max } = fixture.expected;
    const pb = r.paybackYear;
    push(
      pb != null && pb >= payback_year_min && pb <= payback_year_max,
      "payback_within_envelope",
      `paybackYear=${pb}, envelope=[${payback_year_min}, ${payback_year_max}]`
    );
  }

  // Dominant pillars (top 3 by magnitude in expected order)
  if (fixture.expected && fixture.expected.dominant_pillars) {
    const observed = Object.entries(r.pillarTotals || {})
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 3)
      .map(([k]) => k);
    const expected = fixture.expected.dominant_pillars;
    const ok = expected.length === observed.length && expected.every((p, i) => p === observed[i]);
    push(
      ok,
      "dominant_pillars_match",
      `observed=[${observed.join(", ")}], expected=[${expected.join(", ")}]`
    );
  }

  return checks;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!existsSync(RESULT_DIR)) await mkdir(RESULT_DIR, { recursive: true });

  const fixtures = await loadFixtures(args.fixture);
  if (args.list) {
    console.log("Available fixtures:");
    for (const f of fixtures) console.log(`  ${f.id}  —  ${f.region}/${f.profile}`);
    process.exit(0);
  }
  if (!fixtures.length) {
    console.error(args.fixture ? `Fixture not found: ${args.fixture}` : "No fixtures found");
    process.exit(1);
  }

  const browser = await chromium.launch();

  let pass = 0, fail = 0;
  const summary = [];

  for (const fixture of fixtures) {
    const label = `${fixture.id} (${fixture.region}/${fixture.profile})`;
    process.stdout.write(`→ ${label} ... `);
    // Fresh context + page per fixture so no state leaks between runs.
    const context = await browser.newContext();
    await context.route("**/cdn.jsdelivr.net/**", route => route.fulfill({ status: 204, body: "" }));
    await context.addInitScript(initScript);
    const page = await context.newPage();
    page.on("pageerror", err => console.error(`[page error] ${err.message}`));
    page.on("console", msg => {
      if (msg.type() === "error") console.error(`[page console.error] ${msg.text()}`);
    });
    try {
      const result = await runFixture(page, fixture);
      const checks = sanityChecks(result, fixture);
      const allOk = result.ok && checks.every(c => c.ok);
      await writeFile(join(RESULT_DIR, `${fixture.id}.json`), JSON.stringify({ fixture, result, checks }, null, 2));
      if (allOk) {
        pass++;
        console.log("PASS");
      } else {
        fail++;
        console.log("FAIL");
        for (const c of checks.filter(c => !c.ok)) {
          console.log(`    ${c.rule}: ${c.detail}`);
        }
        if (!result.ok) console.log(`    error: ${result.error}`);
      }
      summary.push({ id: fixture.id, ok: allOk, npv: result.npv, paybackYear: result.paybackYear });
    } catch (e) {
      fail++;
      console.log(`ERROR: ${e.message}`);
    } finally {
      await context.close().catch(() => {});
    }
  }

  await browser.close();

  console.log(`\n${pass} pass, ${fail} fail, ${pass + fail} total`);
  await writeFile(join(RESULT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
