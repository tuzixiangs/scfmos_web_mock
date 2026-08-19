<template>
  <div class="asset-management-detail-page" v-loading="loading">
    <div class="detail-page-toolbar">
      <el-button @click="goBack"> <Icon icon="ep:arrow-left" class="mr-4px" />返 回 </el-button>
      <div v-if="detail" class="application-summary">
        <span>申请编号：{{ detail.applicationNo }}</span>
        <span>项目名称：{{ detail.projectName }}</span>
        <el-tag :type="statusTagType" effect="light">{{ detail.status }}</el-tag>
      </div>
    </div>

    <el-empty v-if="!loading && !detail" description="未获取到债项资产入库申请详情" />

    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="contract">
        <template #title>
          <span class="collapse-title">放款及业务合同基本信息</span>
        </template>
        <div class="collapse-content">
          <el-form
            label-width="140px"
            label-position="left"
            size="small"
            class="readonly-detail-form"
          >
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="放款流水号">
                  <el-input :model-value="detail.disbursementFlowNo || '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="放款金额">
                  <el-input :model-value="formatAmount(detail.disbursementAmount)" disabled>
                    <template #append>{{ detail.currency }}</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="放款日期">
                  <el-input :model-value="detail.disbursementDate || '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品方案">
                  <el-input
                    :model-value="detail.productPlan || detail.productScheme || '-'"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="业务合同编号">
                  <el-input
                    :model-value="
                      detail.businessContractNo || detail.relatedBusinessContractNo || '-'
                    "
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同金额">
                  <el-input
                    :model-value="
                      formatAmount(detail.businessContractAmount ?? detail.contractAmount)
                    "
                    disabled
                  >
                    <template #append>{{ detail.currency }}</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="合同起始日">
                  <el-input :model-value="detail.contractStartDate || '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同到期日">
                  <el-input :model-value="detail.contractEndDate || '-'" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="入库类型">
                  <el-input :model-value="detail.inboundType || '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称">
                  <el-input :model-value="detail.projectName || '-'" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12">
                <el-form-item label="链属客户名称">
                  <el-input
                    :model-value="detail.linkedCustomerName || detail.customerName || '-'"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="授信编号">
                  <el-input :model-value="detail.creditNo || '-'" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="orders">
        <template #title>
          <span class="collapse-title">订单/合同基本信息</span>
        </template>
        <div class="collapse-content">
          <div class="section-toolbar">
            <span>请选择一条有效订单/合同，下方将展示其关联的债项资产</span>
            <el-tag type="success" effect="plain">状态：有效</el-tag>
          </div>
          <el-table
            :data="detail.orderContracts || []"
            border
            highlight-current-row
            :row-class-name="contractRowClass"
            @row-click="selectContract"
          >
            <el-table-column width="56" fixed="left" align="center">
              <template #default="{ row }">
                <el-radio
                  :model-value="selectedOrderId"
                  :value="row.id"
                  @change="selectContract(row)"
                >
                  <span class="sr-only">选择订单/合同</span>
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="66" fixed="left" align="center" />
            <el-table-column prop="orderContractFlowNo" label="订单/合同流水号" min-width="170" />
            <el-table-column prop="orderContractNo" label="订单/合同编号" min-width="180" />
            <el-table-column prop="partyOne" label="签约方1" min-width="190" />
            <el-table-column prop="partyTwo" label="签约方2" min-width="190" />
            <el-table-column prop="partyThree" label="签约方3" min-width="190" />
            <el-table-column label="订单/合同总金额" min-width="155" align="right">
              <template #default="{ row }">{{ formatAmount(row.contractTotalAmount) }}</template>
            </el-table-column>
            <el-table-column label="本次使用金额" min-width="145" align="right">
              <template #default="{ row }">{{ formatAmount(row.currentUsedAmount) }}</template>
            </el-table-column>
            <el-table-column label="剩余可用金额" min-width="145" align="right">
              <template #default="{ row }">{{
                formatAmount(row.remainingAvailableAmount)
              }}</template>
            </el-table-column>
            <el-table-column prop="currency" label="币种" width="90" align="center" />
            <el-table-column prop="contractStartDate" label="合同起始日" min-width="120" />
            <el-table-column prop="contractEndDate" label="合同到期日" min-width="120" />
            <el-table-column prop="dataSource" label="数据来源" min-width="140" />
            <el-table-column label="操作" width="110" fixed="right" align="center">
              <template #default="{ row }">
                <el-button link type="primary" @click.stop="viewContractImage(row)">
                  <Icon icon="ep:picture" class="mr-3px" />查看影像
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item name="assets" class="asset-module">
        <template #title>
          <span class="collapse-title">债项资产明细</span>
        </template>
        <div class="collapse-content">
          <div class="section-toolbar">
            <span>{{ selectedContractLabel }}，展示关联的待入库、已到港债项资产信息</span>
            <div class="asset-total">
              拟入库资产总值：<strong
                >{{ currencySymbol }}{{ formatAmount(plannedInboundValue) }}</strong
              >
            </div>
          </div>
          <el-table :data="selectedAssetRows" border empty-text="请先选择一条有效订单/合同">
            <el-table-column type="index" label="序号" width="66" fixed="left" align="center" />
            <el-table-column prop="productCode" label="商品编号" min-width="135" fixed="left" />
            <el-table-column label="商品名称" min-width="180" fixed="left">
              <template #default="{ row }">
                <el-input
                  v-if="editingAssetId === row.id"
                  v-model="editingProductName"
                  class="editable-name-input"
                  size="small"
                  maxlength="50"
                  clearable
                  placeholder="请输入商品名称"
                  @keyup.enter="finishAssetEdit(row)"
                />
                <span v-else>{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品大类" min-width="140">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-category-cell">
                  <span>{{ editingCategories.largeCategory }}</span>
                  <el-tooltip content="选择商品分类" placement="top">
                    <el-button
                      link
                      type="primary"
                      aria-label="选择商品分类"
                      @click.stop="openCategoryDialog"
                    >
                      <Icon icon="ep:search" />
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else>{{ row.largeCategory }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品中类" min-width="140">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-category-cell">
                  <span>{{ editingCategories.middleCategory }}</span>
                  <el-tooltip content="选择商品分类" placement="top">
                    <el-button
                      link
                      type="primary"
                      aria-label="选择商品分类"
                      @click.stop="openCategoryDialog"
                    >
                      <Icon icon="ep:search" />
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else>{{ row.middleCategory }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品小类" min-width="140">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-category-cell">
                  <span>{{ editingCategories.smallCategory }}</span>
                  <el-tooltip content="选择商品分类" placement="top">
                    <el-button
                      link
                      type="primary"
                      aria-label="选择商品分类"
                      @click.stop="openCategoryDialog"
                    >
                      <Icon icon="ep:search" />
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else>{{ row.smallCategory }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="batchNo" label="批次号" min-width="145" />
            <el-table-column prop="containerNo" label="柜号" min-width="135" />
            <el-table-column label="产地" min-width="145">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-category-cell">
                  <span>{{ editingAssetFields.origin }}</span>
                  <el-tooltip content="选择产地" placement="top">
                    <el-button
                      link
                      type="primary"
                      aria-label="选择产地"
                      @click.stop="openOriginDialog"
                    >
                      <Icon icon="ep:location" />
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else>{{ row.origin }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="specification" label="规格" min-width="105" />
            <el-table-column label="仓储地" min-width="185">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-category-cell">
                  <span>{{ editingAssetFields.warehouseName }}</span>
                  <el-tooltip content="选择仓储地" placement="top">
                    <el-button
                      link
                      type="primary"
                      aria-label="选择仓储地"
                      @click.stop="openWarehouseDialog"
                    >
                      <Icon icon="ep:office-building" />
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else>{{ row.warehouseName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="入库数量/重量" min-width="175" align="right">
              <template #default="{ row }">
                <div v-if="editingAssetId === row.id" class="editable-number-cell">
                  <el-input-number
                    v-model="editingAssetFields.inboundQuantity"
                    :min="0"
                    :precision="3"
                    :controls="false"
                    size="small"
                    aria-label="入库数量/重量"
                  />
                  <span>{{ row.quantityUnit }}</span>
                </div>
                <template v-else>
                  {{ formatQuantity(row.inboundQuantity) }} {{ row.quantityUnit }}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="初始认定价格" min-width="165" align="right">
              <template #default="{ row }">
                <el-input-number
                  v-if="editingAssetId === row.id"
                  v-model="editingAssetFields.initialRecognitionPrice"
                  class="editable-number-input"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  size="small"
                  aria-label="初始认定价格"
                />
                <template v-else>{{ formatAmount(row.initialRecognitionPrice) }}</template>
              </template>
            </el-table-column>
            <el-table-column label="初始认定价值" min-width="140" align="right">
              <template #default="{ row }">
                {{
                  formatAmount(
                    editingAssetId === row.id
                      ? editingRecognitionValue
                      : row.initialRecognitionValue
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column prop="currency" label="币种" width="90" align="center" />
            <el-table-column label="货物起始日" min-width="165">
              <template #default="{ row }">
                <el-date-picker
                  v-if="editingAssetId === row.id"
                  v-model="editingAssetFields.goodsStartDate"
                  class="editable-date-picker"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  size="small"
                  placeholder="选择起始日"
                />
                <span v-else>{{ row.goodsStartDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="货物到期日" min-width="165">
              <template #default="{ row }">
                <el-date-picker
                  v-if="editingAssetId === row.id"
                  v-model="editingAssetFields.goodsEndDate"
                  class="editable-date-picker"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  size="small"
                  placeholder="选择到期日"
                />
                <span v-else>{{ row.goodsEndDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="货物所有权" min-width="150">
              <template #default="{ row }">
                <el-select
                  v-if="editingAssetId === row.id"
                  v-model="editingAssetFields.goodsOwnership"
                  size="small"
                  aria-label="货物所有权"
                  placeholder="请选择"
                >
                  <el-option label="核心企业" value="核心企业" />
                  <el-option label="借款人自己" value="借款人自己" />
                </el-select>
                <span v-else>{{ row.goodsOwnership }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" fixed="right" align="center">
              <template #default="{ row }">
                <el-tag :type="row.assetStatus === '已到港' ? 'success' : 'warning'" effect="light">
                  {{ row.assetStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="175" fixed="right" align="center">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  :loading="savingAssetId === row.id"
                  @click="toggleAssetEdit(row)"
                >
                  <Icon
                    :icon="editingAssetId === row.id ? 'ep:check' : 'ep:edit-pen'"
                    class="mr-3px"
                  />
                  {{ editingAssetId === row.id ? '完成' : '编辑' }}
                </el-button>
                <el-button link type="primary" @click="viewAssetImage(row)">
                  <Icon icon="ep:picture" class="mr-3px" />查看影像
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      v-model="categoryDialogVisible"
      title="选择商品分类"
      width="520px"
      append-to-body
      destroy-on-close
    >
      <el-alert
        title="请选择商品小类，确认后将同步反显商品大类、中类和小类"
        type="info"
        :closable="false"
        show-icon
      />
      <div class="category-tree-panel">
        <el-tree
          :data="categoryTree"
          node-key="key"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :current-node-key="pendingCategorySelection?.key"
          @node-click="selectCategoryNode"
        />
      </div>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!pendingCategorySelection"
          @click="confirmCategorySelection"
        >
          确 定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="originDialogVisible"
      title="选择产地"
      width="560px"
      append-to-body
      destroy-on-close
    >
      <el-alert
        title="国内产地请选择到省，国外产地请选择到国家"
        type="info"
        :closable="false"
        show-icon
      />
      <el-cascader-panel
        v-model="pendingOriginPath"
        class="origin-cascader-panel"
        :options="originOptions"
        :props="originCascaderProps"
      />
      <template #footer>
        <el-button @click="originDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="pendingOriginPath.length !== 2"
          @click="confirmOriginSelection"
        >
          确 定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="warehouseDialogVisible"
      title="选择仓储地"
      width="1180px"
      class="warehouse-select-dialog"
      append-to-body
      destroy-on-close
    >
      <el-alert
        title="请选择有效仓库，确认后将反显仓库名称"
        type="info"
        :closable="false"
        show-icon
      />
      <el-table
        :data="warehouseOptions"
        border
        highlight-current-row
        class="warehouse-select-table"
        :row-class-name="warehouseRowClass"
        @row-click="selectWarehouse"
      >
        <el-table-column width="52" align="center">
          <template #default="{ row }">
            <el-radio
              :model-value="pendingWarehouse?.warehouseCode"
              :value="row.warehouseCode"
              @change="selectWarehouse(row)"
            >
              <span class="sr-only">选择仓库</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="regulatorEnterpriseName" label="监管企业名称" min-width="180" />
        <el-table-column prop="warehouseName" label="仓库名称" min-width="160" />
        <el-table-column prop="warehouseCode" label="仓库代码" min-width="125" />
        <el-table-column prop="warehouseType" label="仓库类型" min-width="100" />
        <el-table-column prop="warehouseAddress" label="仓库详细地址" min-width="220" />
        <el-table-column prop="contactName" label="联系人名称" min-width="110" />
        <el-table-column prop="contactPhone" label="联系人电话" min-width="135" />
        <el-table-column prop="insurancePolicyNo" label="仓库保险单号" min-width="160" />
        <el-table-column prop="insuranceExpiryDate" label="保险到期日" min-width="120" />
      </el-table>
      <template #footer>
        <el-button @click="warehouseDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!pendingWarehouse" @click="confirmWarehouseSelection">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAssetManagementApplicationDetail,
  updateAssetManagementAssetDetail,
  type AssetManagementApplicationDetail,
  type AssetManagementAssetDetail,
  type AssetManagementOrderContract
} from '@/api/indebt/assetManagement'

defineOptions({ name: 'AssetManagementApplicationDetailPage' })

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const detail = ref<AssetManagementApplicationDetail>()
const selectedOrderId = ref<number>()
const activeSections = ref(['contract', 'orders', 'assets'])
const editingAssetId = ref<number>()
const editingProductName = ref('')
const savingAssetId = ref<number>()
const categoryDialogVisible = ref(false)
const originDialogVisible = ref(false)
const warehouseDialogVisible = ref(false)

interface AssetCategorySelection {
  key: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
}

interface AssetCategoryTreeNode {
  key: string
  label: string
  selection?: AssetCategorySelection
  children?: AssetCategoryTreeNode[]
}

const categoryDefinitions = [
  ['金属材料', '钢材'],
  ['金属材料', '有色金属'],
  ['化工原料', '合成树脂'],
  ['农产品', '粮食'],
  ['能源矿产', '煤炭'],
  ['家用电器', '空气调节器'],
  ['医疗器械', '医用耗材'],
  ['食品', '乳制品']
] as const

const categoryTree: AssetCategoryTreeNode[] = Array.from(
  categoryDefinitions.reduce((groups, [largeCategory, middleCategory]) => {
    const middleNodes = groups.get(largeCategory) || []
    middleNodes.push({
      key: `${largeCategory}/${middleCategory}`,
      label: middleCategory,
      children: ['标准品', '优等品'].map((smallCategory) => ({
        key: `${largeCategory}/${middleCategory}/${smallCategory}`,
        label: smallCategory,
        selection: {
          key: `${largeCategory}/${middleCategory}/${smallCategory}`,
          largeCategory,
          middleCategory,
          smallCategory
        }
      }))
    })
    groups.set(largeCategory, middleNodes)
    return groups
  }, new Map<string, AssetCategoryTreeNode[]>())
).map(([largeCategory, children]) => ({
  key: largeCategory,
  label: largeCategory,
  children
}))

const editingCategories = ref({
  largeCategory: '',
  middleCategory: '',
  smallCategory: ''
})
const pendingCategorySelection = ref<AssetCategorySelection>()

interface OriginOption {
  value: string
  label: string
  children?: OriginOption[]
}

const provinceNames = [
  '北京市',
  '天津市',
  '河北省',
  '山西省',
  '内蒙古自治区',
  '辽宁省',
  '吉林省',
  '黑龙江省',
  '上海市',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '江西省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '广西壮族自治区',
  '海南省',
  '重庆市',
  '四川省',
  '贵州省',
  '云南省',
  '西藏自治区',
  '陕西省',
  '甘肃省',
  '青海省',
  '宁夏回族自治区',
  '新疆维吾尔自治区',
  '香港特别行政区',
  '澳门特别行政区',
  '台湾省'
]
const countryNames = [
  '美国',
  '加拿大',
  '巴西',
  '澳大利亚',
  '新西兰',
  '日本',
  '韩国',
  '新加坡',
  '德国',
  '法国',
  '英国',
  '荷兰',
  '俄罗斯',
  '印度',
  '印度尼西亚',
  '马来西亚',
  '泰国',
  '越南',
  '南非',
  '智利'
]
const toOriginChildren = (names: string[]): OriginOption[] =>
  names.map((name) => ({ value: name, label: name }))
const originOptions: OriginOption[] = [
  { value: 'domestic', label: '国内', children: toOriginChildren(provinceNames) },
  { value: 'overseas', label: '国外', children: toOriginChildren(countryNames) }
]
const originCascaderProps = { expandTrigger: 'click' as const }
const pendingOriginPath = ref<string[]>([])

interface WarehouseOption {
  regulatorEnterpriseName: string
  warehouseName: string
  warehouseCode: string
  warehouseType: string
  warehouseAddress: string
  contactName: string
  contactPhone: string
  insurancePolicyNo: string
  insuranceExpiryDate: string
}

const warehouseOptions: WarehouseOption[] = [
  {
    regulatorEnterpriseName: '宁波港通监管有限公司',
    warehouseName: '宁波港通监管仓',
    warehouseCode: 'WH-NB-008',
    warehouseType: '监管仓',
    warehouseAddress: '浙江省宁波市北仑区港城路88号',
    contactName: '陈海峰',
    contactPhone: '138****6808',
    insurancePolicyNo: 'PICCNB20260081',
    insuranceExpiryDate: '2027-06-30'
  },
  {
    regulatorEnterpriseName: '中储南京物流有限公司',
    warehouseName: '南京滨江钢材仓',
    warehouseCode: 'WH-NJ-001',
    warehouseType: '普通仓',
    warehouseAddress: '江苏省南京市江宁区滨江开发区盛安大道18号',
    contactName: '王建国',
    contactPhone: '139****2106',
    insurancePolicyNo: 'PICCJS20260012',
    insuranceExpiryDate: '2027-06-30'
  },
  {
    regulatorEnterpriseName: '上海物流监管服务有限公司',
    warehouseName: '上海临港有色仓',
    warehouseCode: 'WH-SH-002',
    warehouseType: '保税仓',
    warehouseAddress: '上海市浦东新区临港新片区业盛路66号',
    contactName: '赵敏',
    contactPhone: '136****5932',
    insurancePolicyNo: 'CPICSH20260105',
    insuranceExpiryDate: '2027-05-15'
  },
  {
    regulatorEnterpriseName: '江苏恒信监管有限公司',
    warehouseName: '常州化工专用仓',
    warehouseCode: 'WH-CZ-004',
    warehouseType: '专用仓',
    warehouseAddress: '江苏省常州市新北区滨江化工园区港区路9号',
    contactName: '李伟',
    contactPhone: '137****3621',
    insurancePolicyNo: 'PAICJS20260176',
    insuranceExpiryDate: '2026-12-31'
  },
  {
    regulatorEnterpriseName: '华北仓储监管有限公司',
    warehouseName: '天津东丽综合仓',
    warehouseCode: 'WH-TJ-003',
    warehouseType: '普通仓',
    warehouseAddress: '天津市东丽区华明大道126号',
    contactName: '孙强',
    contactPhone: '135****8170',
    insurancePolicyNo: 'PICCTJ20260093',
    insuranceExpiryDate: '2027-03-31'
  },
  {
    regulatorEnterpriseName: '中粮仓储监管服务有限公司',
    warehouseName: '吉林松原粮食仓',
    warehouseCode: 'WH-JL-005',
    warehouseType: '粮食仓',
    warehouseAddress: '吉林省松原市宁江区新城东路218号',
    contactName: '周立新',
    contactPhone: '150****9726',
    insurancePolicyNo: 'PICCJL20260045',
    insuranceExpiryDate: '2026-10-20'
  },
  {
    regulatorEnterpriseName: '中储能源监管有限公司',
    warehouseName: '唐山港煤炭监管仓',
    warehouseCode: 'WH-TS-006',
    warehouseType: '堆场仓',
    warehouseAddress: '河北省唐山市海港开发区港兴大街36号',
    contactName: '刘鹏',
    contactPhone: '151****3058',
    insurancePolicyNo: 'PAICHE20260138',
    insuranceExpiryDate: '2027-01-31'
  },
  {
    regulatorEnterpriseName: '粤港仓储监管有限公司',
    warehouseName: '广州南沙家电仓',
    warehouseCode: 'WH-GZ-007',
    warehouseType: '普通仓',
    warehouseAddress: '广东省广州市南沙区龙穴大道中63号',
    contactName: '黄志明',
    contactPhone: '133****4285',
    insurancePolicyNo: 'CPICGD20260067',
    insuranceExpiryDate: '2027-02-28'
  }
]
const pendingWarehouse = ref<WarehouseOption>()

const editingAssetFields = ref({
  origin: '',
  warehouseName: '',
  goodsStartDate: '',
  goodsEndDate: '',
  inboundQuantity: 0,
  initialRecognitionPrice: 0,
  goodsOwnership: '核心企业' as '核心企业' | '借款人自己'
})
const editingRecognitionValue = computed(
  () =>
    Number(editingAssetFields.value.inboundQuantity || 0) *
    Number(editingAssetFields.value.initialRecognitionPrice || 0)
)

const statusTagType = computed(() => {
  if (detail.value?.phase === 'approved') return 'success'
  if (detail.value?.phase === 'rejected') return 'danger'
  if (detail.value?.phase === 'reviewing') return 'warning'
  return 'info'
})

const selectedAssetRows = computed(() =>
  (detail.value?.assetDetails || []).filter(
    (item) => item.orderContractId === selectedOrderId.value
  )
)
const plannedInboundValue = computed(() =>
  selectedAssetRows.value.reduce(
    (total, item) => total + Number(item.initialRecognitionValue || 0),
    0
  )
)
const selectedContractLabel = computed(() => {
  const current = detail.value?.orderContracts?.find((item) => item.id === selectedOrderId.value)
  return current ? `已选择订单/合同：${current.orderContractNo}` : '尚未选择订单/合同'
})
const currencySymbol = computed(() => {
  if (detail.value?.currency === '美元') return '$'
  if (detail.value?.currency === '欧元') return '€'
  return '¥'
})

const formatAmount = (value: unknown) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return number.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatQuantity = (value: unknown) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return number.toLocaleString('zh-CN', { maximumFractionDigits: 3 })
}

const unwrapDetail = (value: unknown): AssetManagementApplicationDetail | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const result = value as Record<string, unknown>
  const data = result.data && typeof result.data === 'object' ? result.data : result
  const source = data as Record<string, unknown>
  const record = source.record && typeof source.record === 'object' ? source.record : source
  return record as unknown as AssetManagementApplicationDetail
}

const loadDetail = async () => {
  const id = Number(route.query.id)
  if (!Number.isFinite(id) || id <= 0) {
    detail.value = undefined
    ElMessage.error('详情参数无效，请返回列表后重新选择')
    return
  }

  loading.value = true
  try {
    const result = await getAssetManagementApplicationDetail(id)
    const record = unwrapDetail(result)
    if (!record?.id) throw new Error('未获取到债项资产入库申请详情')
    detail.value = {
      ...record,
      orderContracts: Array.isArray(record.orderContracts) ? record.orderContracts : [],
      assetDetails: Array.isArray(record.assetDetails) ? record.assetDetails : []
    }
    selectedOrderId.value = detail.value.orderContracts[0]?.id
    editingAssetId.value = undefined
    editingProductName.value = ''
    categoryDialogVisible.value = false
    originDialogVisible.value = false
    warehouseDialogVisible.value = false
    pendingCategorySelection.value = undefined
    pendingOriginPath.value = []
    pendingWarehouse.value = undefined
  } catch (error) {
    detail.value = undefined
    ElMessage.error(error instanceof Error ? error.message : '获取详情失败')
  } finally {
    loading.value = false
  }
}

const selectContract = (row: AssetManagementOrderContract) => {
  if (editingAssetId.value !== undefined) {
    ElMessage.warning('请先完成当前债项资产的编辑')
    return
  }
  selectedOrderId.value = row.id
}

const contractRowClass = ({ row }: { row: AssetManagementOrderContract }) =>
  row.id === selectedOrderId.value ? 'selected-contract-row' : ''

const viewContractImage = (row: AssetManagementOrderContract) => {
  ElMessage.info(`正在查看订单/合同“${row.orderContractNo}”的影像资料（Mock）`)
}

const viewAssetImage = (row: AssetManagementAssetDetail) => {
  ElMessage.info(`正在查看债项资产“${row.productName}”的影像资料（Mock）`)
}

const startAssetEdit = (row: AssetManagementAssetDetail) => {
  if (editingAssetId.value !== undefined && editingAssetId.value !== row.id) {
    ElMessage.warning('请先完成当前债项资产的编辑')
    return
  }
  editingAssetId.value = row.id
  editingProductName.value = row.productName
  editingCategories.value = {
    largeCategory: row.largeCategory,
    middleCategory: row.middleCategory,
    smallCategory: row.smallCategory
  }
  editingAssetFields.value = {
    origin: row.origin,
    warehouseName: row.warehouseName,
    goodsStartDate: row.goodsStartDate,
    goodsEndDate: row.goodsEndDate,
    inboundQuantity: row.inboundQuantity,
    initialRecognitionPrice: row.initialRecognitionPrice,
    goodsOwnership: row.goodsOwnership === '借款人自己' ? '借款人自己' : '核心企业'
  }
}

const openCategoryDialog = () => {
  const { largeCategory, middleCategory, smallCategory } = editingCategories.value
  pendingCategorySelection.value = {
    key: `${largeCategory}/${middleCategory}/${smallCategory}`,
    largeCategory,
    middleCategory,
    smallCategory
  }
  categoryDialogVisible.value = true
}

const selectCategoryNode = (node: AssetCategoryTreeNode) => {
  if (node.selection) pendingCategorySelection.value = node.selection
}

const confirmCategorySelection = () => {
  if (!pendingCategorySelection.value) return
  const { largeCategory, middleCategory, smallCategory } = pendingCategorySelection.value
  editingCategories.value = { largeCategory, middleCategory, smallCategory }
  categoryDialogVisible.value = false
}

const resolveOriginPath = (origin: string) => {
  const province = provinceNames.find((name) => origin.includes(name.replace(/[省市]$/, '')))
  if (province) return ['domestic', province]
  const country = countryNames.find((name) => origin.includes(name))
  return country ? ['overseas', country] : []
}

const openOriginDialog = () => {
  pendingOriginPath.value = resolveOriginPath(editingAssetFields.value.origin)
  originDialogVisible.value = true
}

const confirmOriginSelection = () => {
  if (pendingOriginPath.value.length !== 2) return
  editingAssetFields.value.origin = pendingOriginPath.value[1]
  originDialogVisible.value = false
}

const openWarehouseDialog = () => {
  pendingWarehouse.value = warehouseOptions.find(
    (item) => item.warehouseName === editingAssetFields.value.warehouseName
  )
  warehouseDialogVisible.value = true
}

const selectWarehouse = (row: WarehouseOption) => {
  pendingWarehouse.value = row
}

const warehouseRowClass = ({ row }: { row: WarehouseOption }) =>
  row.warehouseCode === pendingWarehouse.value?.warehouseCode ? 'selected-warehouse-row' : ''

const confirmWarehouseSelection = () => {
  if (!pendingWarehouse.value) return
  editingAssetFields.value.warehouseName = pendingWarehouse.value.warehouseName
  warehouseDialogVisible.value = false
}

const finishAssetEdit = async (row: AssetManagementAssetDetail) => {
  const productName = editingProductName.value.trim()
  if (!productName) {
    ElMessage.warning('请输入商品名称')
    return
  }
  const { origin, warehouseName, goodsStartDate, goodsEndDate } = editingAssetFields.value
  if (!origin) {
    ElMessage.warning('请选择产地')
    return
  }
  if (!warehouseName) {
    ElMessage.warning('请选择仓储地')
    return
  }
  if (!goodsStartDate || !goodsEndDate) {
    ElMessage.warning('请选择货物起止日期')
    return
  }
  if (goodsEndDate < goodsStartDate) {
    ElMessage.warning('货物到期日不能早于货物起始日')
    return
  }
  if (editingAssetFields.value.inboundQuantity <= 0) {
    ElMessage.warning('入库数量/重量必须大于0')
    return
  }
  if (editingAssetFields.value.initialRecognitionPrice <= 0) {
    ElMessage.warning('初始认定价格必须大于0')
    return
  }
  if (!editingAssetFields.value.goodsOwnership) {
    ElMessage.warning('请选择货物所有权')
    return
  }
  if (!detail.value) return

  savingAssetId.value = row.id
  try {
    const result = await updateAssetManagementAssetDetail(detail.value.id, row.id, {
      productName,
      ...editingCategories.value,
      ...editingAssetFields.value
    })
    if (result.success === false) {
      ElMessage.error(result.message || '债项资产明细更新失败')
      return
    }
    row.productName = productName
    row.largeCategory = editingCategories.value.largeCategory
    row.middleCategory = editingCategories.value.middleCategory
    row.smallCategory = editingCategories.value.smallCategory
    row.origin = editingAssetFields.value.origin
    row.warehouseName = editingAssetFields.value.warehouseName
    row.goodsStartDate = editingAssetFields.value.goodsStartDate
    row.goodsEndDate = editingAssetFields.value.goodsEndDate
    row.inboundQuantity = editingAssetFields.value.inboundQuantity
    row.initialRecognitionPrice = editingAssetFields.value.initialRecognitionPrice
    row.initialRecognitionValue = Number(editingRecognitionValue.value.toFixed(2))
    row.goodsOwnership = editingAssetFields.value.goodsOwnership
    editingAssetId.value = undefined
    editingProductName.value = ''
    pendingCategorySelection.value = undefined
    pendingOriginPath.value = []
    pendingWarehouse.value = undefined
    ElMessage.success('债项资产明细已更新')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '债项资产明细更新失败')
  } finally {
    savingAssetId.value = undefined
  }
}

const toggleAssetEdit = (row: AssetManagementAssetDetail) => {
  if (editingAssetId.value === row.id) {
    finishAssetEdit(row)
    return
  }
  startAssetEdit(row)
}

const goBack = () => {
  const query = Object.fromEntries(
    Object.entries(route.query).filter(([key]) => !['view', 'id', 'phase'].includes(key))
  )
  router.push({ path: route.path, query })
}

watch(() => route.query.id, loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.asset-management-detail-page {
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

.system-detail-collapse {
  border-top: 0;
  border-bottom: 0;
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

.readonly-detail-form {
  padding: 4px 20px 0;

  :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  :deep(.el-form-item__label) {
    color: #606266;
    font-weight: 400;
  }

  :deep(.el-input.is-disabled .el-input__wrapper) {
    background: #f5f7fa;
  }
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

.asset-total {
  flex: 0 0 auto;
  color: #606266;
  white-space: nowrap;

  strong {
    color: #f56c6c;
    font-size: 16px;
    font-weight: 600;
  }
}

:deep(.selected-contract-row td.el-table__cell) {
  background: #ecf5ff !important;
}

.editable-category-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  gap: 6px;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.category-tree-panel {
  max-height: 400px;
  margin-top: 16px;
  padding: 10px 12px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editable-number-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.editable-number-cell .el-input-number),
:deep(.editable-number-input) {
  width: 128px;
}

:deep(.editable-number-cell .el-input__inner),
:deep(.editable-number-input .el-input__inner) {
  text-align: right;
}

:deep(.editable-date-picker) {
  width: 142px;
}

:deep(.origin-cascader-panel) {
  width: 100%;
  margin-top: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.warehouse-select-table {
  margin-top: 16px;
}

:deep(.selected-warehouse-row td.el-table__cell) {
  background: #ecf5ff !important;
}

:global(.warehouse-select-dialog) {
  max-width: calc(100vw - 48px);
}

@media (max-width: 900px) {
  .detail-page-toolbar,
  .application-summary,
  .section-toolbar {
    flex-wrap: wrap;
  }

  :deep(.readonly-detail-form .el-col-12) {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
</style>
