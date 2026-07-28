import type { DebtRuleRecord } from '@/api/indebt/debtRuleManagement'

const base = (id: number, status: string, plan: string): DebtRuleRecord => ({
  id, applicationNo: `DRA202607${String(10 + id).padStart(2, '0')}${String(id).padStart(4, '0')}`,
  customerName: id % 2 ? '南京瑞钢贸易有限公司' : '上海铜鑫实业有限公司',
  coreCustomerNo: id % 2 ? 'C2025040300000003' : 'C2025051200000018',
  businessNo: id % 2 ? 'PJ202607010001' : 'HT202607180002', productPlan: plan,
  applicationType: id % 3 === 0 ? '放贷' : id % 2 ? '项目额度' : '链属客户额度',
  applicationDate: `2026-07-${String(10 + id).padStart(2, '0')}`,
  currentStage: status === '待提交' ? '债项管理岗发起' : status === '审查审批中' ? '贷后管理岗审批' : '审批完成',
  completedAt: status === '待提交' ? undefined : `2026-07-${String(15 + id).padStart(2, '0')} 10:20:00`, status
})

export const debtRuleSupplementRecords: DebtRuleRecord[] = [
  base(1, '待提交', '先票/款后货'), base(2, '审查审批中', '货押融资'),
  base(3, '审批通过', '先票/款后货'), base(4, '被否决', '货押融资')
]

export const debtRuleApprovalRecords: DebtRuleRecord[] = [
  { ...base(5, '当前工作', '货押融资'), currentStage: '贷后管理岗审批' },
  { ...base(6, '已完成工作', '先票/款后货'), currentStage: '审批完成', completedAt: '2026-07-22 15:30:00' }
]

export const debtRuleMaintenanceRecords: DebtRuleRecord[] = [
  { ...base(7, '授信债项规则查询', '先票/款后货'), applicationNo: 'CA202607010001', currentStage: '授信阶段' },
  { ...base(8, '出账债项规则查询', '货押融资'), applicationNo: 'LO202607180002', currentStage: '出账阶段' }
]

export const debtRuleLibraryRecords: DebtRuleRecord[] = [
  { ...base(21, '有效', '先票/款后货'), ruleNo: 'RULE-PP-001', ruleCategory: '预警规则', processStage: '出账后', ruleName: '库存货值预警', ruleDescription: '库存货值低于预警阈值时触发预警。', formula: '最新市价 × 数量', supportedAssetType: '存货', debtFactor: '货值', warningColor: '橙色', warningHandlingPlan: '通知客户经理补充保证金', ruleRequirement: '每日盯市', factorModificationControl: '需审批', ruleStatus: '有效', updatedBy: '债项管理岗', updatedAt: '2026-07-20' },
  { ...base(22, '有效', '货押融资'), ruleNo: 'RULE-PL-002', ruleCategory: '核验规则', processStage: '入库', ruleName: '货物保质期校验', ruleDescription: '入库货物剩余保质期需满足规则阈值。', formula: '到期日 - 入库日', supportedAssetType: '存货', debtFactor: '保质期', warningColor: '红色', warningHandlingPlan: '禁止完成入库', ruleRequirement: '入库时校验', factorModificationControl: '禁止修改', ruleStatus: '有效', updatedBy: '贷后管理岗', updatedAt: '2026-07-21' },
  { ...base(23, '失效', '货押融资'), ruleNo: 'RULE-PL-003', ruleCategory: '价格规则', processStage: '存续期', ruleName: '市场价格跌幅预警', ruleDescription: '市场价格跌幅超过阈值时需生成补偿任务。', formula: '(基准价-市价)/基准价', supportedAssetType: '有色金属', debtFactor: '跌幅', warningColor: '黄色', warningHandlingPlan: '发起补货申请', ruleRequirement: '每日盯市', factorModificationControl: '需审批', ruleStatus: '失效', updatedBy: '产品经理', updatedAt: '2026-07-18' }
]
