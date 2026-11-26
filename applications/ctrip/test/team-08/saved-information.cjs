const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const selected = process.argv[3]
const runId = randomUUID().slice(0, 8)
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

async function openCommon(page, owner, section) {
  await page.goto(baseUrl)
  await named(page, 'link', 'Log in').click()
  await page.getByLabel('Account', { exact: true }).fill(`ctrip_${owner}@example.com`)
  await page.getByLabel('Password', { exact: true }).fill('Travel1234')
  await named(page, 'checkbox', 'Agree to terms').check()
  await named(page, 'button', 'Log in').click()
  await named(page, 'button', 'My account').click()
  await named(page, 'link', 'Personal center').click()
  await named(page, 'button', 'Common information').click()
  await named(page, 'link', section).click()
}

async function createAddress(page, name, city) {
  await named(page, 'button', 'Add address').click()
  const form = named(page, 'region', 'Add address')
  for (const [field, value] of Object.entries({
    Recipient: name,
    City: city,
    District: 'Test district',
    'Street address': '100 Test Avenue',
    'Mobile number': '13800000027'
  })) {
    await form.getByLabel(field, { exact: true }).fill(value)
  }
  await named(form, 'button', 'Save address').click()
  const list = named(page, 'region', 'Address list')
  await named(list, 'listitem', `Record ${name}`).waitFor()
}

const cases = {
  'invoice-identity': async page => {
    await openCommon(page, 'invoice_create', 'Invoice titles')
    const name = `Shanghai Team 08 ${runId} Co., Ltd.`
    const add = named(page, 'button', 'Add invoice title')
    const form = named(page, 'region', 'Add invoice title')
    const list = named(page, 'region', 'Invoice title list')
    const record = named(list, 'listitem', `Record ${name}`)
    const fillAndSave = async () => {
      await add.click()
      await form.getByLabel('Type', { exact: true }).selectOption('Company')
      await form.getByLabel('Invoice title', { exact: true }).fill(name)
      await form.getByLabel('Taxpayer ID', { exact: true }).fill('91310000123456789B')
      await named(form, 'button', 'Save').click()
    }
    await fillAndSave()
    await record.waitFor()
    assert.equal(await record.count(), 1)

    await page.reload()
    await record.waitFor()
    const saved = page.waitForResponse(response =>
      response.request().method() === 'POST' &&
      response.request().postDataJSON()?.action === 'personal.add_invoice')
    await fillAndSave()
    await (await saved).finished()
    await page.reload()
    await record.first().waitFor()
    assert.equal(await record.count(), 1, 'The same company title and taxpayer ID persist as duplicate records')
  },
  'latest-address': async page => {
    await openCommon(page, 'address_detail', 'Addresses')
    const first = `Team 08 Shanghai ${runId}`
    const second = `Team 08 Beijing ${runId}`
    await createAddress(page, first, 'Shanghai')
    await createAddress(page, second, 'Beijing')
    const view = name => named(named(page, 'listitem', `Record ${name}`), 'button', 'View address')

    // Hold only the first detail lookup. The original UI request is forwarded
    // unchanged after the currently selected address has rendered.
    let release
    const gate = new Promise(resolve => { release = resolve })
    let markHeld
    const held = new Promise(resolve => { markHeld = resolve })
    let delayNext = true
    await page.route('**/api', async route => {
      if (route.request().postDataJSON()?.action === 'personal.list' && delayNext) {
        delayNext = false
        markHeld(route.request())
        await gate
      }
      await route.continue()
    })
    try {
      await view(first).click()
      const firstLookup = await Promise.race([
        held,
        page.waitForTimeout(5000).then(() => { throw new Error('First detail lookup did not start') })
      ])
      await page.goBack()
      await view(second).click()
      const detail = named(page, 'region', 'Address details')
      await named(detail, 'heading', second).waitFor()
      const selectedUrl = page.url()
      release()
      await (await firstLookup.response()).finished()
      try {
        await named(detail, 'heading', first).waitFor({ timeout: 1000 })
      } catch (error) {
        if (error.name !== 'TimeoutError') throw error
      }
      assert.equal(page.url(), selectedUrl)
      const shown = await detail.getByRole('heading').innerText()
      assert.equal(shown, second, 'The earlier lookup replaced the currently selected address')
    } finally {
      release()
    }
  }
}

async function main() {
  if (!Object.hasOwn(cases, selected)) throw new Error(`Choose a case: ${Object.keys(cases).join(', ')}`)
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ timezoneId: 'Asia/Shanghai' })
    page.setDefaultTimeout(5000)
    await page.clock.install({ time: new Date('2026-07-19T08:00:00+08:00') })
    await cases[selected](page)
    console.log(`PASS ${selected}`)
  } finally {
    await browser.close()
  }
}

main().catch(error => {
  console.error(`${error instanceof assert.AssertionError ? 'FAIL' : 'ERROR'} ${selected}\n${error.message}`)
  process.exitCode = 1
})
