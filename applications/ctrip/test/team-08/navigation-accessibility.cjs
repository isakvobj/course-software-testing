const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

const cases = [
  ['REQ-1.1 — Signed-out entry at a narrow viewport', async page => {
    const navigation = named(page, 'navigation', 'Global navigation')
    const entry = named(navigation, 'link', 'Log in and Register')
    await entry.waitFor()
    assert.equal(await entry.count(), 1, 'Desktop should show one combined entry')

    await page.setViewportSize({ width: 390, height: 844 })
    await named(page, 'heading', 'Ctrip Travel').waitFor()
    assert.equal(await entry.count(), 1,
      'The 390-pixel homepage lost the required Log in and Register link')
  }],
  ['REQ-3.4 — Keyboard focus stays inside the Add passenger modal', async page => {
    await named(page, 'textbox', 'Origin').fill('Chengdu')
    await named(page, 'textbox', 'Destination').fill('Guangzhou')
    await named(page, 'textbox', 'Departure date').click()
    await named(page, 'button', '2026-07-21').click()
    await named(page, 'button', 'Search flights').click()
    const flight = named(page, 'listitem', 'Flight JD5162')
    await named(flight, 'button', 'Show fares').click()
    await named(flight, 'button', 'Book').click()
    await named(page, 'button', 'Add passenger').click()

    const dialog = named(page, 'dialog', 'Add passenger')
    await dialog.waitFor()
    assert.equal(await dialog.getAttribute('aria-modal'), 'true')
    const close = named(dialog, 'button', 'Close dialog')
    await named(dialog, 'textbox', 'Full name').click()
    await page.keyboard.press('Shift+Tab')
    assert.ok(await close.evaluate(button => button === document.activeElement),
      'The first Shift+Tab should reach the modal close button')

    await page.keyboard.press('Shift+Tab')
    const focus = await dialog.evaluate(element => ({
      inside: element.contains(document.activeElement),
      label: document.activeElement?.textContent.trim()
    }))
    assert.ok(focus.inside, `Focus escaped the still-open modal to "${focus.label}"`)
  }]
]

async function main() {
  const caseIds = ['narrow-sign-in', 'passenger-dialog-focus']
  const selected = process.argv[3]
  if (!caseIds.includes(selected)) {
    throw new Error(`Choose a case: ${caseIds.join(', ')}`)
  }
  const browser = await chromium.launch()
  try {
    for (const [index, [name, run]] of cases.entries()) {
      if (selected !== caseIds[index]) continue
      const page = await browser.newPage({
        timezoneId: 'Asia/Shanghai',
        viewport: { width: 1280, height: 900 }
      })
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
