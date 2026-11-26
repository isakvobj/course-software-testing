# Ctrip baseline coverage

This guide summarizes the declared scenarios in 97 specs containing 152 tests. Check the relevant specs, helpers, and fixtures for exact inputs and assertions. Each spec uses its requirement ID as its filename. [Baseline instructions](../baseline/README.md) · [Helpers](../baseline/helpers.ts) · [Fixtures](../baseline/fixtures/data.ts)

| Area | Existing scenarios |
| --- | --- |
| Account access (REQ-1.1–1.15) | Signed-out entry and logout persistence, password and SMS modes, email/username/mobile login, missing or incorrect credentials, legal acceptance, SMS code delivery and validation, registration agreement and verification, account creation, password composition, length and confirmation. |
| Flight search (REQ-2.1–2.16) | Trip mode, city swap and city selectors, departure and return date rules, matching flights and empty results, identical cities, children and Economy preference, anonymous history, criteria changes, nearby and monthly fares, sorting, fare expansion, Economy booking, and combining or removing airline and nonstop filters. |
| Booking and payment (REQ-3.1–3.15) | Travel reminders, two-passenger total, valid and invalid identity, passenger dialog and removal, contact mobile edits, insurance, baggage, drop-off and lounge services, optional fee totals and removal, terms and ID submission checks, unpaid order creation, and simulated Alipay. |
| Orders (REQ-4.1–4.7) | Entry from account menu, order status filters, exact order-number search, unpaid itinerary and countdown, refund/change conditions, confirmed and declined cancellation, and account-scoped listings. |
| Saved information (REQ-5.1–5.19) | Personal center navigation, traveler creation/edit/search and masked identity, address creation and details, contact search and default designation, company invoice titles and VAT fields, taxpayer ID validation, search exclusions, single and batch deletion across record types, and declined traveler deletion. |
| Profile and security settings (REQ-6.1–6.9) | Masked personal data, profile edits that persist, security reminder, password change and reauthentication, phone and email verification progress, incorrect current passwords, and incorrect current-email code. |
| Flight status (REQ-7.1–7.8) | Service entry, flight and route results, ground services, route swap before querying, query mode switching, recording and reusing both query types, and clearing and scoping history by account. |
| Reimbursement (REQ-8.1–8.4) | Service entry, completed voucher and issuance rules, current and older eligible orders, empty pending list, and account-specific eligibility. |
| Airport guide (REQ-9.1–9.4) | Entry, popular airport links, domestic city initials and weather, default airport overview, bus timetable, medical hotline, and domestic and international directories. |

For example, the nonstop and airline combination already has a test that checks the exact remaining results. The baseline also checks removing the airline filter while keeping nonstop. [REQ-2.9](../baseline/REQ-2.9.spec.ts) · [REQ-2.16](../baseline/REQ-2.16.spec.ts)

The traveler batch deletion test also verifies that an unselected traveler remains and that the result persists after reload. [REQ-5.10](../baseline/REQ-5.10.spec.ts)
