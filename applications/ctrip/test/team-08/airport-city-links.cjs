const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

async function openDomesticDirectory(page) {
  await page.goto(baseUrl)
  await named(page, 'button', 'Flights').click()
  await named(page, 'button', 'More services').click()
  await named(page, 'button', 'Domestic airport directory').click()
  const directory = named(page, 'region', 'Domestic airports')
  await named(directory, 'button', 'C').click()
  return directory
}

async function main() {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ timezoneId: 'Asia/Shanghai' })
    page.setDefaultTimeout(5000)
    await page.clock.install({ time: new Date('2026-07-19T08:00:00+08:00') })
    const results = []
    for (const city of ['Chengdu', 'Chongqing', 'Changchun']) {
      const directory = await openDomesticDirectory(page)
      await named(directory, 'link', city).click()
      const heading = page.getByRole('heading', { level: 1 }).filter({ hasText: /Airport/ })
      await named(page, 'region', 'Airport overview').waitFor()
      results.push({ city, actual: (await heading.innerText()).trim() })
    }
    assert.match(results[0].actual, /\bChengdu\b/, 'The Chengdu control should open a Chengdu airport')
    const mismatches = results.filter(({ city, actual }) => !actual.includes(city))
    assert.deepEqual(mismatches, [], 'Domestic city links should open airports in their named cities')
    console.log('PASS REQ-9.2 — Domestic airport links open the named cities')
  } finally {
    await browser.close()
  }
}

main().catch(error => {
  console.error(`${error instanceof assert.AssertionError ? 'FAIL' : 'ERROR'} REQ-9.2\n${error.message}`)
  process.exitCode = 1
})
