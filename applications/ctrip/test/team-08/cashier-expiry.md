# REQ-3.8 Test: Cashier controls after the countdown reaches zero

## Description

The cashier continues to offer payment when its visible countdown expires.

## Requirement: Expected Output

REQ-3.8 states unpaid orders are cancelled when the timer expires. This case checks the resulting cashier UI and uses the browser clock to reach zero. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

Black-box Playwright test. Start from the signed-out homepage on the course clock. Book JD5162 Economy for July 21 from Chengdu to Guangzhou. Enter Wang Wu, ID `110101199001011237`, and mobile `13800000014`. Accept the terms and submit. Advance the browser clock past the remaining time shown by the cashier.

The baseline checks a positive initial timer and the cancellation reminder. REQ-4.4 checks that a timer decreases. This test reaches zero. [Baseline REQ-3.8](../baseline/REQ-3.8.spec.ts)

Run the associated script with the dependency and command instructions in the team README. [Script](booking-boundaries.cjs) · [Run instructions](README.md#run-the-scripts)

## Observed Output

The timer reaches `00:00` and **Pay now** stays enabled. This check covers browser behavior. It does not establish server-side cancellation behavior.
