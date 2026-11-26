# REQ-5.15 Test: A delayed response replaces the selected address

## Description

An earlier address lookup can replace the details of a different address after that second address has been opened successfully.

## Requirement: Expected Output

REQ-5.15 requires **Address details** to show the recipient, city, district, street, and mobile for the record whose **View address** action the user activates. Once the user opens the second address, its details should remain associated with that selection. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

White-box design with Playwright UI verification. `renderAddressDetail` awaits the address lookup before rendering into the shared page. The test makes the first lookup finish last to exercise the stale completion path. Browser routing delays forwarding the original request without replacing any data. [Address detail source](../../frontend/pages-account.js#L314)

1. Sign in as `ctrip_address_detail@example.com` with fixture password `Travel1234`. Open **Addresses** from **Personal center** → **Common information**.
2. Create two addresses with distinct isolated recipient names, one for Shanghai and one for Beijing. Use district `Test district`, street `100 Test Avenue`, and mobile `13800000027` for both.
3. Click **View address** for Shanghai and hold its detail lookup.
4. Go back, click **View address** for Beijing, and wait for the Beijing recipient to render.
5. Release the Shanghai lookup and recheck the displayed recipient and current URL.

The baseline opens and verifies one address. This case opens two in succession and checks that a late earlier response cannot replace a newer selection. [Baseline REQ-5.15](../baseline/REQ-5.15.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](saved-information.cjs)

```powershell
node applications/ctrip/test/team-08/saved-information.cjs $ctripUrl latest-address
```

## Observed Output

The URL stays on the Beijing address, but **Address details** changes to the Shanghai recipient. The two test addresses stay in the local test instance.

```text
FAIL latest-address
The earlier lookup replaced the currently selected address
+ 'Team 08 Shanghai 48ba7731'
- 'Team 08 Beijing 48ba7731'
```
