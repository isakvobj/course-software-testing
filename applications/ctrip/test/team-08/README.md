# Ctrip testing findings for Team 08

Members: Isak Bjelland Vormeland and Yizhen Han

## Ten submission candidates

See the [submission eligibility audit](submission-audit.md) for the scope, baseline comparison, and evidence for each case.

| Case | Design method |
| --- | --- |
| [REQ-1.1 — Narrow homepage hides the combined sign-in link](narrow-sign-in-entry.md) | Black-box |
| [REQ-2.3 — Changing departure leaves an earlier return](return-after-departure.md) | Black-box |
| [REQ-2.3 / REQ-2.8 — Monthly fares accepts a disabled departure date](past-monthly-fare.md) | Black-box |
| [REQ-3.5 — Invalid mobile alert appears outside Contact information](invalid-contact-region.md) | Black-box |
| [REQ-3.8 / REQ-4.1 — One booking creates two orders](duplicate-booking-submit.md) | Black-box |
| [REQ-4.2 — Filtering orders resets the payment countdown](order-countdown-filter.md) | White-box |
| [REQ-5 / REQ-5.9 — An identical company invoice title persists twice](duplicate-invoice-identity.md) | Black-box |
| [REQ-5.15 — A delayed response replaces the selected address](stale-address-detail.md) | White-box |
| [REQ-8.3 — A newly paid eligible order is missing from Pending vouchers](new-paid-voucher.md) | White-box |
| [REQ-9.2 — Domestic airport links open the wrong city](domestic-airport-links.md) | Black-box |

The audit records the closest baseline tests, the strength of each requirement link, and the observations that need more evidence. The course requirements and supplied reference material establish the expected outputs. A separate reference-system run remains unverified. [Submission audit](submission-audit.md)

### Run the scripts

These commands were verified with Node.js 24, Playwright 1.57.0, and Chromium. From the repository root, start Ctrip in one PowerShell terminal and leave it running.

```powershell
Set-Location applications/ctrip
.\start.bat
```

In a second PowerShell terminal at the repository root, install the test dependencies in a temporary directory and set `$ctripUrl` to the URL printed by the launcher. Run any case independently.

Use a dedicated local course instance. The order-lifecycle tests create simulated orders and the voucher test pays through the simulated cashier. The saved-information tests create invoice titles and mailing addresses. The countdown test needs the seeded pending order to have more than 15 seconds remaining.

```powershell
$testDeps = Join-Path $env:TEMP 'ctrip-team08-playwright'
npm.cmd install --prefix $testDeps playwright@1.57.0
& (Join-Path $testDeps 'node_modules/.bin/playwright.cmd') install chromium
$env:NODE_PATH = Join-Path $testDeps 'node_modules'

$ctripUrl = 'http://127.0.0.1:3000'
node applications/ctrip/test/team-08/navigation-accessibility.cjs $ctripUrl narrow-sign-in
node applications/ctrip/test/team-08/journey-dates.cjs $ctripUrl earlier-return
node applications/ctrip/test/team-08/journey-dates.cjs $ctripUrl past-monthly-fare
node applications/ctrip/test/team-08/booking-boundaries.cjs $ctripUrl contact-alert
node applications/ctrip/test/team-08/order-lifecycle.cjs $ctripUrl duplicate-submit
node applications/ctrip/test/team-08/search-and-order-state.cjs $ctripUrl order-countdown
node applications/ctrip/test/team-08/saved-information.cjs $ctripUrl invoice-identity
node applications/ctrip/test/team-08/saved-information.cjs $ctripUrl latest-address
node applications/ctrip/test/team-08/order-lifecycle.cjs $ctripUrl new-paid-voucher
node applications/ctrip/test/team-08/airport-city-links.cjs $ctripUrl
```

Scripts with multiple cases require a case ID and run only that case. The airport script checks three city links as one case. A failed assertion gives exit status 1. All scripts use the course clock of July 19, 2026 in Asia/Shanghai.

## Screenshot evidence

Each black-box write-up embeds a captioned sequence of screenshots from the key steps through the observed result. Chromium captured the images against isolated local course instances. The PNGs are in `assets/`, and the Playwright assertions provide the exact labels, record counts, and navigation context.

## Submission rules

**Submit the test script that exposes each bug. Leave application and baseline code untouched. Skip debugging or fixing the bug.** Document how to run the script and what it exposes. Keep scripts and supporting evidence in this team directory.

Use the [Ctrip requirements](../../requirements/requirements.yaml) to identify the behavior under test and the [prerequisites](../../requirements/prerequisites.md) to document setup.

## Check for overlap

Use the [baseline coverage guide](baseline-coverage.md) to find similar tests. Compare their setup, inputs, and assertions with your proposed case. Record the closest matches and what your test adds.

## Pull request format

Use `[Ctrip][Team 08] Add fault-revealing tests` as the PR title. In the body, link each case document and summarize each finding under `REQ-<ID> Test: <behavior>`, following the four headings in the linked case documents.

The draft PR body lists the ten shortlisted cases and includes the interpretation behind the outcomes that depend on it. [Draft PR body](pr-description.md)
