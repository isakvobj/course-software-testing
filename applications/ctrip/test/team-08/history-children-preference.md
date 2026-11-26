# REQ-2.5 / REQ-2.6 Test: Search history drops the children preference

## Description

Reopening a search through the homepage search history restores the route and date but drops the children preference.

## Requirement: Expected Output

REQ-2.5 carries the children preference into flight results. This case interprets REQ-2.6 search reuse as restoring that preference too. REQ-2.6 explicitly names route and date, so this case depends on that broader interpretation. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

Black-box Playwright test. Start signed out in a fresh browser context under the course clock.

1. Search Chengdu to Guangzhou for July 21 with **Traveling with children** checked.
2. Confirm the results show **Children included**.
3. Click **Home**, then select **Chengdu - Guangzhou** in **Search history**.
4. Check whether the reopened results still show **Children included**.

The REQ-2.5 baseline checks the initial results. The REQ-2.6 baseline reopens the seeded route and date. This case creates a search with a preference through the UI and reopens it. [Baseline REQ-2.5](../baseline/REQ-2.5.spec.ts) · [Baseline REQ-2.6](../baseline/REQ-2.6.spec.ts)

Run the associated script using the team README. [Script](search-and-order-state.cjs) · [Run instructions](README.md#run-the-scripts)

## Observed Output

The reopened results omit **Children included**.
