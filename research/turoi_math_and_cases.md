# Turoi — Calculator Mathematics & Case Studies

**Turocrates AI Private Limited**

---

## 1. Investment Model

### Capital expenditure (Year 0)

| Component | Formula |
|---|---|
| Scanner cost | scanner\_cost × scanner\_count |
| Workstation cost | workstation\_cost × workstation\_count |
| Implementation | implementation\_cost |
| Validation | validation\_cost |
| Training | training\_cost\_per\_fte × (pathologist\_fte + histotech\_fte) |
| **Total capex** | **Sum of above** |

### Operating expenditure (Year 1+, inflation-adjusted)

| Component | Formula |
|---|---|
| IMS license | ims\_license\_annual |
| IMS support & AMC | ims\_support\_annual |
| Storage | storage\_cost\_per\_tb\_year × storage\_growth\_tb\_year |
| Cloud egress | egress\_cost\_annual |
| **Opex(Y)** | **opexY1 × (1 + inflation)^(Y−1)** |

---

## 2. Value Pillar Formulas

All pillars are multiplied by a **productivity ramp**: Y1 = 25%, Y2 = 60%, Y3+ = 100%. Each year's pillar values are further multiplied by an **inflation factor**: (1 + inflation\_rate)^(Y−1).

### Hospital pillars (institution types 1–3)

| Pillar | Formula |
|---|---|
| **Slide movement** | (courier\_cost\_annual × 0.55 + retrieval\_hours/week × 52 × histotech\_hourly × 0.5 + lost\_slides/yr × lost\_cost) × ramp |
| **Productivity** | pathologist\_fte × (1800 hrs × 0.40 gain × 0.50 monetizable) × (salary / 1800) × ramp |
| **Surgical impact** | frozen\_section\_volume × min\_saved × OR\_cost\_per\_min × ramp |
| **Patient flow (LOS)** | affected\_LOS\_cases × days\_saved × bed\_cost\_per\_day × ramp |
| **Waste reduction** | (IHC\_cost × IHC\_avoided + recut\_cost × recuts\_avoided + lost\_cost × lost\_slides) × ramp |
| **Workforce** | burnout\_risk × cost\_per\_event × pathologist\_fte × 0.25 (probability) × ramp |
| **Infrastructure** | sqft\_freed × rent\_per\_sqft × ramp |
| **Risk & compliance** | legal\_requests × cost\_delta\_per\_request × ramp |
| **Strategic** | consult\_revenue\_per\_case × consults\_received × 0.15 (capture fraction) × ramp |

### Diagnostic-lab pillars (institution types 4–6)

| Pillar | Formula |
|---|---|
| **Hub & spoke logistics** | (inter\_site\_runs/week × 52 × 0.85 × cost\_per\_run + loss\_rate × cases × lost\_cost) × ramp |
| **Subspecialty routing** | external\_consults × retained\_pct × (external\_cost − internal\_cost) × ramp |
| **Commercial growth** | [(new\_referrers\_digital − baseline) × vol\_per\_referrer × margin + retention\_uplift × existing\_referrers × vol × margin] × ramp |
| **Consult revenue scale** | consults\_received × growth\_pct × price\_per\_case × ramp |
| **Data monetization** | (dataset\_TB × value\_per\_TB × 0.05 + partnership\_NPV × 0.20) × ramp |

Diagnostic-lab profiles also retain: slide movement, productivity, waste reduction, infrastructure, and risk & compliance. They do **not** model surgical impact or patient LOS (both zeroed).

---

## 3. Aggregate Metrics

| Metric | Formula |
|---|---|
| **NPV** | −capex + Σ(Y=1..H) net(Y) / (1 + discount)^Y |
| **ROI %** | (total\_savings − total\_cost) / total\_cost × 100 |
| **Payback year** | First Y where cumulative net ≥ 0 |
| **Cost per case** | total\_cost / (annual\_cases × horizon) |
| **Productivity hours/yr** | pathologist\_fte × 1800 × 0.40 × 0.50 |

### Sensitivity analysis

Each key input is varied ±20%. The NPV is recomputed at each perturbation. Results are ranked by magnitude of NPV impact (tornado chart).

**Hospital inputs tested:** slide volume, pathologist salary, scanner cost, ramp Y3, storage growth, OR cost/min, bed cost/day, discount rate.

**Diagnostic-lab inputs tested:** slide volume, pathologist salary, scanner cost, ramp Y3, storage growth, inter-site courier cost, consult price/case, new referrers/yr, discount rate.

### Monte Carlo confidence band

2,000 Monte Carlo samples. Each input is perturbed using triangular distribution: high-confidence ±10%, medium ±20%, low ±35%. The 5th and 95th percentile NPV values form the reported 90% confidence interval.

---

## 4. Case Study Results (20 cases)

### India — Hospital profiles

| Case | Profile | Slides/yr | Path FTE | Capex | Opex Y1 | NPV (5yr) | 90% CI | Payback | ROI % | Top pillar |
|---|---|---|---|---|---|---|---|---|---|---|
| IN-GOV-T1 | Govt medical college (Tier 1) | 180k | 18 | ₹23.4M | ₹2.2M | ₹112.1M | ₹89.0M–₹135.9M | Y2 | 436% | Patient flow |
| IN-GOV-T2 | Govt medical college (Tier 2) | 80k | 10 | ₹14.6M | ₹1.6M | ₹39.4M | ₹30.6M–₹48.8M | Y2 | 274% | Patient flow |
| IN-GOV-T3 | District hospital (LMIC) | 25k | 3 | ₹9.7M | ₹1.0M | ₹8.5M | ₹5.5M–₹11.8M | Y3 | 108% | Productivity |
| IN-GOV-SHARED | Shared scanner (4 hospitals) | 25k | 3 | ₹3.8M | ₹1.0M | ₹13.8M | ₹10.5M–₹17.3M | Y1 | 282% | Patient flow |
| IN-GOV-DONOR | Donor-funded scanner | 25k | 3 | ₹1.5M | ₹1.0M | ₹16.2M | ₹12.8M–₹19.8M | Y1 | 460% | Patient flow |
| IN-ACAD-PRIV | Academic private | 280k | 25 | ₹21.2M | ₹3.0M | ₹173.1M | ₹139.2M–₹210.8M | Y1 | 480% | Patient flow |
| IN-CORP | Corporate hospital chain | 130k | 12 | ₹14.7M | ₹2.2M | ₹65.8M | ₹50.3M–₹81.8M | Y2 | 361% | Patient flow |

### India — Diagnostic-lab profiles

| Case | Profile | Slides/yr | Path FTE | Sites | Capex | Opex Y1 | NPV (5yr) | 90% CI | Payback | ROI % | Top pillar |
|---|---|---|---|---|---|---|---|---|---|---|---|
| IN-STANDALONE | Standalone lab | 42k | 3 | 1 | ₹12.1M | ₹1.2M | ₹3.2M | ₹0.2M–₹6.5M | Y4 | 37% | Productivity |
| IN-CHAIN-HYPER | Hyperlocal chain | 180k | 10 | 12 | ₹23.4M | ₹2.8M | ₹140.6M | ₹108.5M–₹174.2M | Y2 | 377% | Hub & spoke logistics |
| IN-CHAIN-NATL | National chain | 1.2M | 80 | 120 | ₹145.5M | ₹15.7M | ₹1,038M | ₹811M–₹1,281M | Y2 | 445% | Hub & spoke logistics |
| IN-CHAIN-MEGA | National chain (stress) | 3M | 140 | 240 | ₹281.1M | ₹30.3M | ₹2,564M | ₹2,001M–₹3,163M | Y2 | 472% | Hub & spoke logistics |

### US profiles

| Case | Profile | Slides/yr | Path FTE | Capex | Opex Y1 | NPV (5yr) | 90% CI | Payback | ROI % | Top pillar |
|---|---|---|---|---|---|---|---|---|---|---|
| US-AMC-MID | Academic medical center | 150k | 15 | $1.9M | $0.2M | $67.5M | $53.5M–$82.3M | Y2 | 2,316% | Patient flow |
| US-AMC-MEGA | Academic (top-tier) | 420k | 35 | $3.5M | $0.3M | $200.5M | $160.2M–$243.8M | Y1 | 3,501% | Patient flow |
| US-COMM | Community hospital | 60k | 6 | $1.2M | $0.1M | $21.1M | $16.0M–$26.4M | Y2 | 1,285% | Patient flow |
| US-STANDALONE | Specialty standalone lab | 90k | 7 | $1.0M | $0.1M | $6.2M | $4.3M–$8.3M | Y2 | 479% | Productivity |
| US-NATL-REF | National reference lab | 2M | 120 | $18.5M | $2.0M | $537.2M | $428.4M–$652.0M | Y1 | 1,889% | Hub & spoke logistics |

### UK, EU, Middle East

| Case | Profile | Slides/yr | Path FTE | Capex | Opex Y1 | NPV (5yr) | 90% CI | Payback | ROI % | Top pillar |
|---|---|---|---|---|---|---|---|---|---|---|
| UK-NHS-MID | NHS Trust | 120k | 10 | £1.1M | £0.1M | £6.3M | £4.7M–£7.9M | Y2 | 456% | Patient flow |
| EU-ACAD | Public university hospital | 160k | 14 | €1.4M | €0.2M | €19.9M | €15.4M–€24.7M | Y2 | 962% | Patient flow |
| ME-PUBLIC | Public hospital | 100k | 8 | $1.3M | $0.1M | $21.2M | $16.5M–$26.2M | Y2 | 1,204% | Patient flow |

### Edge case

| Case | Profile | Slides/yr | Path FTE | Capex | Opex Y1 | NPV (5yr) | 90% CI | Payback | ROI % | Top pillar |
|---|---|---|---|---|---|---|---|---|---|---|
| EDGE-TINY | Single pathologist practice | 10k | 1 | ₹9.5M | ₹0.7M | −₹1.2M | −₹3.8M–₹1.6M | Beyond | −16% | Productivity |

---

## 5. Key Findings

1. **Patient flow dominates hospital profiles.** LOS-attributed bed-day savings are the single largest value driver in every hospital case. This is consistent with published literature but carries a known attribution limitation — savings accrue to the hospital, not the pathology department.

2. **Hub & spoke logistics dominates diagnostic chains.** For hyperlocal and national chains, inter-site courier elimination produces 40–60% of total savings. This pillar is entirely absent from hospital-only ROI tools.

3. **Standalone labs have modest ROI.** Single-site diagnostic labs (IN-STANDALONE) show positive but thin NPV with long payback, driven primarily by productivity gains. The business case here is strategic, not cost-driven.

4. **Indian government profiles are viable.** Despite low absolute salary and scanner cost, the high volume and non-trivial bed-day costs in tertiary teaching hospitals produce strong 5-year NPV with Y2 payback.

5. **Donor-funded scanners produce immediate payback.** When capex is zero or near-zero (grants, shared procurement), the entire savings curve shifts left and ROI exceeds 400%.

6. **The edge case correctly shows negative NPV.** A single-pathologist, 10k-slide practice cannot justify the investment. This is the expected result and demonstrates that Turoi does not default to positive projections.

7. **Monte Carlo bands are tight for high-confidence profiles** (US, UK) and wider for low-confidence profiles (India standalone, edge cases), reflecting the evidence base behind each default.
