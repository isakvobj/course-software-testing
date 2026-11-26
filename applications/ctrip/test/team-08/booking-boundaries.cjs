const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

async function prepareBooking(page, mobile) {
  await page.goto(baseUrl)
  await named(page, 'textbox', 'Origin').fill('Chengdu')
  await named(page, 'textbox', 'Destination').fill('Guangzhou')
  await named(page, 'textbox', 'Departure date').click()
  await named(page, 'button', '2026-07-21').click()
  await named(page, 'button', 'Search flights').click()
  const flight = named(page, 'listitem', 'Flight JD5162')
  await named(flight, 'button', 'Show fares').click()
  await named(named(flight, 'group', 'Economy fare'), 'button', 'Book').click()
  await named(page, 'textbox', 'Full name').fill('Wang Wu')
  await named(page, 'textbox', 'ID number').fill('110101199001011237')
  await named(page, 'textbox', 'Contact mobile').fill(mobile)
  await named(page, 'checkbox', 'Agree to booking terms').check()
  await named(page, 'button', 'Submit order').click()
}

const cases = [
  ['REQ-3.5 — Invalid contact feedback belongs in Contact information', async page => {
    await prepareBooking(page, '123')
    const alert = page.getByRole('alert').filter({ hasText: 'Enter a valid contact mobile number' })
    await alert.waitFor()
    const contact = named(page, 'region', 'Contact information')
    await contact.waitFor()
    assert.equal(await contact.getByRole('alert').count(), 1,
      'The booking rejected the mobile, but its visible validation alert was outside Contact information')
  }],
  ['REQ-3.8 — Cashier should stop offering payment when its timer expires', async page => {
    await prepareBooking(page, '13800000014')
    await named(page, 'heading', 'Payment').waitFor()
    const timer = named(page, 'timer', 'Time remaining')
    const initial = (await timer.innerText()).trim()
    assert.match(initial, /^(?:\d{2}:)?\d{2}:\d{2}$/)
    const seconds = initial.split(':').reduce((total, value) => total * 60 + Number(value), 0)
    assert.ok(seconds > 0, 'The newly created order should start with time remaining')
    await page.clock.fastForward((seconds + 2) * 1000)

    const pay = named(page, 'button', 'Pay now')
    if (await timer.isVisible()) {
      assert.equal((await timer.innerText()).trim(), '00:00', 'The public countdown should reach zero')
      assert.ok(!(await pay.isVisible() && await pay.isEnabled()),
        'The cashier reached 00:00 and still offered an enabled Pay now button')
    }
  }]
]

async function main() {
  const caseIds = ['contact-alert', 'cashier-expiry']
  const selected = process.argv[3]
  if (!caseIds.includes(selected)) {
    throw new Error(`Choose a case: ${caseIds.join(', ')}`)
  }
  const browser = await chromium.launch()
  try {
    for (const [index, [name, run]] of cases.entries()) {
      if (selected !== caseIds[index]) continue
      const page = await browser.newPage({ timezoneId: 'Asia/Shanghai' })
      page.setDefaultTimeout(5000)
      try {
        await page.clock.install({ time: new Date('2026-07-19T08:00:00+08:00') })
        await run(page)
        console.log(`PASS ${name}`)
      } catch (error) {
        process.exitCode = 1
        console.error(`${error instanceof assert.AssertionError ? 'FAIL' : 'ERROR'} ${name}\n${error.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
