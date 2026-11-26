# REQ-3.5 Test: Show invalid contact feedback in Contact information

## Description

Booking rejects an invalid mobile but renders the alert outside the contact region.

## Requirement: Expected Output

REQ-3.5 identifies **Contact information** as the contact-validation region. A mobile validation alert should appear within it. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

**Black-box design.** Start signed out under the course clock. Use a short invalid mobile with valid passenger data and accepted terms to isolate contact validation.

1. Search Chengdu to Guangzhou for **2026-07-21** and book JD5162 Economy.
2. Enter Wang Wu, ID `110101199001011237`, and contact mobile `123`.
3. Accept the booking terms and click **Submit order**.
4. Locate the mobile validation alert and check whether it is inside **Contact information**.

The baseline replaces a prefilled mobile with a valid one. This test submits an invalid mobile with valid passenger data. [Baseline REQ-3.5](../baseline/REQ-3.5.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](booking-boundaries.cjs)

```powershell
node applications/ctrip/test/team-08/booking-boundaries.cjs $ctripUrl contact-alert
```

## Observed Output

The page displays “Enter a valid contact mobile number” outside **Contact information**. The region contains zero alerts.

### Screenshots

**1. JD5162 Economy fare is open on the results page**

![JD5162 Economy fare is open on the results page](assets/invalid-contact-region-flight-fare.png)

**2. The booking form contains valid passenger data and contact mobile 123**

![The booking form contains valid passenger data and contact mobile 123](assets/invalid-contact-region-completed-form.png)

**3. The submitted form displays the mobile alert by Submit order, outside Contact information**

![The submitted form displays the mobile alert by Submit order, outside Contact information](assets/invalid-contact-region.png)
