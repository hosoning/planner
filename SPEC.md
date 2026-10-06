# Arcana — private, deterministic Tarot itinerary MVP

Version 1 · 2026-10-06 · No generative AI at runtime

## 1. Product contract
A mobile-first, owner-private web application turns one atomic tarot draw into a feasible day. Inputs: city, local date, start/end time or all-day (09:00–21:00), ISO currency, total budget. The total covers planned admissions, meals, and transport for one adult; shopping purchases and optional extras are excluded and never scheduled as paid purchases. MVP starts/ends at the first/last stop; it does not silently assume a hotel or airport transfer. Same-day ranges only, 2–12 hours. Date and time refer to the destination, not the browser. No LLM calls, generated descriptions, inferred menus, or AI summaries.

## 2. Atomic draw and calibration
1. Validate input; create/reuse a secure HttpOnly session cookie.
2. One synchronous server-side cryptographic random transaction selects one of 50 questions, shuffles all 78 cards without replacement and independently chooses the orientation of each of 12 drawn cards. Rejection sampling eliminates modulo bias.
3. Positions: calibration, region, urban/suburban, pace, meals, cuisine, activity 1–4, sequence, transport. All positions are fixed before any user answer or Places request. Question-specific mapping selects one predeclared answer and locks it. The question choice and all cards live in an immutable JSON snapshot with versioned mapping.
4. Persist snapshot, salt and SHA-256 commitment, input and session ownership. Only calibration card, predicted answer, options, commitment, round ID and expiry are returned. Formal cards remain server-side.
5. Reveal is a compare-and-set from pending. Only exact option equality succeeds. Invalid answers do not consume the round. Concurrent/replayed answers cannot change the first accepted answer. On failure/skip, mark the whole round void and create an entirely new question/deck/orientations/prediction. No patching calibration or carrying formal cards forward. Same question/card may recur by genuine fresh chance.
6. On success, unlock formal cards and run the deterministic planner. Provider failure or no feasible solution does not trigger redraw: the same successful round can retry planning. A draw is not a guarantee that a feasible itinerary exists.
7. Server record expires after 24 hours. New draws invalidate pending rounds for that session. Persist no real-world facts beyond the selected option; no profile is trained. Commitment can be verified after reveal using the full serialized snapshot and salt. Tarot calibration is a game rule, not scientific evidence of accuracy.

## 3. Editorial data
`data/ontology.json` contains all 78 Rider–Waite–Smith cards, individual upright and reversed meanings, and weighted symbolic tags. These are designed game semantics, not empirical predictors. Reversals have their own meanings and vectors, not a universal sign flip.
`data/questions.json` contains exactly 50 fact questions, time boundaries, mutually exclusive ordered options, symbolic prototypes and a dedicated 156-entry (78 × 2) mapping per question. Every entry includes option scores and deterministic winning option. Mapping generation takes the dot product of that question's option prototypes with each card/orientation's ontology tags; tie-break is the option order. This yields 7,800 auditable mappings, never a hash/modulo answer assignment. Unknown/not applicable uses skip, which voids the entire round.
Categories: surroundings, body/current state, current activity, recent activity, recent interactions. Subjective states use explicit operational categories. Questions never ask for preferences or hidden third-party facts.

## 4. Itinerary architecture
Tarot ontology → position-specific intent → structured POI candidates → hard filters → tag score → beam route optimizer → verified output.
- Region card weights real locality/neighborhood tags and named areas; urban card weights central/suburban locations without inventing geography.
- Pace determines dwell multiplier and target stops; meals determines desired count constrained by duration and actual meal windows.
- Cuisine card scores actual restaurant cuisine tags. Activity cards score walk, beach, shopping, photography, exhibition, museum, skyline, boat, mountain, paragliding and fitness tags.
- Sequence card scores activity ordering. Transport card chooses walking or transit priority; candidates must still have validated routes and total transport cost.
- Lexicographic deterministic tie-break makes identical snapshot + data produce identical output.
- Bounded beam search evaluates permutations without reusing POIs. It is heuristic, not a proof of global optimality. An empty search reports no feasible result rather than relaxing hard constraints.

## 5. Hard constraints
A visit must be operational, have verified coordinates, known date-specific opening interval covering arrival through departure, verified duration, currency-compatible cost upper bound including relevant fees, sufficient weather coverage, and validated inbound route. Unknown means excluded. All monetary arithmetic uses integer cents. Routes include transit/waiting time; unknown fare is excluded unless a verified operator fare cap exists. Walking costs zero. Add 10-minute arrival buffers. Meal windows: breakfast 09–11, lunch 11–15, dinner 17–21. Daily total must stay within budget and final departure within the input interval. Closure, severe weather, unverified high-risk activity/operator availability, insufficient time or unreachable route always wins over a card score. Outdoor activities require hourly forecast coverage throughout the stop; rain/wind thresholds vary by activity. Paragliding needs operator-confirmed slot and weather, not just a tourist-attraction listing. Return trips/hotel transfers are out of MVP scope and clearly disclosed.

## 6. Real-data providers and limits
Selected: Google Places API (New), Routes API and Weather API, accessed exclusively on the server with `GOOGLE_MAPS_API_KEY`. No keys in client JS, URLs returned to users, logs or source. API key restrictions and Cloud billing quotas must be configured by the key owner. Never request AI summaries.
- Places Text Search: id, displayName, location, types, address components, businessStatus, Google Maps link. Bounded queries by tarot activity/cuisine and city. Details only for short-listed IDs: currentOpeningHours, UTC offset and provider attributions. No wildcard masks.
- Date-specific current hours are usable only within the returned coverage. Weekly regular hours are insufficient to verify a holiday/future date. Outside coverage, fail closed.
- Routes computeRoutes: duration, distanceMeters, transit fare. Departure-time transit routes; walking route estimates include buffer. Check route existence and matching currency.
- Weather hourly forecast: up to 240 hours, paginated only as required. Outside horizon, return `forecast_unavailable`, not synthetic weather. Outdoor stops validate all covered hours.
- Reliable all-in admission/meal upper bounds and operator slots are not generally supplied by Places. `VERIFIED_POI_CATALOG` is a server-only operator-curated JSON array keyed by Google place ID, with currency, cost cap, dwell, structured tags, validity dates, source URL, checked timestamp, and optional verified menu. Live planning rejects missing verified records. This is deliberate: a Places price level or restaurant price range is not a guaranteed total spend.
- Concrete dishes appear only from an unexpired source-linked menu record; otherwise output cuisine and venue only.
- Cache durable place IDs and our own editorial tags only. Google responses are request-scoped and not persisted as a POI database. User requests use no-store. The provider result is used to render the current response; subsequent live views revalidate. No photos or reviews requested. Show Google Maps attribution and returned third-party attributions.
- Controls: maximum 40 external requests per plan, 12 candidate details, bounded search (3), planner route budget, per-session rolling hourly draw limit. No background prefetch; no provider calls before calibration success. Deployment-wide daily quota enforced by D1; fail closed if exceeded. Google Cloud quota is the additional billing backstop.

Alternatives assessed: OSM/Overpass has useful tags but incomplete opening hours and price guarantees; public routing instances are not a production SLA; Open-Meteo requires evaluating commercial terms and adds a second attribution/provider lifecycle. Google is the initial integration because identifiers, places and transport coexist. All adapters are plain HTTP, replaceable and have injected transport for tests.

## 7. UX
Premium ivory/ink editorial style; compact header, functional trip form, decorative code-drawn tarot geometry. No emoji, no stock dashboard filler. Flow: trip → locked calibration → result/void-and-redraw → itinerary or truthful constraint failure. Visible mode badge distinguishes demonstration fixtures from live data. Demo uses explicitly fictional venues in a Vancouver-inspired sample geography, synthetic hours/weather/routes and CAD; it never claims verification of real establishments. Currency/city are locked in demo. Live mode only enabled with server credentials and verified catalog.
Results include ordered stops, timing, verified cost caps, travel duration/mode, symbolic rationale, sources, all cards, total budget and remaining amount. A clean print/screenshot view hides controls and calibration facts; there is no public share link. Keyboard controls, labeled fields, focus states, reduced-motion support, mobile viewport and accessible error status.

## 8. API and storage
D1 `rounds`: id, session_id, snapshot, salt, commitment, status, answer, created_at, expires_at. Status: pending, passed, void. Conditional UPDATE atomically consumes reveal. `usage`: bucket, count; atomic count caps for session/global calls. Secrets only via environment. Origin checks on all mutations, JSON-only requests, limited request size, secure session cookie in production, no user-supplied upstream URLs. Private Sites owner gate protects deployment; local preview binds loopback. App is not designed for public unauthenticated deployment.
POST `/api/round` creates a round or answers/skips/retries the current one. GET `/api/status` reports readiness without secrets. No endpoint leaks pending formal cards. Data exports/specs are available only within the private site/source.

## 9. Acceptance tests
Exactly 78 unique cards, 50 unique questions, 156 mappings per question; all option references and scores valid. Draw uniqueness, orientation independence, bounded random sampling. Calibration commitment, success, full failed redraw, skip, ownership, replay and race handling. Planner excludes closed/unknown-hours, over-budget, unreachable, forecast-missing, dangerous-weather, wrong-currency, insufficient-time and unverified-menu cases; exact boundary budgets pass. Compare deterministic repeat plans. API fixtures validate missing credentials, upstream errors and masks. Build/type validation and mobile/desktop interaction checks.

## 10. Delivery and non-goals
Private hosted site + full source/spec + test suite. No public GitHub repository. No app store wrapper, payments, booking, medical or financial guidance, or claim of divination accuracy. Production live acceptance requires actual credentials, provider billing enabled, and a verified city catalog. Demo tests cannot establish external API availability. This limitation must be disclosed at handoff.

## Primary provider references (checked 2026-10-06)
- https://developers.google.com/maps/documentation/places/web-service/place-details
- https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
- https://developers.google.com/maps/documentation/places/web-service/policies
- https://developers.google.com/maps/documentation/routes/compute_route_directions
- https://developers.google.com/maps/documentation/weather/reference/rest

## Implementation notes after validation
Cuisine tags are explicit symbolic weights: water→seafood, nature→vegetarian, comfort→bakery, focus→Japanese, group→Chinese, calm→Mediterranean. These are game-design choices, not cultural or factual claims. A venue must carry its actual curated cuisine tag to receive that weight. Each meal occupies a distinct breakfast/lunch/dinner window; two lunches cannot satisfy a two-meal draw. Candidate shortlist reserves eight activity and four meal slots so meals are not displaced by activity scoring. Demo route computations are free fixtures and can exceed the live route-query cap. Live route queries remain bounded at 20 within the 40-call per-plan cap.
