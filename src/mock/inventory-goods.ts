import {
  createUniqueCategoryCode,
  generateInventoryGoodsCodes,
  getCategoryNameInitials
} from '@/utils/productCategoryCode'

export type InventoryGoodsStatus = '有效' | '历史'
export type InventoryGoodsCreateMode = 'direct' | 'based'

export interface InventoryGoodsRecord {
  id: number
  largeCategoryCode: string
  largeCategoryName: string
  middleCategoryCode: string
  middleCategoryName: string
  smallCategoryCode: string
  smallCategoryName: string
  remark: string
  status: InventoryGoodsStatus
  maintainTime: string
  maintainer: string
}

export interface InventoryGoodsCreatePayload {
  largeCategoryName?: string
  middleCategoryName?: string
  smallCategoryName?: string
  remark?: string
  createMode?: InventoryGoodsCreateMode
  sourceId?: number
}

export interface InventoryGoodsCreateResult {
  success: boolean
  message?: string
  duplicateLevel?: 'large' | 'middle' | 'small'
  record?: InventoryGoodsRecord
}

/**
 * 债项管理 - 存货类商品管理的本地演示数据。
 * 此文件作为该功能的唯一 Mock 数据源，页面通过统一 axios Mock 适配器读取和更新。
 */
export const inventoryGoodsRecords: InventoryGoodsRecord[] = [
  {
    id: 1,
    largeCategoryCode: '01',
    largeCategoryName: '金属及矿产品',
    middleCategoryCode: '0101',
    middleCategoryName: '黑色金属',
    smallCategoryCode: '010101',
    smallCategoryName: '热轧卷板',
    remark: '适用于钢贸供应链融资场景',
    status: '有效',
    maintainTime: '2026-07-21 09:10:00',
    maintainer: '张晨'
  },
  {
    id: 2,
    largeCategoryCode: '01',
    largeCategoryName: '金属及矿产品',
    middleCategoryCode: '0102',
    middleCategoryName: '有色金属',
    smallCategoryCode: '010201',
    smallCategoryName: '电解铜',
    remark: '需关注价格波动及仓储监管',
    status: '有效',
    maintainTime: '2026-07-20 16:35:00',
    maintainer: '李敏'
  },
  {
    id: 3,
    largeCategoryCode: '02',
    largeCategoryName: '化工原料',
    middleCategoryCode: '0201',
    middleCategoryName: '基础化工',
    smallCategoryCode: '020101',
    smallCategoryName: '聚乙烯',
    remark: '适用于标准化仓单质押',
    status: '有效',
    maintainTime: '2026-07-20 14:20:00',
    maintainer: '王磊'
  },
  {
    id: 4,
    largeCategoryCode: '03',
    largeCategoryName: '农产品',
    middleCategoryCode: '0301',
    middleCategoryName: '粮食',
    smallCategoryCode: '030101',
    smallCategoryName: '稻谷',
    remark: '需核验仓单及质量检验报告',
    status: '有效',
    maintainTime: '2026-07-19 11:05:00',
    maintainer: '赵宁'
  },
  {
    id: 5,
    largeCategoryCode: '04',
    largeCategoryName: '能源产品',
    middleCategoryCode: '0401',
    middleCategoryName: '煤炭',
    smallCategoryCode: '040101',
    smallCategoryName: '动力煤',
    remark: '仅支持准入仓库监管库存',
    status: '有效',
    maintainTime: '2026-07-18 15:40:00',
    maintainer: '陈颖'
  },
  {
    id: 6,
    largeCategoryCode: '05',
    largeCategoryName: '机械设备',
    middleCategoryCode: '0501',
    middleCategoryName: '工程机械',
    smallCategoryCode: '050101',
    smallCategoryName: '挖掘机',
    remark: '适用于经销商库存融资',
    status: '有效',
    maintainTime: '2026-07-18 10:15:00',
    maintainer: '周强'
  },
  {
    id: 7,
    largeCategoryCode: '06',
    largeCategoryName: '消费品',
    middleCategoryCode: '0601',
    middleCategoryName: '家用电器',
    smallCategoryCode: '060101',
    smallCategoryName: '冰箱',
    remark: '历史品类，仅供存量业务查询',
    status: '历史',
    maintainTime: '2026-07-17 17:25:00',
    maintainer: '孙悦'
  },
  {
    id: 8,
    largeCategoryCode: '07',
    largeCategoryName: '纺织原料',
    middleCategoryCode: '0701',
    middleCategoryName: '棉纺原料',
    smallCategoryCode: '070101',
    smallCategoryName: '皮棉',
    remark: '须匹配授信客户经营范围',
    status: '有效',
    maintainTime: '2026-07-17 09:50:00',
    maintainer: '刘洋'
  }
]

const normalizeName = (name: string | undefined) => String(name || '').trim()
const getNow = () => new Date().toLocaleString('sv-SE').replace('T', ' ')
const duplicateResult = (
  level: InventoryGoodsCreateResult['duplicateLevel'],
  name: string
): InventoryGoodsCreateResult => {
  const label =
    level === 'large' ? '商品大类名称' : level === 'middle' ? '商品中类名称' : '商品小类名称'
  return { success: false, duplicateLevel: level, message: `${label}“${name}”已存在，请修改后再保存` }
}

export const createInventoryGoodsRecord = (
  payload: InventoryGoodsCreatePayload
): InventoryGoodsCreateResult => {
  const largeCategoryName = normalizeName(payload.largeCategoryName)
  const middleCategoryName = normalizeName(payload.middleCategoryName)
  const smallCategoryName = normalizeName(payload.smallCategoryName)
  const requiredLevels: Array<[InventoryGoodsCreateResult['duplicateLevel'], string]> = [
    ['large', largeCategoryName],
    ['middle', middleCategoryName],
    ['small', smallCategoryName]
  ]
  const missingLevel = requiredLevels.find(([, name]) => !name)

  if (missingLevel) {
    const [level] = missingLevel
    const label =
      level === 'large' ? '商品大类名称' : level === 'middle' ? '商品中类名称' : '商品小类名称'
    return { success: false, duplicateLevel: level, message: `请先填写${label}` }
  }

  const source =
    payload.createMode === 'based'
      ? inventoryGoodsRecords.find((record) => record.id === Number(payload.sourceId))
      : undefined
  if (payload.createMode === 'based' && !source) {
    return { success: false, message: '原有品类不存在或已被删除，请重新选择后新增' }
  }

  const reuseLargeCategory = !!source && largeCategoryName === source.largeCategoryName
  const reuseMiddleCategory =
    reuseLargeCategory && middleCategoryName === source?.middleCategoryName

  if (!reuseLargeCategory && inventoryGoodsRecords.some((record) => record.largeCategoryName === largeCategoryName)) {
    return duplicateResult('large', largeCategoryName)
  }
  if (!reuseMiddleCategory && inventoryGoodsRecords.some((record) => record.middleCategoryName === middleCategoryName)) {
    return duplicateResult('middle', middleCategoryName)
  }
  if (inventoryGoodsRecords.some((record) => record.smallCategoryName === smallCategoryName)) {
    return duplicateResult('small', smallCategoryName)
  }

  const generatedCodes = generateInventoryGoodsCodes({
    largeCategoryName,
    middleCategoryName,
    smallCategoryName
  })
  const largeCategoryCode = reuseLargeCategory
    ? source.largeCategoryCode
    : createUniqueCategoryCode(
        generatedCodes.largeCategoryCode,
        inventoryGoodsRecords.map((record) => record.largeCategoryCode)
      )
  const middleCategoryCode = reuseMiddleCategory
    ? source.middleCategoryCode
    : createUniqueCategoryCode(
        `${largeCategoryCode}-${getCategoryNameInitials(middleCategoryName)}`,
        inventoryGoodsRecords.map((record) => record.middleCategoryCode)
      )
  const smallCategoryCode = createUniqueCategoryCode(
    `${middleCategoryCode}-${getCategoryNameInitials(smallCategoryName)}`,
    inventoryGoodsRecords.map((record) => record.smallCategoryCode)
  )
  const id = Math.max(0, ...inventoryGoodsRecords.map((record) => record.id)) + 1
  const record: InventoryGoodsRecord = {
    id,
    largeCategoryCode,
    largeCategoryName,
    middleCategoryCode,
    middleCategoryName,
    smallCategoryCode,
    smallCategoryName,
    remark: String(payload.remark || ''),
    status: '有效',
    maintainTime: getNow(),
    maintainer: '本地演示用户'
  }

  inventoryGoodsRecords.unshift(record)
  return { success: true, record }
}

export const markInventoryGoodsHistory = (ids: Array<number | string>): number => {
  const idSet = new Set(ids.map((id) => Number(id)))
  let updated = 0

  inventoryGoodsRecords.forEach((record) => {
    if (idSet.has(record.id) && record.status !== '历史') {
      record.status = '历史'
      record.maintainTime = new Date().toLocaleString('sv-SE').replace('T', ' ')
      record.maintainer = '本地演示用户'
      updated += 1
    }
  })

  return updated
}
