# REQ-5 / REQ-5.9 Test: An identical company invoice title persists twice

## Description

Saving an identical company invoice title again in a separate completed form interaction creates another record for the same business identity.

## Requirement: Expected Output

REQ-5 requires exactly one record per business identity in the appropriate list region and identifies invoice records by title. REQ-5.9 requires saved company titles to persist. After saving the same title and taxpayer ID twice, the list should still contain one record for that identity. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

Black-box Playwright test. Use the local course instance and sign in as `ctrip_invoice_create@example.com` with fixture password `Travel1234`.

1. Open **My account** → **Personal center** → **Common information** → **Invoice titles**.
2. Add a **Company** record using an isolated title of the form `Shanghai Team 08 <run ID> Co., Ltd.` and taxpayer ID `91310000123456789B`. Save and verify there is one matching record.
3. Reload, open **Add invoice title** again, and save the identical title and taxpayer ID.
4. Reload after the second save completes and count records with the isolated title.

The REQ-5.9 baseline saves a title once. The earlier Team 08 booking test activates one submission twice before completion. This case tests identity uniqueness after two separate completed saves. [Baseline REQ-5.9](../baseline/REQ-5.9.spec.ts) · [Booking comparison](duplicate-booking-submit.md)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](saved-information.cjs)

```powershell
node applications/ctrip/test/team-08/saved-information.cjs $ctripUrl invoice-identity
```

## Observed Output

Two records with the same isolated title and taxpayer ID remain after reload. The records stay in the local test instance.

[Screenshot of the duplicated title after reload](assets/duplicate-invoice-identity.png)
