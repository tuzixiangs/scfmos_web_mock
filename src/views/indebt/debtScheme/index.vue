<template>
  <ContentWrap class="debt-scheme-page">
    <div class="page-heading">
      <div>
        <div class="page-title">{{ page.title }}</div>
        <div class="page-description">{{ page.description }}</div>
      </div>
      <el-tag type="success" effect="plain">本地 Mock 数据</el-tag>
    </div>

    <el-descriptions v-if="isDetail" :column="2" border class="mb-18px">
      <el-descriptions-item v-for="item in descriptionItems" :key="item.label" :label="item.label">
        {{ item.value }}
      </el-descriptions-item>
    </el-descriptions>

    <Search :schema="schemas.searchSchema" :model="query" :default-expand="false" @search="handleSearch" @reset="handleSearch" />
    <ActionBar :buttons="buttons" />
    <Table :columns="schemas.tableColumns" :data="filteredRows" :pagination="{ total: filteredRows.length }" :show-overflow-tooltip="true">
      <template #status="{ row }">
        <el-tag :type="row.status === '有效' ? 'success' : 'warning'" effect="light">{{ row.status }}</el-tag>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="openDetail(row)">
          <Icon icon="ep:document" class="mr-3px" />详情
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog v-model="dialogVisible" :title="`${page.title}详情`" width="720px">
    <el-descriptions v-if="selectedRow" :column="2" border>
      <el-descriptions-item v-for="(value, key) in selectedRow" :key="String(key)" :label="fieldLabels[String(key)] || String(key)">
        {{ value }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'

defineOptions({ name: 'DebtScheme' })

type PageMode = 'ruleConfigDetail' | 'ruleConfig' | 'debtFactorSetting' | 'debtFactorDetail'
type SchemeRow = Record<string, string>

const route = useRoute()
const mode = computed<PageMode>(() => {
  const path = route.path
  if (path.includes('debtFactorDetail')) return 'debtFactorDetail'
  if (path.includes('debtFactorSetting')) return 'debtFactorSetting'
  if (path.includes('ruleConfigDetail')) return 'ruleConfigDetail'
  return 'ruleConfig'
})

const pages: Record<PageMode, { title: string; description: string }> = {
  ruleConfigDetail: { title: '规则配置详情', description: '展示当前债项方案已生效的规则、适用范围及预警要求。' },
  ruleConfig: { title: '规则配置', description: '维护债项方案的准入、估值、预警及贷后管理规则。' },
  debtFactorSetting: { title: '债项因子设置', description: '维护债项因子口径、取值范围与预警阈值。' },
  debtFactorDetail: { title: '债项因子详情', description: '查看债项因子最新取值、计算依据及更新时间。' }
}
const page = computed(() => pages[mode.value])
const isDetail = computed(() => mode.value === 'ruleConfigDetail' || mode.value === 'debtFactorDetail')

const fieldLabels: Record<string, string> = {
  schemeNo: '方案编号', schemeName: '债项方案名称', ruleNo: '规则编号', ruleName: '规则名称',
  factorCode: '因子编码', factorName: '债项因子', factorValue: '当前取值', threshold: '预警阈值',
  applicableScope: '适用范围', status: '状态', updatedBy: '更新人', updatedAt: '更新时间', description: '说明'
}
const descriptionItems = computed(() => mode.value === 'ruleConfigDetail'
  ? [{ label: '债项方案', value: '供应链存货融资方案' }, { label: '方案编号', value: 'DS20260720001' }, { label: '适用产品', value: '货押融资、先票/款后货' }, { label: '当前版本', value: 'V1.0（已生效）' }]
  : [{ label: '债项方案', value: '供应链存货融资方案' }, { label: '方案编号', value: 'DS20260720001' }, { label: '因子口径', value: '按最近一次有效业务数据计算' }, { label: '数据更新时间', value: '2026-08-04 10:30:00' }])

const ruleRows: SchemeRow[] = [
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', ruleNo: 'RULE-001', ruleName: '存货准入规则', applicableScope: '货押融资', status: '有效', updatedBy: '张晨', updatedAt: '2026-08-01', description: '仅允许准入目录内商品及有效监管仓库。' },
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', ruleNo: 'RULE-002', ruleName: '价格预警规则', applicableScope: '全部存货类业务', status: '有效', updatedBy: '李敏', updatedAt: '2026-08-02', description: '市价跌幅达到阈值时触发补偿及预警流程。' },
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', ruleNo: 'RULE-003', ruleName: '货物期限规则', applicableScope: '先票/款后货', status: '有效', updatedBy: '王磊', updatedAt: '2026-08-03', description: '货物剩余有效期不得低于一个月。' }
]
const factorRows: SchemeRow[] = [
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', factorCode: 'FACTOR-001', factorName: '价格折扣率', factorValue: '70%', threshold: '65%', status: '有效', updatedBy: '张晨', updatedAt: '2026-08-04', description: '按商品小类及市场价格波动区间确定。' },
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', factorCode: 'FACTOR-002', factorName: '监管仓库系数', factorValue: '0.85', threshold: '0.75', status: '有效', updatedBy: '李敏', updatedAt: '2026-08-03', description: '按仓库评级及监管方式计算。' },
  { schemeNo: 'DS20260720001', schemeName: '供应链存货融资方案', factorCode: 'FACTOR-003', factorName: '货物期限系数', factorValue: '0.90', threshold: '0.80', status: '有效', updatedBy: '王磊', updatedAt: '2026-08-02', description: '根据货物剩余有效期动态调整。' }
]
const rows = computed(() => mode.value.includes('Factor') ? factorRows : ruleRows)
const query = reactive({ keyword: '' })
const filteredRows = computed(() => {
  const keyword = query.keyword.trim()
  if (!keyword) return rows.value
  return rows.value.filter((row) => Object.values(row).some((value) => value.includes(keyword)))
})
const columns = computed<CrudSchema[]>(() => mode.value.includes('Factor')
  ? [
      { label: '方案编号', field: 'schemeNo', minWidth: 160 }, { label: '债项方案名称', field: 'schemeName', minWidth: 190 },
      { label: '因子编码', field: 'factorCode', minWidth: 140, isSearch: true }, { label: '债项因子', field: 'factorName', minWidth: 155, isSearch: true },
      { label: mode.value === 'debtFactorDetail' ? '当前取值' : '设置值', field: 'factorValue', minWidth: 120 }, { label: '预警阈值', field: 'threshold', minWidth: 110 },
      { label: '状态', field: 'status', minWidth: 90 }, { label: '更新人', field: 'updatedBy', minWidth: 100 }, { label: '更新时间', field: 'updatedAt', minWidth: 120 }
    ]
  : [
      { label: '方案编号', field: 'schemeNo', minWidth: 160 }, { label: '债项方案名称', field: 'schemeName', minWidth: 190, isSearch: true },
      { label: '规则编号', field: 'ruleNo', minWidth: 130 }, { label: '规则名称', field: 'ruleName', minWidth: 160, isSearch: true },
      { label: '适用范围', field: 'applicableScope', minWidth: 160 }, { label: '状态', field: 'status', minWidth: 90 },
      { label: '更新人', field: 'updatedBy', minWidth: 100 }, { label: '更新时间', field: 'updatedAt', minWidth: 120 }
    ])
const { allSchemas: schemas } = useCrudSchemas(computed(() => [...columns.value, { label: '操作', field: 'action', fixed: 'right', width: 100 }]).value)
const dialogVisible = ref(false)
const selectedRow = ref<SchemeRow>()
const openDetail = (row: SchemeRow) => { selectedRow.value = row; dialogVisible.value = true }
const handleSearch = () => undefined
const buttons = computed<ActionButton[]>(() => isDetail.value
  ? [{ key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true, onClick: () => ElMessage.success('已生成导出任务') }]
  : [{ key: 'add', label: mode.value === 'ruleConfig' ? '新增规则' : '新增因子', icon: 'ep:plus', type: 'primary', onClick: () => ElMessage.success('已新建本地 Mock 草稿') }, { key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true, onClick: () => ElMessage.success('已生成导出任务') }])
</script>

<style scoped lang="scss">
.page-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.page-title { color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; line-height: 1.5; }
.page-description { margin-top: 4px; color: var(--el-text-color-secondary); font-size: 14px; }
</style>
