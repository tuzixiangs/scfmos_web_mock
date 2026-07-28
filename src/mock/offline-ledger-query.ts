import type { OfflineLedgerQueryProject, OfflineLedgerQueryRecord } from '@/api/indebt/offlineLedgerQuery'
import { orderContractLedgerProjects, orderContractLedgerRecords } from './order-contract-ledger-query'

export const offlineLedgerQueryProjects: OfflineLedgerQueryProject[] = orderContractLedgerProjects

export const offlineLedgerQueryRecords: OfflineLedgerQueryRecord[] = orderContractLedgerRecords.flatMap((record, index) => {
  const baseDay = 10 + index
  return [
    {
      id: record.id * 10 + 1,
      projectId: record.projectId,
      effectiveDate: `2026-07-${String(baseDay).padStart(2, '0')}`,
      offlineManagementDescription: `${record.projectName}线下台账已完成月度核对，仓储、订单及资金使用信息一致。`,
      debtManagerOpinion: '台账信息完整，签署同意继续执行线下台账管理。',
      postLoanManagerOpinion: '已核验贷后材料及现场监管记录，建议持续跟踪。',
      imageName: `${record.projectNo}-线下台账影像.pdf`
    },
    {
      id: record.id * 10 + 2,
      projectId: record.projectId,
      effectiveDate: `2026-06-${String(Math.max(1, baseDay - 5)).padStart(2, '0')}`,
      offlineManagementDescription: `已补充${record.customerName}的线下台账说明及监管方盘点记录。`,
      debtManagerOpinion: '已审阅补充材料，台账更新内容可采信。',
      postLoanManagerOpinion: '贷后检查无重大异常，纳入后续监测计划。',
      imageName: `${record.projectNo}-历史台账影像.pdf`
    }
  ]
})
