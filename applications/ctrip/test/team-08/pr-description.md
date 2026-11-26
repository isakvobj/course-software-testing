## Description

Team 08 reproduced ten Ctrip failures in Chromium using seven black-box and three white-box tests. Expected behavior follows the supplied course requirements and reference material. The cases below include the distinct baseline coverage, reproduction steps, and evidence for each finding.

## Test cases

| Requirement | Finding | Observed output and expected-behavior basis |
| --- | --- | --- |
| REQ-1.1 | [Narrow sign-in entry](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/narrow-sign-in-entry.md) | At 390 pixels, the signed-out homepage loses the combined **Log in and Register** link. |
| REQ-2.3 | [Return stays earlier than departure](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/return-after-departure.md) | After departure changes to July 26, July 25 remains selected as the return. |
| REQ-2.3 / REQ-2.8 | [Monthly fares accepts July 18](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/past-monthly-fare.md) | The results calendar disables July 18 while Monthly fares accepts it. This applies the past-date rule to both selectors for the same departure field. |
| REQ-3.5 | [Invalid contact alert appears in the wrong region](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/invalid-contact-region.md) | The mobile validation alert appears near **Submit order**, outside **Contact information**. |
| REQ-3.8 / REQ-4.1 | [One booking produces two orders](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/duplicate-booking-submit.md) | A double-click while submission is pending creates two distinct orders. The test treats both activations of the same pending form submission as one booking attempt. |
| REQ-4.2 | [Order filter resets elapsed countdown time](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/order-countdown-filter.md) | Selecting **Pending payment** gives the same order back the 15 seconds it had counted down. |
| REQ-5 / REQ-5.9 | [Identical invoice title persists twice](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/duplicate-invoice-identity.md) | Two separate completed saves of the same title and taxpayer ID leave two matching records after reload. |
| REQ-5.15 | [Earlier address response replaces the latest selection](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/stale-address-detail.md) | A late Shanghai response replaces the Beijing details while the URL still points to the Beijing address. |
| REQ-8.3 | [Newly paid booking is missing from Pending vouchers](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/new-paid-voucher.md) | The newly paid booking is absent while a seeded eligible order appears. The test infers eligibility from the matched account, flight, travel date, payment date, and absence of a voucher application. |
| REQ-9.2 | [Domestic airport links open the wrong city](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/domestic-airport-links.md) | Chongqing and Changchun both open Beijing Capital Airport. Chengdu opens the correct airport. |

## Reproduction

Run an individual case with its documented Playwright command against a local Ctrip course instance. The write-ups include black-box screenshots or white-box output and source references. [Team 08 setup and run commands](https://github.com/isakvobj/course-software-testing/blob/group-8/applications/ctrip/test/team-08/README.md#run-the-scripts)
