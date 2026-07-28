<template>
  <ContentWrap class="order-contract-work-list">
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
      highlight-current-row
      :selection="!isRecordMode"
      :show-overflow-tooltip="true"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @cell-click="handleCellClick"
      @selection-change="handleSelectionChange"
      @register="register"
    >
      <template #contractTotalAmount="{ row }">
        {{ formatAmount(row.contractTotalAmount) }}
      </template>
      <template #remainingAvailableAmount="{ row }">
        {{ formatAmount(row.remainingAvailableAmount) }}
      </template>
      <template #contractStatus="{ row }">
        <el-tag :type="row.contractStatus === '有效' ? 'success' : 'info'" effect="light">
          {{ row.contractStatus }}
        </el-tag>
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
    title="新增订单/合同信息修改"
    width="780px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-alert
      title="请选择一份当前有效的订单/合同，系统会自动带入合同基础信息并生成一条待提交的修改申请。"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="122px">
      <el-form-item label="当前有效合同" prop="contractId">
        <el-select
          v-model="createForm.contractId"
          class="w-full"
          filterable
          :loading="effectiveContractsLoading"
          placeholder="请选择当前有效的订单/合同"
          @change="handleEffectiveContractChange"
        >
          <el-option
            v-for="contract in effectiveContracts"
            :key="contract.id"
            :label="`${contract.contractNo} · ${contract.partyOne}`"
            :value="contract.id"
          >
            <div class="contract-select-option">
              <strong>{{ contract.contractNo }}</strong>
              <span
                >{{ contract.partyOne }} / {{ formatAmount(contract.contractTotalAmount) }}
                {{ contract.currency }}</span
              >
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="selectedEffectiveContract" class="create-contract-preview">
        <div
          ><span>签约方 1</span><strong>{{ selectedEffectiveContract.partyOne }}</strong></div
        >
        <div
          ><span>签约方 2</span><strong>{{ selectedEffectiveContract.partyTwo }}</strong></div
        >
        <div
          ><span>合同金额</span
          ><strong
            >{{ formatAmount(selectedEffectiveContract.contractTotalAmount) }}
            {{ selectedEffectiveContract.currency }}</strong
          ></div
        >
        <div
          ><span>合同有效期</span
          ><strong
            >{{ selectedEffectiveContract.contractStartDate }} 至
            {{ selectedEffectiveContract.contractEndDate }}</strong
          ></div
        >
      </div>
      <div v-if="selectedEffectiveContract" class="detail-form-grid">
        <el-form-item label="订单/合同编号" prop="orderContractNo">
          <el-input v-model.trim="createForm.orderContractNo" placeholder="请输入订单/合同编号" />
        </el-form-item>
        <el-form-item label="签约方 1" prop="partyOne">
          <el-input v-model.trim="createForm.partyOne" placeholder="请输入签约方 1" />
        </el-form-item>
        <el-form-item label="签约方 2" prop="partyTwo">
          <el-input v-model.trim="createForm.partyTwo" placeholder="请输入签约方 2" />
        </el-form-item>
        <el-form-item label="签约方 3" prop="partyThree">
          <el-input v-model.trim="createForm.partyThree" placeholder="请输入签约方 3（选填）" />
        </el-form-item>
        <el-form-item label="订单/合同总金额" prop="contractTotalAmount">
          <el-input-number
            v-model="createForm.contractTotalAmount"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-select v-model="createForm.currency" class="w-full" placeholder="请选择币种">
            <el-option label="人民币" value="人民币" />
            <el-option label="美元" value="美元" />
            <el-option label="欧元" value="欧元" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同起始日" prop="contractStartDate">
          <el-date-picker
            v-model="createForm.contractStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="合同到期日" prop="contractEndDate">
          <el-date-picker
            v-model="createForm.contractEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
      </div>
      <el-form-item label="申请说明" prop="remark">
        <el-input
          v-model="createForm.remark"
          type="textarea"
          :rows="3"
          maxlength="300"
          show-word-limit
          placeholder="请输入本次信息修改的原因或说明"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="detailVisible"
    :title="detailTitle"
    width="1180px"
    top="5vh"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template v-if="detailRecord">
      <el-alert
        v-if="isRecordMode"
        title="当前为已提交的修改记录，仅支持查看详情和签署意见。"
        type="info"
        :closable="false"
        class="mb-16px"
      />
      <el-tabs v-model="detailActiveTab" class="order-contract-detail-tabs">
        <el-tab-pane label="订单/合同信息" name="contract">
          <section class="detail-section">
            <div class="detail-section-title">订单/合同基础信息</div>
            <el-descriptions :column="3" border class="mb-16px">
              <el-descriptions-item label="申请流水号">{{
                detailRecord.applicationNo
              }}</el-descriptions-item>
              <el-descriptions-item label="订单/合同流水号">{{
                detailRecord.contractSerialNo || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="申请日期">{{
                detailRecord.applicationDate
              }}</el-descriptions-item>
              <el-descriptions-item label="数据来源">{{
                detailRecord.dataSource || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="客户名称">{{
                detailRecord.customerName || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="核心客户编号">{{
                detailRecord.coreCustomerNo || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="业务合同编号">{{
                detailRecord.businessContractNo || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="产品方案">{{
                detailRecord.productPlan || '-'
              }}</el-descriptions-item>
            </el-descriptions>

            <el-form
              ref="detailFormRef"
              :model="detailForm"
              :rules="detailRules"
              label-width="122px"
              :disabled="isRecordMode"
            >
              <div class="detail-form-grid">
                <el-form-item label="订单/合同编号" prop="contractNo">
                  <el-input
                    v-model.trim="detailForm.contractNo"
                    placeholder="请输入订单/合同编号"
                  />
                </el-form-item>
                <el-form-item label="订单/合同状态">
                  <el-input :model-value="detailForm.contractStatus" readonly />
                </el-form-item>
                <el-form-item label="签约方 1" prop="partyOne">
                  <el-input v-model.trim="detailForm.partyOne" placeholder="请输入签约方 1" />
                </el-form-item>
                <el-form-item label="签约方 2" prop="partyTwo">
                  <el-input v-model.trim="detailForm.partyTwo" placeholder="请输入签约方 2" />
                </el-form-item>
                <el-form-item label="签约方 3" prop="partyThree">
                  <el-input
                    v-model.trim="detailForm.partyThree"
                    placeholder="请输入签约方 3（选填）"
                  />
                </el-form-item>
                <el-form-item label="币种" prop="currency">
                  <el-select v-model="detailForm.currency" class="w-full" placeholder="请选择币种">
                    <el-option label="人民币" value="人民币" />
                    <el-option label="美元" value="美元" />
                    <el-option label="欧元" value="欧元" />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单/合同总金额" prop="contractTotalAmount">
                  <el-input-number
                    v-model="detailForm.contractTotalAmount"
                    class="w-full"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="请输入总金额"
                  />
                </el-form-item>
                <el-form-item label="本次使用金额" prop="currentUsageAmount">
                  <el-input-number
                    v-model="detailForm.currentUsageAmount"
                    class="w-full"
                    :min="0"
                    :max="detailForm.contractTotalAmount || undefined"
                    :precision="2"
                    :controls="false"
                    placeholder="请输入本次使用金额"
                  />
                </el-form-item>
                <el-form-item label="剩余可用金额">
                  <el-input
                    :model-value="formatAmount(detailRecord.remainingAvailableAmount)"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="合同起始日" prop="contractStartDate">
                  <el-date-picker
                    v-model="detailForm.contractStartDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    class="w-full"
                    placeholder="请选择合同起始日"
                  />
                </el-form-item>
                <el-form-item label="合同到期日" prop="contractEndDate">
                  <el-date-picker
                    v-model="detailForm.contractEndDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    class="w-full"
                    placeholder="请选择合同到期日"
                  />
                </el-form-item>
              </div>
            </el-form>
            <div v-if="!isRecordMode" class="detail-actions">
              <el-button type="primary" :loading="detailSaving" @click="handleSaveDetail">
                <Icon icon="ep:check" class="mr-4px" />保存合同信息
              </el-button>
              <el-button @click="detailActiveTab = 'items'">
                <Icon icon="ep:edit-pen" class="mr-4px" />修改合同项下信息
              </el-button>
              <el-button type="danger" plain :loading="invalidateLoading" @click="handleInvalidate">
                <Icon icon="ep:circle-close" class="mr-4px" />置为失效
              </el-button>
            </div>
            <p class="detail-note"
              >置为失效时，如合同项下关联了未结清业务，Mock 将提示不允许置为失效。</p
            >
          </section>
        </el-tab-pane>

        <el-tab-pane label="合同项下信息" name="items">
          <section class="detail-section">
            <div class="items-toolbar" v-if="!isRecordMode">
              <div>
                <el-button type="primary" @click="openItemEditor()">
                  <Icon icon="ep:plus" class="mr-4px" />新增
                </el-button>
                <el-button @click="handleMockUpload">
                  <Icon icon="ep:upload" class="mr-4px" />上传 Excel
                </el-button>
                <el-button @click="handleExportTemplate">
                  <Icon icon="ep:download" class="mr-4px" />导出模板
                </el-button>
              </div>
              <span>货物总金额：{{ formatAmount(itemTotalAmount) }} {{ detailForm.currency }}</span>
            </div>
            <el-table :data="detailRecord.contractItems || []" border max-height="380">
              <el-table-column type="index" label="序号" width="64" align="center" />
              <el-table-column prop="productCode" label="商品编号" min-width="135" />
              <el-table-column prop="productName" label="商品名称" min-width="145" />
              <el-table-column label="商品分类" min-width="205">
                <template #default="{ row }">
                  {{
                    [row.largeCategoryName, row.middleCategoryName, row.smallCategoryName]
                      .filter(Boolean)
                      .join(' / ') || '-'
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="batchNo" label="批号" min-width="115" />
              <el-table-column prop="cabinetNo" label="柜号" min-width="115" />
              <el-table-column prop="warehouseAddress" label="仓储地" min-width="150" />
              <el-table-column prop="quantity" label="数量/重量" min-width="110" align="right" />
              <el-table-column prop="unitPrice" label="单价" min-width="105" align="right">
                <template #default="{ row }">{{ formatAmount(row.unitPrice) }}</template>
              </el-table-column>
              <el-table-column label="总金额" min-width="115" align="right">
                <template #default="{ row }">{{ formatAmount(row.totalAmount) }}</template>
              </el-table-column>
              <el-table-column v-if="!isRecordMode" label="操作" fixed="right" width="142">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openItemEditor(row)">编辑</el-button>
                  <el-button link type="danger" @click="handleDeleteItem(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-empty
              v-if="!(detailRecord.contractItems || []).length"
              description="暂无合同项下货物信息"
            />
          </section>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #footer>
      <el-button @click="detailVisible = false">关 闭</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="itemEditorVisible"
    :title="itemEditorTitle"
    width="920px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="106px">
      <div class="detail-form-grid">
        <el-form-item label="商品编号">
          <el-input :model-value="itemForm.productCode || '保存后自动生成'" readonly />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model.trim="itemForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品大类" prop="largeCategoryName">
          <el-select
            v-model="itemForm.largeCategoryName"
            class="w-full"
            placeholder="请选择商品大类"
            @change="handleLargeCategoryChange"
          >
            <el-option
              v-for="category in categoryOptions"
              :key="category.name"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品中类" prop="middleCategoryName">
          <el-select
            v-model="itemForm.middleCategoryName"
            class="w-full"
            placeholder="请选择商品中类"
            @change="handleMiddleCategoryChange"
          >
            <el-option
              v-for="category in middleCategoryOptions"
              :key="category.name"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类" prop="smallCategoryName">
          <el-select
            v-model="itemForm.smallCategoryName"
            class="w-full"
            placeholder="请选择商品小类"
          >
            <el-option
              v-for="category in smallCategoryOptions"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="批号" prop="batchNo">
          <el-input v-model.trim="itemForm.batchNo" placeholder="请输入批号" />
        </el-form-item>
        <el-form-item label="柜号" prop="cabinetNo">
          <el-input v-model.trim="itemForm.cabinetNo" placeholder="请输入柜号" />
        </el-form-item>
        <el-form-item label="指导价" prop="guidancePrice">
          <el-input-number
            v-model="itemForm.guidancePrice"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="产地" prop="origin">
          <el-select v-model="itemForm.origin" class="w-full" filterable placeholder="请选择产地">
            <el-option label="中国·江苏省·苏州市" value="中国·江苏省·苏州市" />
            <el-option label="中国·上海市" value="中国·上海市" />
            <el-option label="中国·河北省·唐山市" value="中国·河北省·唐山市" />
            <el-option label="澳大利亚·西澳州" value="澳大利亚·西澳州" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓储地" prop="warehouseAddress">
          <el-select
            v-model="itemForm.warehouseAddress"
            class="w-full"
            placeholder="请选择有效仓库"
          >
            <el-option
              v-for="warehouse in warehouseOptions"
              :key="warehouse"
              :label="warehouse"
              :value="warehouse"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model.trim="itemForm.specification" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="数量/重量" prop="quantity">
          <el-input-number
            v-model="itemForm.quantity"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input-number
            v-model="itemForm.unitPrice"
            class="w-full"
            :min="0"
            :precision="2"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="总金额">
          <el-input :model-value="formatAmount(itemFormTotalAmount)" readonly />
        </el-form-item>
        <el-form-item label="币种">
          <el-input model-value="人民币" readonly />
        </el-form-item>
        <el-form-item label="货物起始日" prop="goodsStartDate">
          <el-date-picker
            v-model="itemForm.goodsStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="货物到期日" prop="goodsEndDate">
          <el-date-picker
            v-model="itemForm.goodsEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="货物所有权" prop="owner">
          <el-select v-model="itemForm.owner" class="w-full" placeholder="请选择货物所有权">
            <el-option label="核心企业" value="核心企业" />
            <el-option label="借款人自己" value="借款人自己" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="itemEditorVisible = false">取 消</el-button>
      <el-button type="primary" :loading="itemSaving" @click="handleSaveItem">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="signOpinionVisible" title="签署意见" width="600px" destroy-on-close>
    <el-form label-width="104px">
      <el-form-item label="当前申请">
        <el-input :model-value="currentRecord?.applicationNo || ''" readonly />
      </el-form-item>
      <el-form-item label="意见内容" required>
        <el-input
          v-model="signOpinionContent"
          type="textarea"
          :rows="5"
          maxlength="500"
          show-word-limit
          placeholder="请输入签署意见"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="signOpinionVisible = false">取 消</el-button>
      <el-button type="primary" :loading="signOpinionLoading" @click="handleSignOpinion"
        >确 定</el-button
      >
    </template>
  </el-dialog>

  <el-dialog
    v-model="batchSubmitVisible"
    title="批量提交订单/合同信息修改"
    width="620px"
    destroy-on-close
  >
    <el-alert
      :title="`已选择 ${selectedRecords.length} 条待提交申请，将为所选申请统一签署意见后提交。`"
      type="warning"
      :closable="false"
      class="mb-16px"
    />
    <el-form label-width="104px">
      <el-form-item label="签署意见" required>
        <el-input
          v-model="batchSubmitOpinion"
          type="textarea"
          :rows="5"
          maxlength="500"
          show-word-limit
          placeholder="请输入统一签署意见"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="batchSubmitVisible = false">取 消</el-button>
      <el-button type="primary" :loading="batchSubmitting" @click="handleBatchSubmit"
        >确认提交</el-button
      >
    </template>
  </el-dialog>

  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="order-contract-timeline">
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

  <el-dialog v-model="imageVisible" title="订单/合同影像" width="740px" destroy-on-close>
    <el-alert
      :title="`订单/合同编号：${imageRecord?.contractNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div v-for="image in imageItems" :key="image.name" class="image-file-card">
        <Icon :icon="image.icon" class="image-file-icon" />
        <div>
          <strong>{{ image.name }}</strong>
          <p>{{ image.description }}</p>
        </div>
        <el-button
          link
          type="primary"
          @click="ElMessage.info('当前为 Mock 演示影像，可在此接入实际影像系统')"
          >预览</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as OrderContractModificationApi from '@/api/indebt/orderContractModification'

defineOptions({ name: 'OrderContractModificationWorkList' })

type WorkMode = 'application' | 'record'
type ContractStatus = '有效' | '失效'

interface ContractOpinion {
  id: number | string
  content: string
  signer: string
  signedAt: string
}

interface ContractItem {
  id?: number | string
  productCode: string
  productName: string
  largeCategoryName: string
  middleCategoryName: string
  smallCategoryName: string
  batchNo: string
  cabinetNo: string
  guidancePrice: number
  origin: string
  warehouseAddress: string
  specification: string
  quantity: number
  unitPrice: number
  totalAmount: number
  goodsStartDate: string
  goodsEndDate: string
  owner: string
}

interface OrderContractRecord {
  id: number | string
  applicationNo: string
  contractSerialNo?: string
  contractNo: string
  partyOne: string
  partyTwo: string
  partyThree?: string
  contractTotalAmount: number
  remainingAvailableAmount: number
  currency: string
  contractStartDate: string
  contractEndDate: string
  applicationDate: string
  contractStatus: ContractStatus
  modifier?: string
  modifiedAt?: string
  currentUsageAmount?: number
  dataSource?: string
  customerName?: string
  coreCustomerNo?: string
  businessContractNo?: string
  productPlan?: string
  remark?: string
  opinions?: ContractOpinion[]
  contractItems?: ContractItem[]
}

interface OrderContractPageResult {
  total: number
  list: OrderContractRecord[]
  records?: OrderContractRecord[]
  pageNo?: number
  pageSize?: number
}

interface EffectiveContract extends OrderContractRecord {
  id: number | string
}

interface CreateForm {
  contractId: number | string | ''
  orderContractNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  currency: string
  contractStartDate: string
  contractEndDate: string
  remark: string
}

interface DetailForm {
  contractNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  currentUsageAmount: number
  remainingAvailableAmount: number
  currency: string
  contractStartDate: string
  contractEndDate: string
  contractStatus: ContractStatus
}

interface CategoryOption {
  name: string
  children: {
    name: string
    children: string[]
  }[]
}

const props = defineProps<{
  params?: {
    mode?: WorkMode
  }
}>()

const validModes: WorkMode[] = ['application', 'record']
const isWorkMode = (value: unknown): value is WorkMode => validModes.includes(value as WorkMode)
const currentMode = computed<WorkMode>(() =>
  isWorkMode(props.params?.mode) ? props.params.mode : 'application'
)
const isRecordMode = computed(() => currentMode.value === 'record')

/**
 * 页面与 Mock API 分开演进。通过函数名调用可以让接口层集中维护请求封装，
 * 同时保留清晰的界面类型约束。
 */
type ApiFunction = (...args: any[]) => Promise<any>
const api = OrderContractModificationApi as unknown as Record<string, ApiFunction>
const callApi = async <T,>(name: string, ...args: any[]): Promise<T> => {
  const fn = api[name]
  if (typeof fn !== 'function') {
    throw new Error(`订单/合同信息修改 Mock 未提供 ${name} 接口`)
  }
  return fn(...args) as Promise<T>
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '申请流水号',
    field: 'applicationNo',
    fixed: 'left',
    minWidth: 180,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入订单/合同流水号' } }
  },
  {
    label: '订单/合同编号',
    field: 'contractNo',
    minWidth: 180,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入订单/合同编号' } }
  },
  { label: '签约方 1', field: 'partyOne', minWidth: 180 },
  { label: '签约方 2', field: 'partyTwo', minWidth: 180 },
  { label: '签约方 3', field: 'partyThree', minWidth: 160 },
  { label: '订单/合同总金额', field: 'contractTotalAmount', minWidth: 165 },
  { label: '剩余可用金额', field: 'remainingAvailableAmount', minWidth: 150 },
  { label: '币种', field: 'currency', minWidth: 100 },
  { label: '合同起始日', field: 'contractStartDate', minWidth: 130 },
  { label: '合同到期日', field: 'contractEndDate', minWidth: 130 },
  { label: '订单/合同状态', field: 'contractStatus', minWidth: 125 },
  { label: '申请日期', field: 'applicationDate', minWidth: 130 },
  { label: '修改人', field: 'modifier', minWidth: 120 },
  { label: '修改时间', field: 'modifiedAt', minWidth: 170 },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  isRecordMode.value
    ? allSchemas.tableColumns
    : allSchemas.tableColumns.filter(
        (column) => column.field !== 'modifier' && column.field !== 'modifiedAt'
      )
)

const getCurrentPage = async (params: Recordable): Promise<OrderContractPageResult> => {
  const { applicationNo, contractNo, ...restParams } = params
  const result = await callApi<OrderContractPageResult>(
    isRecordMode.value
      ? 'getOrderContractModificationRecordPage'
      : 'getOrderContractModificationPage',
    {
      ...restParams,
      applicationFlowNo: applicationNo,
      orderContractNo: contractNo,
      mode: currentMode.value
    }
  )
  const list = Array.isArray(result?.list) ? result.list.map(normalizeOrderContractRecord) : []
  return { ...result, list, records: list }
}

const { register, tableObject, tableMethods } = useTable<OrderContractRecord>({
  getListApi: getCurrentPage,
  defaultParams: { mode: currentMode.value }
})
const { getList, setSearchParams } = tableMethods

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const effectiveContractsLoading = ref(false)
const effectiveContracts = ref<EffectiveContract[]>([])
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailSaving = ref(false)
const invalidateLoading = ref(false)
const detailFormRef = ref<FormInstance>()
const detailActiveTab = ref<'contract' | 'items'>('contract')
const detailRecord = ref<OrderContractRecord>()
const itemEditorVisible = ref(false)
const itemSaving = ref(false)
const itemFormRef = ref<FormInstance>()
const editingItemIndex = ref<number | undefined>()
const signOpinionVisible = ref(false)
const signOpinionContent = ref('')
const signOpinionLoading = ref(false)
const opinionVisible = ref(false)
const opinionRecord = ref<OrderContractRecord>()
const imageVisible = ref(false)
const imageRecord = ref<OrderContractRecord>()
const actionLoading = ref<'submit' | 'delete' | ''>('')
const selectedRecords = ref<OrderContractRecord[]>([])
const batchSubmitVisible = ref(false)
const batchSubmitting = ref(false)
const batchSubmitOpinion = ref('')

const initialCreateForm = (): CreateForm => ({
  contractId: '',
  orderContractNo: '',
  partyOne: '',
  partyTwo: '',
  partyThree: '',
  contractTotalAmount: 0,
  currency: '人民币',
  contractStartDate: '',
  contractEndDate: '',
  remark: ''
})
const createForm = reactive<CreateForm>(initialCreateForm())
const createRules: FormRules<CreateForm> = {
  contractId: [{ required: true, message: '请选择当前有效的订单/合同', trigger: 'change' }],
  orderContractNo: [{ required: true, message: '请输入订单/合同编号', trigger: 'blur' }],
  partyOne: [{ required: true, message: '请输入签约方 1', trigger: 'blur' }],
  partyTwo: [{ required: true, message: '请输入签约方 2', trigger: 'blur' }],
  contractTotalAmount: [{ required: true, message: '请输入订单/合同总金额', trigger: 'blur' }],
  currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
  contractStartDate: [{ required: true, message: '请选择合同起始日', trigger: 'change' }],
  contractEndDate: [{ required: true, message: '请选择合同到期日', trigger: 'change' }]
}

const initialDetailForm = (): DetailForm => ({
  contractNo: '',
  partyOne: '',
  partyTwo: '',
  partyThree: '',
  contractTotalAmount: 0,
  currentUsageAmount: 0,
  remainingAvailableAmount: 0,
  currency: '人民币',
  contractStartDate: '',
  contractEndDate: '',
  contractStatus: '有效'
})
const detailForm = reactive<DetailForm>(initialDetailForm())
const detailRules: FormRules<DetailForm> = {
  contractNo: [{ required: true, message: '请输入订单/合同编号', trigger: 'blur' }],
  partyOne: [{ required: true, message: '请输入签约方 1', trigger: 'blur' }],
  partyTwo: [{ required: true, message: '请输入签约方 2', trigger: 'blur' }],
  currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
  contractTotalAmount: [{ required: true, message: '请输入订单/合同总金额', trigger: 'blur' }],
  currentUsageAmount: [{ required: true, message: '请输入本次使用金额', trigger: 'blur' }],
  contractStartDate: [{ required: true, message: '请选择合同起始日', trigger: 'change' }],
  contractEndDate: [{ required: true, message: '请选择合同到期日', trigger: 'change' }]
}

const initialItemForm = (): ContractItem => ({
  productCode: '',
  productName: '',
  largeCategoryName: '',
  middleCategoryName: '',
  smallCategoryName: '',
  batchNo: '',
  cabinetNo: '',
  guidancePrice: 0,
  origin: '',
  warehouseAddress: '',
  specification: '',
  quantity: 0,
  unitPrice: 0,
  totalAmount: 0,
  goodsStartDate: '',
  goodsEndDate: '',
  owner: '核心企业'
})
const itemForm = reactive<ContractItem>(initialItemForm())
const itemRules: FormRules<ContractItem> = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  largeCategoryName: [{ required: true, message: '请选择商品大类', trigger: 'change' }],
  middleCategoryName: [{ required: true, message: '请选择商品中类', trigger: 'change' }],
  smallCategoryName: [{ required: true, message: '请选择商品小类', trigger: 'change' }],
  batchNo: [{ required: true, message: '请输入批号', trigger: 'blur' }],
  warehouseAddress: [{ required: true, message: '请选择仓储地', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量或重量', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  owner: [{ required: true, message: '请选择货物所有权', trigger: 'change' }]
}

const categoryOptions: CategoryOption[] = [
  {
    name: '金属及矿产品',
    children: [
      { name: '黑色金属', children: ['热轧卷板', '冷轧卷板', '螺纹钢'] },
      { name: '有色金属', children: ['电解铜', '铝锭', '锌锭'] }
    ]
  },
  {
    name: '化工原料',
    children: [
      { name: '基础化工', children: ['聚乙烯', '聚丙烯', '聚氯乙烯'] },
      { name: '塑料粒子', children: ['PP 粒子', 'PE 粒子', 'ABS 粒子'] },
      { name: '橡胶', children: ['天然橡胶', '丁苯橡胶'] }
    ]
  },
  {
    name: '农产品',
    children: [
      { name: '粮食', children: ['玉米', '小麦', '大豆', '稻谷'] },
      { name: '油脂油料', children: ['豆油', '菜籽油'] }
    ]
  },
  {
    name: '能源产品',
    children: [{ name: '煤炭', children: ['动力煤', '焦煤'] }]
  },
  {
    name: '消费品',
    children: [{ name: '家用电器', children: ['冰箱', '洗衣机'] }]
  }
]
const warehouseOptions = ['南京滨江钢材仓', '上海临港有色仓', '天津东丽综合仓', '唐山港煤炭监管仓']

const selectedEffectiveContract = computed(() =>
  effectiveContracts.value.find((contract) => String(contract.id) === String(createForm.contractId))
)
const currentRecord = computed(() => tableObject.currentRow || undefined)
const detailTitle = computed(() =>
  isRecordMode.value ? '订单/合同信息修改记录详情' : '订单/合同信息修改详情'
)
const itemEditorTitle = computed(() =>
  editingItemIndex.value === undefined ? '新增合同项下信息' : '编辑合同项下信息'
)
const itemFormTotalAmount = computed(() => roundAmount(itemForm.quantity * itemForm.unitPrice))
const itemTotalAmount = computed(() =>
  (detailRecord.value?.contractItems || []).reduce(
    (total, item) => total + Number(item.totalAmount || 0),
    0
  )
)
const middleCategoryOptions = computed(
  () =>
    categoryOptions.find((category) => category.name === itemForm.largeCategoryName)?.children || []
)
const smallCategoryOptions = computed(
  () =>
    middleCategoryOptions.value.find((category) => category.name === itemForm.middleCategoryName)
      ?.children || []
)
const imageItems = computed(() => [
  {
    name: '订单/合同文本',
    description: imageRecord.value?.contractNo || '订单/合同扫描件',
    icon: 'ep:document'
  },
  {
    name: '签约方授权材料',
    description: imageRecord.value?.partyOne || '签约方主体资料',
    icon: 'ep:files'
  },
  {
    name: '货物明细附件',
    description: `合同项下 ${(imageRecord.value?.contractItems || []).length} 条货物信息`,
    icon: 'ep:picture'
  }
])

const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const roundAmount = (value: number) => Math.round((Number(value) || 0) * 100) / 100

const toText = (value: unknown) => (value === undefined || value === null ? '' : String(value))
const toNumber = (value: unknown) => {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

/** 将 Mock/API 的领域字段适配为页面展示字段，避免 UI 直接依赖后端命名细节。 */
const normalizeContractItem = (value: unknown): ContractItem => {
  const item = (value || {}) as Record<string, unknown>
  return {
    id: item.id as number | string | undefined,
    productCode: toText(item.productCode),
    productName: toText(item.productName),
    largeCategoryName: toText(item.largeCategoryName || item.largeCategory),
    middleCategoryName: toText(item.middleCategoryName || item.middleCategory),
    smallCategoryName: toText(item.smallCategoryName || item.smallCategory),
    batchNo: toText(item.batchNo),
    cabinetNo: toText(item.cabinetNo),
    guidancePrice: toNumber(item.guidancePrice || item.unitPrice),
    origin: toText(item.origin),
    warehouseAddress: toText(item.warehouseAddress || item.warehouseName),
    specification: toText(item.specification),
    quantity: toNumber(item.quantity ?? item.quantityOrWeight),
    unitPrice: toNumber(item.unitPrice),
    totalAmount: toNumber(item.totalAmount),
    goodsStartDate: toText(item.goodsStartDate || item.cargoStartDate),
    goodsEndDate: toText(item.goodsEndDate || item.cargoEndDate),
    owner:
      toText(item.owner || item.cargoOwner) === '借款人本人'
        ? '借款人自己'
        : toText(item.owner || item.cargoOwner || '核心企业')
  }
}

const normalizeOrderContractRecord = (value: unknown): OrderContractRecord => {
  const record = (value || {}) as Record<string, unknown>
  const rawItems = Array.isArray(record.contractItems)
    ? record.contractItems
    : Array.isArray(record.items)
      ? record.items
      : []
  const rawOpinions = Array.isArray(record.opinions) ? record.opinions : []
  return {
    id: (record.id ?? 0) as number | string,
    applicationNo: toText(record.applicationNo || record.applicationFlowNo),
    contractSerialNo: toText(record.contractSerialNo || record.applicationFlowNo),
    contractNo: toText(record.contractNo || record.orderContractNo),
    partyOne: toText(record.partyOne),
    partyTwo: toText(record.partyTwo),
    partyThree: toText(record.partyThree),
    contractTotalAmount: toNumber(record.contractTotalAmount),
    remainingAvailableAmount: toNumber(record.remainingAvailableAmount),
    currency: toText(record.currency || '人民币'),
    contractStartDate: toText(record.contractStartDate),
    contractEndDate: toText(record.contractEndDate),
    applicationDate: toText(record.applicationDate),
    contractStatus: record.contractStatus === '失效' ? '失效' : '有效',
    modifier: toText(record.modifier),
    modifiedAt: toText(record.modifiedAt),
    currentUsageAmount: toNumber(record.currentUsageAmount ?? record.currentUsedAmount),
    dataSource: toText(record.dataSource),
    customerName: toText(record.customerName),
    coreCustomerNo: toText(record.coreCustomerNo),
    businessContractNo: toText(record.businessContractNo),
    productPlan: toText(record.productPlan || record.productScheme),
    remark: toText(record.remark),
    opinions: rawOpinions as ContractOpinion[],
    contractItems: rawItems.map(normalizeContractItem)
  }
}

const toOrderContractItemPayload = (item: ContractItem) => ({
  productName: item.productName,
  largeCategory: item.largeCategoryName,
  middleCategory: item.middleCategoryName,
  smallCategory: item.smallCategoryName,
  batchNo: item.batchNo,
  cabinetNo: item.cabinetNo,
  specification: item.specification,
  origin: item.origin,
  warehouseName: item.warehouseAddress,
  quantityOrWeight: item.quantity,
  unitPrice: item.unitPrice,
  currency: detailForm.currency,
  cargoStartDate: item.goodsStartDate,
  cargoEndDate: item.goodsEndDate,
  cargoOwner: item.owner === '借款人自己' ? '借款人本人' : '核心企业'
})

const isFailedResult = (result: unknown): result is { success: false; message?: string } =>
  typeof result === 'object' && result !== null && 'success' in result && result.success === false

const resultRecord = (result: unknown): OrderContractRecord | undefined => {
  if (!result || typeof result !== 'object') return undefined
  if ('record' in result && (result as { record?: OrderContractRecord }).record) {
    return normalizeOrderContractRecord((result as { record: OrderContractRecord }).record)
  }
  return 'id' in result ? normalizeOrderContractRecord(result) : undefined
}

const setCurrentRecord = (record: OrderContractRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: OrderContractRecord) => {
  setCurrentRecord(record)
}

const handleSelectionChange = (records: OrderContractRecord[]) => {
  selectedRecords.value = records
}

const requireCurrentRecord = (): OrderContractRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条订单/合同信息')
    return undefined
  }
  return currentRecord.value
}

const refreshList = async () => {
  tableObject.currentRow = null
  await getList()
}

const handleSearch = (params: Recordable) => {
  tableObject.currentRow = null
  setSearchParams({ ...params, mode: currentMode.value })
}

const loadEffectiveContracts = async () => {
  effectiveContractsLoading.value = true
  try {
    const result = await callApi<EffectiveContract[]>('getEffectiveOrderContracts')
    effectiveContracts.value = Array.isArray(result) ? result.map(normalizeOrderContractRecord) : []
  } catch (error) {
    effectiveContracts.value = []
    ElMessage.error(error instanceof Error ? error.message : '获取有效订单/合同失败')
  } finally {
    effectiveContractsLoading.value = false
  }
}

const openCreate = async () => {
  Object.assign(createForm, initialCreateForm())
  createFormRef.value?.clearValidate()
  createVisible.value = true
  await loadEffectiveContracts()
}

const handleEffectiveContractChange = () => {
  const selectedContract = selectedEffectiveContract.value
  if (!selectedContract) {
    ElMessage.warning('未找到所选的有效订单/合同，请重新选择')
    return
  }
  Object.assign(createForm, {
    orderContractNo: selectedContract.contractNo,
    partyOne: selectedContract.partyOne,
    partyTwo: selectedContract.partyTwo,
    partyThree: selectedContract.partyThree || '',
    contractTotalAmount: selectedContract.contractTotalAmount,
    currency: selectedContract.currency,
    contractStartDate: selectedContract.contractStartDate,
    contractEndDate: selectedContract.contractEndDate
  })
}

const handleCreate = async () => {
  const valid = await createFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const result = await callApi<unknown>('createOrderContractModification', {
      sourceContractId: createForm.contractId,
      orderContractNo: createForm.orderContractNo,
      partyOne: createForm.partyOne,
      partyTwo: createForm.partyTwo,
      partyThree: createForm.partyThree,
      contractTotalAmount: createForm.contractTotalAmount,
      currency: createForm.currency,
      contractStartDate: createForm.contractStartDate,
      contractEndDate: createForm.contractEndDate
    })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '新增订单/合同信息修改失败')
      return
    }
    ElMessage.success('新增成功，修改申请已进入“订单/合同信息修改”节点')
    createVisible.value = false
    if (!isRecordMode.value) await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增订单/合同信息修改失败')
  } finally {
    createLoading.value = false
  }
}

const applyDetailRecord = (record: OrderContractRecord) => {
  record = normalizeOrderContractRecord(record)
  const normalizedRecord: OrderContractRecord = {
    ...record,
    contractItems: Array.isArray(record.contractItems) ? record.contractItems : []
  }
  detailRecord.value = normalizedRecord
  Object.assign(detailForm, {
    contractNo: normalizedRecord.contractNo || '',
    partyOne: normalizedRecord.partyOne || '',
    partyTwo: normalizedRecord.partyTwo || '',
    partyThree: normalizedRecord.partyThree || '',
    contractTotalAmount: Number(normalizedRecord.contractTotalAmount || 0),
    currentUsageAmount: Number(normalizedRecord.currentUsageAmount || 0),
    remainingAvailableAmount: Number(normalizedRecord.remainingAvailableAmount || 0),
    currency: normalizedRecord.currency || '人民币',
    contractStartDate: normalizedRecord.contractStartDate || '',
    contractEndDate: normalizedRecord.contractEndDate || '',
    contractStatus: normalizedRecord.contractStatus || '有效'
  })
}

const getDetail = async (record: OrderContractRecord) => {
  const result = await callApi<unknown>(
    'getOrderContractModificationDetail',
    record.id,
    isRecordMode.value ? 'records' : 'active'
  )
  if (isFailedResult(result)) {
    ElMessage.error(result.message || '未获取到订单/合同详情')
    return undefined
  }
  return resultRecord(result)
}

const openDetail = async () => {
  const record = requireCurrentRecord()
  if (!record) return

  detailLoading.value = true
  try {
    const detail = await getDetail(record)
    if (!detail) return
    applyDetailRecord(detail)
    detailActiveTab.value = 'contract'
    detailVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取订单/合同详情失败')
  } finally {
    detailLoading.value = false
  }
}

const handleSaveDetail = async () => {
  if (!detailRecord.value) return
  const valid = await detailFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return
  if (detailForm.currentUsageAmount > detailForm.contractTotalAmount) {
    ElMessage.warning('本次使用金额不能大于订单/合同总金额')
    return
  }

  detailSaving.value = true
  try {
    const result = await callApi<unknown>(
      'updateOrderContractModification',
      detailRecord.value.id,
      {
        orderContractNo: detailForm.contractNo,
        partyOne: detailForm.partyOne,
        partyTwo: detailForm.partyTwo,
        partyThree: detailForm.partyThree,
        contractTotalAmount: detailForm.contractTotalAmount,
        currentUsedAmount: detailForm.currentUsageAmount,
        currency: detailForm.currency,
        contractStartDate: detailForm.contractStartDate,
        contractEndDate: detailForm.contractEndDate,
        contractStatus: detailForm.contractStatus
      }
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '保存订单/合同信息失败')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) applyDetailRecord(savedRecord)
    else Object.assign(detailRecord.value, detailForm)
    ElMessage.success('订单/合同信息已保存')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存订单/合同信息失败')
  } finally {
    detailSaving.value = false
  }
}

const handleInvalidate = async () => {
  if (!detailRecord.value) return
  try {
    await ElMessageBox.confirm(
      `确认将订单/合同“${detailRecord.value.contractNo}”置为失效吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  invalidateLoading.value = true
  try {
    const result = await callApi<unknown>(
      'invalidateOrderContractModification',
      detailRecord.value.id
    )
    if (isFailedResult(result)) {
      ElMessage.warning(result.message || '当前订单/合同不允许置为失效')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) applyDetailRecord(savedRecord)
    else if (detailRecord.value) {
      detailRecord.value.contractStatus = '失效'
      detailForm.contractStatus = '失效'
    }
    ElMessage.success('订单/合同已置为失效')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '置为失效失败')
  } finally {
    invalidateLoading.value = false
  }
}

const openItemEditor = (item?: ContractItem) => {
  const items = detailRecord.value?.contractItems || []
  editingItemIndex.value = item ? items.indexOf(item) : undefined
  Object.assign(itemForm, initialItemForm(), item || {})
  itemForm.totalAmount = Number(item?.totalAmount || 0)
  itemFormRef.value?.clearValidate()
  itemEditorVisible.value = true
}

const handleLargeCategoryChange = () => {
  itemForm.middleCategoryName = ''
  itemForm.smallCategoryName = ''
}

const handleMiddleCategoryChange = () => {
  itemForm.smallCategoryName = ''
}

const buildProductCode = (item: ContractItem, index: number) => {
  if (item.productCode) return item.productCode
  const category = `${item.largeCategoryName}${item.middleCategoryName}${item.smallCategoryName}`
  const initials = category
    .split('')
    .filter((character) => /[A-Za-z0-9]/.test(character))
    .join('')
    .slice(0, 8)
    .toUpperCase()
  return `SP-${initials || 'MOCK'}-${String(index + 1).padStart(3, '0')}`
}

const handleSaveItem = async () => {
  if (!detailRecord.value) return
  const valid = await itemFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return

  const existingItems = [...(detailRecord.value.contractItems || [])]
  const itemIndex = editingItemIndex.value
  const savedItem: ContractItem = {
    ...itemForm,
    id: itemForm.id || `item-${Date.now()}`,
    productCode: buildProductCode(itemForm, itemIndex ?? existingItems.length),
    totalAmount: itemFormTotalAmount.value
  }
  const nextItems =
    itemIndex === undefined || itemIndex < 0
      ? [...existingItems, savedItem]
      : existingItems.map((item, index) => (index === itemIndex ? savedItem : item))

  itemSaving.value = true
  try {
    const result = await callApi<unknown>(
      'updateOrderContractModificationItems',
      detailRecord.value.id,
      nextItems.map(toOrderContractItemPayload)
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '保存合同项下信息失败')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) applyDetailRecord(savedRecord)
    else detailRecord.value.contractItems = nextItems
    itemEditorVisible.value = false
    ElMessage.success('合同项下信息已保存')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存合同项下信息失败')
  } finally {
    itemSaving.value = false
  }
}

const handleDeleteItem = async (item: ContractItem) => {
  if (!detailRecord.value) return
  try {
    await ElMessageBox.confirm(`确认删除商品“${item.productName}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    if (!item.id) {
      ElMessage.warning('当前货物信息缺少主键，无法删除')
      return
    }
    const result = await callApi<unknown>('deleteOrderContractItem', detailRecord.value.id, item.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '删除合同项下信息失败')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) applyDetailRecord(savedRecord)
    else {
      detailRecord.value.contractItems = (detailRecord.value.contractItems || []).filter(
        (currentItem) => currentItem !== item
      )
    }
    ElMessage.success('合同项下信息已删除')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '删除合同项下信息失败')
  }
}

const handleMockUpload = () => {
  ElMessage.success('已模拟上传 Excel，当前可在表格中继续补充或编辑货物信息')
}

const handleExportTemplate = () => {
  ElMessage.info('已模拟导出“订单合同项下货物导入模板.xlsx”')
}

const openSignOpinion = () => {
  const record = requireCurrentRecord()
  if (!record) return
  signOpinionContent.value = ''
  signOpinionVisible.value = true
}

const handleSignOpinion = async () => {
  const record = requireCurrentRecord()
  const content = signOpinionContent.value.trim()
  if (!record || !content) {
    if (!content) ElMessage.warning('请输入签署意见')
    return
  }

  signOpinionLoading.value = true
  try {
    const result = await callApi<unknown>(
      'signOrderContractModificationOpinion',
      record.id,
      content
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    signOpinionVisible.value = false
    ElMessage.success('意见已签署')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '签署意见失败')
  } finally {
    signOpinionLoading.value = false
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
    ElMessage.error(error instanceof Error ? error.message : '获取签署意见失败')
  }
}

const handleTransition = async (type: 'submit' | 'delete') => {
  const record = requireCurrentRecord()
  if (!record) return
  const isSubmit = type === 'submit'
  const label = isSubmit ? '提交' : '删除'
  try {
    await ElMessageBox.confirm(
      `确认${label}订单/合同信息修改申请“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = type
  try {
    const result = await callApi<unknown>(
      isSubmit ? 'submitOrderContractModification' : 'deleteOrderContractModification',
      record.id
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || `${label}失败`)
      return
    }
    ElMessage.success(`${label}成功`)
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : `${label}失败`)
  } finally {
    actionLoading.value = ''
  }
}

const openBatchSubmit = () => {
  if (!selectedRecords.value.length) {
    ElMessage.warning('请先勾选需要提交的订单/合同信息修改申请')
    return
  }
  batchSubmitOpinion.value = ''
  batchSubmitVisible.value = true
}

const handleBatchSubmit = async () => {
  const opinion = batchSubmitOpinion.value.trim()
  if (!opinion) {
    ElMessage.warning('请输入统一签署意见')
    return
  }

  const ids = selectedRecords.value
    .map((record) => Number(record.id))
    .filter((id) => Number.isFinite(id))
  if (!ids.length) {
    ElMessage.warning('未找到可提交的订单/合同信息修改申请')
    return
  }

  batchSubmitting.value = true
  try {
    const result = await callApi<{
      success?: boolean
      submitted?: number
      failedIds?: number[]
      message?: string
    }>('batchSubmitOrderContractModifications', ids, opinion)
    if (result.success === false && !result.submitted) {
      ElMessage.error(result.message || '批量提交失败')
      return
    }
    if (result.failedIds?.length) {
      ElMessage.warning(
        result.message || `已提交 ${result.submitted || 0} 条申请，部分申请提交失败`
      )
    } else {
      ElMessage.success(
        result.message || `已提交 ${result.submitted || ids.length} 条订单/合同信息修改申请`
      )
    }
    batchSubmitVisible.value = false
    selectedRecords.value = []
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '批量提交失败')
  } finally {
    batchSubmitting.value = false
  }
}

const openImage = (record: OrderContractRecord) => {
  setCurrentRecord(record)
  imageRecord.value = record
  imageVisible.value = true
}

const visibleButtons = computed<ActionButton[]>(() => {
  const detailButton: ActionButton = {
    key: 'detail',
    label: '详情',
    icon: 'ep:document',
    plain: true,
    onClick: openDetail
  }
  if (isRecordMode.value) {
    return [
      detailButton,
      {
        key: 'view-opinion',
        label: '查看意见',
        icon: 'ep:chat-line-square',
        plain: true,
        onClick: openOpinion
      }
    ]
  }

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
      onClick: openSignOpinion
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
      disabled: !selectedRecords.value.length,
      onClick: openBatchSubmit
    },
    {
      key: 'delete',
      label: '删除',
      icon: 'ep:delete',
      plain: true,
      type: 'danger',
      loading: actionLoading.value === 'delete',
      onClick: () => handleTransition('delete')
    }
  ]
})

watch(
  currentMode,
  (mode) => {
    tableObject.currentRow = null
    selectedRecords.value = []
    tableObject.currentPage = 1
    setSearchParams({ ...tableObject.params, mode })
  },
  { immediate: true }
)

onActivated(() => {
  getList()
})
</script>

<style scoped lang="scss">
.order-contract-work-list {
  min-width: 0;
}

.contract-select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  strong {
    color: #26384f;
    font-weight: 600;
  }

  span {
    color: #8492a6;
    font-size: 13px;
  }
}

.create-contract-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0 0 18px;
  overflow: hidden;
  border: 1px solid #e3e9f2;
  border-radius: 6px;
  background: #e3e9f2;

  div {
    display: flex;
    min-height: 42px;
    padding: 10px 14px;
    background: #fafcff;
  }

  span {
    flex: 0 0 88px;
    color: #8492a6;
  }

  strong {
    color: #34495e;
    font-weight: 500;
  }
}

.detail-section-title {
  margin: 0 0 14px;
  padding-left: 10px;
  border-left: 3px solid #3d7ad6;
  color: #26384f;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
}

.detail-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.detail-actions,
.items-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.items-toolbar {
  margin: 0 0 14px;

  span {
    color: #576b84;
    font-size: 13px;
  }
}

.detail-note {
  margin: 14px 0 0;
  color: #909399;
  font-size: 13px;
}

.order-contract-timeline {
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

@media (max-width: 900px) {
  .detail-form-grid,
  .create-contract-preview {
    grid-template-columns: 1fr;
  }

  .items-toolbar,
  .detail-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
