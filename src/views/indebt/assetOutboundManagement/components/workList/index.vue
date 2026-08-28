<template>
  <ContentWrap class="asset-outbound-management-work-list">
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      :default-expand="false"
      @search="handleSearch"
      @reset="handleSearch"
    />

    <ActionBar :buttons="visibleButtons" />

    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{ total: tableObject.total }"
      :selection="currentPhase === 'pending'"
      highlight-current-row
      :show-overflow-tooltip="true"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @cell-click="handleCellClick"
      @selection-change="handleSelectionChange"
      @register="register"
    >
      <template #latestInventoryValue="{ row }">
        {{ formatAmount(row.latestInventoryValue) }}
      </template>
      <template #proposedOutboundAmount="{ row }">
        {{ formatAmount(row.proposedOutboundAmount) }}
      </template>
      <template #outboundValue="{ row }">
        {{ formatAmount(row.outboundValue) }}
      </template>
      <template #currency="{ row }">
        {{ row.currency || '-' }}
      </template>
      <template #currentStage="{ row }">
        <el-tag v-if="row.currentStage" type="warning" effect="light">
          {{ row.currentStage }}
        </el-tag>
        <span v-else>-</span>
      </template>
      <template #completedAt="{ row }">
        {{ row.completedAt || '-' }}
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openImage(row)">
          <Icon icon="ep:picture" class="mr-3px" />
          查看影像
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog
    v-model="createVisible"
    title="新增债项资产出库申请"
    width="980px"
    destroy-on-close
    :close-on-click-modal="false"
    class="custom-create-dialog"
  >
    <div class="create-instruction-banner text-blue-600 text-sm mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
      提示：先选客户，再选项目，选完自动带出项目编号，最后选择产品方案。
    </div>

    <el-form ref="createFormRef" :model="createForm" :rules="createRules">
      <!-- 2x2 Grid Table Matching Mockup Screenshot -->
      <table class="grid-form-table">
        <tbody>
          <tr>
            <td class="grid-header-cell required-header">项目名称</td>
            <td class="grid-header-cell">项目编号</td>
          </tr>
          <tr>
            <td class="grid-body-cell">
              <el-input
                v-model="createForm.projectName"
                readonly
                :placeholder="createForm.linkedCustomerName ? '点击选择项目名称' : '请先选择链属客户'"
                class="clickable-input"
                :disabled="!createForm.linkedCustomerName"
                @click="handleProjectInputClick"
              >
                <template #suffix>
                  <Icon icon="ep:search" class="cursor-pointer text-blue-500" @click.stop="handleProjectInputClick" />
                </template>
              </el-input>
            </td>
            <td class="grid-body-cell">
              <el-input
                v-model="createForm.projectNo"
                readonly
                placeholder="选择项目后自动带出"
              />
            </td>
          </tr>
          <tr>
            <td class="grid-header-cell required-header">链属客户名称</td>
            <td class="grid-header-cell required-header">产品方案</td>
          </tr>
          <tr>
            <td class="grid-body-cell">
              <el-input
                v-model="createForm.linkedCustomerName"
                readonly
                placeholder="点击选择链属客户名称"
                class="clickable-input highlight-step"
                @click="openCustomerSelect"
              >
                <template #suffix>
                  <Icon icon="ep:search" class="cursor-pointer text-blue-500" @click.stop="openCustomerSelect" />
                </template>
              </el-input>
            </td>
            <td class="grid-body-cell">
              <el-select
                v-model="createForm.productPlan"
                placeholder="请选择产品方案"
                class="w-full"
                @change="handleProductPlanChange"
              >
                <el-option label="货押融资" value="货押融资" />
                <el-option label="先票后货" value="先票后货" />
              </el-select>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Supplementary Form Options -->
      <div class="mt-4 flex gap-4">
        <el-form-item label="出库类型" prop="outboundType" class="flex-1 mb-0">
          <el-select v-model="createForm.outboundType" class="w-full" placeholder="请选择出库类型">
            <el-option label="部分出库" value="部分出库" />
            <el-option label="已完成出库" value="已完成出库" />
          </el-select>
        </el-form-item>
      </div>

      <!-- In-Stock Goods Section -->
      <div v-if="createForm.linkedCustomerName && createForm.projectName && createForm.productPlan" class="inventory-section mt-5">
        <div class="inventory-header flex items-center justify-between mb-3">
          <div class="font-bold text-gray-800 text-sm flex items-center gap-2">
            <span class="w-2.5 h-4 bg-blue-600 rounded-sm inline-block"></span>
            在库商品列表（已选择该客户在此项目此产品中的所有在库商品，供选择出库）
          </div>
          <el-tag type="info" effect="plain">在库商品共 {{ inventoryGoods.length }} 项</el-tag>
        </div>

        <el-table
          ref="inventoryTableRef"
          :data="inventoryGoods"
          border
          size="small"
          highlight-current-row
          @selection-change="handleInventorySelectionChange"
        >
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column prop="goodsNo" label="商品编号" min-width="135" />
          <el-table-column prop="goodsName" label="商品名称" min-width="180" />
          <el-table-column prop="spec" label="规格型号" min-width="130" />
          <el-table-column prop="unit" label="单位" width="70" align="center" />
          <el-table-column prop="inStockQuantity" label="在库数量" width="95" align="right" />
          <el-table-column prop="unitPrice" label="在库单价(元)" width="115" align="right">
            <template #default="{ row }">
              ¥ {{ formatAmount(row.unitPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="inStockValue" label="在库货值(元)" width="125" align="right">
            <template #default="{ row }">
              ¥ {{ formatAmount(row.inStockValue) }}
            </template>
          </el-table-column>
          <el-table-column label="拟出库数量" width="125" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.proposedOutboundQuantity"
                :min="1"
                :max="row.inStockQuantity"
                size="small"
                controls-position="right"
                style="width: 105px;"
                @change="calculateGoodsRowValue(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="拟出库货值(元)" width="135" align="right">
            <template #default="{ row }">
              <span class="text-blue-600 font-semibold">
                ¥ {{ formatAmount(row.proposedOutboundValue) }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <div class="inventory-summary-bar mt-3 p-3 bg-blue-50 border border-blue-100 rounded flex justify-between items-center text-sm">
          <div>
            已选择 <span class="font-bold text-blue-600 text-base">{{ selectedInventoryGoods.length }}</span> 项商品出库
          </div>
          <div>
            拟出库总货值：<span class="font-bold text-red-600 text-base">¥ {{ formatAmount(totalOutboundValue) }}</span>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <!-- 链属客户选择弹窗 -->
  <el-dialog
    v-model="customerSelectVisible"
    title="选择链属客户"
    width="720px"
    destroy-on-close
    append-to-body
  >
    <div class="flex gap-2 mb-4">
      <el-input
        v-model.trim="customerSearchKeyword"
        placeholder="请输入链属客户名称或核心客户编号"
        clearable
        @keyup.enter="loadCustomerList"
      />
      <el-button type="primary" @click="loadCustomerList">
        <Icon icon="ep:search" class="mr-1" />搜 索
      </el-button>
    </div>
    <el-table
      :data="customerList"
      border
      size="small"
      highlight-current-row
      max-height="320"
      @row-click="handleSelectCustomer"
    >
      <el-table-column prop="linkedCustomerName" label="链属客户名称" min-width="200" />
      <el-table-column prop="coreCustomerNo" label="核心客户编号" min-width="160" />
      <el-table-column prop="projectCount" label="可用有效项目数" width="130" align="center" />
      <el-table-column label="操作" width="90" align="center">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleSelectCustomer(row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <!-- 有效项目选择弹窗 -->
  <el-dialog
    v-model="projectSelectVisible"
    title="选择有效项目"
    width="860px"
    destroy-on-close
    append-to-body
  >
    <div class="flex gap-2 mb-4">
      <el-input
        v-model.trim="projectSearchKeyword"
        placeholder="请输入项目名称或项目编号"
        clearable
        @keyup.enter="loadFilteredProjects"
      />
      <el-button type="primary" @click="loadFilteredProjects">
        <Icon icon="ep:search" class="mr-1" />搜 索
      </el-button>
    </div>
    <el-table
      :data="customerProjects"
      border
      size="small"
      highlight-current-row
      max-height="320"
      @row-click="handleSelectProject"
    >
      <el-table-column prop="projectName" label="项目名称" min-width="170" />
      <el-table-column prop="projectNo" label="项目编号" min-width="150" />
      <el-table-column prop="linkedCustomerName" label="链属客户名称" min-width="170" />
      <el-table-column prop="creditNo" label="授信编号" min-width="150" />
      <el-table-column prop="businessContractNo" label="业务合同编号" min-width="160" />
      <el-table-column label="操作" width="90" align="center">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleSelectProject(row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog
    v-model="detailVisible"
    title="债项资产出库申请详情"
    width="1080px"
    top="5vh"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template v-if="detailRecord">
      <el-tabs v-model="detailActiveTab" class="asset-outbound-management-detail-tabs">
        <el-tab-pane label="业务合同信息" name="contract">
          <section class="detail-section">
            <div class="detail-section-title">业务合同基本信息</div>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="申请编号">{{ detailRecord.applicationNo }}</el-descriptions-item>
              <el-descriptions-item label="申请状态">
                <el-tag :type="statusTagType(detailRecord.phase)" effect="light">
                  {{ detailRecord.status }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="申请日期">{{ detailRecord.applicationDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="项目名称">{{ detailRecord.projectName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="项目编号">{{ detailRecord.projectNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="客户名称">{{ detailRecord.customerName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="核心客户编号">{{ detailRecord.coreCustomerNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="链属客户名称">{{ detailRecord.linkedCustomerName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="授信编号">{{ detailRecord.creditNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="产品方案">{{ detailRecord.productPlan || '-' }}</el-descriptions-item>
              <el-descriptions-item label="关联业务合同编号">{{ detailRecord.businessContractNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="业务合同金额">
                {{ formatAmount(detailRecord.businessContractAmount) }} {{ detailRecord.currency || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同起始日">{{ detailRecord.contractStartDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="合同到期日">{{ detailRecord.contractEndDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="出账金额">
                {{ formatAmount(detailRecord.outboundAmount) }} {{ detailRecord.currency || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="出账日期">{{ detailRecord.billingDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="出库截止日期">{{ detailRecord.arrivalDeadline || '-' }}</el-descriptions-item>
              <el-descriptions-item label="当前阶段">{{ detailRecord.currentStage || '-' }}</el-descriptions-item>
              <el-descriptions-item label="完成时间">{{ detailRecord.completedAt || '-' }}</el-descriptions-item>
            </el-descriptions>
          </section>
        </el-tab-pane>

        <el-tab-pane label="出库确认信息" name="confirmation">
          <section class="detail-section">
            <div class="detail-section-heading">
              <div>
                <div class="detail-section-title">债项资产出库出库确认</div>
                <p>待处理节点支持补充或调整确认信息；提交后将进入审查审批流程。</p>
              </div>
              <el-tag :type="canEditConfirmation ? 'warning' : 'info'" effect="light">
                {{ canEditConfirmation ? '可编辑' : '审批中/已完成，仅可查看' }}
              </el-tag>
            </div>
            <el-form
              ref="confirmationFormRef"
              :model="confirmationForm"
              :rules="confirmationRules"
              label-width="122px"
              :disabled="!canEditConfirmation"
            >
              <div class="arrival-form-grid">
                <el-form-item label="出库类型" prop="outboundType">
                  <el-select v-model="confirmationForm.outboundType" class="w-full" placeholder="请选择出库类型">
                    <el-option label="部分出库" value="部分出库" />
                    <el-option label="已完成出库" value="已完成出库" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出库在库货值" prop="outboundValue">
                  <el-input-number
                    v-model="confirmationForm.outboundValue"
                    class="w-full"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="请输入出库在库货值"
                  />
                </el-form-item>
                <el-form-item label="币种">
                  <el-input :model-value="confirmationForm.currency" readonly />
                </el-form-item>
                <el-form-item label="出库截止日期" prop="arrivalDeadline">
                  <el-date-picker
                    v-model="confirmationForm.arrivalDeadline"
                    type="date"
                    value-format="YYYY-MM-DD"
                    class="w-full"
                    placeholder="请选择出库截止日期"
                  />
                </el-form-item>
              </div>
            </el-form>
            <div v-if="canEditConfirmation" class="detail-actions">
              <el-button type="primary" :loading="detailSaving" @click="handleSaveConfirmation">
                <Icon icon="ep:check" class="mr-4px" />保存出库确认信息
              </el-button>
            </div>
          </section>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #footer>
      <el-button @click="detailVisible = false">关 闭</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="batchSubmitVisible"
    title="批量提交债项资产出库申请"
    width="600px"
    destroy-on-close
  >
    <el-alert
      :title="`已选择 ${selectedRecords.length} 条待处理出库申请，将统一提交至审查审批流程。`"
      type="warning"
      :closable="false"
      class="mb-16px"
    />
    <template #footer>
      <el-button @click="batchSubmitVisible = false">取 消</el-button>
      <el-button type="primary" :loading="batchSubmitting" @click="handleBatchSubmit">确认提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="asset-outbound-management-timeline">
      <el-timeline-item
        v-for="opinion in opinionRecord.opinions"
        :key="opinion.id"
        :timestamp="`${opinion.signer} · ${opinion.signedAt}`"
        placement="top"
      >
        {{ opinion.content }}
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无已签署意见" />
  </el-dialog>

  <el-dialog v-model="historyVisible" title="查看流转记录" width="680px" destroy-on-close>
    <el-timeline v-if="historyRecord?.flowRecords?.length" class="asset-outbound-management-timeline">
      <el-timeline-item
        v-for="flowRecord in historyRecord.flowRecords"
        :key="flowRecord.id"
        :timestamp="`${flowRecord.operator} · ${flowRecord.operatedAt}`"
        placement="top"
      >
        {{ flowRecord.node }}：{{ flowRecord.action }}
        <span v-if="flowRecord.comment">（{{ flowRecord.comment }}）</span>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无流转记录" />
  </el-dialog>

  <el-dialog v-model="imageVisible" title="债项资产出库申请影像" width="760px" destroy-on-close>
    <el-alert
      :title="`申请编号：${imageRecord?.applicationNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div v-for="image in imageItems" :key="image.id" class="image-file-card">
        <Icon :icon="image.icon" class="image-file-icon" />
        <div>
          <strong>{{ image.name }}</strong>
          <p>{{ image.description }}</p>
        </div>
        <el-button link type="primary" @click="ElMessage.info('当前为 Mock 演示影像，可在此接入实际影像系统')">
          预览
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as AssetOutboundManagementApi from '@/api/indebt/assetOutboundManagement'
import {
  getAssetOutboundManagementCustomers,
  getAssetOutboundManagementInventoryGoods,
  type AssetOutboundManagementCustomer,
  type AssetOutboundInventoryGoods
} from '@/mock/asset-outbound-management'

defineOptions({ name: 'AssetOutboundManagementApplicationWorkList' })

const route = useRoute()
const router = useRouter()

type AssetOutboundManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

interface AssetOutboundManagementOpinion {
  id: number | string
  content: string
  signer: string
  signedAt: string
}

interface AssetOutboundManagementFlowRecord {
  id: number | string
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

interface AssetOutboundManagementRecord {
  id: number | string
  phase: AssetOutboundManagementApplicationPhase
  status: string
  applicationNo: string
  customerName: string
  coreCustomerNo: string
  linkedCustomerName: string
  projectName: string
  projectNo: string
  creditNo: string
  productPlan: string
  businessContractNo: string
  businessContractAmount: number
  outboundAmount: number
  latestInventoryValue: number
  proposedOutboundAmount: number
  applicationChannel: string
  billingDate: string
  arrivalDeadline: string
  outboundValue: number
  currency: string
  applicationDate: string
  outboundType: string
  contractStartDate: string
  contractEndDate: string
  currentStage?: string
  completedAt?: string
  opinions?: AssetOutboundManagementOpinion[]
  flowRecords?: AssetOutboundManagementFlowRecord[]
}

interface AvailableProject {
  id: number | string
  projectName: string
  projectNo: string
  linkedCustomerName: string
  creditNo: string
  productPlan: string
  businessContractNo: string
}

interface AssetOutboundManagementPageResult {
  total: number
  list: AssetOutboundManagementRecord[]
  records?: AssetOutboundManagementRecord[]
  pageNo?: number
  pageSize?: number
}

interface CreateForm {
  projectId: number | string | ''
  projectName: string
  projectNo: string
  linkedCustomerName: string
  creditNo: string
  productPlan: string
  businessContractNo: string
  outboundType: '部分出库' | '已完成出库' | ''
}

interface ConfirmationForm {
  outboundType: '部分出库' | '已完成出库' | ''
  outboundValue: number
  currency: string
  arrivalDeadline: string
}

interface ImageFile {
  id: number | string
  name: string
  description: string
  icon: string
}

const props = defineProps<{
  params?: {
    phase?: AssetOutboundManagementApplicationPhase
  }
}>()

const validPhases: AssetOutboundManagementApplicationPhase[] = ['pending', 'reviewing', 'rejected', 'approved']
const isAssetOutboundManagementApplicationPhase = (value: unknown): value is AssetOutboundManagementApplicationPhase =>
  validPhases.includes(value as AssetOutboundManagementApplicationPhase)
const currentPhase = computed<AssetOutboundManagementApplicationPhase>(() =>
  isAssetOutboundManagementApplicationPhase(props.params?.phase) ? props.params.phase : 'pending'
)

type ApiFunction = (...args: unknown[]) => Promise<unknown>
const api = AssetOutboundManagementApi as unknown as Record<string, ApiFunction>

const callApi = async <T,>(names: string | string[], ...args: unknown[]): Promise<T> => {
  const candidates = Array.isArray(names) ? names : [names]
  const name = candidates.find((candidate) => typeof api[candidate] === 'function')
  if (!name) {
    throw new Error(`债项资产管理 Mock 未提供 ${candidates[0]} 接口`)
  }
  return api[name](...args) as Promise<T>
}

const toObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
const unwrapData = (value: unknown): unknown => {
  const result = toObject(value)
  return result.data === undefined ? value : result.data
}
const toText = (value: unknown) => (value === undefined || value === null ? '' : String(value))
const toNumber = (value: unknown) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}
const getArray = (value: unknown) => (Array.isArray(value) ? value : [])
const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const phaseLabel = (phase: AssetOutboundManagementApplicationPhase) => {
  if (phase === 'approved') return '审批通过'
  if (phase === 'rejected') return '被否决'
  if (phase === 'reviewing') return '审查审批中'
  return '待提交'
}

const statusTagType = (phase: AssetOutboundManagementApplicationPhase) => {
  if (phase === 'approved') return 'success'
  if (phase === 'rejected') return 'danger'
  if (phase === 'reviewing') return 'warning'
  return 'info'
}

const normalizeOpinion = (value: unknown, index: number): AssetOutboundManagementOpinion => {
  const opinion = toObject(value)
  return {
    id: (opinion.id ?? opinion.opinionId ?? index) as number | string,
    content: toText(opinion.content ?? opinion.opinion),
    signer: toText(opinion.signer ?? opinion.userName ?? opinion.operatorName),
    signedAt: toText(opinion.signedAt ?? opinion.createTime ?? opinion.opinionTime)
  }
}

const normalizeFlowRecord = (value: unknown, index: number): AssetOutboundManagementFlowRecord => {
  const flowRecord = toObject(value)
  return {
    id: (flowRecord.id ?? flowRecord.flowId ?? index) as number | string,
    node: toText(flowRecord.node ?? flowRecord.stage ?? flowRecord.currentStage),
    action: toText(flowRecord.action ?? flowRecord.operation ?? flowRecord.status),
    operator: toText(flowRecord.operator ?? flowRecord.operatorName ?? flowRecord.userName),
    operatedAt: toText(flowRecord.operatedAt ?? flowRecord.createTime ?? flowRecord.operationTime),
    comment: toText(flowRecord.comment ?? flowRecord.opinion ?? flowRecord.remark)
  }
}

const normalizeRecord = (
  value: unknown,
  fallbackPhase: AssetOutboundManagementApplicationPhase = currentPhase.value
): AssetOutboundManagementRecord => {
  const record = toObject(unwrapData(value))
  const rawOpinions = getArray(record.opinions ?? record.opinionList)
  const rawFlowRecords = getArray(record.flowRecords ?? record.flowList ?? record.historyRecords)
  const phase = isAssetOutboundManagementApplicationPhase(record.phase) ? record.phase : fallbackPhase
  return {
    id: (record.id ?? record.applicationId ?? record.applyId ?? 0) as number | string,
    phase,
    status: toText(record.status ?? record.applicationStatus) || phaseLabel(phase),
    applicationNo: toText(record.applicationNo ?? record.applyNo ?? record.applicationNumber),
    customerName: toText(record.customerName ?? record.chainCustomerName ?? record.linkedCustomerName),
    coreCustomerNo: toText(record.coreCustomerNo ?? record.coreCustomerId ?? record.customerNo),
    linkedCustomerName: toText(
      record.linkedCustomerName ?? record.chainCustomerName ?? record.customerName
    ),
    projectName: toText(record.projectName),
    projectNo: toText(record.projectNo ?? record.projectCode),
    creditNo: toText(record.creditNo ?? record.creditNumber ?? record.creditApplyNo),
    productPlan: toText(record.productPlan ?? record.productPlanName ?? record.productScheme),
    businessContractNo: toText(
      record.businessContractNo ??
        record.relatedBusinessContractNo ??
        record.contractNo ??
        record.businessAgreementNo
    ),
    businessContractAmount: toNumber(record.businessContractAmount ?? record.contractAmount),
    outboundAmount: toNumber(
      record.outboundAmount ?? record.billingAmount ?? record.drawdownAmount ?? record.disbursementAmount
    ),
    latestInventoryValue: toNumber(
      record.latestInventoryValue ?? record.currentInventoryValue ?? record.stockValue ?? record.outboundValue
    ),
    proposedOutboundAmount: toNumber(
      record.proposedOutboundAmount ?? record.applyOutboundAmount ?? record.outboundAmount
    ),
    applicationChannel: toText(record.applicationChannel ?? record.applyChannel) || '供应链',
    billingDate: toText(
      record.billingDate ?? record.outboundDate ?? record.drawdownDate ?? record.disbursementDate
    ),
    arrivalDeadline: toText(record.arrivalDeadline ?? record.arrivalDeadlineDate ?? record.arrivalLimitDate),
    outboundValue: toNumber(
      record.outboundValue ?? record.outboundTotalValue ?? record.storageValue ?? record.outboundGoodsValue
    ),
    currency: toText(record.currency ?? record.currencyName),
    applicationDate: toText(record.applicationDate ?? record.applyDate),
    outboundType: toText(record.outboundType ?? record.storageType),
    contractStartDate: toText(record.contractStartDate ?? record.businessContractStartDate),
    contractEndDate: toText(record.contractEndDate ?? record.businessContractEndDate),
    currentStage: toText(record.currentStage ?? record.currentNode),
    completedAt: toText(record.completedAt ?? record.completeTime ?? record.completedTime),
    opinions: rawOpinions.map(normalizeOpinion),
    flowRecords: rawFlowRecords.map(normalizeFlowRecord)
  }
}

const normalizeProject = (value: unknown): AvailableProject => {
  const project = toObject(unwrapData(value))
  return {
    id: (project.id ?? project.projectId ?? 0) as number | string,
    projectName: toText(project.projectName),
    projectNo: toText(project.projectNo ?? project.projectCode),
    linkedCustomerName: toText(project.linkedCustomerName ?? project.chainCustomerName ?? project.customerName),
    creditNo: toText(project.creditNo ?? project.creditNumber ?? project.creditApplyNo),
    productPlan: toText(project.productPlan ?? project.productPlanName ?? project.productScheme),
    businessContractNo: toText(project.businessContractNo ?? project.contractNo ?? project.businessAgreementNo)
  }
}

const isFailedResult = (value: unknown): value is { success: false; message?: string } => {
  const result = toObject(value)
  return result.success === false || result.code === -1 || result.code === 'FAIL'
}

const recordFromResult = (value: unknown): AssetOutboundManagementRecord | undefined => {
  const raw = unwrapData(value)
  const result = toObject(raw)
  const record = result.record ?? result.application ?? result.detail
  if (record) return normalizeRecord(record)
  if (result.id ?? result.applicationNo ?? result.applyNo) return normalizeRecord(result)
  return undefined
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '申请编号',
    field: 'applicationNo',
    fixed: 'left',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入申请编号' } }
  },
  {
    label: '客户名称',
    field: 'customerName',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 165,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  { label: '产品方案', field: 'productPlan', minWidth: 145 },
  { label: '关联业务合同编号', field: 'businessContractNo', minWidth: 180 },
  { label: '最新在库货值', field: 'latestInventoryValue', minWidth: 145 },
  { label: '拟出库金额', field: 'proposedOutboundAmount', minWidth: 135 },
  { label: '出库在库货值', field: 'outboundValue', minWidth: 135 },
  { label: '币种', field: 'currency', minWidth: 105 },
  { label: '申请日期', field: 'applicationDate', minWidth: 130 },
  { label: '申请渠道', field: 'applicationChannel', minWidth: 120 },
  { label: '出库类型', field: 'outboundType', minWidth: 125 },
  { label: '当前阶段', field: 'currentStage', minWidth: 175 },
  { label: '完成时间', field: 'completedAt', minWidth: 170 },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])

const pendingFields = new Set([
  'applicationNo',
  'customerName',
  'coreCustomerNo',
  'productPlan',
  'businessContractNo',
  'latestInventoryValue',
  'proposedOutboundAmount',
  'currency',
  'applicationDate',
  'outboundType',
  'applicationChannel',
  'action'
])
const reviewingAndApprovedFields = new Set([
  'applicationNo',
  'customerName',
  'coreCustomerNo',
  'productPlan',
  'businessContractNo',
  'latestInventoryValue',
  'proposedOutboundAmount',
  'outboundValue',
  'currency',
  'applicationDate',
  'outboundType',
  'applicationChannel',
  'currentStage',
  'completedAt',
  'action'
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  allSchemas.tableColumns.filter((column) =>
    (currentPhase.value === 'pending' ? pendingFields : reviewingAndApprovedFields).has(column.field)
  )
)

const getCurrentPage = async (params: Recordable): Promise<AssetOutboundManagementPageResult> => {
  const result = await callApi<unknown>(
    ['getAssetOutboundManagementApplicationPage', 'getAssetOutboundManagementPage'],
    { ...params, phase: currentPhase.value }
  )
  const page = toObject(unwrapData(result))
  const rows = getArray(page.list ?? page.records ?? page.rows).map((item) =>
    normalizeRecord(item, currentPhase.value)
  )
  return {
    total: toNumber(page.total ?? page.totalCount ?? rows.length),
    list: rows,
    records: rows,
    pageNo: toNumber(page.pageNo ?? page.currentPage),
    pageSize: toNumber(page.pageSize)
  }
}

const { register, tableObject, tableMethods } = useTable<AssetOutboundManagementRecord>({
  getListApi: getCurrentPage,
  defaultParams: { phase: currentPhase.value }
})
const { getList, setSearchParams } = tableMethods

interface SelectableInventoryGoods extends AssetOutboundInventoryGoods {
  proposedOutboundQuantity: number
  proposedOutboundValue: number
}

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const projectKeyword = ref('')
const linkedCustomerKeyword = ref('')
const projectsLoading = ref(false)
const availableProjects = ref<AvailableProject[]>([])

const customerSelectVisible = ref(false)
const customerSearchKeyword = ref('')
const customerList = ref<AssetOutboundManagementCustomer[]>([])

const projectSelectVisible = ref(false)
const projectSearchKeyword = ref('')
const customerProjects = ref<AvailableProject[]>([])

const inventoryGoods = ref<SelectableInventoryGoods[]>([])
const selectedInventoryGoods = ref<SelectableInventoryGoods[]>([])

const totalOutboundValue = computed(() => {
  return selectedInventoryGoods.value.reduce((sum, item) => sum + (item.proposedOutboundValue || 0), 0)
})

const detailVisible = ref(false)
const detailRecord = ref<AssetOutboundManagementRecord>()
const detailActiveTab = ref('contract')
const confirmationFormRef = ref<FormInstance>()
const detailSaving = ref(false)
const batchSubmitVisible = ref(false)
const batchSubmitting = ref(false)
const selectedRecords = ref<AssetOutboundManagementRecord[]>([])
const opinionVisible = ref(false)
const opinionRecord = ref<AssetOutboundManagementRecord>()
const historyVisible = ref(false)
const historyRecord = ref<AssetOutboundManagementRecord>()
const imageVisible = ref(false)
const imageRecord = ref<AssetOutboundManagementRecord>()
const imageItems = ref<ImageFile[]>([])
const actionLoading = ref<'submit' | 'withdraw' | 'approve' | 'sign' | ''>('')

const initialCreateForm = (): CreateForm => ({
  projectId: '',
  projectName: '',
  projectNo: '',
  linkedCustomerName: '',
  creditNo: '',
  productPlan: '',
  businessContractNo: '',
  outboundType: '部分出库'
})
const createForm = reactive<CreateForm>(initialCreateForm())
const createRules: FormRules<CreateForm> = {
  linkedCustomerName: [{ required: true, message: '请选择链属客户名称', trigger: 'change' }],
  projectName: [{ required: true, message: '请选择有效项目名称', trigger: 'change' }],
  productPlan: [{ required: true, message: '请选择产品方案', trigger: 'change' }],
  outboundType: [{ required: true, message: '请选择出库类型', trigger: 'change' }]
}

const initialConfirmationForm = (): ConfirmationForm => ({
  outboundType: '部分出库',
  outboundValue: 0,
  currency: '人民币',
  arrivalDeadline: ''
})
const confirmationForm = reactive<ConfirmationForm>(initialConfirmationForm())
const confirmationRules: FormRules<ConfirmationForm> = {
  outboundType: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
  outboundValue: [
    { required: true, type: 'number', min: 0.01, message: '请输入大于 0 的出库在库货值', trigger: 'blur' }
  ],
  arrivalDeadline: [{ required: true, message: '请选择出库截止日期', trigger: 'change' }]
}

const currentRecord = computed(() => tableObject.currentRow || undefined)
const canEditConfirmation = computed(
  () => detailRecord.value?.phase === 'pending' && currentPhase.value === 'pending'
)

const setCurrentRecord = (record: AssetOutboundManagementRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: AssetOutboundManagementRecord) => {
  setCurrentRecord(record)
}

const handleSelectionChange = (records: AssetOutboundManagementRecord[]) => {
  selectedRecords.value = Array.isArray(records) ? records : []
}

const requireCurrentRecord = (): AssetOutboundManagementRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条债项资产出库申请')
    return undefined
  }
  return currentRecord.value
}

const refreshList = async () => {
  tableObject.currentRow = null
  selectedRecords.value = []
  await getList()
}

const handleSearch = (params: Recordable) => {
  tableObject.currentRow = null
  selectedRecords.value = []
  setSearchParams({ ...params, phase: currentPhase.value })
}

const loadAvailableProjects = async () => {
  projectsLoading.value = true
  try {
    const result = await callApi<unknown>(
      ['getAvailableAssetOutboundManagementProjects', 'getEffectiveAssetOutboundManagementProjects'],
      {
        projectName: projectKeyword.value.trim() || undefined,
        linkedCustomerName: linkedCustomerKeyword.value.trim() || undefined,
        customerName: linkedCustomerKeyword.value.trim() || undefined
      }
    )
    const source = unwrapData(result)
    const page = toObject(source)
    const rows = Array.isArray(source) ? source : getArray(page.list ?? page.records ?? page.rows)
    availableProjects.value = rows.map(normalizeProject)
  } catch (error) {
    availableProjects.value = []
    ElMessage.error(error instanceof Error ? error.message : '获取有效项目失败')
  } finally {
    projectsLoading.value = false
  }
}

const selectProject = (project: AvailableProject) => {
  Object.assign(createForm, {
    projectId: project.id,
    projectName: project.projectName,
    projectNo: project.projectNo,
    linkedCustomerName: project.linkedCustomerName,
    creditNo: project.creditNo,
    productPlan: project.productPlan,
    businessContractNo: project.businessContractNo
  })
  createFormRef.value?.validateField('projectId')
}

const openCustomerSelect = () => {
  customerSearchKeyword.value = ''
  customerSelectVisible.value = true
  loadCustomerList()
}

const loadCustomerList = () => {
  customerList.value = getAssetOutboundManagementCustomers(customerSearchKeyword.value)
}

const handleSelectCustomer = (row: AssetOutboundManagementCustomer) => {
  createForm.linkedCustomerName = row.linkedCustomerName
  linkedCustomerKeyword.value = row.linkedCustomerName
  createForm.projectId = ''
  createForm.projectName = ''
  createForm.projectNo = ''
  createForm.productPlan = ''
  inventoryGoods.value = []
  selectedInventoryGoods.value = []
  customerSelectVisible.value = false
  ElMessage.success(`已选择链属客户：${row.linkedCustomerName}，请接着选择项目`)
}

const handleProjectInputClick = () => {
  if (!createForm.linkedCustomerName) {
    ElMessage.warning('请先选择链属客户')
    openCustomerSelect()
    return
  }
  projectSearchKeyword.value = ''
  projectSelectVisible.value = true
  loadFilteredProjects()
}

const loadFilteredProjects = async () => {
  projectsLoading.value = true
  try {
    const result = await callApi<unknown>(
      ['getAvailableAssetOutboundManagementProjects', 'getEffectiveAssetOutboundManagementProjects'],
      {
        projectName: projectSearchKeyword.value.trim() || undefined,
        linkedCustomerName: createForm.linkedCustomerName || undefined,
        customerName: createForm.linkedCustomerName || undefined
      }
    )
    const source = unwrapData(result)
    const page = toObject(source)
    const rows = Array.isArray(source) ? source : getArray(page.list ?? page.records ?? page.rows)
    customerProjects.value = rows.map(normalizeProject)
  } catch (error) {
    customerProjects.value = []
  } finally {
    projectsLoading.value = false
  }
}

const handleSelectProject = (project: AvailableProject) => {
  createForm.projectId = project.id
  createForm.projectName = project.projectName
  createForm.projectNo = project.projectNo
  createForm.creditNo = project.creditNo
  createForm.businessContractNo = project.businessContractNo

  if (!createForm.productPlan) {
    createForm.productPlan = project.productPlan === '先票后货' ? '先票后货' : '货押融资'
  }

  projectSelectVisible.value = false
  loadInventoryGoodsList()
}

const handleProductPlanChange = () => {
  loadInventoryGoodsList()
}

const loadInventoryGoodsList = () => {
  if (createForm.projectId && createForm.productPlan) {
    const goods = getAssetOutboundManagementInventoryGoods(createForm.projectId, createForm.productPlan)
    inventoryGoods.value = goods.map((item) => ({
      ...item,
      proposedOutboundQuantity: item.inStockQuantity,
      proposedOutboundValue: item.inStockValue
    }))
    selectedInventoryGoods.value = [...inventoryGoods.value]
  } else {
    inventoryGoods.value = []
    selectedInventoryGoods.value = []
  }
}

const calculateGoodsRowValue = (row: SelectableInventoryGoods) => {
  row.proposedOutboundValue = (row.proposedOutboundQuantity || 0) * (row.unitPrice || 0)
}

const handleInventorySelectionChange = (selection: SelectableInventoryGoods[]) => {
  selectedInventoryGoods.value = selection
}

const openCreate = async () => {
  Object.assign(createForm, initialCreateForm())
  projectKeyword.value = ''
  linkedCustomerKeyword.value = ''
  customerSearchKeyword.value = ''
  projectSearchKeyword.value = ''
  inventoryGoods.value = []
  selectedInventoryGoods.value = []
  createFormRef.value?.clearValidate()
  createVisible.value = true
}

const handleCreate = async () => {
  if (!createForm.linkedCustomerName) {
    ElMessage.warning('请选择链属客户名称')
    return
  }
  if (!createForm.projectId) {
    ElMessage.warning('请选择有效项目名称')
    return
  }
  if (!createForm.productPlan) {
    ElMessage.warning('请选择产品方案')
    return
  }
  if (!selectedInventoryGoods.value.length) {
    ElMessage.warning('请勾选拟出库的在库商品')
    return
  }

  createLoading.value = true
  try {
    const result = await callApi<unknown>('createAssetOutboundManagementApplication', {
      projectId: Number(createForm.projectId),
      outboundType: createForm.outboundType,
      linkedCustomerName: createForm.linkedCustomerName,
      productPlan: createForm.productPlan,
      outboundValue: totalOutboundValue.value
    })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '新增债项资产出库申请失败')
      return
    }
    ElMessage.success('新增成功，申请已进入待提交节点')
    createVisible.value = false
    if (currentPhase.value === 'pending') await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增债项资产出库申请失败')
  } finally {
    createLoading.value = false
  }
}

const getDetail = async (record: AssetOutboundManagementRecord) => {
  const result = await callApi<unknown>('getAssetOutboundManagementApplicationDetail', record.id)
  if (isFailedResult(result)) {
    ElMessage.error(result.message || '未获取到债项资产出库申请详情')
    return undefined
  }
  return recordFromResult(result)
}

const applyConfirmationForm = (record: AssetOutboundManagementRecord) => {
  Object.assign(confirmationForm, {
    outboundType: record.outboundType === '已完成出库' ? '已完成出库' : '部分出库',
    outboundValue: record.outboundValue,
    currency: record.currency || '人民币',
    arrivalDeadline: record.arrivalDeadline
  })
}

const openDetail = () => {
  const record = requireCurrentRecord()
  if (!record) return
  router.push({
    path: route.path,
    query: { ...route.query, view: 'detail', id: String(record.id), phase: currentPhase.value }
  })
}

const handleSaveConfirmation = async () => {
  if (!detailRecord.value) return
  const valid = await confirmationFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return

  detailSaving.value = true
  try {
    const result = await callApi<unknown>(
      ['updateAssetOutboundManagementConfirmation', 'saveAssetOutboundManagementConfirmation', 'updateAssetOutboundManagementApplication'],
      detailRecord.value.id,
      {
        outboundGoodsValue: confirmationForm.outboundValue,
        outboundType: confirmationForm.outboundType,
        arrivalDeadline: confirmationForm.arrivalDeadline
      }
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '保存出库确认信息失败')
      return
    }
    const saved = recordFromResult(result)
    if (saved) {
      detailRecord.value = saved
      applyConfirmationForm(saved)
    }
    ElMessage.success('出库确认信息已保存')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存出库确认信息失败')
  } finally {
    detailSaving.value = false
  }
}

const openOpinion = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    const detail = await getDetail(record)
    if (!detail) return
    opinionRecord.value = detail
    opinionVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取意见失败')
  }
}

const openHistory = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    const detail = await getDetail(record)
    if (!detail) return
    historyRecord.value = detail
    historyVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取流转记录失败')
  }
}

const handleTransition = async (type: 'submit' | 'withdraw') => {
  const record = requireCurrentRecord()
  if (!record) return
  const actionLabel = type === 'submit' ? '提交' : '收回'
  try {
    await ElMessageBox.confirm(
      `确认${actionLabel}债项资产出库申请“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = type
  try {
    const result =
      type === 'submit'
        ? await callApi<unknown>('submitAssetOutboundManagementApplication', record.id)
        : await callApi<unknown>('withdrawAssetOutboundManagementApplication', record.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || `${actionLabel}失败`)
      return
    }
    ElMessage.success(`${actionLabel}成功`)
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : `${actionLabel}失败`)
  } finally {
    actionLoading.value = ''
  }
}

const handleSignOpinion = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  let content = ''
  try {
    const result = await ElMessageBox.prompt('请输入签署意见', '签署意见', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputValue: '经核验，出库资产信息与业务合同匹配。',
      inputValidator: (value) => Boolean(value?.trim()) || '请填写意见内容'
    })
    content = result.value
  } catch {
    return
  }

  actionLoading.value = 'sign'
  try {
    const result = await callApi<unknown>('signAssetOutboundManagementApplicationOpinion', record.id, content)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    ElMessage.success('签署意见已保存')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '签署意见失败')
  } finally {
    actionLoading.value = ''
  }
}

const handleApprove = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    await ElMessageBox.confirm(
      `确认提交并完成债项资产出库审批“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = 'approve'
  try {
    const result = await callApi<unknown>('approveAssetOutboundManagementApplication', record.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '提交审批失败')
      return
    }
    ElMessage.success('提交成功，申请已进入已完成工作')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '提交审批失败')
  } finally {
    actionLoading.value = ''
  }
}

const openBatchSubmit = () => {
  if (!selectedRecords.value.length) {
    ElMessage.warning('请先勾选需要批量提交的出库申请')
    return
  }
  batchSubmitVisible.value = true
}

const handleBatchSubmit = async () => {
  if (!selectedRecords.value.length) return
  batchSubmitting.value = true
  try {
    const result = await callApi<unknown>(
      ['batchSubmitAssetOutboundManagementApplications', 'batchSubmitAssetOutboundManagement'],
      selectedRecords.value.map((record) => record.id)
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '批量提交失败')
      return
    }
    const resultData = toObject(unwrapData(result))
    const count = toNumber(resultData.submitted ?? resultData.count)
    ElMessage.success(`批量提交成功${count ? `，共 ${count} 条` : ''}`)
    batchSubmitVisible.value = false
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '批量提交失败')
  } finally {
    batchSubmitting.value = false
  }
}

const defaultImages = (record: AssetOutboundManagementRecord): ImageFile[] => [
  {
    id: 'arrival-notice',
    name: '出库通知单',
    description: `出库截止日期：${record.arrivalDeadline || '待补充'}`,
    icon: 'ep:document'
  },
  {
    id: 'outbound-document',
    name: '出库确认材料',
    description: `出库类型：${record.outboundType || '待补充'}`,
    icon: 'ep:files'
  },
  {
    id: 'arrival-image',
    name: '货物出库影像',
    description: record.businessContractNo || '关联业务合同影像材料',
    icon: 'ep:picture'
  }
]

const normalizeImage = (value: unknown, index: number): ImageFile => {
  const image = toObject(value)
  return {
    id: (image.id ?? image.fileId ?? index) as number | string,
    name: toText(image.name ?? image.fileName ?? `出库影像${index + 1}`),
    description: toText(image.description ?? image.uploadedAt ?? image.createTime ?? '债项资产出库申请影像材料'),
    icon: toText(image.icon) || 'ep:document'
  }
}

const openImage = async (record: AssetOutboundManagementRecord) => {
  setCurrentRecord(record)
  imageRecord.value = record
  imageItems.value = defaultImages(record)
  imageVisible.value = true
  try {
    const result = await callApi<unknown>('getAssetOutboundManagementApplicationImages', record.id)
    const source = unwrapData(result)
    const resultObject = toObject(source)
    const rows = Array.isArray(source) ? source : getArray(resultObject.list ?? resultObject.records)
    if (rows.length) imageItems.value = rows.map(normalizeImage)
  } catch {
    // 影像接口缺失时保留结构化 Mock 影像，页面仍可正常演示。
  }
}

const generatePledgeTask = () => {
  const record = requireCurrentRecord()
  if (!record) return
  ElMessage.success(`已生成动产质押变更待办：${record.applicationNo}（Mock）`)
}

const generatePickupNotice = () => {
  const record = requireCurrentRecord()
  if (!record) return
  ElMessage.success(`已生成加签版提货通知书：${record.applicationNo}（Mock）`)
}

const deleteCurrentRecord = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    await ElMessageBox.confirm(`确认删除出库申请“${record.applicationNo}”吗？`, '删除确认', {
      type: 'warning'
    })
  } catch {
    return
  }
  tableObject.tableList = tableObject.tableList.filter((item) => item.id !== record.id)
  tableObject.total = Math.max(0, tableObject.total - 1)
  tableObject.currentRow = null
  ElMessage.success('删除成功')
}

const visibleButtons = computed<ActionButton[]>(() => {
  const detailButton: ActionButton = {
    key: 'detail',
    label: '详情',
    icon: 'ep:document',
    plain: true,
    onClick: openDetail
  }
  const opinionButton: ActionButton = {
    key: 'view-opinion',
    label: '查看意见',
    icon: 'ep:chat-line-square',
    plain: true,
    onClick: openOpinion
  }
  const historyButton: ActionButton = {
    key: 'view-history',
    label: '查看流转记录',
    icon: 'ep:connection',
    plain: true,
    onClick: openHistory
  }

  if (currentPhase.value === 'pending') {
    return [
      {
        key: 'create',
        label: '新增',
        icon: 'ep:plus',
        plain: true,
        onClick: openCreate
      },
      detailButton,
      {
        key: 'sign-opinion',
        label: '签署意见',
        icon: 'ep:edit-pen',
        plain: true,
        onClick: handleSignOpinion
      },
      {
        key: 'submit',
        label: '提交',
        icon: 'ep:promotion',
        plain: true,
        loading: actionLoading.value === 'submit',
        onClick: () => handleTransition('submit')
      },
      {
        key: 'batch-submit',
        label: '批量提交',
        icon: 'ep:finished',
        plain: true,
        onClick: openBatchSubmit
      },
      {
        key: 'delete',
        label: '删除',
        icon: 'ep:delete',
        type: 'danger',
        plain: true,
        onClick: deleteCurrentRecord
      }
    ]
  }

  if (currentPhase.value === 'reviewing') {
    return [
      detailButton,
      {
        key: 'approve',
        label: '提交',
        icon: 'ep:promotion',
        plain: true,
        loading: actionLoading.value === 'approve',
        onClick: handleApprove
      },
      {
        key: 'sign-opinion',
        label: '签署意见',
        icon: 'ep:edit-pen',
        plain: true,
        loading: actionLoading.value === 'sign',
        onClick: handleSignOpinion
      },
      opinionButton,
      historyButton,
      {
        key: 'withdraw',
        label: '退回上一步',
        icon: 'ep:back',
        plain: true,
        loading: actionLoading.value === 'withdraw',
        onClick: () => handleTransition('withdraw')
      },
      {
        key: 'generate-pledge',
        label: '生成动产质押变更待办',
        icon: 'ep:document-add',
        plain: true,
        onClick: generatePledgeTask
      }
    ]
  }

  return [
    detailButton,
    opinionButton,
    historyButton,
    ...(currentPhase.value === 'approved'
      ? [{ key: 'pickup-notice', label: '生成提货通知书', icon: 'ep:document-checked', plain: true, onClick: generatePickupNotice }]
      : [])
  ]
})

watch(
  currentPhase,
  (phase) => {
    tableObject.currentRow = null
    tableObject.currentPage = 1
    selectedRecords.value = []
    setSearchParams({ ...tableObject.params, phase })
  },
  { immediate: true }
)

onActivated(() => {
  getList()
})
</script>

<style scoped lang="scss">
.asset-outbound-management-work-list {
  min-width: 0;
}

.project-query-row {
  display: flex;
  width: 100%;
  gap: 10px;

  .el-input {
    flex: 1;
  }
}

.project-picker {
  width: 100%;
}

.arrival-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.detail-section {
  min-width: 0;
}

.detail-section-title {
  margin-bottom: 14px;
  color: #27364b;
  font-size: 15px;
  font-weight: 600;
}

.detail-section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  .detail-section-title {
    margin-bottom: 5px;
  }

  p {
    margin: 0 0 14px;
    color: #8492a6;
    font-size: 13px;
  }
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.asset-outbound-management-timeline {
  padding: 8px 12px 0;
}

.image-file-list {
  display: grid;
  gap: 12px;
}

.image-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 12px 16px;
  border: 1px solid #e3e9f2;
  border-radius: 6px;
  background: #fafcff;

  .image-file-icon {
    flex: 0 0 auto;
    color: #3d7ad6;
    font-size: 28px;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    color: #27364b;
    font-weight: 600;
  }

  p {
    margin: 5px 0 0;
    color: #8492a6;
    font-size: 13px;
  }
}

.create-instruction-banner {
  padding: 12px 16px;
  background-color: #f0f7ff;
  border: 1px dashed #409eff;
  border-radius: 6px;
  margin-bottom: 18px;
}

.grid-form-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  table-layout: fixed;

  td {
    border: 1px solid #dcdfe6;
    padding: 8px 12px;
    box-sizing: border-box;
  }

  .grid-header-cell {
    width: 50%;
    background-color: #f8fafc;
    color: #303133;
    font-weight: 600;
    font-size: 14px;

    &.required-header::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .grid-body-cell {
    width: 50%;
    background-color: #ffffff;
  }
}

.clickable-input {
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}

.inventory-section {
  border-top: 1px dashed #dcdfe6;
  padding-top: 16px;
}

@media (max-width: 900px) {
  .project-query-row,
  .detail-section-heading {
    display: block;
  }

  .project-query-row > * + * {
    margin-top: 10px;
  }

  .arrival-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
