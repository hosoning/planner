# Arcana — Private Tarot Itinerary MVP

Start with [SPEC.md](SPEC.md) for the full contract and [EDITORIAL.md](EDITORIAL.md) for all 50 questions. The complete 78-card ontology and 7,800 mappings are in `data/`.

## Current status

Working private MVP with demonstration data, cryptographic server-side draw, immutable commitment, D1 compare-and-set calibration, full failed-round replacement, deterministic constraint planner, responsive UI and print/screenshot view. No generative AI services or runtime dependency.

Google Places New, Routes and Weather adapters are implemented. **Live production integration is not verified without an owner-provided Google Maps Platform API key and a verified city catalog.** Demonstration venues, weather, opening hours and routes are fictional and visibly labelled. Do not use demo output for travel.

## Run locally

Node 22.13+ and npm are required.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_broken_madrox.sql
npm start
```

Preview binds `127.0.0.1:8787`. Apply the schema only once to a fresh local database. Hosting migrations are managed by Sites. The default npm build uses the configured portable profile; hosting uses the bundled Sites build helper.

## Validation

```sh
npx tsc --noEmit
node --import tsx --test tests/core.test.ts
node tests/http.mjs
```

The HTTP checks require the running local preview and initialized database. They create disposable local test rounds. `tsx` is currently available through the starter's dependency tree; use `npx tsx --test tests/core.test.ts` if a future dependency update removes it.

## Enable real data

Keep the deployment owner-private. Configure server secrets with Sites environment settings; never add them to source or send them through the browser form.

- `GOOGLE_MAPS_API_KEY`: a key restricted to Places API (New), Routes API and Weather API. Enable those APIs and billing in the owner's Google Cloud project. Configure provider quotas.
- `VERIFIED_POI_CATALOG`: JSON array matching `VerifiedRecord` in `lib/tarot/google.ts`. Each place requires its real Google place ID, exact city, IANA timezone, real area, urban/suburban classification, structured activity/cuisine tags, currency, **all-in cost cap in minor units**, duration, indoor/outdoor and meal flags, valid dates, checked timestamp and HTTPS evidence URL. `allInCap` must be true only when verified, including required fees and taxes. Optional `transitCap` is a verified per-journey fare upper bound in the same currency; estimated fare alone is not accepted. `menu` may contain a real dish, source URL and expiry. Operator activities require `operatorConfirmed: true` plus `availability: [{date, start, end}]` with destination-local minutes for actual confirmed operating slots.
- `DAILY_PROVIDER_LIMIT`: default 500 API calls per UTC day, maximum 10,000. Additional cap: 40 upstream calls per plan. No pre-calibration API calls.

Do not put invented Google IDs or estimated prices in the verified catalog. The live selector stays disabled until a key and structurally valid records exist; candidate records are further checked against the chosen date/currency/city. A configured key is not proof that billing/permissions work; the first live request must be validated.

No full Google place cache is persisted. Live responses use request-scoped data and `Cache-Control: no-store`. Revalidation retains the same tarot snapshot. Out-of-horizon weather or missing dated opening intervals produces no eligible stop. The optimizer is bounded beam search and may return no complete plan even if a larger search could find one.

## Private delivery

Site identity is in `.openai/hosting.json`. Source and deployment are kept private through Sites; no public GitHub repository was created. Do not change access settings without the owner's instruction.

## Known MVP limits

- One adult; one destination day; start at first stop and end at last stop. No hotel/airport return leg.
- No booking or guaranteed stock/table availability. Only explicitly verified operator slots may be used for slot-dependent activities.
- Live exact-time opening data and weather must be available; far-future planning can legitimately fail.
- Mapping is editorial symbolism, not evidence that tarot predicts current facts. Ties use fixed option ordering.
- Page reload currently returns to trip entry; D1 preserves round authority for retries in an active UI session.
- Browser print/PDF and screenshot view are provided; there is no public share link.

## Edition II (2026-10-07)

See `SPEC-V2.md`, which supersedes the v1 calibration UI, spread, duration and surprise behavior.

- 41 cards in one draw: calibration + 40 formal detail decisions.
- Prediction first, then yes/no/skip. Both passed and failed rounds have commitment proofs.
- Short trips and next-day/overnight end times; 1–4 meals, start windows, home/takeaway/restaurant class, per-stop region and activity confirmations.
- Every stop has name/address, inbound mode/time/cost, booking metadata, deposit status. Demo booking pages are local explanatory fixtures, not real reservations.
- Surprise results are server-redacted until each release time; first stop gets two hours' notice. The executor still needs to confirm actual initial travel time with the participant.
- Explicit organizer Markdown export contains all spoilers and timed messages. Spoiler-free ICS reminders link to the private app. Files must be forwarded/imported by the user; the app sends no messages or background push. The open page polls every 30 seconds.
- D1 saves the chosen itinerary and user-recorded booking/payment/gift completion. Reload resumes it. Recording a confirmation does not make a booking or pay money.

### Additional live catalog fields

Each record now requires operator-owned `name`, `address`, and `booking` (required, URL, status, depositKind, deposit in cents, deadline, cancellation terms). `region` is one of downtown/north/coquitlam/richmond/kitsilano/other for Vancouver; `mealStyle` is home/takeaway/regular/premium. Add true cuisine and activity tags. Never supply home meals without a verified actual base/meal arrangement.

`routeCaps[destinationPlaceId + ':' + mode]` must contain a verified conservative `minutes`, `cost` in cents, `validUntil` date and HTTPS `source`. Google verifies its current estimate against this operator-owned cap; an exceeded cap is rejected. Only the operator-owned cap is saved with the itinerary. Saved plans strip Google coordinates, opening periods and attributions; full Google responses are not stored. A saved plan records validation time, not a promise that conditions cannot change. Check operational changes with the venue/operator before travel.

Apply `drizzle/0001_flashy_clint_barton.sql` once to an existing local v1 database (same wrangler command as above, new filename). Sites applies this additive migration during publication. Do not reapply v1 migration to an existing database.

Run `node --import tsx --test tests/core.test.ts` and, with local preview running, `node tests/http.mjs` for the v2 tests.
