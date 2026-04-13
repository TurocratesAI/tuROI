# TuroPath Digital Pathology ROI Calculator — Full Agent Context

## PROJECT OVERVIEW

Build a global, region-adaptive Digital Pathology ROI Calculator as a standalone web product under TuroPath branding (Turocrates AI Private Limited). The calculator walks users through a guided questionnaire, pre-populates region/institution-specific defaults, **sends all inputs through Claude for pre-estimation sanity checking and gap-filling before any computation**, computes 5–7 year cost-benefit projections across interconnected value pillars, renders an interactive dashboard with charts, exports a PDF business case, and embeds Claude API for dynamic interpretation and what-if analysis. **Every assumption — whether hardcoded, user-entered, or Claude-estimated — is tracked in a structured assumptions ledger that can be exported and reviewed by lab directors for verification.**

### Core Design Philosophy: Personalized, Actionable, Presentation-Ready

This is NOT a generic spreadsheet calculator. The output must feel like a senior consultant sat with the user, understood their institution's specific situation, and prepared a tailored business case they can walk into their hospital director's or CFO's office with.

**What "personalized" means concretely:**
- Claude doesn't just crunch numbers — it tells a story. "For your 300-bed government hospital doing 150 biopsies/day with shared histotechs, the single biggest ROI driver isn't scanner savings — it's eliminating the 2 hours/day your pathologists spend walking to the OR for frozen sections. That's ₹X lakhs/year in recaptured productivity, enough to fund the scanner within 18 months."
- Dashboard highlights are institution-specific. A private chain lab in Mumbai gets different emphasis (consult revenue scalability, IHC quantification reimbursement) than a government medical college in a tier-2 city (frozen section TAT, reduced slide loss, making the case for a scanner purchase through GeM).
- The PDF executive summary is written in the language of whoever will read it. Claude should ask: "Who will you present this to?" and tailor accordingly — a pathology department head gets clinical workflow framing; a hospital CFO gets NPV/payback/cost-per-case framing; a government administrator gets public health impact framing.
- What-if analysis proactively suggests the most impactful levers: "If you negotiate scanner pricing down 15% (common in government tenders), your payback period drops from 3.2 years to 2.4 years."
- The tool surfaces non-obvious insights: "Your frozen section volume is high relative to peers. Going digital for FS alone — before full clinical deployment — could generate positive ROI within 14 months and serve as proof-of-concept for full adoption."

**The value pillars are not rigid numbered categories — they are lenses.** Claude dynamically reorders, weights, and narrates them based on what matters most for each institution. A rural hub-and-spoke network cares most about slide movement and remote access; an urban academic center cares most about productivity and space; a private chain cares most about consult revenue and AI-enabled services. The framework adapts — the user never sees a generic "Domain 1, Domain 2" list.

### Tech Stack
- Single-file or multi-file plain HTML/CSS/JS (no framework)
- Charts: Chart.js or D3.js (CDN)
- PDF export: jsPDF + html2canvas (CDN)
- Claude API integration for interpretation layer
- No backend required — all computation client-side; Claude API calls direct from browser (API key managed via user input or env)

### Branding
- TuroPath product, Turocrates AI Private Limited
- Use Turocrates brand colors, logo, professional medical SaaS aesthetic
- Target users: pathology lab directors, hospital administrators, health system CFOs, digital pathology champions building a business case

---

## PART 1: DOMAIN KNOWLEDGE (Source Material)

### 1A. Published Evidence & Expert Framework — DP Economics

#### Cost Structure of Digital Pathology
Three cost buckets:
- **Capital**: Scanners, image management systems, storage infrastructure (on-prem vs cloud tiers), workstations and displays, initial IT integration
- **Operational**: Storage growth (per slide, per year), maintenance and service contracts, personnel (scanning, QA, IT support), data egress / cloud retrieval
- **Transitional**: Training and onboarding, validation studies, temporary inefficiencies during transition

#### Published Evidence on ROI
| Study | Finding |
|-------|---------|
| Hanna et al., Arch Pathol Lab Med 2019; 143(12):1545–1555 | 5-year $1.3M savings via comprehensive comparative cost analysis |
| Ho et al., J Pathol Inform 2014;5:33 | Projected 5-year savings ~$18M for large academic health system (~$85/case for 219K annual cases) |
| Baidoshvili et al., Histopathology 73:784–794 | >19h/day saved working digitally (~1h pathologist time); ~€120K/year equivalent |
| Matias-Guiu et al., Virchows Archiv 2025; 487:815–826 | 7-year NPV €0.21M, positive cash flow by Year 3, 15% efficiency gain |

#### Modeling Approaches (and Their Limitations)
- Targeted savings buckets
- Volume-adjusted projections
- Use of calculators: DPA ROI calculator, vendor-developed tools (e.g., Sectra)
- **Limitations**: Typically account for <30% of total economic value; limited customizability

#### Direct Financial Returns (Quantifiable, Immediate Savings)
Four categories:
1. Courier and transportation logistics
2. Slide storage
3. Labor (slide retrieval and refiling)
4. Reduced recuts and IHC

#### DPA Calculator — Required Input Data
- Annual slide volume (daily volumes — inhouse and consults)
- Days/hours of operation, shifts per tech/admin
- Daily FS/ROSE volume
- Costs and number of equipment (scanners, monitors, workstation upgrades, mice) / software / installation, licensing and annual fees / incremental storage plan
- Annual salaries (MDs, techs, admins, DP/QC personnel, IT members)
- Number of pathologists using DP
- Anticipated productivity gains (over 5 years)
- Courier costs
- Processing times (accessioning, labeling, handling distribution)
- Slide retrieval logistics, annual teaching recuts etc.
- Case prep times for conferences, teaching and frequency
- Legal costs / missing cases
- Reimbursement — computer assisted IHC quantification

#### DPA Calculator — Cost vs. Savings Structure

**COSTS (left side):**
- Pathologists
- Glass slides generation
- FS digital workflow
- ROSE digital workflow
- Pathologist workstation
- Clinical digital workflow
- IT to support DWF (digital workflow)
- Digital storage
- Lab renovation
- MD admin (annual salary/FTE) over 5 years
- DP supervisor, IT support staff
- → Total investment

**SAVINGS/REVENUE (right side):**
- Savings/avoidance by digital workflow (DWF)
- Cost avoidance by adopting DWF
  - by FS DWF
  - by ROSE DWF
  - by consult DWF
  - clinical DWF
- Glass slide storage offsite
- Cost avoidance glass slide retrieval
- Cost avoidance educational recuts
- Cost savings conferences (personnel time)
- Cost savings in case review/collaboration
- Legal cost avoidance
- Revenue:
  - Additional consultation practice
  - Data commercialization (industry partnership)
  - Computer assisted quantification reimbursement
  - Future CPT reimbursement
- AI assisted slide review (in red — emerging)
- Hospital savings by decreasing pathology TAT (in pt stay and OR times) (in red — emerging)
- → Total savings + revenue

#### TuroPath Value Pillars

**Slide Movement & Supply Chain**
- Elimination of physical slide transport removes chronic source of friction, delay, and loss
- Evidence (Ardon et al., J Pathol Inform 2023 — MSK):
  - 93% decrease in glass slide archive requests after full digital deployment
  - 97% reduction in requests from an off-site surgery center
  - 3 FTE staff from slide file room redeployed into digital scanning operations
  - 77% cost reduction in legal slide handling
  - 85% reduction in workflow time for medicolegal cases
- Hub-and-spoke network, Canada (Vodovnik, J Pathol Inform 2018):
  - CA$26,000/yr courier savings
  - CA$60,000/yr pathologist travel savings
  - CA$45,000/yr accommodation and related expenses eliminated

**Pathologist Productivity & Turnaround**
- Digital pathology compresses non-diagnostic time across every step from bench to sign-out
- 10-year longitudinal study (Vodovnik, J Pathol Inform 2024):
  - 40% increase in productivity over 10 years
  - Gains driven by consolidation of slide handling, annotation, report prep, and sign-off
  - Not from faster diagnosis — from eliminating the time around the diagnosis
- MSK efficiency and TAT study (Hanna et al., Arch Pathol Lab Med 2019):
  - 1-day reduction in TAT for surgical resection cases with prior WSIs in LIS
  - $114,000/year anticipated savings from reduced confirmatory IHC orders
- **Key insight: Gains require active workflow redesign — digitization alone is insufficient. Don't expect it on day 1.**

**Surgical Workflow Impact**
- Intraoperative consultation (frozen section) delays have direct, measurable OR cost implications
- OR cost benchmarks:
  - $36–37/min direct cost, California hospitals (Childers & Maggard-Gibbons, JAMA Surg 2018)
  - $46–115/min depending on case complexity and institution (Thomas et al., J Orthop Bus 2022)
  - A 10-minute reduction in OR idle time = $460–$1,150 per case
- Digital pathology impact on frozen section TAT:
  - Telepathology frozen section mean TAT: 18–20 min — equivalent to on-site performance
  - Eliminates pathologist travel time and frees in-house capacity for routine signout
  - (Laurent-Bellue et al., Am J Clin Pathol 2020 — 4-year, 864-case French academic experience)
- Scalable: multiply across annual frozen section volume for institutional impact

**Patient Flow & Bed Utilization**
- Pathology turnaround time directly affects inpatient bed utilization
- Established mechanism — laboratory TAT and ED LOS:
  - 11-hospital study: reducing TAT outliers decreased ED LOS from 4.1h to 3.2h (Blick, Ann Clin Lab Sci 2010)
  - Principle extends to anatomic pathology: faster biopsy results → earlier treatment decisions → faster discharge
- Where this matters most in digital pathology:
  - Same-day subspecialty review via remote signout — no waiting for slides to travel between sites
  - Remote consultation enabling rapid second opinion without physical transfer
  - Oncology staging workups: 1-day TAT reduction documented at MSK (Hanna et al. 2019)
- Hospital bed cost: $2,000–$4,000/day — even a fraction of a day saved per case aggregates to significant system-level value
- **This value accrues to the hospital, not the pathology department — illustrating the attribution problem**

**Waste Reduction & Quality Assurance**
- Physical slide handling creates costs that disappear entirely in digital workflows
- Sources of rework cost in analog pathology:
  - Lost or misfiled slides requiring repeat sectioning and staining
  - Damaged slides during transport (breakage, coverslip failure)
  - Repeat IHC ordered because prior material cannot be located quickly
  - Educational recuts
- Quantified savings from digital access to prior material:
  - 48% reduction in confirmatory IHC orders for recurrent/metastatic disease (Hanna et al. 2019)
  - $114,000/year in anticipated savings from IHC reduction alone at a single academic center
  - Driven by: instant LIS-integrated access to prior WSIs eliminates need to reorder to compare
- Additional rework costs: reagent waste, technician time — not typically modeled

**Workforce Sustainability**
- Burnout cost estimates: ~$500k to >$1M per physician; replacement often 2–3× salary
- A 30–50% greater likelihood of reduced professional output follows a documented rise in burnout
- Pre-departure productivity loss begins well before a physician leaves
- Physicians experiencing burnout are twice as likely to provide suboptimal care and more likely to generate malpractice risk
- Sources: AMA, HayesLocums, Kyruus Health

**Physical Infrastructure Optimization**
- Physical slide archives are a mandated cost: histopathology slides must be retained for ≥10 years
- For large academic centers: extensive on/off-site storage with rent, transport, and staffing costs
- Impact of digital deployment on physical footprint (Ardon et al., J Pathol Inform 2023 — MSK):
  - 93% decrease in archive retrieval demand → slide file room operationally reconfigured
  - Multiheaded scope rooms no longer required; pathologists' offices need not be physically adjacent to laboratory
  - Scanning team integrated into reclaimed space; personnel redeployed from archival to operational roles
- Remote work as a structural benefit:
  - Digital pathology enables sustainable remote signout — reducing physical office footprint requirements
  - Particularly relevant in high-cost urban medical centers where laboratory real estate is at premium
- **Space reallocation value is institution-specific and often not modeled — but in NYC, Boston, or San Francisco (or Mumbai, Delhi), this can be a game changer!**

**Risk, Compliance & Audit Readiness**
- Digital workflows create an immutable, time-stamped audit record unavailable in conventional practice
- What digital documentation provides:
  - Timestamped record of every case view: who, when, how long, at what magnification
  - Permanent, LIS-integrated access to all prior diagnostic material
  - Facilitated remote subspecialty consultation — reducing deferred and provisional diagnoses
- Quantified legal cost savings (Ardon et al., J Pathol Inform 2023 — MSK):
  - 77% reduction in cost of handling legal glass slide requests
  - 85% reduction in workflow time for medicolegal case fulfillment
  - Digital slides available instantly; glass slides required search, retrieval, transport, and on-site review
- DPA ROI calculator explicitly models medicolegal cost avoidance as a quantifiable savings category
- Risk mitigation by avoiding loss of material — difficult to quantify but even 1–2 examples can strengthen your case

#### Strategic Economic Value (Long-Term and Non-Linear Returns)
- **Consult Revenue Models**: Internal redistribution vs external revenue; digital consult scalability
- **Pharma & Industry Partnerships**: Clinical trials, biomarker pipelines, AI development
- **Data Monetization**: Curated WSI datasets, grant funding, institutional partnerships
- **AI Integration**: Future reimbursement potential, workflow augmentation
  - Example: Breast lymph nodes — overall efficiency gain of 55% (Am J Surg Pathol. 2024 Jul 1;48(7):846-854)
  - Example: Prostate biopsies — 52% time reduction (JAMA Netw Open. 2020 Nov 2;3(11):e2023267)

#### Temporal Dynamics: The ROI J-Curve
- Year 0–1: High cost, minimal return
- Year 1–3: Efficiency gains emerge
- Year 3–5+: Strategic value realized
- Positive cash flow typically by Year 3 (Matias-Guiu et al.)

#### A Customizable Economic Framework (6-Step Approach)
1. Characterize baseline inefficiencies — costs, time, and diagnostic quality
2. Quantify direct savings (storage, courier, recuts, archive handling)
3. Model efficiency gains via salary-weighted, time-to-cost translation
4. Incorporate all value pillars across departmental boundaries (Logistics, TAT, OR time, LOS, Rework, Liability, Real estate, Burnout)
5. Layer AI-enabled value as a distinct category (efficiency, cost avoidance)
6. Align with institutional strategy; model over a 5–7 year horizon
- **Plug and play with a conventional ROI model — gives you a good baseline**

---

### 1B. DPA ROI Calculator — Published Paper Details

**Citation**: Ardon O, Asa SL, Lloyd MC, Lujan G, Parwani A, Santa-Rosario JC, Van Meter B, Samboy J, Pirain D, Blakely S, Hanna MG. Understanding the financial aspects of digital pathology: A dynamic customizable return on investment calculator for informed decision-making. J Pathol Inform. 2024 Apr 10;15:100376. doi: 10.1016/j.jpi.2024.100376. PMID: 38736870; PMCID: PMC11087961.

**Key characteristics:**
- Web-based, 5-year projection tool
- Members-only (DPA)
- First commercially bias-free tool (no vendor affiliation in design)
- Modular: users can skip entire sections that don't apply
- Categories: clinical operations, other clinical services (FS/ROSE), consults, hardware/software, IT infrastructure, archive/retrieval, medicolegal, reimbursement
- Running cost vs savings tally displayed as user inputs data
- No save/download (privacy by design — no institutional data stored)
- Designed primarily for US academic/health system context
- Authors from MSK, Ohio State, Case Western, plus vendors (Fujifilm, Barco, Philips, Visiopharm, Hamamatsu) — industry involvement in building but bias-free in structure

### 1C. Sectra Business Case Calculator

**Source**: Sectra Medical whitepaper "Guidance on how to create a business case for digital pathology"

**Key characteristics:**
- Downloadable spreadsheet companion to whitepaper
- Covers 20+ peer-reviewed papers
- Models cost categories: scanner/storage/IT infrastructure implementation costs, annual operational costs (subscriptions, depreciation, maintenance), staffing changes
- Savings modeled: reduced consult workflow time, slide retrieval elimination, IHC reduction, MDT prep time savings, remote signout enabling
- References Ho et al. benchmark: $18M/5yr for 219K annual cases = ~$85/case (~$93 inflation-adjusted to 2020)
- Quality improvements listed but explicitly noted as "very hard to quantify in a business case": reduced TAT, increased diagnostic precision, faster treatment decisions
- Also HIC-oriented (European/US pricing assumptions)
- Emphasizes that cost calculation for business case ≠ cash flow calculation (both needed)

---

## PART 2: WHAT WE'RE BUILDING DIFFERENTLY

### Critical Gaps in Existing Tools (Our Differentiation)

1. **No global/regional adaptation**: DPA and Sectra assume US/EU salary scales ($300K+ pathologist), scanner pricing at list, cloud infrastructure, and US-style reimbursement. None of this applies in India, Sub-Saharan Africa, Southeast Asia, Middle East, or even Eastern Europe.

2. **No institutional sub-profiling**: In India alone, a government medical college, a private corporate chain (e.g., Metropolis, SRL, Thyrocare), a large academic institution, and a standalone diagnostic lab have radically different cost structures, procurement processes (GeM portal vs direct purchase), staffing models (pooled resources, outsourced scanning), and revenue sources.

3. **No interpretive layer**: Both tools give you numbers but no guidance on what the numbers mean, which levers matter most, or how to present findings to administration.

4. **No dynamic what-if**: You can't ask "what if I delay scanner 2 to year 3?" or "what if pathologist salary increases 8% annually?" — you have to re-enter everything.

5. **No cross-departmental value capture**: Both tools focus on the pathology department P&L. They don't model hospital-level value (OR time, LOS, burnout retention) in a way that's legible to a CFO.

6. **Only capture <30% of total economic value**: Direct financial returns are the minority. The 8-domain framework captures the rest, and we model all of it.

### Our Value Proposition
- Region-adaptive with hardcoded defaults + Claude-refined context
- All value pillars + strategic value modeled
- Guided wizard (not a giant spreadsheet)
- Interactive dashboard with J-curve visualization
- Claude-powered interpretation and dynamic sensitivity analysis
- PDF export of complete business case
- TuroPath branded — potential SaaS product

---

## PART 3: REGION/INSTITUTION PROFILES

### Profile Structure (JSON)
Each region profile should contain:
```json
{
  "region": "india",
  "currency": "INR",
  "currency_symbol": "₹",
  "exchange_rate_to_usd": 0.012,
  "sub_profiles": {
    "government_medical_college": {
      "label": "Government Medical College / Teaching Hospital",
      "defaults": {
        "pathologist_salary_annual": 1800000,
        "technician_salary_annual": 420000,
        "admin_salary_annual": 360000,
        "it_support_salary_annual": 600000,
        "scanner_cost": 10000000,
        "workstation_cost": 200000,
        "monitor_cost": 150000,
        "storage_cost_per_tb_year": 5000,
        "courier_cost_annual": 50000,
        "slide_cost_per_unit": 15,
        "ihc_cost_per_stain": 800,
        "or_cost_per_min": 500,
        "bed_cost_per_day": 3000,
        "real_estate_cost_sqft_year": 500,
        "archive_space_sqft": 200,
        "slides_per_year": 50000,
        "pathologist_count": 8,
        "frozen_sections_per_day": 3,
        "consult_cases_per_month": 50,
        "procurement_model": "GeM portal / government tender",
        "staffing_model": "pooled — shared histotechs across departments",
        "reimbursement_landscape": "minimal — mostly CGHS/state insurance rates",
        "regulatory_context": "CDSCO for AI/software; no specific DP regulation yet"
      }
    },
    "private_corporate_chain": {
      "label": "Private Corporate Lab Chain",
      "defaults": { ... }
    },
    "academic_private": {
      "label": "Private Academic Hospital",
      "defaults": { ... }
    },
    "standalone_diagnostic": {
      "label": "Standalone Diagnostic Lab",
      "defaults": { ... }
    }
  }
}
```

Other regions to include with sub-profiles:
- **US**: Academic medical center, community hospital, reference lab, VA system
- **EU/UK**: NHS trust, private European group, academic
- **Middle East**: Government hospital (Saudi/UAE model), private
- **Southeast Asia**: Government, private chain
- **Sub-Saharan Africa**: Teaching hospital, NGO-supported facility
- **Latin America**: Public, private

Claude API call at region selection: after user picks region + sub-profile and optionally describes their setup in free text, call Claude to refine defaults and flag which domains are most/least relevant for their context.

---

## PART 4: CALCULATOR ARCHITECTURE

### Phase 1: Onboarding (Region + Institution)
**Screen 1**: Welcome + TuroPath branding. Brief explainer.
**Screen 2**: Region selector (country dropdown → auto-selects currency, sub-profiles).
**Screen 3**: Institution sub-profile selector + optional free-text description ("Describe your lab setup, volume, staffing, any unique circumstances").
**Screen 4**: Claude API call → refines defaults, returns a brief institutional profile summary and flags most relevant domains.

### Phase 2: Guided Questionnaire (Wizard)
Each section = one screen. User can skip any section. Pre-populated with region defaults (editable). Show a running cost/savings tally on the side (like DPA calculator).

**Section 1 — Clinical Operations**
- Annual slide volume (inhouse + consults)
- Days/hours of operation
- Number of pathologists, techs, admin staff
- Average salaries (pre-populated from profile)
- Number of pathologists who will use digital

**Section 2 — Frozen Section / ROSE**
- Daily FS volume
- Daily ROSE volume
- Current FS TAT (minutes)
- Pathologist travel time to OR/procedure suite
- Skip if not applicable

**Section 3 — Consults**
- Monthly consult volume (sent + received)
- Current courier cost per consult
- Average consult TAT (days)
- Skip if not applicable

**Section 4 — Equipment & Infrastructure**
- Number of scanners needed (with scanner cost)
- Workstations + monitors
- Software/IMS licensing (annual)
- Storage plan (on-prem vs cloud, cost per TB/year)
- IT integration costs (one-time)
- Installation costs

**Section 5 — Staffing Changes**
- New FTEs needed (scanning tech, DP supervisor, IT support)
- Salaries for new positions
- FTEs that can be redeployed (slide file room, courier, etc.)
- Training costs (one-time)
- Validation study costs (one-time)

**Section 6 — Archive & Retrieval**
- Current archive space (sqft)
- Storage cost per sqft/year (or rent)
- Slide retrieval requests per month
- Time per retrieval (minutes)
- Personnel cost per retrieval
- Off-site storage costs (if any)

**Section 7 — Material Loss & Rework**
- Estimated lost/damaged slides per year
- Repeat IHC orders due to missing prior material (per year)
- Cost per IHC stain
- Cost per recut/restain
- Educational recuts per year

**Section 8 — Legal/Medicolegal**
- Legal slide requests per year
- Current cost per legal slide request fulfillment
- Average time to fulfill (days)
- Any known costs from lost/unavailable material in legal context

**Section 9 — OR Time (Frozen Section Impact)**
- Annual frozen section volume
- OR cost per minute (from profile)
- Estimated minutes saved per case via telepathology
- Auto-calculates annual OR savings

**Section 10 — Patient Length of Stay**
- Estimated cases per year where TAT reduction could affect discharge
- Average bed cost per day (from profile)
- Estimated TAT reduction (days or fraction)
- Auto-calculates LOS savings (note: accrues to hospital, not path dept)

**Section 11 — Burnout & Retention**
- Current pathologist vacancy rate
- Recent departures in last 3 years
- Estimated recruitment cost per pathologist
- Qualitative: does your team report burnout? (scale 1–5)
- Auto-models retention value based on published estimates

**Section 12 — Real Estate & Space**
- Space currently used for slide archives (sqft)
- Space for multiheaded scope rooms (sqft)
- Space for pathologist offices adjacent to lab (sqft)
- Potential to enable remote signout (yes/no)
- Real estate cost per sqft/year (from profile)

**Section 13 — Revenue & Strategic Value**
- Current external consult revenue per year
- Projected consult growth with digital (%)
- Pharma/industry partnership potential (qualitative → Claude interprets)
- AI reimbursement potential (IHC quantification, future CPT codes)
- Data monetization potential (qualitative)
- Grant funding potential

**Section 14 — Projection Parameters**
- Projection horizon (default: 5 years, allow 3–7)
- Discount rate (default: 8% for India, 5% for US/EU)
- Annual salary inflation rate
- Scanner depreciation period (default: 7 years)
- Productivity ramp: Year 1 = X%, Year 2 = Y%, Year 3+ = Z% of projected gains

### Phase 2.5: Claude Pre-Estimation Analysis (CRITICAL — DO NOT SKIP)

Before running any calculations, after the wizard is complete, the full input state is sent to Claude for a **pre-estimation review**. This happens BEFORE results exist. Claude acts as an experienced lab operations consultant who sanity-checks inputs and enriches estimates.

**What Claude does here:**
1. **Sanity check inputs**: Flags implausible values ("You've entered 500 slides/day with 2 pathologists — that's 250/pathologist/day which is extremely high. Typical for your institution type is 60–100. Should we adjust?")
2. **Fill gaps with reasoning**: For skipped sections, Claude estimates reasonable values based on institution profile and volume. ("You skipped rework. Based on published data for labs your size, ~2–3% of slides are recut/re-ordered annually. For 50,000 slides/year → ~1,200 recuts. I'll use that as conservative estimate. Adjust?")
3. **Cross-validate between domains**: ("Your courier cost seems low relative to consult volume — are consults hand-carried by residents? If so, hidden cost is resident time, not courier fees. Should we model that?")
4. **Surface hidden costs the user didn't think of**: ("For a government medical college in Maharashtra, you likely have PMJAY case volumes. Digital pathology could reduce TAT for scheme cases, which matters for reimbursement timelines. Factor that in?")
5. **Calibrate the productivity ramp**: Based on published evidence for similar institutions, suggest realistic Year 1/2/3 ramp percentages.
6. **Flag region-specific considerations**: ("CGHS rates for histopathology are ₹300–500/test. Computer-assisted IHC quantification has no separate CPT equivalent in India yet — set reimbursement revenue to zero unless you have private insurer contracts.")

**UI for this phase:**
- "Reviewing your inputs..." loading screen
- Display Claude's analysis as a checklist of findings, each with:
  - The finding/flag
  - Claude's suggested adjustment (if any)
  - Accept / Modify / Ignore buttons for each
- User reviews all flags, accepts/modifies/ignores
- Only THEN does computation run with finalized inputs

**Claude API call:**
```
System: You are a digital pathology lab operations and financial analyst for TuroPath. You are reviewing a user's inputs for a DP ROI calculator BEFORE any estimates are computed. Your job:
1. Sanity-check every input against published benchmarks and institutional norms for this region/type.
2. For skipped sections, propose reasonable estimates with citations or reasoning.
3. Cross-validate inputs across domains for internal consistency.
4. Surface hidden costs or savings the user may not have considered.
5. Calibrate productivity ramp assumptions based on evidence.
6. Flag region-specific regulatory, reimbursement, or procurement considerations.

Be specific. Give numbers. Cite evidence where possible. Return JSON array of findings: {id, category, finding, current_value, suggested_value, reasoning, severity: "info"|"warning"|"error", source}.

User: {full_wizard_state_json + region_profile + institution_description}
```

This makes the calculator genuinely consultative — not just a spreadsheet with a coat of paint.

### Phase 3: Dashboard

**Top Bar: Institution Context**
- Shows: institution name, type, region, annual volume — always visible so the user feels "this is MY analysis"

**Personalized Headline Insight (Claude-generated, prominent):**
- NOT a generic summary. Example: "Your strongest case for digital pathology is frozen section telepathology — at your volume of 8 FS/day and ₹500/min OR cost, digitizing FS alone pays for the scanner in 16 months. Full deployment reaches positive ROI by month 28."
- This is the first thing the user sees. It should be quotable — something they can literally say to their hospital director.

**Main Dashboard View:**
1. **Investment vs. Returns Timeline** — Year-by-year cumulative cost vs cumulative savings, showing crossover point (the J-curve). Annotated with milestones ("Scanner installed", "Validation complete", "Full clinical go-live", "Payback achieved")
2. **Where Your Value Comes From** — Horizontal waterfall chart showing contribution of each value pillar, dynamically ordered by magnitude for THIS institution (not a fixed order). Color-coded by attribution: pathology dept (direct), hospital (indirect), health system (strategic)
3. **Investment Breakdown** — Donut chart of total costs by category
4. **Key Metrics Cards** — NPV, payback period, 5-yr ROI %, cost-per-case impact, productivity hours recaptured/year
5. **Sensitivity: What Moves the Needle** — Tornado diagram, but with plain-language labels ("If scanner costs 20% less → payback drops to X months" rather than abstract parameter names)
6. **Year-by-Year Table** — Detailed annual breakdown, expandable by pillar

**Attribution Panel:**
- Every savings line item tagged: "This accrues to your department" vs "This accrues to the hospital" vs "System-level value"
- This is critical for the presentation — the user needs to know what to claim as their department's win vs what to frame as institutional benefit

**Claude Advisor Panel (persistent right sidebar or expandable):**
- **Initial load**: Auto-generates a personalized narrative (3-4 paragraphs) covering: your top 3 value drivers, the most compelling argument for your audience, what data you're still missing that would strengthen the case, and a suggested phased rollout strategy
- **Chat interface** for dynamic what-if: "What if I start with FS only and add clinical in year 2?" → Claude recalculates, updates all charts, explains what changed and why
- **Audience selector**: dropdown — "I'm presenting to: Department Head / Hospital CFO / Government Administrator / Board / Grant Committee" → Claude reframes the entire narrative and highlights
- **"Strengthen My Case" button**: Claude identifies the weakest assumptions and suggests specific data the user should collect from their lab to make the case more defensible
- **"Compare Scenarios" mode**: Save up to 3 scenarios (e.g., "FS only", "Full deployment", "Phased rollout") and show side-by-side comparison

### Phase 4: PDF Export — The Business Case Document

The PDF is the primary deliverable. It should look like a professional consulting report, not a printout of a web dashboard.

**Structure:**
1. **Cover page**: TuroPath branding, institution name, date, "Digital Pathology Business Case & Financial Projection"
2. **Executive Summary** (1 page, Claude-generated, tailored to selected audience): Opening paragraph with the headline insight, key financial metrics (NPV, payback, ROI), top 3 value drivers in plain language, recommended implementation approach, closing statement
3. **Institution Profile** (half page): Region, type, volume, staffing — establishes context
4. **Financial Projection** (2-3 pages): Investment timeline chart, returns by value pillar waterfall, year-by-year table, key metrics
5. **Value Pillar Deep-Dives** (1 page each, only for pillars with material impact): Each pillar gets a brief narrative, the specific calculation, cited evidence, and institution-specific notes
6. **Sensitivity Analysis** (1 page): Tornado diagram + narrative on which levers matter most
7. **Implementation Roadmap** (Claude-generated): Suggested phases, timeline, milestones, resource requirements
8. **Assumptions & Methodology Appendix**: Complete assumptions ledger — every value, its source, basis, confidence level, verification status. Clearly distinguishes user inputs, region defaults, and Claude estimates. This is the section lab directors review.
9. **References**: All cited papers
10. **Disclaimer**: Estimates only, not financial advice, prepared using TuroPath ROI Calculator

---

## PART 5: COMPUTATION LOGIC

### Core Formulas

**Total Investment (Year N):**
```
Year 0: scanner_cost × num_scanners + workstation_cost × num_workstations + monitor_cost × num_monitors + it_integration_cost + installation_cost + training_cost + validation_cost + lab_renovation_cost

Year 1+: ims_license_annual + storage_cost_per_tb × storage_growth_tb + maintenance_contracts + new_fte_salaries × (1 + salary_inflation)^N + data_egress_costs
```

**Savings by Domain (Year N):**
Apply productivity ramp factor: Year 1 = 25%, Year 2 = 60%, Year 3+ = 100% of projected savings

```
Slide Movement: courier_cost_saved + slide_retrieval_labor_saved + transport_damage_avoided
Productivity: pathologist_time_saved_hours × pathologist_hourly_rate × productivity_ramp
Surgical Impact: frozen_volume × minutes_saved × or_cost_per_min × productivity_ramp
Patient Flow: affected_cases × fractional_days_saved × bed_cost_per_day × productivity_ramp
Waste Reduction: (repeat_ihc_avoided × ihc_cost) + (recuts_avoided × recut_cost) + (lost_slides × restain_cost)
Workforce: qualitative_risk_score × published_per_physician_cost × probability_factor
Infrastructure: archive_sqft_freed × cost_per_sqft + scope_room_sqft_freed × cost_per_sqft
Risk & Compliance: legal_requests × cost_reduction_per_request + risk_avoidance_estimate
Strategic: consult_revenue_growth + ai_reimbursement_estimate + partnership_estimate
```

**NPV:**
```
NPV = Σ (Net_Savings_Year_N / (1 + discount_rate)^N) for N = 0 to projection_horizon
```

**Payback Period:**
Year where cumulative net savings first becomes positive.

**ROI %:**
```
ROI = (Total_Savings_Over_Horizon - Total_Costs_Over_Horizon) / Total_Costs_Over_Horizon × 100
```

### Sensitivity Analysis
Run NPV calculation varying each key input ±20% while holding others constant. Display as tornado diagram. Key inputs to vary:
- Slide volume
- Pathologist salary
- Scanner cost
- Productivity ramp speed
- Storage cost growth rate
- OR cost per minute
- Bed cost per day
- Discount rate

---

## PART 6: CLAUDE API INTEGRATION

### Integration Points (5 Total)

**0. Pre-Estimation Analysis (Phase 2.5) — SEE PHASE 2.5 ABOVE FOR FULL SPEC**
This is the most important Claude integration. It runs after the wizard, before computation. Sanity-checks inputs, fills gaps, cross-validates, surfaces hidden costs, calibrates ramp assumptions, flags region-specific issues. Returns structured JSON findings that user reviews before computation proceeds.

**1. Region Profile Refinement (Phase 1)**
```
System: You are a digital pathology economics expert. Given a region, institution type, and free-text description, refine the default cost/savings parameters. Return JSON with updated defaults and a brief narrative summary. Flag which of the value pillars are most/least relevant for this institution type.

User: Region: India, Sub-profile: Government Medical College. Description: "300-bed tertiary care hospital in tier-2 city Maharashtra, 6 pathologists, 4 histotechs shared with microbiology, ~150 biopsies/day, no current scanner, CGHS reimbursement, considering starting with frozen section digitization only"
```

**2. Dashboard Personalized Insight (Phase 3 — auto-runs on dashboard load)**
```
System: You are a senior digital pathology consultant working for TuroPath. You have this institution's complete profile and calculator results. Your job is to generate a personalized analysis that feels like expert advisory, not generic output.

Generate:
1. HEADLINE INSIGHT (1-2 sentences): The single most compelling finding for THIS institution. Must be specific, quotable, and actionable. Use their actual numbers. Example: "At your volume of 8 frozen sections/day, telepathology alone recovers ₹18.4 lakhs/year in OR idle time — funding your scanner in 16 months."
2. TOP 3 VALUE DRIVERS: Ordered by impact for this institution (not a generic list). For each: the specific dollar/rupee amount, why it matters for their institution type, and what evidence supports it.
3. ATTRIBUTION MAP: Which of these savings the user can claim as their department's win vs what to frame as hospital-level benefit.
4. WEAKEST LINK: The assumption with highest uncertainty that most affects the bottom line. Suggest what specific data to collect to strengthen it.
5. PHASED STRATEGY: If applicable, suggest a phased rollout (e.g., "Start with FS telepathology → expand to consults → full clinical") with projected ROI at each phase.
6. PRESENTATION HOOK: One compelling opening line the user could use when presenting to their leadership.

User: {calculator_results_json + institution_profile + audience_type}
```

**3. Audience-Tailored Reframing (triggered by audience selector)**
```
System: You are reframing a digital pathology business case for a specific audience. Same data, different story. The user has already generated results — now reframe the narrative.

Audiences and what they care about:
- Department Head: clinical workflow improvement, staff satisfaction, diagnostic quality, academic output
- Hospital CFO: NPV, payback, cost-per-case, capital allocation, risk-adjusted returns
- Government Administrator: public health impact, scheme compliance (PMJAY/CGHS), procurement justification, equity of access
- Board/Trustees: strategic positioning, competitive advantage, reputation, long-term institutional value
- Grant Committee: innovation, research potential, scalability, alignment with funding priorities

Reframe the same findings for the selected audience. Adjust tone, metrics emphasized, and framing language. Do NOT change the underlying numbers.

User: {audience_type + calculator_results_json}
```

**4. What-If Analysis (Chat Interface)**
```
System: You are the TuroPath ROI advisor. You have the user's current calculator state. When they ask what-if questions:
1. Identify which parameters change
2. Recalculate and return updated metrics as JSON (so UI updates charts)
3. Explain the impact in plain language with specific numbers
4. Proactively suggest related what-ifs ("You might also want to explore...")
5. If they ask about strategy/presentation, advise based on audience context

Be conversational but precise. Always use their actual numbers.

User: What if we delay the second scanner purchase to year 3 instead of year 1?
```

**5. PDF Executive Summary (Phase 4)**
```
System: Generate a professional executive summary for a digital pathology business case. This will be the first page of a PDF the user hands to their leadership. It must be:
- Tailored to the selected audience (CFO vs department head vs government admin)
- Lead with the headline insight (their strongest value driver with specific numbers)
- Include key metrics (NPV, payback, ROI) naturally woven into narrative, not as a bullet dump
- Reference the institution's specific context (volume, staffing, challenges)
- Close with a clear, confident recommendation and suggested next step
- 250-400 words, professional tone, no buzzwords, no hedging

User: {calculator_results_json + institution_profile + audience_type}
```

### API Configuration
- Model: claude-sonnet-4-20250514
- Max tokens: 1000 for interpretations, 2000 for executive summaries
- API key: user-provided via settings modal (stored in localStorage, never transmitted elsewhere)
- All calls client-side via fetch to api.anthropic.com

---

## PART 7: IMPLEMENTATION PLAN FOR CLAUDE CODE

### File Structure
```
turopath-roi-calculator/
├── index.html          # Main entry, all screens
├── css/
│   └── styles.css      # TuroPath branded styles
├── js/
│   ├── app.js          # Main app controller, screen navigation
│   ├── regions.js      # Region/sub-profile defaults (JSON data)
│   ├── calculator.js   # All computation logic (NPV, ROI, domain calcs)
│   ├── charts.js       # Chart rendering (Chart.js)
│   ├── claude.js       # Claude API integration
│   ├── pdf.js          # PDF export logic
│   ├── wizard.js       # Questionnaire wizard logic, validation, skip
│   └── assumptions.js  # Assumptions ledger tracking
├── assets/
│   └── logo.svg        # TuroPath logo
└── README.md
```

### CRITICAL: Assumptions Ledger (assumptions.js)

**Every single default value, estimate, formula coefficient, and Claude-suggested adjustment must be logged in a structured assumptions ledger.** This is non-negotiable. The purpose is to produce a document that Turo can hand to practicing lab directors and administrators to verify every assumption before this tool ships as a product.

**What the ledger tracks:**
For every value used in computation:
```json
{
  "id": "pathologist_salary_annual",
  "label": "Pathologist annual salary",
  "value": 1800000,
  "currency": "INR",
  "source": "region_default",
  "source_detail": "India > Government Medical College profile",
  "user_modified": false,
  "claude_modified": false,
  "claude_reasoning": null,
  "evidence_basis": "Based on 7th CPC pay scale for Associate Professor (Level 13A), typical government medical college",
  "confidence": "medium",
  "verification_status": "unverified",
  "notes": "",
  "domain": "clinical_operations",
  "category": "salary"
}
```

**Source types:**
- `region_default` — hardcoded in regions.js with documented basis
- `user_input` — directly entered by user
- `claude_estimated` — Claude filled in for a skipped section (must include reasoning)
- `claude_adjusted` — Claude suggested changing a user input (must include reasoning + original value)
- `published_evidence` — derived from a specific cited paper
- `formula_derived` — calculated from other inputs (document the formula)

**Confidence levels:**
- `high` — based on published peer-reviewed data or direct user input
- `medium` — based on reasonable estimates from comparable institutions or expert opinion
- `low` — rough estimate, limited evidence, high uncertainty
- `qualitative` — not a hard number (e.g., burnout risk score)

**Verification status:**
- `unverified` — default for all assumptions until reviewed
- `verified` — a lab director/administrator has confirmed this is reasonable
- `disputed` — reviewer flagged this as inaccurate for their context
- `not_applicable` — reviewer confirmed this domain doesn't apply

**The ledger must be:**
1. Viewable in-app as a dedicated "Assumptions & Methodology" tab on the dashboard
2. Exportable as a standalone document (separate from the PDF business case) — either CSV or a clean formatted PDF/HTML
3. Filterable by: domain, source type, confidence level, verification status
4. Editable: reviewers should be able to add notes/comments to each assumption
5. Versioned: if the user runs the calculator multiple times with adjustments, track which assumptions changed

**In the PDF export**, the assumptions section should clearly distinguish:
- What came from published evidence (with citation)
- What came from region defaults (with basis documented)
- What the user entered
- What Claude estimated or adjusted (with Claude's reasoning shown)
- Confidence level for each

**For regions.js**, every hardcoded default MUST have a comment or accompanying JSON field documenting the basis. Examples:
```javascript
// India > Government Medical College
pathologist_salary_annual: 1800000,
// Basis: 7th CPC Level 13A (Associate Professor), ₹1,31,400–2,17,100/month.
// Mid-range ~₹1,50,000/month = ₹18,00,000/year.
// Does NOT include NPA (non-practicing allowance) which would add 20-25%.
// Verification needed: actual take-home varies by state, seniority.

scanner_cost: 10000000,
// Basis: Mid-range WSI scanner (e.g., 3DHistech P1000, Hamamatsu S360)
// at Indian distributor pricing including GST.
// Range: ₹60L (basic) to ₹2Cr+ (high-throughput Leica/Philips).
// Verification needed: actual GeM portal tender prices.
```

This assumptions documentation is what separates a toy calculator from a credible product. It lets us:
- Get expert review before launch
- Build trust with users (they can see exactly what's behind every number)
- Iterate with real-world feedback
- Publish the methodology (potential paper)

### Build Order (Suggested Sprint Sequence)

**Sprint 1 — Skeleton + Region Profiles + Assumptions Ledger**
- index.html with screen structure (onboarding → wizard → pre-estimation review → dashboard)
- CSS with TuroPath branding
- regions.js with India (4 sub-profiles) + US (3 sub-profiles) defaults — **every default must have a documented basis as a comment or JSON field**
- assumptions.js — the ledger module that tracks every value's source, confidence, reasoning, and verification status
- Screen navigation (app.js)

**Sprint 2 — Wizard**
- All 14 wizard sections with form inputs
- Pre-population from region defaults
- Skip logic
- Running tally sidebar
- Input validation
- Every user input and every default used is logged to the assumptions ledger

**Sprint 3 — Claude Pre-Estimation Review (Phase 2.5)**
- Claude API call with full wizard state
- Parse structured findings JSON
- Review UI: checklist with Accept/Modify/Ignore per finding
- Log all Claude adjustments to assumptions ledger with reasoning
- Only proceed to computation after user confirms

**Sprint 4 — Calculator Engine**
- calculator.js with all domain formulas
- Year-by-year projection
- NPV, IRR, payback, ROI calculations
- Sensitivity analysis engine

**Sprint 5 — Dashboard**
- Chart.js integration
- J-curve, pie charts, waterfall, tornado diagram
- Summary cards
- Year-by-year table
- Attribution panel (path dept vs hospital)
- **Assumptions & Methodology tab** — filterable view of full assumptions ledger (filter by domain, source type, confidence, verification status)

**Sprint 6 — Claude Interpretation + What-If Chat**
- Region refinement call (Phase 1)
- Auto-interpretation on dashboard load
- Chat interface for what-if (updates charts dynamically)
- Executive summary generation
- All Claude outputs logged to assumptions ledger

**Sprint 7 — PDF Export**
- jsPDF + html2canvas
- Cover page, charts, tables, interpretation
- **Dedicated assumptions appendix** in PDF: every value with its source, basis, confidence level, and verification status
- **Separate standalone assumptions export** (CSV) for lab director review — this is the "hand it to someone who runs a lab" document
- Branded formatting

**Sprint 8 — Polish**
- Responsive design
- Additional region profiles (EU, Middle East, SEA, Africa)
- Edge case handling
- Documentation
- Assumptions ledger review workflow (mark as verified/disputed)

### Key Implementation Notes
- All computation is client-side JS — no server needed
- Claude API calls are the only network dependency
- Use CDNs for Chart.js, jsPDF, html2canvas
- The calculator state should be a single JS object that can be serialized to JSON (for Claude calls and PDF export)
- Consider localStorage for saving/resuming sessions (with clear privacy notice)
- All monetary values stored internally in local currency; USD equivalent shown optionally
- Charts must be printer-friendly (white backgrounds, clear labels)

---

## PART 8: REFERENCES

1. Ardon O, et al. J Pathol Inform. 2024;15:100376. (DPA ROI Calculator paper)
2. Hanna MG, et al. Arch Pathol Lab Med. 2019;143(12):1545-1555. (MSK cost analysis)
3. Ho J, et al. J Pathol Inform. 2014;5:33. ($18M savings projection)
4. Baidoshvili A, et al. Histopathology. 2018;73:784-794. (Time savings)
5. Matias-Guiu X, et al. Virchows Archiv. 2025;487:815-826. (7-year NPV, J-curve)
6. Ardon O, et al. J Pathol Inform. 2023. (MSK logistics/legal savings)
7. Vodovnik A. J Pathol Inform. 2018. (Canadian hub-and-spoke)
8. Vodovnik A. J Pathol Inform. 2024. (10-year productivity study)
9. Childers CP, Maggard-Gibbons M. JAMA Surg. 2018. (OR costs)
10. Thomas TJ, et al. J Orthop Bus. 2022. (OR costs by complexity)
11. Laurent-Bellue A, et al. Am J Clin Pathol. 2020. (Telepathology FS)
12. Blick KE. Ann Clin Lab Sci. 2010. (TAT and ED LOS)
13. Sectra Medical. "Guidance on how to create a business case for digital pathology." Whitepaper.
14. Am J Surg Pathol. 2024;48(7):846-854. (AI breast lymph node efficiency)
15. JAMA Netw Open. 2020;3(11):e2023267. (AI prostate biopsy efficiency)
