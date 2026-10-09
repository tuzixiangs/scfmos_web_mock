import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { createServer as createHttpServer } from 'node:http'

const root = fileURLToPath(new URL('../', import.meta.url))
// A non-listening HTTP server keeps this data regression check entirely local,
// without opening a development or WebSocket port.
const httpServer = createHttpServer()
const server = await createServer({
  configFile: false,
  root,
  resolve: { alias: { '@': `${root}src` } },
  server: { middlewareMode: true, hmr: { server: httpServer } },
  appType: 'custom'
})
try {
  const { intranetPermissionMenus } = await server.ssrLoadModule(
    '/src/mock/intranet-permission-menus.ts'
  )
  const flatten = (nodes) => nodes.flatMap((node) => [node, ...flatten(node.children || [])])
  const menus = flatten(intranetPermissionMenus)
  for (const name of ['线下台账更新申请', '线下台账查询', '债项资产风险台账查询'])
    assert.equal(menus.find((menu) => menu.name === name).visible, false)
  for (const name of [
    '债项资产维护',
    '待提交债项资产修改',
    '债项资产修改记录',
    '价格盯市申请',
    '价格盯市审批'
  ])
    assert.equal(menus.find((menu) => menu.name === name).visible, true)
  const assets = await server.ssrLoadModule('/src/mock/order-contract-modification.ts')
  const record = assets.orderContractModificationRecords[0]
  const item = record.items[0]
  const original = { ...item }
  const result = assets.updateOrderContractModificationItem(record.id, item.id, {
    productName: '不应被修改',
    largeCategory: '不应被修改',
    middleCategory: '不应被修改',
    smallCategory: '不应被修改',
    origin: '不应被修改',
    unitPrice: 1,
    batchNo: 'NEW-BATCH',
    cabinetNo: 'NEW-CABINET',
    specification: 'NEW-SPEC',
    quantityOrWeight: 123,
    latestStockPrice: 4000,
    purchaseMethod: '境内采购',
    creditPurpose: '支付货款',
    remark1: '说明1',
    remark2: '说明2',
    cargoStartDate: '',
    cargoEndDate: ''
  })
  assert.equal(result.success, true)
  for (const field of [
    'productName',
    'largeCategory',
    'middleCategory',
    'smallCategory',
    'origin',
    'unitPrice',
    'productCode'
  ])
    assert.equal(item[field], original[field], field)
  assert.equal(item.totalAmount, Number((123 * original.unitPrice).toFixed(2)))
  assert.equal(item.remark2, '说明2')
  assert.equal(item.latestStockPrice, 4000)
  assert.equal(item.cargoEndDate, '')
  const prices = await server.ssrLoadModule('/src/mock/inventory-price-management.ts')
  const application = prices.getInventoryPriceApplicationRecord(1)
  application.items[0].customerWarningRates = [0.03, 0.12, 0.08]
  assert.equal(prices.getInventoryPriceApplicationRecord(1).items[0].warningRate, 0.12)
  const excel = await server.ssrLoadModule('/src/utils/inventoryPriceExcel.ts')
  const priceItem = application.items[0]
  assert.ok(priceItem.smallCategoryCode)
  const row = [
    priceItem.largeCategoryCode,
    priceItem.largeCategory,
    priceItem.middleCategoryCode,
    priceItem.middleCategory,
    priceItem.smallCategoryCode,
    priceItem.smallCategory,
    priceItem.origin,
    123.45,
    '市场报价'
  ]
  assert.equal(
    excel.parsePriceRows([excel.priceHeaders, row], application.items)[0].monitoringUnitPrice,
    123.45
  )
  assert.throws(
    () => excel.parsePriceRows([excel.priceHeaders, row, row], application.items),
    /重复/
  )
  assert.throws(
    () =>
      excel.parsePriceRows(
        [excel.priceHeaders, [...row.slice(0, 7), -1, '报价']],
        application.items
      ),
    /价格/
  )
  assert.throws(() => excel.parsePriceRows([['错误模板'], row], application.items), /模板/)
  const {
    default: { Workbook }
  } = await import('exceljs')
  const book = new Workbook()
  const sheet = book.addWorksheet('价格盯市')
  sheet.addRow(excel.priceHeaders)
  sheet.addRow(row)
  const bytes = await book.xlsx.writeBuffer()
  const imported = await excel.readPriceWorkbook(
    { name: 'test.xlsx', size: bytes.length, arrayBuffer: async () => bytes },
    application.items
  )
  assert.equal(imported[0].monitoringUnitPrice, 123.45)
  console.log(
    'PASS: V1.1 immutable asset fields, editable fields, value linkage, max decline factors, Excel validation and XLSX round-trip'
  )
} finally {
  await server.close()
}
