import type { InventoryPriceItem } from '@/api/indebt/inventoryPriceManagement'

export const priceHeaders = [
  '商品大类编码',
  '商品大类',
  '商品中类编码',
  '商品中类',
  '商品小类编码',
  '商品小类',
  '产地',
  '本次盯市价格',
  '盯市来源'
]
const key = (row: string[]) => JSON.stringify(row)
const itemKey = (item: InventoryPriceItem) =>
  key([item.largeCategory, item.middleCategory, item.smallCategory, item.origin])

// Validate the complete file before changing any rows, so invalid imports are atomic.
export function parsePriceRows(rows: unknown[][], items: InventoryPriceItem[]) {
  if (rows.length < 2 || priceHeaders.some((header, index) => rows[0][index] !== header))
    throw new Error('模板列不匹配，请下载当前项目模板后填写')
  const byKey = new Map(items.map((item) => [itemKey(item), item]))
  const seen = new Set<number>()
  const updates: { id: number; monitoringUnitPrice: number; monitoringSource: string }[] = []
  rows.slice(1).forEach((row, index) => {
    if (row.every((value) => value === '' || value == null)) return
    const text = row.map((value) => String(value ?? '').trim())
    const item = byKey.get(key([text[1], text[3], text[5], text[6]]))
    if (!item) throw new Error(`第${index + 2}行品类或产地不属于当前项目`)
    if (seen.has(item.id)) throw new Error(`第${index + 2}行重复，请每个品类及产地仅保留一行`)
    if (
      [0, 2, 4].some(
        (col, i) =>
          text[col] !==
          String([item.largeCategoryCode, item.middleCategoryCode, item.smallCategoryCode][i] || '')
      )
    )
      throw new Error(`第${index + 2}行分类编码不匹配`)
    const price = Number(text[7])
    if (
      !text[7] ||
      !Number.isFinite(price) ||
      price <= 0 ||
      Math.abs(price * 100 - Math.round(price * 100)) > 0.000001
    )
      throw new Error(`第${index + 2}行价格须为大于0且最多两位小数的数字`)
    if (!text[8] || text[8].length > 200)
      throw new Error(`第${index + 2}行请填写盯市来源（最多200字）`)
    seen.add(item.id)
    updates.push({ id: item.id, monitoringUnitPrice: price, monitoringSource: text[8] })
  })
  if (!updates.length) throw new Error('文件没有可导入的数据')
  return updates
}

export async function readPriceWorkbook(file: File, items: InventoryPriceItem[]) {
  if (!file.name.toLowerCase().endsWith('.xlsx')) throw new Error('请选择 .xlsx 格式的模板文件')
  if (file.size > 5 * 1024 * 1024) throw new Error('文件不能超过5MB')
  const { default: ExcelJS } = await import('exceljs')
  const { Workbook } = ExcelJS
  const book = new Workbook()
  await book.xlsx.load(await file.arrayBuffer())
  const sheet = book.worksheets[0]
  if (!sheet || sheet.rowCount > 10001) throw new Error('文件为空或超过10000行限制')
  const rows: unknown[][] = []
  sheet.eachRow((row) => rows.push(priceHeaders.map((_, index) => row.getCell(index + 1).value)))
  return parsePriceRows(rows, items)
}

export async function downloadPriceWorkbook(items: InventoryPriceItem[]) {
  const { default: ExcelJS } = await import('exceljs')
  const { Workbook } = ExcelJS
  const book = new Workbook()
  const sheet = book.addWorksheet('价格盯市')
  sheet.addRow(priceHeaders)
  items.forEach((item) =>
    sheet.addRow([
      item.largeCategoryCode || '',
      item.largeCategory,
      item.middleCategoryCode || '',
      item.middleCategory,
      item.smallCategoryCode || '',
      item.smallCategory,
      item.origin,
      item.monitoringUnitPrice || '',
      item.monitoringSource || ''
    ])
  )
  sheet.columns.forEach((column) => {
    column.width = 22
  })
  const buffer = await book.xlsx.writeBuffer()
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = '价格盯市导入模板.xlsx'
  anchor.hidden = true
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
