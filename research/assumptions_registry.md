# Turoi — Assumptions Registry

> Master record for every default value in the Turoi calculator.
> Each row keyed to a ledger `id` in `index.html` and a citation key in `bibliography.bib`.
> Per project rules: every assumption needs at least 2–3 primary references, enumerated edge cases, and per-region variation.
> One citation per default is the starting point, not the finish line.

## How to use this file

- Rows are grouped by wizard domain (staffing, capex, opex, slide_movement, consults, surgical, patient_flow, waste, workforce, infrastructure, risk, strategic, hub_spoke, subspecialty_routing, commercial_growth, consult_revenue_scale, data_monetization).
- Each row must eventually list: label, current default(s) per region, primary sources (≥2), edge cases (≥3), confidence, reviewer status, open questions.
- When a row is reviewed by an external lab director or health economist, update the **Reviewer status** column with their name and date.
- Turoi code in `/home/swapnil/master/cal/index.html` reads defaults from `REGIONS[region].sub_profiles[type].defaults` with sibling `basis` records — the `basis` citation_ids must match keys in `bibliography.bib`.

---

## Research sprint cadence

Parallel to the build. Research runs one sprint ahead of code so every Turoi screen has defensible sources before the wizard or dashboard ships that section's fields.

- **R1** (with Build Phase 1): cost structure + slide movement + productivity — India + US
- **R2** (with Build Phase 2): surgical workflow + patient flow + waste reduction — India + US
- **R3** (with Build Phase 3): workforce + infrastructure + risk/compliance + strategic — India + US
- **R4** (with Build Phase 4): cross-cutting questions (ramp, discount, J-curve, attribution framework)
- **R5** (with Build Phase 5): UK + EU expansion
- **R6** (with Build Phase 6): Middle East + SEA expansion
- **R7** (with Build Phase 7): Africa + LatAm expansion
- **R8** (with Build Phase 8): External reviewer pass — 3+ practicing lab directors across regions and institution types (≥1 hospital-attached, ≥1 diagnostic-chain reviewer)

---

## Domain: staffing

### `pathologist_salary_annual`

| Region | Default | Primary sources (minimum 2) | Confidence | Reviewer status |
|---|---|---|---|---|
| India — government_medical_college | ₹18L | 7th CPC Level 13A pay matrix (midpoint); AIIMS faculty pay disclosure 2023; TODO: PGI Chandigarh recruitment notification for Associate Professor band | medium | unreviewed |
| India — academic_private | ₹32L | Large Indian private academic center pay band interviews; TODO: Indian Association of Pathologists compensation survey | medium | unreviewed |
| India — community_corporate_hospital | ₹28L | Corporate hospital chain recruitment advertisements 2023–2024; TODO: NathHealth corporate hospital pay benchmark | medium | unreviewed |
| India — standalone_diagnostic_lab | ₹22L | Owner-operator practice interviews; TODO: CRISIL standalone lab cost study | low | unreviewed |
| India — hyperlocal_diagnostic_chain | ₹26L | CRISIL 2023 chain cost analysis; TODO: regional chain investor disclosures | low | unreviewed |
| India — national_diagnostic_chain | ₹34L | National diagnostic chain annual report pay disclosures; IBEF 2024 diagnostics report; TODO: MGMA India affiliate survey | medium | unreviewed |
| US — academic_medical_center | $385k | MGMA 2024 Provider Compensation; AAMC Faculty Salary Report 2024 | high | unreviewed |
| US — community_hospital | $345k | MGMA 2024 community hospital section; TODO: Doximity compensation survey | high | unreviewed |
| UK — NHS trust | £105k | NHS Agenda for Change 2024/25 consultant pay; BMA consultant contract data | high | unreviewed |

**Edge cases to enumerate:**
- Part-time / hybrid pathologist appointments (common in Indian private academic and US community settings)
- Locum coverage premium (~30–50% above base)
- Trainee / resident productivity — Turoi excludes but registry should document
- Subspecialty vs general pathology pay delta (breast, derm, GI, heme often +15–25% over general AP)
- Non-clinical time allocation (research, teaching) that reduces monetizable capacity
- Incentive-based pay (RVU / per-case) — not captured in annual salary model, needs a flag
- Jurisdictions with fixed-salary vs overtime models — CPC vs private sector
- Expatriate consultant contracts in Middle East — base + housing + transport allowance structure

**Per-region variation drivers:**
- India: government pay commission cycle (~10 year), state vs central, NPA for medical faculty, corporate vs academic delta
- US: academic vs private, subspecialty, RVU-based vs salaried, geographic (coast premium)
- EU: public civil service scales, public-private gap much smaller than India or US
- UK: NHS consultant contracts, clinical excellence awards, private practice supplements
- Middle East: expatriate packages dominate, all-in comp substantially higher than base

**Open questions:**
- How should Turoi handle labs with 1 owner-operator pathologist? Salary isn't really the right abstraction.
- Should we model pathologist capacity hours instead of salary directly?

---

## Domain: capex

### `scanner_cost`

| Region | Default | Primary sources (minimum 2) | Confidence | Reviewer status |
|---|---|---|---|---|
| India — government | ₹75L | Indian distributor mid-range WSI quotes 2023; GeM portal tender results for mid-range WSI; TODO: additional vendor tender price | medium | unreviewed |
| India — private | ₹85L | Private procurement quotes vs tendered; TODO: 3DHistech Pannoramic pricing through Indian channel | medium | unreviewed |
| US — academic | $210k | Major WSI vendor US list pricing; academic discount data from multiple manufacturers; TODO: GPO pricing survey | medium | unreviewed |
| UK — NHS | £155k | NHS Supply Chain framework pricing; TODO: specific vendor agreements | medium | unreviewed |

**Edge cases:**
- Refurbished vs new (30–50% price delta)
- Bundled deals (scanner + software + storage) vs à la carte
- Subscription/usage-based models emerging from newer vendors
- Warranty vs AMC structures — Indian procurement often includes 3-year AMC
- Multi-head vs single-head scanners
- Throughput mismatch: academic spec (400+ slides/hr) vs community need (80 slides/hr)

**Open questions:**
- How should depreciation be modeled? Turoi currently charges full capex in Y0 — is straight-line over useful life a better fit for hospital CFO audience?
- Tender discounts are highly variable — should Turoi model a distribution rather than a point estimate?

### `implementation_cost` / `validation_cost`

TODO: populate with CAP validation guidelines, published vendor whitepaper benchmarks, Hanna 2019 deployment detail, Matias-Guiu 2025 European cost disclosure.

---

## Domain: opex

### `storage_cost_per_tb_year`

| Region | Default | Primary sources | Confidence |
|---|---|---|---|
| India | ₹9,000 | Indian data-center pricing surveys; TODO: AWS India Mumbai region Glacier/S3 warm tier pricing; TODO: Jio Cloud enterprise rate card | medium |
| US | $180 | AWS S3 Standard + IA blended; Azure Blob cool tier; TODO: on-prem NAS cost at 100TB+ scale | medium |
| UK | £160 | NHS digital infrastructure framework; TODO: Azure UK South pricing | medium |

**Edge cases:**
- Egress costs — often the hidden line item; AWS egress can double effective storage cost for active retrieval workloads
- Hot/warm/cold tier split — a chain with 10 years of retention can have 80%+ in cold tier
- On-prem vs cloud break-even point (usually ~50–100TB depending on retention)
- Backup + DR multiplier (typically 1.5–2.5× base storage)
- Sovereign data requirements (India DPDP, GDPR) forcing in-country storage

---

## Domain: slide_movement

### `courier_cost_annual` and inter-site logistics

TODO: ingest:
- Vodovnik 2018 Canadian hub-spoke data
- Ardon 2023 single-institution logistics quantification
- National reference lab public filings (logistics disclosure)
- Indian chain courier contract rates
- African teaching hospital donor-funded courier arrangements

**Edge cases:**
- Labs with in-hospital tube systems (no external courier)
- Outsourced archival (savings accrue to 3rd party, not the lab)
- Remote spokes with no courier access (today's gap digital closes)
- Legal/medicolegal retrievals specifically — different cost structure than routine

---

## Domain: surgical

### `or_cost_per_minute`

| Region | Default | Primary sources | Confidence |
|---|---|---|---|
| US | $37 | Childers 2018 JAMA Surgery; Thomas 2022 Annals of Surgery — both corroborate ~$36-37 labor-dominant cost | high |
| India — public | ₹180 | AIIMS published cost studies; TODO: PGI NABH cost report | medium |
| India — private | ₹450 | Corporate hospital cost-of-care disclosures; TODO: IRDAI cashless rate cards | medium |
| UK — NHS | £22 | NHS reference costs; TODO: BMA operating theatre cost data | medium |

**Edge cases:**
- Frozen sections done off-shift (no OR utilization penalty at all — zero the saving)
- Non-oncology FS (trauma, neuro) have different cost profiles
- ROSE vs FS workflow — ROSE doesn't occupy OR time
- Pathologist-to-OR physical distance varies — academic centers with adjacent OR vs separated pathology
- Public hospitals where OR time is not chargeback'd to departments

---

## Domain: patient_flow

### `bed_cost_per_day`

TODO: Blick 2010 is emergency medicine — find ≥2 anatomic-pathology-specific TAT-to-LOS studies.

**Edge cases:**
- Attribution problem: savings accrue to hospital, not pathology dept (Turoi exposes this via attribution tagging but the registry should document it)
- LOS savings capped by non-pathology bottlenecks (OT scheduling, imaging TAT)
- Public hospitals where bed cost ≠ opportunity cost

---

## Domain: hub_spoke (diagnostic-lab specific)

### `cost_per_inter_site_run`

TODO: primary sources needed for every tier:
- National diagnostic chain investor filings (Indian market)
- National reference lab public filings (US/EU market logistics disclosures)
- Regional Indian chain interview data (IBEF 2024)
- Synlab / Unilabs EU annual reports

**Edge cases:**
- Chains with outsourced courier (passes through; Turoi should surface this as a flag)
- Chains with in-house courier fleet (capex hidden in logistics capex line)
- Cross-state sub-specialty routing (subject to inter-state transport restrictions in some jurisdictions)
- Seasonal monsoon disruption (India)
- Franchise-model chains where spoke economics are borne by franchisee

---

## Cross-cutting questions

### Productivity ramp calibration

| Year | Current default | Primary sources | Confidence |
|---|---|---|---|
| Y1 | 25% | Vodovnik 2024 longitudinal; Hanna 2019 single-institution ramp; TODO: Baidoshvili 2018 Netherlands data | medium |
| Y2 | 60% | Vodovnik 2024; TODO: Matias-Guiu 2025 year-by-year data | medium |
| Y3+ | 100% | Vodovnik 2024 ten-year plateau | medium |

**Open questions:**
- Should Turoi offer multiple ramp presets (aggressive / moderate / conservative) instead of one default?
- How does ramp differ between hospital and diagnostic-lab profiles? (Smaller labs may ramp faster due to shorter validation cycles.)

### Discount rate

| Region | Default | Basis |
|---|---|---|
| India | 8% | RBI repo rate + healthcare WACC spread |
| US | 5% | 10-year Treasury + healthcare WACC |
| UK | 3.5% | HM Treasury Green Book discount rate for public sector |
| EU | 4% | ECB + public health infrastructure benchmark |

TODO: cite central bank sources, WACC benchmarks for healthcare, published health-tech business case discount rates.

### J-curve crossover

Current assumption: Year 3 (Matias-Guiu 2025). TODO: find ≥2 other published longitudinal ROI studies with explicit crossover year disclosure.

### Attribution framework

The hospital attribution (pathology_dept / hospital / health_system) and diagnostic-lab attribution (lab_opex / commercial_growth / strategic_asset) are Turoi's own framework, not a published standard. Document the rationale explicitly so reviewers can challenge it.

---

## Edge-case review gate

Before Dashboard (Build Phase 5) ships, walk through `edge_cases.md` and confirm each edge case is either:
- (a) handled in code,
- (b) flagged in the Claude pre-estimation review prompt, or
- (c) explicitly documented as a known limitation in the UI.

Any edge case falling through all three is a blocker.

---

## Explicitly NOT in scope for this registry

- Systematic review / meta-analysis (would be valuable, belongs in a separate publication)
- Original primary data collection from Turo's own lab
- Formal health economic evaluation (CEA/CUA/BIA)
- Regulatory dossier preparation (CDSCO, FDA, CE-IVD)
