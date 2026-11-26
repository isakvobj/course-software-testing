# REQ-8.3 Test: A newly paid eligible order is missing from Pending vouchers

## Description

A simulated payment succeeds for a new booking, but Pending vouchers omits that order while displaying an equivalent seeded order for the same account.

## Requirement: Expected Output

REQ-8.3 lists eligible paid orders without a voucher application under **Pending**. The new order is for the same flight and date as the eligible fixture, paid on the benchmark date under the same account. It should appear in that list without any additional application step. [Ctrip requirements](../../requirements/requirements.yaml)

## Test description

White-box design with Playwright UI verification. In the backend, newly created orders leave `voucher_status` unset and simulated payment updates payment state and date. The `vouchers.list` loop skips an unset voucher status before checking paid-order eligibility. Choosing a UI-created order and comparing it with the matching seeded eligible order exercises that branch. [Voucher listing source](../../backend/app.py#L630)

1. Sign in to the local course instance as `ctrip_voucher_pending@example.com` with fixture password `Travel1234`.
2. Search Chengdu to Guangzhou for July 21 and book JD5162 Economy. Fill Wang Wu, ID `110101199001011237` and mobile `13800000014`. Accept the terms and submit once.
3. Record the new order number, select simulated **Alipay**, and click **Pay now**. Verify **Payment successful** for that number.
4. Open **More services** → **Reimbursement vouchers**. Verify that **Pending vouchers** lists the eligible seeded order `CTRIP20260721005`, then look for the newly paid order.

The voucher baseline uses existing paid fixtures. The payment baseline stops at the cashier confirmation. This case verifies the handoff from simulated payment to voucher eligibility. It creates and pays one order, so its assertion is separate from the duplicate-submit case. [Baseline REQ-8.3](../baseline/REQ-8.3.spec.ts) · [Baseline REQ-3.9](../baseline/REQ-3.9.spec.ts)

Run from the repository root after setting `$ctripUrl` to the launcher URL. [Playwright 1.57.0 and Chromium setup](README.md#run-the-scripts) · [Test script](order-lifecycle.cjs)

```powershell
node applications/ctrip/test/team-08/order-lifecycle.cjs $ctripUrl new-paid-voucher
```

## Observed Output

The cashier confirms payment for the newly created order. **Pending vouchers** shows the seeded eligible order and omits the newly paid one.

```text
FAIL new-paid-voucher
Pending vouchers shows the equivalent seeded order but omits newly paid CTRIP20260719410
```
