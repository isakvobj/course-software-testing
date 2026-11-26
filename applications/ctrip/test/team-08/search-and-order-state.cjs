const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

async function readCountdown(timer) {
  const value = (await timer.innerText()).trim()
  assert.match(value, /^(?:\d{2}:)?\d{2}:\d{2}$/)
  return value.split(':').reduce((seconds, part) => seconds * 60 + Number(part), 0)
}

const cases = [
  ['REQ-4.2 — Changing order tabs must preserve elapsed countdown time', async page => {
    const navigation = named(page, 'navigation', 'Global navigation')
    await named(navigation, 'link', 'Log in').click()
    await named(page, 'textbox', 'Account').fill('ctrip_order_read@example.com')
    await page.getByLabel('Password', { exact: true }).fill('Travel1234')
    await named(page, 'checkbox', 'Agree to terms').check()
    await named(page, 'button', 'Log in').click()
    await named(page, 'button', 'My account').click()
    await named(page, 'link', 'Orders').click()

    const order = named(page, 'listitem', 'Record CTRIP20260721001')
    const timer = named(order, 'timer', 'Time remaining')
    const initial = await readCountdown(timer)
    assert.ok(initial > 15, 'The fixture needs an unpaid order with more than 15 seconds remaining')
    await page.clock.fastForward(15_000)
    const beforeFilter = await readCountdown(timer)
    assert.ok(beforeFilter < initial, 'The timer should decrease before changing the filter')

    await named(page, 'tab', 'Pending payment').click()
    const afterFilter = await readCountdown(timer)
    assert.ok(afterFilter <= beforeFilter,
      `The same order gained ${afterFilter - beforeFilter} seconds after changing the status filter`)
  }],
  ['REQ-2.5 / REQ-2.6 — Reopening a search drops the children preference', async page => {
    await named(page, 'textbox', 'Origin').fill('Chengdu')
    await named(page, 'textbox', 'Destination').fill('Guangzhou')
    await named(page, 'checkbox', 'Traveling with children').check()
    await named(page, 'textbox', 'Departure date').click()
    await named(page, 'button', '2026-07-21').click()
    await named(page, 'button', 'Search flights').click()
    await page.getByText('Children included', { exact: true }).waitFor()

    await named(page, 'link', 'Home').click()
    const history = named(page, 'region', 'Search history')
    await named(history, 'button', 'Chengdu - Guangzhou').click()
    await named(page, 'heading', 'Flight results').waitFor()
    assert.ok(await page.getByText('Children included', { exact: true }).isVisible(),
      'The restored route and date no longer show Children included')
  }]
]

async function main() {
  const caseIds = ['order-countdown', 'history-children']
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
        await page.goto(baseUrl)
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
