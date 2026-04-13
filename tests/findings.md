# Turoi Test Findings

Running log of findings from the 20-case test pass. "Finding" is used neutrally — each entry may turn out to be a calculator bug, a calibration issue, a documentation gap, or a feature request. The user decides which to act on before the comparative and docx passes.

Format: each finding has an ID, the fixture(s) that surfaced it, a one-line summary, the evidence, the plan-tag (calculator / defaults / attribution / scope / research-debt), and a suggested resolution.

---

## F-01 — US Academic `patient_flow` dominates NPV ~50× vs published anchor

**Fixtures:** TA-1 (us/academic_medical_center, no overrides)

**Summary:** Turoi's US academic defaults produce 5-yr NPV **$68.2M**, dominated by a **$55.2M `patient_flow` contribution (65% of total savings)**. Published anchor Hanna 2019 projects $1.3M/5yr from digital pathology adoption. The envelope fail is structural, not noise.

**Evidence (verbatim from `tests/results/TA-1.json`):**
- `npv: 68,175,466`
- `pillarTotals.patient_flow: 55,156,906`
- `pillarTotals.surgical_impact: 9,390,774`
- `pillarTotals.productivity: 8,941,224`
- Observed dominant pillars (top 3): `patient_flow, surgical_impact, productivity`
- Expected dominant pillars (literature-anchored): `surgical_impact, productivity, waste_reduction`
- Payback year observed: 1. Matias-Guiu 2025 anchor: Y3. Hanna 2019: not explicitly modeled, but 5-yr cumulative benefits suggest Y2–Y3 payback at earliest.

**Root cause trace:**
`pillar_patient_flow(ramp)` (`index.html:3082`) = `affected_los_cases_year × los_days_saved_per_case × bed_cost_per_day × ramp`. US academic defaults (`index.html:1197–1199`):
- `affected_los_cases_year: 9500`
- `los_days_saved_per_case: 0.5`
- `bed_cost_per_day: 2800`
- Year 1 ramp 0.25 → 9500 × 0.5 × 2800 × 0.25 = $3,325,000 ✓ matches output
- 5-yr aggregate ≈ $55M ✓

The arithmetic is correct. The issue is that these input defaults have no evidence base:
- Hanna 2019 documents 1-day TAT reduction for *surgical resection cases with prior WSIs*, not a 0.5-day LOS reduction for 9500 cases/yr.
- `research/assumptions_registry.md` explicitly flags `bed_cost_per_day` as "TODO — needs ≥2 anatomic-pathology-specific TAT-to-LOS studies (Blick 2010 is emergency medicine, not appropriate)".
- `turopath-roi-calculator-agent-context.md` line 166 states: *"This value accrues to the hospital, not the pathology department — illustrating the attribution problem."*

So the calculator is (a) attributing hospital-level LOS savings to pathology-department P&L and (b) using volume/days/cost assumptions that are unvalidated.

**Plan-tag:** `defaults` + `attribution` + `research-debt`

**Suggested resolution options (user chooses):**
1. **Lower the defaults.** `affected_los_cases_year` → ~1500 (surgical resection subset), `los_days_saved_per_case` → 0.2–0.3 (Hanna 2019 style), `bed_cost_per_day` → keep but verify. Expected impact: patient_flow drops from $55M → ~$6–10M, NPV falls into the $12–18M range.
2. **Gate patient_flow behind an explicit attribution mode.** When `attribution_mode === "hospital"` but the user's scorecard is pathology-dept P&L (detected via Claude pre-review or a new wizard toggle), suppress the pillar and note it as hospital-level value captured separately.
3. **Keep defaults but surface an explicit "hospital-captured" bucket in the dashboard.** Show NPV-as-pathology-dept ($13M) and NPV-as-hospital ($68M) side by side. This is probably the most defensible for a scientific-venture framing.
4. **Do nothing, document louder.** The pillar is real value, the attribution problem is documented in the context doc, and a savvy CFO will discount it. The test report explicitly flags this as "user must read the attribution section."

**Recommendation (preliminary — user to confirm):** (3) is the most defensible because it preserves value completeness while separating the claim surface. It matches the context doc's "attribution problem" framing and avoids silently underselling digital pathology's real hospital-level impact. But (3) requires calculator surgery; (1) is the cheapest and also defensible.

---
