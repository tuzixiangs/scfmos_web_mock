<template>
  <div class="order-contract-detail-page" v-loading="loading">
    <div class="detail-page-toolbar">
      <el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button>
      <div v-if="detail" class="application-summary">
        <span>申请流水号：{{ detail.applicationFlowNo }}</span>
        <span>订单/合同编号：{{ detail.orderContractNo }}</span>
        <el-tag :type="detail.contractStatus === '有效' ? 'success' : 'info'" effect="light">
          {{ detail.contractStatus }}
        </el-tag>
      </div>
    </div>

    <el-alert
      v-if="detail && isRecordMode"
      title="当前为已提交的订单/合同信息修改记录，仅支持查看。"
      type="info"
      :closable="false"
      class="record-alert"
    />
    <el-empty v-if="!loading && !detail" description="未获取到订单/合同信息修改详情" />

    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="application">
        <template #title><span class="collapse-title">申请及关联信息</span></template>
        <div class="collapse-content">
          <el-form label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="申请流水号"><el-input :model-value="detail.applicationFlowNo || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="申请日期"><el-input :model-value="detail.applicationDate || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="客户名称"><el-input :model-value="detail.customerName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="核心客户编号"><el-input :model-value="detail.coreCustomerNo || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="项目名称"><el-input :model-value="detail.projectName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="项目编号"><el-input :model-value="detail.projectNo || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="业务合同编号"><el-input :model-value="detail.businessContractNo || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="产品方案"><el-input :model-value="detail.productScheme || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="数据来源"><el-input :model-value="detail.dataSource || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="修改状态"><el-input :model-value="detail.modificationStatus || '-'" disabled /></el-form-item></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="contract">
        <template #title><span class="collapse-title">订单/合同基础信息</span></template>
        <div class="collapse-content">
          <el-form ref="contractFormRef" :model="contractForm" :rules="contractRules" label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="订单/合同编号" prop="orderContractNo"><el-input v-model.trim="contractForm.orderContractNo" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="订单/合同状态"><el-input :model-value="detail.contractStatus" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="签约方1" prop="partyOne"><el-input v-model.trim="contractForm.partyOne" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="签约方2" prop="partyTwo"><el-input v-model.trim="contractForm.partyTwo" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="签约方3"><el-input v-model.trim="contractForm.partyThree" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="币种" prop="currency"><el-select v-model="contractForm.currency" class="w-full" :disabled="readonly"><el-option label="人民币" value="人民币" /><el-option label="美元" value="美元" /><el-option label="欧元" value="欧元" /></el-select></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="订单/合同总金额" prop="contractTotalAmount"><el-input-number v-model="contractForm.contractTotalAmount" class="w-full" :min="0" :precision="2" :controls="false" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="本次使用金额" prop="currentUsedAmount"><el-input-number v-model="contractForm.currentUsedAmount" class="w-full" :min="0" :precision="2" :controls="false" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="剩余可用金额"><el-input :model-value="formatAmount(remainingAmount)" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="合同起始日" prop="contractStartDate"><el-date-picker v-model="contractForm.contractStartDate" type="date" value-format="YYYY-MM-DD" class="w-full" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="合同到期日" prop="contractEndDate"><el-date-picker v-model="contractForm.contractEndDate" type="date" value-format="YYYY-MM-DD" class="w-full" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
          </el-form>
          <div v-if="!isRecordMode" class="section-actions">
            <el-button type="primary" :loading="saving" @click="saveContract">保存合同信息</el-button>
            <el-button type="danger" plain :loading="invalidating" :disabled="detail.contractStatus === '失效'" @click="invalidateContract">置为失效</el-button>
            <span class="action-tip">存在未结清业务时不能置为失效。</span>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="items">
        <template #title><span class="collapse-title">合同项下信息</span></template>
        <div class="collapse-content">
          <div class="section-toolbar">
            <div v-if="!isRecordMode">
              <el-button type="primary" @click="openItemEditor()"><Icon icon="ep:plus" class="mr-4px" />新增</el-button>
              <el-button @click="mockExcel('上传')"><Icon icon="ep:upload" class="mr-4px" />上传 Excel</el-button>
              <el-button @click="mockExcel('导出')"><Icon icon="ep:download" class="mr-4px" />导出模板</el-button>
            </div>
            <span v-else>展示该修改记录提交时的合同项下信息</span>
            <div class="item-total">货物总金额：<strong>{{ formatAmount(itemsTotal) }} {{ detail.currency }}</strong></div>
          </div>
          <el-table :data="detail.items" border empty-text="暂无合同项下信息">
            <el-table-column prop="sequence" label="序号" width="66" fixed="left" align="center" />
            <el-table-column prop="productCode" label="商品编号" min-width="150" fixed="left" />
            <el-table-column prop="productName" label="商品名称" min-width="160" fixed="left" />
            <el-table-column prop="largeCategory" label="商品大类" min-width="130" />
            <el-table-column prop="middleCategory" label="商品中类" min-width="130" />
            <el-table-column prop="smallCategory" label="商品小类" min-width="130" />
            <el-table-column prop="batchNo" label="批号" min-width="120" />
            <el-table-column prop="cabinetNo" label="柜号" min-width="120" />
            <el-table-column label="指导价" min-width="120" align="right"><template #default="{ row }">{{ formatAmount(row.guidancePrice ?? row.unitPrice) }}</template></el-table-column>
            <el-table-column prop="origin" label="产地" min-width="120" />
            <el-table-column prop="warehouseName" label="仓储地" min-width="170" />
            <el-table-column prop="specification" label="规格" min-width="120" />
            <el-table-column label="数量/重量" min-width="130" align="right"><template #default="{ row }">{{ formatQuantity(row.quantityOrWeight) }}</template></el-table-column>
            <el-table-column label="单价" min-width="120" align="right"><template #default="{ row }">{{ formatAmount(row.unitPrice) }}</template></el-table-column>
            <el-table-column label="总金额" min-width="140" align="right"><template #default="{ row }">{{ formatAmount(row.totalAmount) }}</template></el-table-column>
            <el-table-column prop="currency" label="币种" width="90" align="center" />
            <el-table-column prop="cargoStartDate" label="货物起始日" min-width="120" />
            <el-table-column prop="cargoEndDate" label="货物到期日" min-width="120" />
            <el-table-column label="货物所有权" min-width="120"><template #default="{ row }">{{ row.cargoOwner === '借款人本人' ? '借款人自己' : row.cargoOwner }}</template></el-table-column>
            <el-table-column v-if="!isRecordMode" label="操作" width="130" fixed="right" align="center">
              <template #default="{ row }"><el-button link type="primary" @click="openItemEditor(row)">编辑</el-button><el-button link type="danger" @click="removeItem(row)">删除</el-button></template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog v-model="itemEditorVisible" :title="itemForm.id ? '编辑合同项下信息' : '新增合同项下信息'" width="900px" destroy-on-close :close-on-click-modal="false">
      <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="120px">
        <div class="item-form-grid">
          <el-form-item label="商品编号"><el-input :model-value="itemForm.productCode || '保存后自动生成'" disabled /></el-form-item>
          <el-form-item label="商品名称" prop="productName"><el-input v-model.trim="itemForm.productName" /></el-form-item>
          <el-form-item label="商品大类" prop="largeCategory"><el-select v-model="itemForm.largeCategory" class="w-full" @change="handleLargeCategoryChange"><el-option v-for="item in categoryOptions" :key="item.name" :label="item.name" :value="item.name" /></el-select></el-form-item>
          <el-form-item label="商品中类" prop="middleCategory"><el-select v-model="itemForm.middleCategory" class="w-full" @change="handleMiddleCategoryChange"><el-option v-for="item in middleCategoryOptions" :key="item.name" :label="item.name" :value="item.name" /></el-select></el-form-item>
          <el-form-item label="商品小类" prop="smallCategory"><el-select v-model="itemForm.smallCategory" class="w-full"><el-option v-for="item in smallCategoryOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="批号"><el-input v-model.trim="itemForm.batchNo" /></el-form-item>
          <el-form-item label="柜号"><el-input v-model.trim="itemForm.cabinetNo" /></el-form-item>
          <el-form-item label="指导价"><el-input-number v-model="itemForm.guidancePrice" class="w-full" :min="0" :precision="2" :controls="false" /></el-form-item>
          <el-form-item label="产地"><el-cascader v-model="itemForm.originPath" :options="originOptions" class="w-full" clearable /></el-form-item>
          <el-form-item label="仓储地" prop="warehouseName"><el-select v-model="itemForm.warehouseName" class="w-full" filterable><el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="规格"><el-input v-model.trim="itemForm.specification" /></el-form-item>
          <el-form-item label="数量/重量" prop="quantityOrWeight"><el-input-number v-model="itemForm.quantityOrWeight" class="w-full" :min="0" :precision="3" :controls="false" /></el-form-item>
          <el-form-item label="单价" prop="unitPrice"><el-input-number v-model="itemForm.unitPrice" class="w-full" :min="0" :precision="2" :controls="false" /></el-form-item>
          <el-form-item label="总金额"><el-input :model-value="formatAmount(itemCalculatedTotal)" disabled /></el-form-item>
          <el-form-item label="币种"><el-select v-model="itemForm.currency" class="w-full"><el-option label="人民币" value="人民币" /><el-option label="美元" value="美元" /><el-option label="欧元" value="欧元" /></el-select></el-form-item>
          <el-form-item label="货物起始日" prop="cargoStartDate"><el-date-picker v-model="itemForm.cargoStartDate" type="date" value-format="YYYY-MM-DD" class="w-full" /></el-form-item>
          <el-form-item label="货物到期日" prop="cargoEndDate"><el-date-picker v-model="itemForm.cargoEndDate" type="date" value-format="YYYY-MM-DD" class="w-full" /></el-form-item>
          <el-form-item label="货物所有权" prop="cargoOwner"><el-select v-model="itemForm.cargoOwner" class="w-full"><el-option label="核心企业" value="核心企业" /><el-option label="借款人自己" value="借款人本人" /></el-select></el-form-item>
        </div>
      </el-form>
      <template #footer><el-button @click="itemEditorVisible = false">取 消</el-button><el-button type="primary" :loading="itemSaving" @click="saveItem">保 存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  createOrderContractItem,
  deleteOrderContractItem,
  getOrderContractModificationDetail,
  invalidateOrderContractModification,
  updateOrderContractItem,
  updateOrderContractModification,
  type OrderContractCurrency,
  type OrderContractItem,
  type OrderContractItemForm,
  type OrderContractModificationDetail,
  type OrderContractModificationNode
} from '@/api/indebt/orderContractModification'

defineOptions({ name: 'OrderContractModificationDetail' })

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const invalidating = ref(false)
const itemSaving = ref(false)
const detail = ref<OrderContractModificationDetail>()
const activeSections = ref(['application', 'contract', 'items'])
const contractFormRef = ref<FormInstance>()
const itemFormRef = ref<FormInstance>()
const itemEditorVisible = ref(false)

const node = computed<OrderContractModificationNode>(() =>
  route.query.mode === 'records' || route.query.key === 'record' ? 'records' : 'active'
)
const isRecordMode = computed(() => node.value === 'records')
const readonly = computed(() => isRecordMode.value || detail.value?.contractStatus === '失效')

const contractForm = reactive({
  orderContractNo: '', partyOne: '', partyTwo: '', partyThree: '',
  contractTotalAmount: 0, currentUsedAmount: 0, currency: '人民币' as OrderContractCurrency,
  contractStartDate: '', contractEndDate: ''
})
const required = (message: string, trigger = 'blur') => ({ required: true, message, trigger })
const contractRules: FormRules = {
  orderContractNo: [required('请输入订单/合同编号')], partyOne: [required('请输入签约方1')],
  partyTwo: [required('请输入签约方2')], currency: [required('请选择币种', 'change')],
  contractTotalAmount: [required('请输入订单/合同总金额')], currentUsedAmount: [required('请输入本次使用金额')],
  contractStartDate: [required('请选择合同起始日', 'change')], contractEndDate: [required('请选择合同到期日', 'change')]
}
const remainingAmount = computed(() => Math.max(contractForm.contractTotalAmount - contractForm.currentUsedAmount, 0))
const itemsTotal = computed(() => (detail.value?.items || []).reduce((sum, item) => sum + Number(item.totalAmount || 0), 0))

interface CategoryOption { name: string; children: { name: string; children: string[] }[] }
const categoryOptions: CategoryOption[] = [
  { name: '金属材料', children: [{ name: '钢材', children: ['热轧卷板', '冷轧卷板', '螺纹钢'] }, { name: '有色金属', children: ['铜材', '铝材'] }] },
  { name: '化工产品', children: [{ name: '基础化工', children: ['聚乙烯', '聚丙烯'] }, { name: '精细化工', children: ['涂料', '助剂'] }] },
  { name: '农产品', children: [{ name: '粮食', children: ['玉米', '大豆', '小麦'] }, { name: '油脂', children: ['豆油', '棕榈油'] }] }
]
const originOptions = [
  { value: '中国', label: '中国', children: ['浙江省', '江苏省', '河北省', '山东省', '广东省'].map((value) => ({ value, label: value })) },
  ...['美国', '巴西', '澳大利亚', '德国', '日本'].map((value) => ({ value, label: value }))
]
const warehouseOptions = ['宁波港通监管仓', '上海临港监管仓', '天津港保税仓', '青岛前湾监管仓', '在途监管仓']

type ItemEditor = OrderContractItemForm & { id?: number; productCode?: string; guidancePrice: number; originPath: string[] }
const newItemForm = (): ItemEditor => ({
  productName: '', largeCategory: '', middleCategory: '', smallCategory: '', batchNo: '', cabinetNo: '',
  guidancePrice: 0, specification: '', origin: '', originPath: [], warehouseName: '', quantityOrWeight: 0,
  unitPrice: 0, currency: detail.value?.currency || '人民币', cargoStartDate: '', cargoEndDate: '', cargoOwner: '核心企业'
})
const itemForm = reactive<ItemEditor>(newItemForm())
const itemRules: FormRules = {
  productName: [required('请输入商品名称')], largeCategory: [required('请选择商品大类', 'change')],
  middleCategory: [required('请选择商品中类', 'change')], smallCategory: [required('请选择商品小类', 'change')],
  warehouseName: [required('请选择仓储地', 'change')], quantityOrWeight: [required('请输入数量/重量')],
  unitPrice: [required('请输入单价')], cargoStartDate: [required('请选择货物起始日', 'change')],
  cargoEndDate: [required('请选择货物到期日', 'change')], cargoOwner: [required('请选择货物所有权', 'change')]
}
const middleCategoryOptions = computed(() => categoryOptions.find((item) => item.name === itemForm.largeCategory)?.children || [])
const smallCategoryOptions = computed(() => middleCategoryOptions.value.find((item) => item.name === itemForm.middleCategory)?.children || [])
const itemCalculatedTotal = computed(() => Number(itemForm.quantityOrWeight || 0) * Number(itemForm.unitPrice || 0))

const formatAmount = (value: unknown) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatQuantity = (value: unknown) => Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 3 })
const applyDetail = (record: OrderContractModificationDetail) => {
  detail.value = record
  Object.assign(contractForm, {
    orderContractNo: record.orderContractNo, partyOne: record.partyOne, partyTwo: record.partyTwo,
    partyThree: record.partyThree, contractTotalAmount: record.contractTotalAmount,
    currentUsedAmount: record.currentUsedAmount, currency: record.currency,
    contractStartDate: record.contractStartDate, contractEndDate: record.contractEndDate
  })
}
const loadDetail = async () => {
  const id = Number(route.query.id)
  if (!Number.isFinite(id) || id <= 0) { detail.value = undefined; return }
  loading.value = true
  try { applyDetail(await getOrderContractModificationDetail(id, node.value)) }
  catch (error) { detail.value = undefined; ElMessage.error(error instanceof Error ? error.message : '获取订单/合同详情失败') }
  finally { loading.value = false }
}
const saveContract = async () => {
  if (!detail.value || readonly.value) return
  const valid = await contractFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  if (contractForm.currentUsedAmount > contractForm.contractTotalAmount) return ElMessage.warning('本次使用金额不能大于订单/合同总金额')
  if (contractForm.contractEndDate < contractForm.contractStartDate) return ElMessage.warning('合同到期日不能早于合同起始日')
  saving.value = true
  try {
    const result = await updateOrderContractModification(detail.value.id, { ...contractForm })
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record); ElMessage.success('订单/合同基础信息已保存')
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '保存失败') }
  finally { saving.value = false }
}
const invalidateContract = async () => {
  if (!detail.value) return
  try { await ElMessageBox.confirm('确认将当前订单/合同置为失效吗？', '操作确认', { type: 'warning' }) } catch { return }
  invalidating.value = true
  try {
    const result = await invalidateOrderContractModification(detail.value.id)
    if (!result.success || !result.record) throw new Error(result.message || '操作失败')
    applyDetail(result.record); ElMessage.success('订单/合同已置为失效')
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '操作失败') }
  finally { invalidating.value = false }
}
const handleLargeCategoryChange = () => { itemForm.middleCategory = ''; itemForm.smallCategory = '' }
const handleMiddleCategoryChange = () => { itemForm.smallCategory = '' }
const openItemEditor = (row?: OrderContractItem) => {
  const originPath = row?.origin ? (row.origin.includes('/') ? row.origin.split('/') : [row.origin]) : []
  Object.assign(itemForm, newItemForm(), row || {}, {
    guidancePrice: row?.guidancePrice ?? row?.unitPrice ?? 0,
    originPath
  })
  itemEditorVisible.value = true
}
const saveItem = async () => {
  if (!detail.value) return
  const valid = await itemFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  if (itemForm.quantityOrWeight <= 0 || itemForm.unitPrice <= 0) return ElMessage.warning('数量/重量和单价必须大于0')
  if (itemForm.cargoEndDate < itemForm.cargoStartDate) return ElMessage.warning('货物到期日不能早于货物起始日')
  itemSaving.value = true
  try {
    const { id, productCode: _productCode, originPath, ...payload } = itemForm
    payload.origin = originPath.join('/')
    const result = id ? await updateOrderContractItem(detail.value.id, id, payload) : await createOrderContractItem(detail.value.id, payload)
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record); itemEditorVisible.value = false; ElMessage.success('合同项下信息已保存')
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '保存失败') }
  finally { itemSaving.value = false }
}
const removeItem = async (row: OrderContractItem) => {
  if (!detail.value) return
  try { await ElMessageBox.confirm(`确认删除“${row.productName}”吗？`, '操作确认', { type: 'warning' }) } catch { return }
  try {
    const result = await deleteOrderContractItem(detail.value.id, row.id)
    if (!result.success || !result.record) throw new Error(result.message || '删除失败')
    applyDetail(result.record); ElMessage.success('合同项下信息已删除')
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '删除失败') }
}
const mockExcel = (action: string) => ElMessage.info(`${action}功能为 Mock 演示，可在此接入实际文件服务`)
const goBack = () => {
  const query = Object.fromEntries(Object.entries(route.query).filter(([key]) => !['view', 'id', 'mode'].includes(key)))
  router.push({ path: route.path, query })
}
watch([() => route.query.id, node], loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.order-contract-detail-page { min-width: 0; min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }
.detail-page-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; gap: 24px; }
.application-summary { display: flex; align-items: center; color: #606266; font-size: 13px; gap: 28px; }
.record-alert { margin-bottom: 12px; }
.system-detail-collapse { border: 0; background: transparent; }
:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }
:deep(.system-detail-collapse .el-collapse-item__header) { height: 52px; padding: 0 20px; border-bottom: 0; background: #fff; color: #303133; }
:deep(.system-detail-collapse .el-collapse-item__wrap) { border-bottom: 0; background: #fff; }
:deep(.system-detail-collapse .el-collapse-item__content) { padding-bottom: 0; color: #606266; }
.collapse-title { font-size: 16px; font-weight: 600; }
.collapse-content { min-width: 0; padding: 4px 20px 20px; }
.detail-form { padding: 4px 20px 0; }
.detail-form :deep(.el-form-item) { margin-bottom: 14px; }
.detail-form :deep(.el-form-item__label) { color: #606266; font-weight: 400; }
.detail-form :deep(.el-input.is-disabled .el-input__wrapper) { background: #f5f7fa; }
.section-actions { display: flex; align-items: center; padding: 4px 20px 0 160px; gap: 10px; }
.action-tip { color: #909399; font-size: 12px; }
.section-toolbar { display: flex; align-items: center; justify-content: space-between; min-height: 32px; margin-bottom: 10px; color: #909399; font-size: 13px; gap: 20px; }
.item-total { flex: 0 0 auto; color: #606266; white-space: nowrap; }
.item-total strong { color: #f56c6c; font-size: 16px; font-weight: 600; }
.item-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
@media (max-width: 900px) {
  .detail-page-toolbar, .application-summary, .section-toolbar { flex-wrap: wrap; }
  .item-form-grid { grid-template-columns: 1fr; }
  :deep(.detail-form .el-col-12) { max-width: 100%; flex: 0 0 100%; }
}
</style>
