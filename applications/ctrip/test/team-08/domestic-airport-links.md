# REQ-9.2 Test: Domestic airport links open the wrong city

## Description

The Chongqing and Changchun links in the domestic airport index both open Beijing Capital Airport.

## Requirement: Expected Output

REQ-9.2 calls for Chengdu, Chongqing, and Changchun links when the visitor selects C in **Domestic airports**. Each city link should open airport information for its named city. This uses the link labels and the airport directory behavior shown in the supplied airport guide and detail references. [Ctrip requirements](../../requirements/requirements.yaml) · [Airport guide reference](../../requirements/reference/airport1.png) · [Airport detail reference](../../requirements/reference/airport2.png)

## Test description

**Black-box design.** Start signed out under the course clock. Check all three city links specified by REQ-9.2 under **C**, using Chengdu as a positive control.

1. Open **Flights** → **More services** → **Domestic airport directory**.
2. Select **C**, click **Chengdu**, and record the airport details heading.
3. Reopen the directory and repeat for **Chongqing** and **Changchun**.
4. Compare each heading with the city named by the link.

The REQ-9.2 and REQ-9.4 baselines assert that the links are visible. The REQ-9.3 baseline opens Beijing through **Popular airports**. This test activates the three city links and checks the destination for each. [Baseline REQ-9.2](../baseline/REQ-9.2.spec.ts) · [Baseline REQ-9.3](../baseline/REQ-9.3.spec.ts) · [Baseline REQ-9.4](../baseline/REQ-9.4.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](airport-city-links.cjs)

```powershell
node applications/ctrip/test/team-08/airport-city-links.cjs $ctripUrl
```

## Observed Output

Chengdu opens Chengdu Tianfu Airport. Chongqing and Changchun both open Beijing Capital Airport. The two incorrect destinations are treated as one finding.

[Screenshot of the Beijing page after clicking Changchun](assets/domestic-airport-links.png)
