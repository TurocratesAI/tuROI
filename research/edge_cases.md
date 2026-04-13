# Turoi — Edge Case Catalog

Narrative edge cases grouped by wizard section. For each, the registry must specify whether Turoi:
**(a)** handles it in code, **(b)** flags it in the Claude pre-estimation review prompt, or **(c)** documents it as a known limitation.

Any edge case that falls through all three is a blocker for Build Phase 5 (dashboard) → Build Phase 6 (Claude interpretation).

---

## Section 1: Clinical operations

1. **Shared histotech staffing across anatomic + clinical pathology** — pooled labs with combined AP/CP histotechs make productivity attribution noisy. → *Flag in Claude pre-estimation review.*
2. **Seasonal volume (agrarian region monsoon dip; tourism-medicine spike)** — annual-volume defaults miss this. → *Document as limitation; recommend user enter conservative annual average.*
3. **Pathologists reporting both AP and cytology** — productivity attribution split. → *Flag in Claude review; consider a reporting-mix field in a future iteration.*
4. **Residents / trainees providing partial reporting capacity** — not captured in FTE model. → *Document as limitation.*
5. **Locum coverage premium** — base salary underestimates true cost during vacancies. → *Flag in Claude review.*
6. **Single-pathologist practices** — salary abstraction breaks. → *Handle: when `pathologist_fte == 1`, Claude review should reframe productivity pillar as capacity creation rather than labor savings.*

## Section 2: Consults (sent/received)

1. **Pure outbound consult labs** (standalone diagnostic) — `consults_received_per_year = 0`; strategic pillar needs to reflect this. → *Handle in code (pillar formulas already weight received consults).*
2. **Academic centers with net inbound consult volume** — inverse of above. Strategic pillar should foreground revenue capture. → *Handle via audience-tailored dashboard insight.*
3. **Telepathology FS where the distant site already has digital** — courier cost is already zero. → *Flag in Claude review.*
4. **Consults routed through a subspecialty aggregator** — third-party takes a cut, reducing net revenue. → *Document; expose a margin factor in a future iteration.*

## Section 3: Equipment & infrastructure

1. **Refurbished or donated scanners** — capex is fraction of new. → *Flag in Claude review ("is this scanner refurbished, new, or grant-funded?").*
2. **Bundled procurement (scanner + software + storage)** — disaggregation is noisy. → *Flag in Claude review.*
3. **Subscription / usage-based pricing** (emerging vendor models) — not captured by one-time scanner cost. → *Document as limitation; add usage-based pricing mode in a future iteration.*
4. **Sites with existing partial digital deployment** — incremental ROI, not greenfield. → *Flag in Claude review ("is any part of the workflow already digital?").*
5. **Multi-head scope co-location** — frees space differently than archive consolidation. → *Handle via real-estate pillar; Claude review should surface if facility type is teaching.*

## Section 4: Staffing changes

1. **Geographic isolation driving vacancy, not workload** — burnout pillar mis-attributes. → *Flag in Claude review.*
2. **Rural / remote institutions where there is no replacement market** — burnout cost isn't "recruit replacement"; it's "the role stays empty". → *Handle: when region is Africa or LatAm, burnout pillar uses an alternative formulation (capacity gap cost).*

## Section 5: Archive & retrieval

1. **Labs that already outsource archive to a 3rd party** — savings accrue to vendor, not lab. → *Flag in Claude review.*
2. **Jurisdictions with 20+ year retention minimums** — free-sqft savings only realize after retention period. → *Flag in Claude review per region.*
3. **Archive colocated with hospital main store** — no per-sqft rent to save. → *Flag in Claude review.*

## Section 6: Material loss & rework

1. **Labs using Indian-made antibodies** — IHC cost is 1/3 of US reference cost. → *Handled via region-specific IHC cost defaults.*
2. **Automated vs manual staining** — cost structure differs materially. → *Document as limitation.*
3. **Labs running ISH/FISH in-house** — separate pricing. → *Document as limitation.*
4. **Consumable price volatility (supply chain disruptions, COVID-era)** — year-over-year inflation on consumables is higher than salary. → *Handle via separate consumable inflation knob — future iteration.*

## Section 7: Legal / medicolegal

1. **Jurisdictions with no pathology-specific malpractice claim history** — the entire pillar is not financial, it's reputational. → *Flag in Claude review.*
2. **Public-sector settings with state indemnification** — individual practitioner risk is zero; institutional risk is different. → *Flag in Claude review.*
3. **Countries where digital records are not yet legally admissible** — audit trail value is reduced. → *Document as limitation per region.*

## Section 8: Projection parameters

1. **Merging institution mid-horizon** — M&A activity invalidates the projection. → *Out of scope; document as limitation.*
2. **Reimbursement regime changes mid-horizon** (e.g. CMS AI code introduction) — strategic pillar should be probability-weighted. → *Handled via low-confidence flag on strategic pillar.*
3. **Currency crisis / hyperinflation** — discount rate assumption breaks. → *Document as limitation for LatAm and selected African regions.*

## Section 9: Frozen section / ROSE (hospital only)

1. **FS performed off-hours when OR isn't otherwise booked** — no opportunity cost. → *Flag in Claude review.*
2. **Trauma / neuro FS vs oncology FS** — different minute-saving profile. → *Document as limitation; foreground in Claude review for hospitals with significant trauma volume.*
3. **ROSE for FNA (cytopathology)** — different workflow than FS. → *Document; ROSE-specific handling is future scope.*

## Section 10: OR time (hospital only)

1. **OR cost not charged back to pathology** (common in public teaching hospitals) — the "saving" doesn't accrue to the pathology dept. → *Handled via attribution tagging; dashboard clearly labels the attribution.*
2. **NABH-accredited labs with itemized OR costing vs non-accredited** — OR cost per minute differs. → *Flag in Claude review.*
3. **Mixed public/private ORs in corporate hospitals** — different cost profiles. → *Document.*

## Section 11: Patient LOS (hospital only)

1. **LOS bottleneck is OT scheduling, not pathology** — savings don't materialize. → *Flag in Claude review.*
2. **Public-hospital LOS where bed cost ≠ opportunity cost** — attribution needs reframing. → *Handled via attribution mode + region-specific bed cost.*
3. **Day-care / ambulatory pathways** — no overnight bed cost to save. → *Flag in Claude review.*

## Section 12: Burnout & retention (hospital only)

1. **Non-physician burnout (histotech attrition)** — not captured in the physician-focused pillar. → *Document as limitation.*
2. **Attrition driven by geographic / family factors, not workload** — pillar over-attributes. → *Flag in Claude review.*
3. **Qualitative scoring drift over time** — confidence must stay low. → *Handle: pillar is always marked low-confidence regardless of user input.*

## Section 13: Real estate & space (hospital only)

1. **Leased vs owned property** — savings only realize on lease renewal. → *Flag in Claude review.*
2. **Public hospitals where real estate has no market price** — pillar is zero. → *Handled via region + profile type.*

## Section 14: Hub & spoke (diagnostic lab only)

1. **Chains with outsourced courier** — the savings flow to the courier, not the lab. → *Flag in Claude review.*
2. **Franchise-model chains** — revenue share changes the math; spoke savings accrue to franchisee. → *Flag in Claude review.*
3. **Seasonal disruption (monsoon, winter)** — courier cost inflates during peak months. → *Document as limitation.*
4. **Cross-state sub-specialty routing restrictions** (India, EU) — some consults can't legally leave state/country. → *Flag in Claude review per region.*
5. **Chains with partial existing digital deployment** — incremental ROI only. → *Flag in Claude review.*

## Section 15: Subspecialty routing (diagnostic lab only)

1. **Captive referrer bases (corporate tie-ups)** — commercial growth pillar mis-models. → *Flag in Claude review.*
2. **Chains in active acquisition** — valuation effects swamp ROI signal. → *Out of scope.*
3. **Markets with price controls** (Karnataka cap on diagnostic rates) — margin formula breaks. → *Flag in Claude review per sub-region.*

## Section 16: Commercial growth (diagnostic lab only)

1. **Conflicted procurement** — lab CEO owns the scanner market too. → *Document; not within Turoi's scope to detect.*
2. **Markets where national chains have already absorbed volume** — new-referrer growth projection breaks. → *Flag in Claude review when `pricing_pressure_level = high`.*

## Section 17: Consult revenue scalability (diagnostic lab only)

1. **Consult cannibalization** — digital lowers per-case price even as volume grows. → *Document; consult revenue pillar should include a pricing pressure factor (future iteration).*
2. **Geographic reach limit from language / regulatory barriers** — growth projection cap. → *Flag in Claude review.*

## Section 18: Data monetization & AI (chain only)

1. **Data ownership ambiguity** — patient consent vs institutional ownership. → *Document as limitation.*
2. **Jurisdictional data export restrictions** (DPDP Act India, GDPR EU) — partnership NPV drops materially. → *Flag in Claude review per region.*
3. **Partnership NPV highly skewed** — use probability-weighted value and flag low confidence. → *Handled in calculator.*
4. **Existing partial AI deployment** — incremental value only. → *Flag in Claude review.*

## Section 19: Revenue & strategic value (universal)

1. **AI reimbursement codes changing mid-horizon** — strategic pillar assumes current state. → *Flag in Claude review; document in registry.*
2. **Grant funding already budgeted** — double-counting risk. → *Flag in Claude review.*

---

## Cross-cutting edge cases

1. **Labs with existing partial digital deployment** — incremental ROI, not greenfield. → *Universal flag in Claude review; should be the first question the review asks.*
2. **Extremely small or extremely large scale** — formulas calibrated to mid-sized institutions. → *Flag when `annual_slide_volume < 20k` or `> 3M`.*
3. **Non-standard procurement (donor-funded, grant-funded)** — capex structure breaks. → *Flag in Claude review; surface an alternative capex mode.*
4. **Institutions mid-acquisition / mid-merger** — projection horizon assumption is invalid. → *Out of scope; document.*
5. **Users who skip half the wizard** — gap-filling via Claude review is the designed path. → *Handled.*
