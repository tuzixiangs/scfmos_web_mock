<template>
  <div class="customer-qualification-page">
    <ContentWrap class="qualification-shell" :body-style="{ padding: '0' }">
      <div class="qualification-tab">客户资质认定信息</div>
      <div class="qualification-body">
        <div class="qualification-actions">
        <el-button size="small" :loading="saving" @click="saveQualification">
          <Icon icon="ep:document" class="mr-5px" />保存
        </el-button>
        <el-button size="small" @click="historyVisible = true">
          <Icon icon="ep:clock" class="mr-5px" />企业规模转换历史情况
        </el-button>
        <el-button size="small" @click="openEnterpriseData">
          <Icon icon="ep:search" class="mr-5px" />企查查数据查询
        </el-button>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="230px"
        size="small"
        class="qualification-form"
      >
        <el-form-item label="客户编号">
          <el-input v-model="form.customerNo" disabled />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="form.customerName" disabled />
        </el-form-item>
        <el-form-item label="国标行业分类" prop="nationalIndustry">
          <el-input
            v-model="form.nationalIndustry"
            readonly
            placeholder="请选择国标行业分类"
            class="industry-input"
          >
            <template #append>
              <el-button aria-label="选择国标行业分类" @click="industryVisible = true">
                <Icon icon="ep:search" />
              </el-button>
            </template>
          </el-input>
          <el-button link type="primary" class="industry-download" @click="downloadIndustryGuide">
            行业分类说明下载（征信 M）
          </el-button>
        </el-form-item>
        <el-form-item label="工信部行业分类" prop="miitIndustry">
          <el-select v-model="form.miitIndustry" placeholder="请选择工信部行业分类" class="w-full">
            <el-option v-for="item in miitIndustryOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工人数" prop="employeeCount">
          <div class="unit-field">
            <el-input-number
              v-model="form.employeeCount"
              :min="0"
              :precision="0"
              :controls="false"
              placeholder="请输入员工人数"
            />
            <span>人</span>
          </div>
        </el-form-item>
        <el-form-item label="上年营业收入（原上年销售额）" prop="priorYearRevenue">
          <div class="unit-field">
            <el-input-number
              v-model="form.priorYearRevenue"
              :min="0"
              :precision="2"
              :controls="false"
              placeholder="请输入上年营业收入"
            />
            <span>万元</span>
          </div>
        </el-form-item>
        <el-form-item label="上年总资产（原上年资产总额）" prop="priorYearAssets">
          <div class="unit-field">
            <el-input-number
              v-model="form.priorYearAssets"
              :min="0"
              :precision="2"
              :controls="false"
              placeholder="请输入上年总资产"
            />
            <span>万元</span>
          </div>
        </el-form-item>
        <el-form-item label="企业规模" prop="enterpriseScale">
          <el-select v-model="form.enterpriseScale" placeholder="请选择企业规模" class="w-full">
            <el-option v-for="item in scaleOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否执行定义小微" prop="smallMicroStandard">
          <el-select v-model="form.smallMicroStandard" placeholder="请选择" class="w-full">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-form>
      </div>
    </ContentWrap>

    <el-dialog
      v-model="industryVisible"
      title="选择国标行业分类"
      width="720px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-input v-model.trim="industryKeyword" clearable placeholder="请输入行业名称或代码" class="mb-12px">
        <template #prefix><Icon icon="ep:search" /></template>
      </el-input>
      <el-table :data="filteredIndustries" border highlight-current-row @row-click="selectIndustry">
        <el-table-column width="56" align="center">
          <template #default="{ row }">
            <el-radio :model-value="pendingIndustry" :value="row.value"><span></span></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="行业代码" width="130" />
        <el-table-column prop="name" label="行业名称" min-width="240" />
        <el-table-column prop="category" label="行业门类" min-width="150" />
      </el-table>
      <template #footer>
        <el-button @click="industryVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!pendingIndustry" @click="confirmIndustry">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="historyVisible" title="企业规模转换历史情况" width="820px">
      <el-table :data="scaleHistory" border>
        <el-table-column prop="changedAt" label="变更日期" width="130" />
        <el-table-column prop="previousScale" label="变更前规模" width="130" />
        <el-table-column prop="currentScale" label="变更后规模" width="130" />
        <el-table-column prop="reason" label="变更原因" min-width="220" />
        <el-table-column prop="operator" label="操作人" width="110" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="enterpriseDataVisible" title="企查查数据查询" width="760px">
      <el-alert title="以下为企查查最新企业数据，确认后可回填资质认定信息。" type="info" :closable="false" class="mb-12px" />
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ form.customerName }}</el-descriptions-item>
        <el-descriptions-item label="经营状态">存续</el-descriptions-item>
        <el-descriptions-item label="参保人数">{{ enterpriseData.employeeCount }} 人</el-descriptions-item>
        <el-descriptions-item label="所属行业">{{ enterpriseData.industry }}</el-descriptions-item>
        <el-descriptions-item label="注册资本">5,000 万元</el-descriptions-item>
        <el-descriptions-item label="数据更新时间">2026-08-31</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="enterpriseDataVisible = false">关 闭</el-button>
        <el-button type="primary" @click="applyEnterpriseData">确认回填</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

defineOptions({ name: 'CompanyCustomerQualification' })

const props = defineProps<{
  params?: {
    customerId?: string
    customerIdByProps?: string
    detailInfo?: Record<string, unknown> | { value?: Record<string, unknown> }
  }
}>()

const route = useRoute()
const formRef = ref<FormInstance>()
const saving = ref(false)
const industryVisible = ref(false)
const historyVisible = ref(false)
const enterpriseDataVisible = ref(false)
const industryKeyword = ref('')
const pendingIndustry = ref('')

const form = reactive({
  customerNo: '',
  customerName: '',
  nationalIndustry: 'F5121-米、面制品及食用油批发',
  miitIndustry: '批发和零售业',
  employeeCount: 10,
  priorYearRevenue: 1280,
  priorYearAssets: 960,
  enterpriseScale: '小型',
  smallMicroStandard: '是'
})

const rules: FormRules = {
  nationalIndustry: [{ required: true, message: '请选择国标行业分类', trigger: 'change' }],
  miitIndustry: [{ required: true, message: '请选择工信部行业分类', trigger: 'change' }],
  employeeCount: [{ required: true, message: '请输入员工人数', trigger: 'blur' }],
  priorYearRevenue: [{ required: true, message: '请输入上年营业收入', trigger: 'blur' }],
  priorYearAssets: [{ required: true, message: '请输入上年总资产', trigger: 'blur' }],
  enterpriseScale: [{ required: true, message: '请选择企业规模', trigger: 'change' }],
  smallMicroStandard: [{ required: true, message: '请选择是否执行定义小微', trigger: 'change' }]
}

const miitIndustryOptions = ['农、林、牧、渔业', '工业', '建筑业', '批发和零售业', '交通运输业', '软件和信息技术服务业', '其他行业']
const scaleOptions = ['大型', '中型', '小型', '微型']
const industries = [
  { code: 'F5121', name: '米、面制品及食用油批发', category: '批发和零售业', value: 'F5121-米、面制品及食用油批发' },
  { code: 'F5164', name: '金属及金属矿批发', category: '批发和零售业', value: 'F5164-金属及金属矿批发' },
  { code: 'C3130', name: '钢压延加工', category: '制造业', value: 'C3130-钢压延加工' },
  { code: 'I6513', name: '应用软件开发', category: '信息传输、软件和信息技术服务业', value: 'I6513-应用软件开发' }
]
const filteredIndustries = computed(() => {
  const keyword = industryKeyword.value.toLowerCase()
  return industries.filter((item) => !keyword || `${item.code}${item.name}${item.category}`.toLowerCase().includes(keyword))
})
const scaleHistory = [
  { changedAt: '2026-07-28', previousScale: '微型', currentScale: '小型', reason: '年度营业收入及资产规模更新', operator: '项猸疼' },
  { changedAt: '2025-07-16', previousScale: '小型', currentScale: '微型', reason: '按年度企业划型标准重新认定', operator: '张晨' }
]
const enterpriseData = { employeeCount: 12, industry: 'F5121-米、面制品及食用油批发' }

const resolvedDetailInfo = computed<Record<string, unknown>>(() => {
  const detailInfo = props.params?.detailInfo
  if (!detailInfo) return {}
  const nestedValue = 'value' in detailInfo ? detailInfo.value : undefined
  return nestedValue && typeof nestedValue === 'object'
    ? (nestedValue as Record<string, unknown>)
    : (detailInfo as Record<string, unknown>)
})

const syncCustomerInfo = () => {
  const detail = resolvedDetailInfo.value
  form.customerNo = String(
    detail.customerid ||
      route.query.customerId ||
      route.query.customerID ||
      route.query.customerid ||
      props.params?.customerId ||
      props.params?.customerIdByProps ||
      ''
  )
  form.customerName = String(
    detail.enterprisename || detail.customername || route.query.customerName || '洋寻华柳自动化有限公司'
  )
  if (detail.industrytypename) form.nationalIndustry = String(detail.industrytypename)
  if (detail.employeenumber !== undefined) form.employeeCount = Number(detail.employeenumber) || 0
  if (detail.scope) {
    const scaleMap: Record<string, string> = { '1': '大型', '2': '中型', '3': '小型', '4': '微型' }
    form.enterpriseScale = scaleMap[String(detail.scope)] || form.enterpriseScale
  }
}

const selectIndustry = (row: (typeof industries)[number]) => {
  pendingIndustry.value = row.value
}
const confirmIndustry = () => {
  if (!pendingIndustry.value) return
  form.nationalIndustry = pendingIndustry.value
  industryVisible.value = false
}
const downloadIndustryGuide = () => ElMessage.success('行业分类说明已生成下载任务（Mock）')
const openEnterpriseData = () => {
  enterpriseDataVisible.value = true
}
const applyEnterpriseData = () => {
  form.employeeCount = enterpriseData.employeeCount
  form.nationalIndustry = enterpriseData.industry
  enterpriseDataVisible.value = false
  ElMessage.success('企查查企业数据已回填')
}
const saveQualification = async () => {
  const valid = await formRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  saving.value = true
  window.setTimeout(() => {
    saving.value = false
    ElMessage.success('客户资质认定信息保存成功（Mock）')
  }, 300)
}

watch(resolvedDetailInfo, syncCustomerInfo, { immediate: true, deep: true })
</script>

<style scoped lang="scss">
.customer-qualification-page { min-width: 0; height: 100%; background: #fff; }
.qualification-shell { margin: 0; border-radius: 0; }
.qualification-tab { display: inline-flex; align-items: center; height: 34px; padding: 0 24px; background: var(--el-color-primary); color: #fff; font-size: 14px; }
.qualification-body { padding: 10px 12px 18px; }
.qualification-actions { display: flex; flex-wrap: wrap; margin-bottom: 8px; gap: 6px; }
.qualification-actions :deep(.el-button) { height: 30px; margin: 0; border-radius: 2px; }
.qualification-form { width: min(900px, 100%); border-top: 1px solid #cfd3dc; border-right: 1px solid #cfd3dc; }
.qualification-form :deep(.el-form-item) { min-height: 38px; margin: 0; border-bottom: 1px solid #cfd3dc; border-left: 1px solid #cfd3dc; }
.qualification-form :deep(.el-form-item__label) { align-self: stretch; justify-content: flex-start; height: auto; padding: 8px 12px; border-right: 1px solid #cfd3dc; background: #f2f3f5; color: #303133; line-height: 21px; }
.qualification-form :deep(.el-form-item__content) { min-height: 37px; padding: 3px 7px; line-height: 30px; }
.qualification-form :deep(.el-input),
.qualification-form :deep(.el-select),
.qualification-form :deep(.el-input-number) { width: 430px; max-width: 100%; }
.qualification-form :deep(.el-input__wrapper),
.qualification-form :deep(.el-select__wrapper) { border-radius: 0; }
.industry-input { width: 430px !important; }
.industry-download { margin-left: 10px; }
.unit-field { display: flex; align-items: center; width: 490px; max-width: 100%; gap: 10px; }
.unit-field > span { min-width: 38px; color: #606266; }
@media (max-width: 900px) {
  .qualification-form { width: 100%; }
  .qualification-form :deep(.el-form-item__label) { width: 190px !important; }
  .industry-input { width: 100%; }
  .industry-download { margin-left: 0; }
}
</style>
