import type { AssetLedgerProject, AssetLedgerRecord } from '@/api/indebt/assetLedgerQuery'
import { orderContractLedgerProjects, orderContractLedgerRecords } from './order-contract-ledger-query'

export const assetLedgerProjects: AssetLedgerProject[] = orderContractLedgerProjects

const categoryByPlan = (plan: string, index: number) =>
  plan === '货押融资'
    ? { largeCategory: '有色金属', middleCategory: '铜材', smallCategory: index % 2 ? '电解铜' : '铜杆' }
    : { largeCategory: '钢铁', middleCategory: index % 2 ? '板材' : '型材', smallCategory: index % 2 ? '热轧卷板' : '螺纹钢' }

export const assetLedgerRecords: AssetLedgerRecord[] = orderContractLedgerRecords.flatMap((record, index) => {
  const statuses = record.productPlan === '货押融资'
    ? (['inStock', 'outbound', 'invalid'] as const)
    : (['inStock', 'pendingInbound', 'outbound', 'invalid'] as const)

  return statuses.map((status, statusIndex) => {
    const dataIndex = index * 4 + statusIndex
    const category = categoryByPlan(record.productPlan, dataIndex)
    const quantity = 120 + dataIndex * 18
    const unitPrice = 6800 + dataIndex * 135
    const marketPrice = unitPrice + (statusIndex === 0 ? -180 : 120)
    const inStockQuantity = status === 'outbound' ? quantity - 45 : status === 'pendingInbound' ? 0 : quantity
    return {
      id: record.id * 10 + statusIndex + 1,
      projectId: record.projectId,
      status,
      productCode: `SP${record.projectId}${String(statusIndex + 1).padStart(3, '0')}`,
      productName: category.smallCategory,
      ...category,
      orderContractNo: record.orderContractNo,
      orderContractFlowNo: record.orderContractFlowNo,
      customerName: record.customerName,
      coreCustomerNo: record.coreCustomerNo,
      relatedBusinessContractNo: record.relatedBusinessContractNo,
      batchNo: `B${record.projectNo.slice(2)}${statusIndex + 1}`,
      cabinetNo: `柜-${String(dataIndex + 1).padStart(3, '0')}`,
      origin: dataIndex % 2 ? '江苏' : '上海',
      warehouseName: dataIndex % 2 ? '苏州综合保税仓' : '上海临港监管仓',
      specification: dataIndex % 2 ? '厚度 2.0mm' : '标准规格',
      inStockLatestPrice: unitPrice,
      benchmarkPrice: unitPrice - 180,
      initialPricing: unitPrice - 320,
      latestMarketPrice: marketPrice,
      initialQuantityOrWeight: quantity + 25,
      inStockQuantityOrWeight: inStockQuantity,
      inStockLatestValue: inStockQuantity * unitPrice,
      benchmarkValue: inStockQuantity * (unitPrice - 180),
      initialPricingValue: (quantity + 25) * (unitPrice - 320),
      latestMarketValue: inStockQuantity * marketPrice,
      priceTrigger: statusIndex === 0 ? '已触发' : '未触发',
      dropRate: statusIndex === 0 ? 2.65 : 0.85,
      unitPriceUpdatedAt: `2026-07-${String(10 + dataIndex).padStart(2, '0')}`,
      priceCompensationAmount: statusIndex === 0 ? 18500 + dataIndex * 1200 : 0,
      currency: record.currency,
      goodsOwnership: dataIndex % 2 ? '借款人自己' : '核心企业',
      goodsStartDate: '2026-07-01',
      goodsEndDate: '2027-06-30',
      latestPickupDate: '2027-05-30',
      inStockDuration: `${18 + dataIndex}天`,
      goodsStatus: status === 'inStock' ? '正常' : status === 'pendingInbound' ? '待入库' : status === 'outbound' ? '已出库' : '失效',
      remark1: '系统生成',
      remark2: dataIndex % 2 ? '定期盘点' : '监管仓保管',
      loanStartDate: '2026-07-02',
      loanEndDate: '2027-06-30',
      generatedAt: `2026-07-${String(12 + dataIndex).padStart(2, '0')}`,
      inboundDate: status !== 'pendingInbound' ? '2026-07-03' : undefined,
      outboundDate: status === 'outbound' ? '2026-07-20' : undefined,
      invalidDate: status === 'invalid' ? '2026-07-18' : undefined
    }
  })
})
