const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'

async function chooseDate(page, field, date) {
  await page.getByRole('textbox', { name: field, exact: true }).click()
  await page.getByRole('button', { name: date, exact: true }).click()
}

const cases = [
  ['REQ-2.3 — Changing departure invalidates an earlier return', async page => {
    await chooseDate(page, 'Departure date', '2026-07-21')
    await page.getByRole('button', { name: 'Add return', exact: true }).click()
    await page.getByRole('button', { name: '2026-07-25', exact: true }).click()
    const returnDate = page.getByRole('textbox', { name: 'Return date', exact: true })
    assert.equal(await returnDate.inputValue(), '2026-07-25')

    await chooseDate(page, 'Departure date', '2026-07-26')
    const departure = await page.getByRole('textbox', { name: 'Departure date', exact: true }).inputValue()
    const selectedReturn = await returnDate.inputValue()
    assert.ok(!selectedReturn || selectedReturn >= departure,
      `The form kept return ${selectedReturn} with departure ${departure}`)
  }],
  ['REQ-2.3 / REQ-2.8 — Monthly fares cannot select a past departure', async page => {
    await page.getByRole('textbox', { name: 'Origin', exact: true }).fill('Chengdu')
    await page.getByRole('textbox', { name: 'Destination', exact: true }).fill('Guangzhou')
    await chooseDate(page, 'Departure date', '2026-07-21')
    await page.getByRole('button', { name: 'Search flights', exact: true }).click()
    await page.getByRole('heading', { name: 'Flight results', exact: true }).waitFor()
    await page.getByRole('textbox', { name: 'Departure date', exact: true }).click()
    const calendar = page.getByRole('dialog', { name: 'Select departure date' })
    const controlDate = calendar.getByRole('button', { name: '2026-07-18', exact: true })
    await controlDate.waitFor()
    assert.ok(await controlDate.isDisabled(), 'The results departure calendar should disable July 18')
    await calendar.getByRole('button', { name: 'Close date picker', exact: true }).click()
    await page.getByRole('button', { name: 'More dates', exact: true }).click()
    const monthlyFares = page.getByRole('dialog', { name: 'Monthly fares' })
    const pastDate = monthlyFares.getByRole('button', { name: '2026-07-18', exact: true })
    await monthlyFares.waitFor()
    if (await pastDate.isVisible() && await pastDate.isEnabled()) {
      await pastDate.click()
      // Read the public results URL after the click. The old form can remain
      // visible briefly while the results for the new date render.
      const query = page.url().split('?')[1]
      const selected = new URLSearchParams(query).get('date')
      assert.notEqual(selected, '2026-07-18', 'Monthly fares changed departure to July 18, before the July 19 course clock')
    }
  }]
]

async function main() {
  const caseIds = ['earlier-return', 'past-monthly-fare']
  const selected = process.argv[3]
  if (selected && !caseIds.includes(selected)) {
    throw new Error(`Choose a case: ${caseIds.join(', ')}`)
  }
  const browser = await chromium.launch()
  try {
    for (const [index, [name, run]] of cases.entries()) {
      if (selected && selected !== caseIds[index]) continue
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
