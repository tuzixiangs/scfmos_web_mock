<template>
  <div class="select-area1">
    <el-form-item label="债项信息">
      <el-button style="width: 360px" @click="selectDebtInfo">选择债项信息</el-button>
    </el-form-item>

    <!-- 新增 -->
    <div v-if="props.ruleAdd">
      <el-dialog
        title="选择债项信息"
        v-model="visible"
        :width="500"
        :close-on-click-modal="false"
        @confirm="handleOk('add')"
        @cancel="handleCancel"
      >
        <div class="select-block">
          <div class="debt-stage">债项阶段</div>
          <el-select v-model="indebtStep" style="width: 300px" @change="debtStageChange">
            <el-option
              v-for="debtStage in debtStageData"
              :key="debtStage.value"
              :label="debtStage.label"
              :value="debtStage.value"
            />
          </el-select>
        </div>
        <div class="select-block" style="margin-top: 20px">
          <div class="debt-stage">债项信息</div>
          <el-select v-model="assocTable" style="width: 300px" @change="debtInfoChange">
            <el-option
              v-for="debtInfo in debtInfos"
              :key="debtInfo.value"
              :label="debtInfo.label"
              :value="debtInfo.value"
            />
          </el-select>
        </div>

        <div style="margin-top: 20px; width: 300px; margin-left: 76px">
          <el-select
            v-model="infoItem"
            multiple
            style="width: 300px"
            @change="resItemChange"
          >
            <el-option v-for="(item, index) in resList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
      </el-dialog>
      <div style="display: flex; padding: 0 20px">
        <el-table
          border
          :data="purData"
          :row-key="(row, index) => index"
          class="field-table"
        >
          <el-table-column prop="indebtStep" label="债项阶段" align="center" />
          <el-table-column prop="assocTable" label="债项信息" align="center" />
          <el-table-column prop="fieldList" label="关联属性" align="center" />
        </el-table>
      </div>
    </div>

    <!-- 编辑 -->
    <div v-else-if="props.ruleEdit">
      <el-dialog
        title="选择债项信息"
        v-model="visible"
        :width="500"
        :close-on-click-modal="false"
        @confirm="handleOk('edit')"
        @cancel="handleCancel"
      >
        <div class="select-block">
          <div class="debt-stage">债项阶段</div>
          <el-select v-model="indebtStep" style="width: 300px" @change="debtStageChange">
            <el-option
              v-for="debtStage in debtStageData"
              :key="debtStage.value"
              :label="debtStage.label"
              :value="debtStage.value"
            />
          </el-select>
        </div>
        <div class="select-block" style="margin-top: 20px">
          <div class="debt-stage">债项信息</div>
          <el-select v-model="assocTable" style="width: 300px" @change="debtInfoChange">
            <el-option
              v-for="debtInfo in debtInfos"
              :key="debtInfo.value"
              :label="debtInfo.label"
              :value="debtInfo.value"
            />
          </el-select>
        </div>

        <div style="margin-top: 20px; width: 300px; margin-left: 76px">
          <el-select
            v-model="infoItem"
            multiple
            style="width: 300px"
            @change="resItemChange"
          >
            <el-option v-for="(item, index) in resList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
      </el-dialog>

      <div style="display: flex; padding: 0 20px">
        <el-table
          border
          :data="purData"
          :row-key="(row, index) => index"
          class="field-table"
        >
          <el-table-column prop="indebtStep" label="债项阶段" align="center" />
          <el-table-column prop="assocTable" label="债项信息" align="center" />
          <el-table-column prop="fieldList" label="关联属性" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, defineProps, defineEmits } from 'vue'
import { contantGroupList } from './api.js'

// Props
const props = defineProps({
  diUpdateData: {
    type: Array,
    default: () => []
  },
  ruleAdd: {
    type: Boolean,
    default: false
  },
  ruleEdit: {
    type: Boolean,
    default: false
  },
  debtInfoList: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['dfTransData', 'dfupTransData'])

// 常量数据
const debtStageData = [
  { label: '采购', value: 'CG' },
  { label: '存货', value: 'CH' },
  { label: '销售', value: 'XS' },
  { label: '订单融资', value: 'DDRZ' },
  { label: '建筑集采', value: 'JZJC' }
]

const secondData: Record<string, any[]> = {
  CG: [
    { label: '采购合同', value: 'DtPurContract' },
    { label: '采购物流', value: 'DtPurLogistics' },
    { label: '采购付款', value: 'DtPurPay' },
    { label: '采购发票', value: 'DtPurInvoice' },
    { label: '采购订单', value: 'DtPurOrder' }
  ],
  CH: [
    { label: '存货库存', value: 'DtInventoryInfo' },
    { label: '存货入库', value: 'DtInventoryStockin' },
    { label: '存货出库', value: 'DtInventoryStockout' }
  ],
  XS: [
    { label: '销售合同', value: 'DtSellContract' },
    { label: '销售物流', value: 'DtSellLogistics' },
    { label: '销售收款', value: 'DtSellReceipt' },
    { label: '销售发票', value: 'DtSellInvoice' },
    { label: '销售订单', value: 'DtSellOrder' }
  ],
  DDRZ: [
    { label: '订单融资订单', value: 'DtFinanceOrder' },
    { label: '订单融资发票', value: 'DtFinanceInvoice' },
    { label: '出账订单关系表', value: 'DtLoanFinanceOrder' },
    { label: '订单融资业务应收账款统计表', value: 'DtLoanReceivableApply' }
  ],
  JZJC: [{ label: '建筑项目表', value: 'BuildingProject' }]
}

// 状态
const visible = ref(false)
const confirmLoading = ref(false)
const indebtStep = ref('CG')
const debtInfos = ref(secondData[debtStageData[0].value])
const assocTable = ref(secondData[debtStageData[0].value][0].value)
const purData = ref<any[]>([])
const indebtInfo = ref('DtPurContract')
const resList = ref<string[]>([])
const infoItem = ref<string[]>([])
const fieldList = ref<string[]>([])
const entity = ref('DtPurContract')
const crDtRelaReqList = ref<any[]>([])

// 各个债项信息的对象
const purContractObj = ref<any>(null)
const purLogisticsObj = ref<any>(null)
const purPayObj = ref<any>(null)
const purInvoiceObj = ref<any>(null)
const purOrderObj = ref<any>(null)
const stockInfoObj = ref<any>(null)
const stockInObj = ref<any>(null)
const stocOutObj = ref<any>(null)
const sellContractObj = ref<any>(null)
const sellLoginsticsObj = ref<any>(null)
const sellGainObj = ref<any>(null)
const sellInvoiceObj = ref<any>(null)
const sellOrderObj = ref<any>(null)
const financeOrderObj = ref<any>(null)
const financeInvoiceObj = ref<any>(null)
const buildingProject = ref<any>(null)

// 方法
const loadData = async (val: string) => {
  try {
    const data = { entity: val }
    const res: any = await crDtRelaList(data)
    resList.value = res.result?.result || []
  } catch (error) {
    console.error('查询债项信息字段失败:', error)
  }
}

const selectDebtInfo = () => {
  purData.value = []
  visible.value = true
}

const handleOk = (val: string) => {
  infoItem.value = []

  if (purContractObj.value) crDtRelaReqList.value.push(purContractObj.value)
  if (purLogisticsObj.value) crDtRelaReqList.value.push(purLogisticsObj.value)
  if (purPayObj.value) crDtRelaReqList.value.push(purPayObj.value)
  if (purInvoiceObj.value) crDtRelaReqList.value.push(purInvoiceObj.value)
  if (purOrderObj.value) crDtRelaReqList.value.push(purOrderObj.value)
  if (stockInfoObj.value) crDtRelaReqList.value.push(stockInfoObj.value)
  if (stockInObj.value) crDtRelaReqList.value.push(stockInObj.value)
  if (stocOutObj.value) crDtRelaReqList.value.push(stocOutObj.value)
  if (sellContractObj.value) crDtRelaReqList.value.push(sellContractObj.value)
  if (sellLoginsticsObj.value) crDtRelaReqList.value.push(sellLoginsticsObj.value)
  if (sellGainObj.value) crDtRelaReqList.value.push(sellGainObj.value)
  if (sellInvoiceObj.value) crDtRelaReqList.value.push(sellInvoiceObj.value)
  if (sellOrderObj.value) crDtRelaReqList.value.push(sellOrderObj.value)
  if (financeOrderObj.value) crDtRelaReqList.value.push(financeOrderObj.value)
  if (financeInvoiceObj.value) crDtRelaReqList.value.push(financeInvoiceObj.value)
  if (buildingProject.value) crDtRelaReqList.value.push(buildingProject.value)

  if (crDtRelaReqList.value.length === 0) {
    console.warn('请选择债项关联信息')
  } else {
    visible.value = false
    if (val === 'add') {
      emit('dfTransData', { crDtRelaList: crDtRelaReqList.value })
    } else if (val === 'edit') {
      emit('dfupTransData', { crDtRelaList: crDtRelaReqList.value })
    }
  }
}

const handleCancel = () => {
  infoItem.value = []
  crDtRelaReqList.value = []
  purData.value = []
  confirmLoading.value = true
  visible.value = false
  confirmLoading.value = false
}

const debtStageChange = (val: string) => {
  indebtStep.value = val
  if (val === 'CG') indebtInfo.value = 'DtPurContract'
  else if (val === 'CH') indebtInfo.value = 'DtInventoryInfo'
  else if (val === 'XS') indebtInfo.value = 'DtSellContract'
  else if (val === 'DDRZ') indebtInfo.value = 'DtFinanceOrder'
  else if (val === 'JZJC') indebtInfo.value = 'BuildingProject'

  infoItem.value = []
  debtInfos.value = secondData[val]
  assocTable.value = secondData[val][0].value
  loadData(assocTable.value)
}

const debtInfoChange = (val: string) => {
  indebtInfo.value = val
  infoItem.value = []
  entity.value = val
  loadData(entity.value)
}

const resItemChange = (val: string[]) => {
  const addPurData = (step: string, table: string, obj: any) => {
    if (val.length > 0) {
      purData.value.push({ indebtStep: step, assocTable: table, fieldList: val[val.length - 1] })
    }
  }

  if (indebtStep.value === 'CG' && indebtInfo.value === 'DtPurContract') {
    purContractObj.value = { indebtStep: 'CG', assocTable: 'DtPurContract', fieldList: val }
    addPurData('CG', 'DtPurContract', purContractObj.value)
  } else if (indebtStep.value === 'CG' && indebtInfo.value === 'DtPurLogistics') {
    purLogisticsObj.value = { indebtStep: 'CG', assocTable: 'DtPurLogistics', fieldList: val }
    addPurData('CG', 'DtPurLogistics', purLogisticsObj.value)
  } else if (indebtStep.value === 'CG' && indebtInfo.value === 'DtPurPay') {
    purPayObj.value = { indebtStep: 'CG', assocTable: 'DtPurPay', fieldList: val }
    addPurData('CG', 'DtPurPay', purPayObj.value)
  } else if (indebtStep.value === 'CG' && indebtInfo.value === 'DtPurInvoice') {
    purInvoiceObj.value = { indebtStep: 'CG', assocTable: 'DtPurInvoice', fieldList: val }
    addPurData('CG', 'DtPurInvoice', purInvoiceObj.value)
  } else if (indebtStep.value === 'CG' && indebtInfo.value === 'DtPurOrder') {
    purOrderObj.value = { indebtStep: 'CG', assocTable: 'DtPurOrder', fieldList: val }
    addPurData('CG', 'DtPurOrder', purOrderObj.value)
  } else if (indebtStep.value === 'CH' && indebtInfo.value === 'DtInventoryInfo') {
    stockInfoObj.value = { indebtStep: 'CH', assocTable: 'DtInventoryInfo', fieldList: val }
    addPurData('CH', 'DtInventoryInfo', stockInfoObj.value)
  } else if (indebtStep.value === 'CH' && indebtInfo.value === 'DtInventoryStockin') {
    stockInObj.value = { indebtStep: 'CH', assocTable: 'DtInventoryStockin', fieldList: val }
    addPurData('CH', 'DtInventoryStockin', stockInObj.value)
  } else if (indebtStep.value === 'CH' && indebtInfo.value === 'DtInventoryStockout') {
    stocOutObj.value = { indebtStep: 'CH', assocTable: 'DtInventoryStockout', fieldList: val }
    addPurData('CH', 'DtInventoryStockout', stocOutObj.value)
  } else if (indebtStep.value === 'XS' && indebtInfo.value === 'DtSellContract') {
    sellContractObj.value = { indebtStep: 'XS', assocTable: 'DtSellContract', fieldList: val }
    addPurData('XS', 'DtSellContract', sellContractObj.value)
  } else if (indebtStep.value === 'XS' && indebtInfo.value === 'DtSellLogistics') {
    sellLoginsticsObj.value = { indebtStep: 'XS', assocTable: 'DtSellLogistics', fieldList: val }
    addPurData('XS', 'DtSellLogistics', sellLoginsticsObj.value)
  } else if (indebtStep.value === 'XS' && indebtInfo.value === 'DtSellReceipt') {
    sellGainObj.value = { indebtStep: 'XS', assocTable: 'DtSellReceipt', fieldList: val }
    addPurData('XS', 'DtSellReceipt', sellGainObj.value)
  } else if (indebtStep.value === 'XS' && indebtInfo.value === 'DtSellInvoice') {
    sellInvoiceObj.value = { indebtStep: 'XS', assocTable: 'DtSellInvoice', fieldList: val }
    addPurData('XS', 'DtSellInvoice', sellInvoiceObj.value)
  } else if (indebtStep.value === 'XS' && indebtInfo.value === 'DtSellOrder') {
    sellOrderObj.value = { indebtStep: 'XS', assocTable: 'DtSellOrder', fieldList: val }
    addPurData('XS', 'DtSellOrder', sellOrderObj.value)
  } else if (indebtStep.value === 'DDRZ' && indebtInfo.value === 'DtFinanceOrder') {
    financeOrderObj.value = { indebtStep: 'DDRZ', assocTable: 'DtFinanceOrder', fieldList: val }
    addPurData('DDRZ', 'DtFinanceOrder', financeOrderObj.value)
  } else if (indebtStep.value === 'DDRZ' && indebtInfo.value === 'DtFinanceInvoice') {
    financeInvoiceObj.value = { indebtStep: 'DDRZ', assocTable: 'DtFinanceInvoice', fieldList: val }
    addPurData('DDRZ', 'DtFinanceInvoice', financeInvoiceObj.value)
  } else if (indebtStep.value === 'DDRZ' && indebtInfo.value === 'DtLoanFinanceOrder') {
    financeInvoiceObj.value = {
      indebtStep: 'DDRZ',
      assocTable: 'DtLoanFinanceOrder',
      fieldList: val
    }
    addPurData('DDRZ', 'DtLoanFinanceOrder', financeInvoiceObj.value)
  } else if (indebtStep.value === 'DDRZ' && indebtInfo.value === 'DtLoanReceivableApply') {
    financeInvoiceObj.value = {
      indebtStep: 'DDRZ',
      assocTable: 'DtLoanReceivableApply',
      fieldList: val
    }
    addPurData('DDRZ', 'DtLoanReceivableApply', financeInvoiceObj.value)
  } else if (indebtStep.value === 'JZJC' && indebtInfo.value === 'BuildingProject') {
    buildingProject.value = { indebtStep: 'JZJC', assocTable: 'BuildingProject', fieldList: val }
    addPurData('JZJC', 'BuildingProject', buildingProject.value)
  }
}

// 监听 diUpdateData 变化
watch(
  () => props.diUpdateData,
  (newVal) => {
    setTimeout(() => {
      if (newVal && newVal.length > 0) {
        const mappings = [
          { assocTable: 'DtPurContract', objRef: purContractObj },
          { assocTable: 'DtPurLogistics', objRef: purLogisticsObj },
          { assocTable: 'DtPurInvoice', objRef: purInvoiceObj },
          { assocTable: 'DtPurOrder', objRef: purOrderObj },
          { assocTable: 'DtPurPay', objRef: purPayObj },
          { assocTable: 'DtInventoryInfo', objRef: stockInfoObj },
          { assocTable: 'DtInventoryStockin', objRef: stockInObj },
          { assocTable: 'DtInventoryStockout', objRef: stocOutObj },
          { assocTable: 'DtSellContract', objRef: sellContractObj },
          { assocTable: 'DtSellLogistics', objRef: sellLoginsticsObj },
          { assocTable: 'DtSellReceipt', objRef: sellGainObj },
          { assocTable: 'DtSellInvoice', objRef: sellInvoiceObj },
          { assocTable: 'DtSellOrder', objRef: sellOrderObj },
          { assocTable: 'DtFinanceOrder', objRef: financeOrderObj },
          { assocTable: 'DtSellOrder', objRef: financeInvoiceObj },
          { assocTable: 'BuildingProject', objRef: buildingProject }
        ]

        mappings.forEach(({ assocTable, objRef }) => {
          const item = newVal.filter((i: any) => i.assocTable === assocTable)[0]
          if (item) {
            const purUp = []
            item.fieldList.forEach((elem: any) => {
              const indebtStepVal =
                assocTable === 'DtPurContract' ||
                assocTable === 'DtPurLogistics' ||
                assocTable === 'DtPurPay' ||
                assocTable === 'DtPurInvoice' ||
                assocTable === 'DtPurOrder'
                  ? 'CG'
                  : assocTable === 'DtInventoryInfo' ||
                      assocTable === 'DtInventoryStockin' ||
                      assocTable === 'DtInventoryStockout'
                    ? 'CH'
                    : assocTable === 'DtSellContract' ||
                        assocTable === 'DtSellLogistics' ||
                        assocTable === 'DtSellReceipt' ||
                        assocTable === 'DtSellInvoice' ||
                        assocTable === 'DtSellOrder'
                      ? 'XS'
                      : assocTable === 'DtFinanceOrder' ||
                          assocTable === 'DtFinanceInvoice' ||
                          assocTable === 'DtLoanFinanceOrder' ||
                          assocTable === 'DtLoanReceivableApply'
                        ? 'DDRZ'
                        : assocTable === 'BuildingProject'
                          ? 'JZJC'
                          : ''
              purUp.push({ indebtStep: indebtStepVal, assocTable: assocTable, fieldList: elem })
            })
            purData.value.push(...purUp)
            objRef.value = item
          }
        })
      }
    }, 1000)
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  loadData(entity.value)
})
</script>

<style scoped lang="scss">
.field-table {
  width: 100%;
}
.select-block {
  display: flex;
  align-items: center;
  :deep(.el-select) {
    margin-left: 20px;
  }
}
</style>
