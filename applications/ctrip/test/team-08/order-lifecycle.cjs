const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000'
const selectedCase = process.argv[3]
const named = (scope, role, name) => scope.getByRole(role, { name, exact: true })

async function signIn(page) {
  await page.goto(baseUrl)
  const navigation = named(page, 'navigation', 'Global navigation')
  await named(navigation, 'link', 'Log in').click()
  await page.getByLabel('Account', { exact: true }).fill('ctrip_voucher_pending@example.com')
  await page.getByLabel('Password', { exact: true }).fill('Travel1234')
  await named(page, 'checkbox', 'Agree to terms').check()
  await named(page, 'button', 'Log in').click()
  await named(page, 'button', 'My account').waitFor()
}

async function openBooking(page) {
  await page.getByRole('heading', { name: 'Ctrip Travel', exact: true }).waitFor()
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
  await named(page, 'textbox', 'Contact mobile').fill('13800000014')
  await named(page, 'checkbox', 'Agree to booking terms').check()
}

async function openOrders(page) {
  await named(page, 'button', 'My account').click()
  await named(page, 'link', 'Orders').click()
  const orders = named(page, 'region', 'Order list')
  await named(orders, 'listitem', 'Record CTRIP20260721005').waitFor()
  return orders
}

async function orderNames(orders) {
  return orders.getByRole('listitem').evaluateAll(items => items.map(item => item.getAttribute('aria-label')))
}

const cases = {
  'duplicate-submit': async page => {
    const initial = new Set(await orderNames(await openOrders(page)))
    await named(page, 'link', 'Home').click()
    await openBooking(page)

    // Keep the response pending across the two clicks. The application receives
    // the original UI requests with their headers and bodies untouched.
    const submissions = []
    await page.route('**/api', async route => {
      if (route.request().postDataJSON()?.action === 'orders.create') {
        submissions.push(route.request())
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      await route.continue()
    })
    await named(page, 'button', 'Submit order').dblclick()
    await named(page, 'heading', 'Payment').waitFor()
    await Promise.all(submissions.map(async request => (await request.response()).finished()))

    const newOrders = (await orderNames(await openOrders(page))).filter(name => !initial.has(name))
    assert.equal(newOrders.length, 1, `One booking created ${newOrders.length} orders: ${newOrders.join(', ')}`)
  },
  'new-paid-voucher': async page => {
    await openBooking(page)
    await named(page, 'button', 'Submit order').click()
    await named(page, 'heading', 'Payment').waitFor()
    const orderNumber = await page.getByText(/^CTRIP\d+$/).first().innerText()
    await named(page, 'radio', 'Alipay').check()
    await named(page, 'button', 'Pay now').click()
    await page.getByRole('status').filter({ hasText: 'Payment successful' }).waitFor()
    await page.getByText(orderNumber, { exact: true }).waitFor()

    await named(page, 'button', 'More services').click()
    await named(page, 'button', 'Reimbursement vouchers').click()
    const pending = named(page, 'region', 'Pending vouchers')
    await pending.getByText('CTRIP20260721005', { exact: true }).waitFor()
    assert.ok(await pending.getByText(orderNumber, { exact: true }).isVisible(),
      `Pending vouchers shows the equivalent seeded order but omits newly paid ${orderNumber}`)
  }
}

async function main() {
  if (!Object.hasOwn(cases, selectedCase)) {
    throw new Error(`Choose a case: ${Object.keys(cases).join(', ')}`)
  }
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ timezoneId: 'Asia/Shanghai' })
    page.setDefaultTimeout(5000)
    await page.clock.install({ time: new Date('2026-07-19T08:00:00+08:00') })
    await signIn(page)
    await cases[selectedCase](page)
    console.log(`PASS ${selectedCase}`)
  } finally {
    await browser.close()
  }
}

main().catch(error => {
  console.error(`${error instanceof assert.AssertionError ? 'FAIL' : 'ERROR'} ${selectedCase}\n${error.message}`)
  process.exitCode = 1
})
