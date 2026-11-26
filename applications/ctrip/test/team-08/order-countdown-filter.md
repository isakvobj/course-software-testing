# REQ-4.2 Test: Filtering orders resets the payment countdown

## Description

Changing the order status filter adds time to the countdown for the same unpaid order.

## Requirement: Expected Output

REQ-4.2 filters the order list by status. The shared requirement says public countdowns use elapsed time, so changing the filter should preserve the time already elapsed for the same order. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

White-box design with Playwright UI verification. In `renderOrders`, the status-tab handler calls `renderList()`. That function clears the active timers, sets `started = Date.now()`, and reuses each order's original `remaining_seconds`. Waiting 15 seconds before changing the filter makes that reset visible on the same record. [Order list source](../../frontend/pages-account.js#L798)

Use the course clock and the `ctrip_order_read@example.com` fixture with password `Travel1234`. The seeded order needs to be pending with more than 15 seconds left.

1. Sign in and open **My account** → **Orders**.
2. In **All orders**, read **Time remaining** in order `CTRIP20260721001`.
3. Advance the browser clock by 15 seconds and verify the timer decreases.
4. Select **Pending payment**, then read the timer for the same order again.

REQ-4.2 checks which orders remain after filtering. REQ-4.4 checks that an order-detail timer decreases. This case measures the list timer on both sides of a filter change. [Baseline REQ-4.2](../baseline/REQ-4.2.spec.ts) · [Baseline REQ-4.4](../baseline/REQ-4.4.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](search-and-order-state.cjs)

```powershell
node applications/ctrip/test/team-08/search-and-order-state.cjs $ctripUrl order-countdown
```

## Observed Output

The same unpaid order regained 15 seconds after the filter changed.

```text
FAIL REQ-4.2 — Changing order tabs must preserve elapsed countdown time
The same order gained 15 seconds after changing the status filter
```
