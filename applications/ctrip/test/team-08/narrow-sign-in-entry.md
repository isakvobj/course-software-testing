# REQ-1.1 Test: Narrow homepage hides the combined sign-in link

## Description

On a phone-width viewport, the signed-out homepage loses the required combined **Log in and Register** navigation link.

## Requirement: Expected Output

REQ-1.1 requires exactly one **Log in and Register** link within **Global navigation** on the signed-out homepage. The requirement gives no viewport exception. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

**Black-box design.** Use a desktop viewport as a positive control and a phone-width viewport to test the same required link at a different layout width.

1. Open the signed-out homepage at 1280 × 900.
2. Verify that **Global navigation** exposes one **Log in and Register** link.
3. Resize the viewport to 390 × 844 and wait for the **Ctrip Travel** heading to be visible.
4. Count the combined link in the same navigation landmark.

The REQ-1.1 baseline checks separate **Log in** and **Register** links at its default viewport. This case checks the combined link named in the written requirement across a responsive transition. [Baseline REQ-1.1](../baseline/REQ-1.1.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](navigation-accessibility.cjs)

```powershell
node applications/ctrip/test/team-08/navigation-accessibility.cjs $ctripUrl narrow-sign-in
```

## Observed Output

Chromium finds one combined link at 1280 pixels and zero at 390 pixels. Separate **Log in** and **Register** links are still available.

[390-pixel homepage screenshot](assets/narrow-sign-in-entry.png)
