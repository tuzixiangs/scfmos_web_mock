<template>
  <div class="order-contract-detail-page" v-loading="loading">
    <div class="detail-page-toolbar">
      <el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button>
      <div v-if="detail" class="application-summary">
        <span>申请编号：{{ detail.applicationFlowNo }}</span>
        <span>项目名称：{{ detail.projectName }}</span>
        <el-tag :type="detail.contractStatus === '有效' ? 'success' : 'info'" effect="light">
          {{ detail.contractStatus }}
        </el-tag>
      </div>
    </div>

    <el-alert
      v-if="detail && isRecordMode"
      title="当前为已提交的债项数据修改记录，仅支持查看。"
      type="info"
      :closable="false"
      class="record-alert"
    />
    <el-empty v-if="!loading && !detail" description="未获取到债项数据修改详情" />

    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="application">
        <template #title><span class="collapse-title">业务合同基本信息</span></template>
        <div class="collapse-content">
          <el-form label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"
                ><el-form-item label="业务合同编号"
                  ><el-input
                    :model-value="detail.businessContractNo || '-'"
                    disabled /></el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="合同金额"
                  ><el-input :model-value="formatAmount(detail.contractTotalAmount)" disabled
                    ><template #append>{{ detail.currency }}</template></el-input
                  ></el-form-item
                ></el-col
              >
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"
                ><el-form-item label="合同起始日"
                  ><el-input
                    :model-value="detail.contractStartDate || '-'"
                    disabled /></el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="合同到期日"
                  ><el-input :model-value="detail.contractEndDate || '-'" disabled /></el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"
                ><el-form-item label="产品方案"
                  ><el-input :model-value="detail.productScheme || '-'" disabled /></el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="项目名称"
                  ><el-input :model-value="detail.projectName || '-'" disabled /></el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"
                ><el-form-item label="链属客户名称"
                  ><el-input :model-value="detail.customerName || '-'" disabled /></el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="核心客户编号"
                  ><el-input :model-value="detail.coreCustomerNo || '-'" disabled /></el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"
                ><el-form-item label="项目编号"
                  ><el-input :model-value="detail.projectNo || '-'" disabled /></el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="申请日期"
                  ><el-input :model-value="detail.applicationDate || '-'" disabled /></el-form-item
              ></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="contract">
        <template #title><span class="collapse-title">订单/合同基本信息</span></template>
        <div class="collapse-content">
          <div class="section-toolbar">
            <span>请选择一条有效订单/合同，下方将展示其关联的债项资产</span>
            <el-tag :type="detail.contractStatus === '有效' ? 'success' : 'info'" effect="plain"
              >状态：{{ detail.contractStatus }}</el-tag
            >
          </div>
          <el-table :data="contractRows" border highlight-current-row class="contract-table">
            <el-table-column width="56" fixed="left" align="center"
              ><template #default
                ><el-radio :model-value="detail.id" :value="detail.id"
                  ><span class="sr-only">选择订单/合同</span></el-radio
                ></template
              ></el-table-column
            >
            <el-table-column type="index" label="序号" width="66" fixed="left" align="center" />
            <el-table-column prop="applicationFlowNo" label="订单/合同流水号" min-width="180" />
            <el-table-column prop="orderContractNo" label="订单/合同编号" min-width="180" />
            <el-table-column prop="partyOne" label="签约方1" min-width="190" />
            <el-table-column prop="partyTwo" label="签约方2" min-width="190" />
            <el-table-column prop="partyThree" label="签约方3" min-width="190" />
            <el-table-column label="订单/合同总金额" min-width="155" align="right"
              ><template #default="{ row }">{{
                formatAmount(row.contractTotalAmount)
              }}</template></el-table-column
            >
            <el-table-column label="本次使用金额" min-width="145" align="right"
              ><template #default="{ row }">{{
                formatAmount(row.currentUsedAmount)
              }}</template></el-table-column
            >
            <el-table-column label="剩余可用金额" min-width="145" align="right"
              ><template #default="{ row }">{{
                formatAmount(row.remainingAvailableAmount)
              }}</template></el-table-column
            >
            <el-table-column prop="currency" label="币种" width="90" align="center" />
            <el-table-column prop="contractStartDate" label="合同起始日" min-width="120" />
            <el-table-column prop="contractEndDate" label="合同到期日" min-width="120" />
            <el-table-column prop="dataSource" label="数据来源" min-width="140" />
            <el-table-column
              label="操作"
              :width="isRecordMode ? 110 : 220"
              fixed="right"
              align="center"
              ><template #default="{ row }">
                <el-button
                  v-if="!isRecordMode"
                  link
                  type="primary"
                  @click="contractEditorVisible = true"
                  ><Icon icon="ep:edit-pen" class="mr-3px" />编辑</el-button
                >
                <el-button link type="primary" @click="viewContractImage(row)"
                  ><Icon icon="ep:picture" class="mr-3px" />查看影像</el-button
                >
                <el-button
                  v-if="!isRecordMode"
                  link
                  type="danger"
                  :loading="invalidating"
                  :disabled="detail.contractStatus === '失效'"
                  @click="invalidateContract"
                  >置为失效</el-button
                >
              </template></el-table-column
            >
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item name="items">
        <template #title><span class="collapse-title">债项资产明细</span></template>
        <div class="collapse-content">
          <div class="section-toolbar">
            <span>已选择订单/合同：{{ detail.orderContractNo }}，展示关联的债项资产信息</span>
            <div class="item-total"
              >债项资产总值：<strong
                >{{ formatAmount(itemsTotal) }} {{ detail.currency }}</strong
              ></div
            >
          </div>
          <el-table :data="detail.items" border empty-text="暂无合同项下信息">
            <el-table-column prop="sequence" label="序号" width="66" fixed="left" align="center" />
            <el-table-column prop="productCode" label="商品编号" min-width="150" fixed="left" />
            <el-table-column label="商品名称" min-width="180" fixed="left"
              ><template #default="{ row }"
                ><el-input
                  v-if="editingItemId === row.id"
                  v-model.trim="itemForm.productName"
                  size="small"
                  @keyup.enter="saveInlineItem(row)"
                /><span v-else>{{ row.productName }}</span></template
              ></el-table-column
            >
            <el-table-column
              v-for="field in categoryColumns"
              :key="field.prop"
              :label="field.label"
              min-width="140"
              ><template #default="{ row }"
                ><div v-if="editingItemId === row.id" class="editable-category-cell"
                  ><span>{{ itemForm[field.prop] }}</span
                  ><el-button link type="primary" @click.stop="openCategoryDialog"
                    ><Icon icon="ep:search" /></el-button></div
                ><span v-else>{{ row[field.prop] }}</span></template
              ></el-table-column
            >
            <el-table-column prop="batchNo" label="批号" min-width="120" />
            <el-table-column prop="cabinetNo" label="柜号" min-width="120" />
            <el-table-column label="产地" min-width="145"
              ><template #default="{ row }"
                ><div v-if="editingItemId === row.id" class="editable-category-cell"
                  ><span>{{ itemForm.origin }}</span
                  ><el-button link type="primary" @click.stop="openOriginDialog"
                    ><Icon icon="ep:location" /></el-button></div
                ><span v-else>{{ row.origin }}</span></template
              ></el-table-column
            >
            <el-table-column label="仓储地" min-width="185"
              ><template #default="{ row }"
                ><div v-if="editingItemId === row.id" class="editable-category-cell"
                  ><span>{{ itemForm.warehouseName }}</span
                  ><el-button link type="primary" @click.stop="openWarehouseDialog"
                    ><Icon icon="ep:office-building" /></el-button></div
                ><span v-else>{{ row.warehouseName }}</span></template
              ></el-table-column
            >
            <el-table-column prop="specification" label="规格" min-width="120" />
            <el-table-column label="入库数量/重量" min-width="170" align="right"
              ><template #default="{ row }"
                ><el-input-number
                  v-if="editingItemId === row.id"
                  v-model="itemForm.quantityOrWeight"
                  :min="0"
                  :precision="3"
                  :controls="false"
                  size="small"
                /><span v-else>{{ formatQuantity(row.quantityOrWeight) }}</span></template
              ></el-table-column
            >
            <el-table-column label="初始认定价格" min-width="165" align="right"
              ><template #default="{ row }"
                ><el-input-number
                  v-if="editingItemId === row.id"
                  v-model="itemForm.unitPrice"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  size="small"
                /><span v-else>{{ formatAmount(row.unitPrice) }}</span></template
              ></el-table-column
            >
            <el-table-column label="初始认定价值" min-width="150" align="right"
              ><template #default="{ row }">{{
                formatAmount(editingItemId === row.id ? itemCalculatedTotal : row.totalAmount)
              }}</template></el-table-column
            >
            <el-table-column prop="currency" label="币种" width="90" align="center" />
            <el-table-column label="货物起始日" min-width="165"
              ><template #default="{ row }"
                ><el-date-picker
                  v-if="editingItemId === row.id"
                  v-model="itemForm.cargoStartDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  size="small"
                /><span v-else>{{ row.cargoStartDate }}</span></template
              ></el-table-column
            >
            <el-table-column label="货物到期日" min-width="165"
              ><template #default="{ row }"
                ><el-date-picker
                  v-if="editingItemId === row.id"
                  v-model="itemForm.cargoEndDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  size="small"
                /><span v-else>{{ row.cargoEndDate }}</span></template
              ></el-table-column
            >
            <el-table-column label="货物所有权" min-width="150"
              ><template #default="{ row }"
                ><el-select
                  v-if="editingItemId === row.id"
                  v-model="itemForm.cargoOwner"
                  size="small"
                  ><el-option label="核心企业" value="核心企业" /><el-option
                    label="借款人自己"
                    value="借款人本人" /></el-select
                ><span v-else>{{
                  row.cargoOwner === '借款人本人' ? '借款人自己' : row.cargoOwner
                }}</span></template
              ></el-table-column
            >
            <el-table-column label="操作" width="175" fixed="right" align="center">
              <template #default="{ row }"
                ><el-button
                  v-if="!isRecordMode"
                  link
                  type="primary"
                  :loading="itemSaving && editingItemId === row.id"
                  @click="toggleItemEdit(row)"
                  ><Icon
                    :icon="editingItemId === row.id ? 'ep:check' : 'ep:edit-pen'"
                    class="mr-3px"
                  />{{ editingItemId === row.id ? '完成' : '编辑' }}</el-button
                ><el-button link type="primary" @click="viewItemImage(row)"
                  ><Icon icon="ep:picture" class="mr-3px" />查看影像</el-button
                ></template
              >
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      v-model="contractEditorVisible"
      title="编辑订单/合同基本信息"
      width="900px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="contractFormRef"
        :model="contractForm"
        :rules="contractRules"
        label-width="140px"
        class="item-form-grid"
      >
        <el-form-item label="订单/合同编号" prop="orderContractNo"
          ><el-input v-model.trim="contractForm.orderContractNo" /></el-form-item
        ><el-form-item label="币种" prop="currency"
          ><el-select v-model="contractForm.currency" class="w-full"
            ><el-option label="人民币" value="人民币" /><el-option
              label="美元"
              value="美元" /><el-option label="欧元" value="欧元" /></el-select
        ></el-form-item>
        <el-form-item label="签约方1" prop="partyOne"
          ><el-input v-model.trim="contractForm.partyOne" /></el-form-item
        ><el-form-item label="签约方2" prop="partyTwo"
          ><el-input v-model.trim="contractForm.partyTwo"
        /></el-form-item>
        <el-form-item label="签约方3"
          ><el-input v-model.trim="contractForm.partyThree" /></el-form-item
        ><el-form-item label="订单/合同总金额" prop="contractTotalAmount"
          ><el-input-number
            v-model="contractForm.contractTotalAmount"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false"
        /></el-form-item>
        <el-form-item label="本次使用金额" prop="currentUsedAmount"
          ><el-input-number
            v-model="contractForm.currentUsedAmount"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false" /></el-form-item
        ><el-form-item label="剩余可用金额"
          ><el-input :model-value="formatAmount(remainingAmount)" disabled
        /></el-form-item>
        <el-form-item label="合同起始日" prop="contractStartDate"
          ><el-date-picker
            v-model="contractForm.contractStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full" /></el-form-item
        ><el-form-item label="合同到期日" prop="contractEndDate"
          ><el-date-picker
            v-model="contractForm.contractEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
        /></el-form-item>
      </el-form>
      <template #footer
        ><el-button @click="contractEditorVisible = false">取 消</el-button
        ><el-button type="primary" :loading="saving" @click="saveContract"
          >保 存</el-button
        ></template
      >
    </el-dialog>

    <el-dialog v-model="categoryDialogVisible" title="选择商品分类" width="520px" append-to-body
      ><el-cascader-panel
        v-model="pendingCategoryPath"
        :options="categoryCascaderOptions"
      /><template #footer
        ><el-button @click="categoryDialogVisible = false">取 消</el-button
        ><el-button
          type="primary"
          :disabled="pendingCategoryPath.length !== 3"
          @click="confirmCategory"
          >确 定</el-button
        ></template
      ></el-dialog
    >
    <el-dialog v-model="originDialogVisible" title="选择产地" width="560px" append-to-body
      ><el-alert
        title="国内产地请选择到省，国外产地请选择到国家"
        type="info"
        :closable="false"
        show-icon
      /><el-cascader-panel
        v-model="pendingOriginPath"
        class="origin-panel"
        :options="originSelectOptions"
      /><template #footer
        ><el-button @click="originDialogVisible = false">取 消</el-button
        ><el-button type="primary" :disabled="pendingOriginPath.length !== 2" @click="confirmOrigin"
          >确 定</el-button
        ></template
      ></el-dialog
    >
    <el-dialog v-model="warehouseDialogVisible" title="选择仓储地" width="1000px" append-to-body
      ><el-table
        :data="warehouseTableOptions"
        border
        highlight-current-row
        @row-click="pendingWarehouse = $event"
        ><el-table-column width="52" align="center"
          ><template #default="{ row }"
            ><el-radio
              :model-value="pendingWarehouse?.warehouseName"
              :value="row.warehouseName" /></template></el-table-column
        ><el-table-column prop="regulator" label="监管企业名称" min-width="180" /><el-table-column
          prop="warehouseName"
          label="仓库名称"
          min-width="170" /><el-table-column
          prop="code"
          label="仓库代码"
          min-width="120" /><el-table-column
          prop="type"
          label="仓库类型"
          min-width="100" /><el-table-column
          prop="address"
          label="仓库详细地址"
          min-width="230" /></el-table
      ><template #footer
        ><el-button @click="warehouseDialogVisible = false">取 消</el-button
        ><el-button type="primary" :disabled="!pendingWarehouse" @click="confirmWarehouse"
          >确 定</el-button
        ></template
      ></el-dialog
    >
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
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
const contractEditorVisible = ref(false)
const editingItemId = ref<number>()
const categoryDialogVisible = ref(false)
const originDialogVisible = ref(false)
const warehouseDialogVisible = ref(false)

const node = computed<OrderContractModificationNode>(() =>
  route.query.mode === 'records' || route.query.key === 'record' ? 'records' : 'active'
)
const isRecordMode = computed(() => node.value === 'records')
const readonly = computed(() => isRecordMode.value || detail.value?.contractStatus === '失效')

const contractForm = reactive({
  orderContractNo: '',
  partyOne: '',
  partyTwo: '',
  partyThree: '',
  contractTotalAmount: 0,
  currentUsedAmount: 0,
  currency: '人民币' as OrderContractCurrency,
  contractStartDate: '',
  contractEndDate: ''
})
const required = (message: string, trigger = 'blur') => ({ required: true, message, trigger })
const contractRules: FormRules = {
  orderContractNo: [required('请输入订单/合同编号')],
  partyOne: [required('请输入签约方1')],
  partyTwo: [required('请输入签约方2')],
  currency: [required('请选择币种', 'change')],
  contractTotalAmount: [required('请输入订单/合同总金额')],
  currentUsedAmount: [required('请输入本次使用金额')],
  contractStartDate: [required('请选择合同起始日', 'change')],
  contractEndDate: [required('请选择合同到期日', 'change')]
}
const remainingAmount = computed(() =>
  Math.max(contractForm.contractTotalAmount - contractForm.currentUsedAmount, 0)
)
const itemsTotal = computed(() =>
  (detail.value?.items || []).reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
)
const contractRows = computed(() => (detail.value ? [detail.value] : []))

interface CategoryOption {
  name: string
  children: { name: string; children: string[] }[]
}
const categoryOptions: CategoryOption[] = [
  {
    name: '金属材料',
    children: [
      { name: '钢材', children: ['热轧卷板', '冷轧卷板', '螺纹钢'] },
      { name: '有色金属', children: ['铜材', '铝材'] }
    ]
  },
  {
    name: '化工产品',
    children: [
      { name: '基础化工', children: ['聚乙烯', '聚丙烯'] },
      { name: '精细化工', children: ['涂料', '助剂'] }
    ]
  },
  {
    name: '农产品',
    children: [
      { name: '粮食', children: ['玉米', '大豆', '小麦'] },
      { name: '油脂', children: ['豆油', '棕榈油'] }
    ]
  }
]
type CategoryField = 'largeCategory' | 'middleCategory' | 'smallCategory'
const categoryColumns: { prop: CategoryField; label: string }[] = [
  { prop: 'largeCategory', label: '商品大类' },
  { prop: 'middleCategory', label: '商品中类' },
  { prop: 'smallCategory', label: '商品小类' }
]
const categoryCascaderOptions = categoryOptions.map((large) => ({
  value: large.name,
  label: large.name,
  children: large.children.map((middle) => ({
    value: middle.name,
    label: middle.name,
    children: middle.children.map((small) => ({ value: small, label: small }))
  }))
}))
const pendingCategoryPath = ref<string[]>([])

const provinceNames = [
  '北京市',
  '天津市',
  '河北省',
  '辽宁省',
  '上海市',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '四川省',
  '重庆市',
  '陕西省',
  '新疆维吾尔自治区'
]
const countryNames = [
  '美国',
  '加拿大',
  '巴西',
  '澳大利亚',
  '新西兰',
  '日本',
  '韩国',
  '德国',
  '法国',
  '英国',
  '俄罗斯',
  '印度',
  '印度尼西亚',
  '越南',
  '南非',
  '智利'
]
const originSelectOptions = [
  {
    value: 'domestic',
    label: '国内',
    children: provinceNames.map((value) => ({ value, label: value }))
  },
  {
    value: 'overseas',
    label: '国外',
    children: countryNames.map((value) => ({ value, label: value }))
  }
]
const pendingOriginPath = ref<string[]>([])

interface WarehouseOption {
  regulator: string
  warehouseName: string
  code: string
  type: string
  address: string
}
const warehouseTableOptions: WarehouseOption[] = [
  {
    regulator: '宁波港通监管有限公司',
    warehouseName: '宁波港通监管仓',
    code: 'WH-NB-008',
    type: '监管仓',
    address: '浙江省宁波市北仑区港城路88号'
  },
  {
    regulator: '上海物流监管服务有限公司',
    warehouseName: '上海临港监管仓',
    code: 'WH-SH-002',
    type: '保税仓',
    address: '上海市浦东新区临港新片区业盛路66号'
  },
  {
    regulator: '华北仓储监管有限公司',
    warehouseName: '天津港保税仓',
    code: 'WH-TJ-003',
    type: '保税仓',
    address: '天津市东丽区华明大道126号'
  },
  {
    regulator: '青岛前湾仓储有限公司',
    warehouseName: '青岛前湾监管仓',
    code: 'WH-QD-005',
    type: '监管仓',
    address: '山东省青岛市黄岛区前湾港路68号'
  },
  {
    regulator: '供应链在途监管中心',
    warehouseName: '在途监管仓',
    code: 'WH-TRANSIT',
    type: '在途仓',
    address: '运输途中动态监管'
  }
]
const pendingWarehouse = ref<WarehouseOption>()

type ItemEditor = OrderContractItemForm & {
  id?: number
  productCode?: string
  guidancePrice: number
  originPath: string[]
}
const newItemForm = (): ItemEditor => ({
  productName: '',
  largeCategory: '',
  middleCategory: '',
  smallCategory: '',
  batchNo: '',
  cabinetNo: '',
  guidancePrice: 0,
  specification: '',
  origin: '',
  originPath: [],
  warehouseName: '',
  quantityOrWeight: 0,
  unitPrice: 0,
  currency: detail.value?.currency || '人民币',
  cargoStartDate: '',
  cargoEndDate: '',
  cargoOwner: '核心企业'
})
const itemForm = reactive<ItemEditor>(newItemForm())
const itemCalculatedTotal = computed(
  () => Number(itemForm.quantityOrWeight || 0) * Number(itemForm.unitPrice || 0)
)

const formatAmount = (value: unknown) =>
  Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatQuantity = (value: unknown) =>
  Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 3 })
const applyDetail = (record: OrderContractModificationDetail) => {
  detail.value = record
  editingItemId.value = undefined
  Object.assign(contractForm, {
    orderContractNo: record.orderContractNo,
    partyOne: record.partyOne,
    partyTwo: record.partyTwo,
    partyThree: record.partyThree,
    contractTotalAmount: record.contractTotalAmount,
    currentUsedAmount: record.currentUsedAmount,
    currency: record.currency,
    contractStartDate: record.contractStartDate,
    contractEndDate: record.contractEndDate
  })
}
const loadDetail = async () => {
  const id = Number(route.query.id)
  if (!Number.isFinite(id) || id <= 0) {
    detail.value = undefined
    return
  }
  loading.value = true
  try {
    applyDetail(await getOrderContractModificationDetail(id, node.value))
  } catch (error) {
    detail.value = undefined
    ElMessage.error(error instanceof Error ? error.message : '获取债项数据修改详情失败')
  } finally {
    loading.value = false
  }
}
const saveContract = async () => {
  if (!detail.value || readonly.value) return
  const valid = await contractFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return
  if (contractForm.currentUsedAmount > contractForm.contractTotalAmount)
    return ElMessage.warning('本次使用金额不能大于订单/合同总金额')
  if (contractForm.contractEndDate < contractForm.contractStartDate)
    return ElMessage.warning('合同到期日不能早于合同起始日')
  saving.value = true
  try {
    const result = await updateOrderContractModification(detail.value.id, { ...contractForm })
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record)
    contractEditorVisible.value = false
    ElMessage.success('订单/合同基本信息已保存')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    saving.value = false
  }
}
const invalidateContract = async () => {
  if (!detail.value) return
  try {
    await ElMessageBox.confirm('确认将当前订单/合同置为失效吗？', '操作确认', { type: 'warning' })
  } catch {
    return
  }
  invalidating.value = true
  try {
    const result = await invalidateOrderContractModification(detail.value.id)
    if (!result.success || !result.record) throw new Error(result.message || '操作失败')
    applyDetail(result.record)
    ElMessage.success('订单/合同已置为失效')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '操作失败')
  } finally {
    invalidating.value = false
  }
}
const startItemEdit = (row: OrderContractItem) => {
  if (editingItemId.value !== undefined && editingItemId.value !== row.id) {
    ElMessage.warning('请先完成当前债项资产的编辑')
    return
  }
  const originPath = row?.origin
    ? row.origin.includes('/')
      ? row.origin.split('/')
      : [row.origin]
    : []
  Object.assign(itemForm, newItemForm(), row || {}, {
    guidancePrice: row?.guidancePrice ?? row?.unitPrice ?? 0,
    originPath
  })
  editingItemId.value = row.id
}
const openCategoryDialog = () => {
  pendingCategoryPath.value = [
    itemForm.largeCategory,
    itemForm.middleCategory,
    itemForm.smallCategory
  ].filter(Boolean)
  categoryDialogVisible.value = true
}
const confirmCategory = () => {
  if (pendingCategoryPath.value.length !== 3) return
  ;[itemForm.largeCategory, itemForm.middleCategory, itemForm.smallCategory] =
    pendingCategoryPath.value
  categoryDialogVisible.value = false
}
const openOriginDialog = () => {
  const province = provinceNames.find((name) =>
    itemForm.origin.includes(name.replace(/[省市]$/, ''))
  )
  const country = countryNames.find((name) => itemForm.origin.includes(name))
  pendingOriginPath.value = province ? ['domestic', province] : country ? ['overseas', country] : []
  originDialogVisible.value = true
}
const confirmOrigin = () => {
  if (pendingOriginPath.value.length !== 2) return
  itemForm.origin = pendingOriginPath.value[1]
  itemForm.originPath = [...pendingOriginPath.value]
  originDialogVisible.value = false
}
const openWarehouseDialog = () => {
  pendingWarehouse.value = warehouseTableOptions.find(
    (item) => item.warehouseName === itemForm.warehouseName
  )
  warehouseDialogVisible.value = true
}
const confirmWarehouse = () => {
  if (!pendingWarehouse.value) return
  itemForm.warehouseName = pendingWarehouse.value.warehouseName
  warehouseDialogVisible.value = false
}
const saveInlineItem = async (row: OrderContractItem) => {
  if (!detail.value) return
  if (!itemForm.productName.trim()) return ElMessage.warning('请输入商品名称')
  if (!itemForm.largeCategory || !itemForm.middleCategory || !itemForm.smallCategory)
    return ElMessage.warning('请选择完整的商品分类')
  if (!itemForm.origin) return ElMessage.warning('请选择产地')
  if (!itemForm.warehouseName) return ElMessage.warning('请选择仓储地')
  if (itemForm.quantityOrWeight <= 0 || itemForm.unitPrice <= 0)
    return ElMessage.warning('入库数量/重量和初始认定价格必须大于0')
  if (!itemForm.cargoStartDate || !itemForm.cargoEndDate)
    return ElMessage.warning('请选择货物起止日期')
  if (itemForm.cargoEndDate < itemForm.cargoStartDate)
    return ElMessage.warning('货物到期日不能早于货物起始日')
  itemSaving.value = true
  try {
    const { id: _id, productCode: _productCode, originPath: _originPath, ...payload } = itemForm
    const result = await updateOrderContractItem(detail.value.id, row.id, payload)
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record)
    ElMessage.success('债项资产明细已更新')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    itemSaving.value = false
  }
}
const toggleItemEdit = (row: OrderContractItem) => {
  if (editingItemId.value === row.id) saveInlineItem(row)
  else startItemEdit(row)
}
const viewContractImage = (row: OrderContractModificationDetail) =>
  ElMessage.info(`正在查看订单/合同“${row.orderContractNo}”的影像资料（Mock）`)
const viewItemImage = (row: OrderContractItem) =>
  ElMessage.info(`正在查看债项资产“${row.productName}”的影像资料（Mock）`)
const goBack = () => {
  const query = Object.fromEntries(
    Object.entries(route.query).filter(([key]) => !['view', 'id', 'mode'].includes(key))
  )
  router.push({ path: route.path, query })
}
watch([() => route.query.id, node], loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.order-contract-detail-page {
  min-width: 0;
  min-height: 100%;
  padding: 12px 16px 20px;
  background: #f2f3f5;
}
.detail-page-toolbar {
  display: flex;
  align-items: center;
  min-height: 52px;
  margin-bottom: 12px;
  padding: 8px 20px;
  background: #fff;
  gap: 24px;
}
.application-summary {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 13px;
  gap: 28px;
}
.record-alert {
  margin-bottom: 12px;
}
.system-detail-collapse {
  border: 0;
  background: transparent;
}
:deep(.system-detail-collapse .el-collapse-item) {
  margin-bottom: 12px;
}
:deep(.system-detail-collapse .el-collapse-item__header) {
  height: 52px;
  padding: 0 20px;
  border-bottom: 0;
  background: #fff;
  color: #303133;
}
:deep(.system-detail-collapse .el-collapse-item__wrap) {
  border-bottom: 0;
  background: #fff;
}
:deep(.system-detail-collapse .el-collapse-item__content) {
  padding-bottom: 0;
  color: #606266;
}
.collapse-title {
  font-size: 16px;
  font-weight: 600;
}
.collapse-content {
  min-width: 0;
  padding: 4px 20px 20px;
}
.detail-form {
  padding: 4px 20px 0;
}
.detail-form :deep(.el-form-item) {
  margin-bottom: 14px;
}
.detail-form :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 400;
}
.detail-form :deep(.el-input.is-disabled .el-input__wrapper) {
  background: #f5f7fa;
}
.section-actions {
  display: flex;
  align-items: center;
  padding: 4px 20px 0 160px;
  gap: 10px;
}
.action-tip {
  color: #909399;
  font-size: 12px;
}
.section-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  margin-bottom: 10px;
  color: #909399;
  font-size: 13px;
  gap: 20px;
}
.item-total {
  flex: 0 0 auto;
  color: #606266;
  white-space: nowrap;
}
.item-total strong {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 600;
}
.item-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
}
:deep(.contract-table .el-table__body tr:first-child td.el-table__cell) {
  background: #ecf5ff;
}
.editable-category-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  gap: 6px;
}
.editable-category-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.origin-panel {
  width: 100%;
  margin-top: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
:deep(.el-table .el-input-number) {
  width: 128px;
}
:deep(.el-table .el-date-editor) {
  width: 142px;
}
@media (max-width: 900px) {
  .detail-page-toolbar,
  .application-summary,
  .section-toolbar {
    flex-wrap: wrap;
  }
  .item-form-grid {
    grid-template-columns: 1fr;
  }
  :deep(.detail-form .el-col-12) {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
</style>
