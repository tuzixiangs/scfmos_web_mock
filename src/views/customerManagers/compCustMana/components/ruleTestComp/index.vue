<template>
  <div class="rule-test">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规则配置-线上债项</span>
        </div>
      </template>
      <DefineTemplate v-slot="{ $slots, title }">
        <div class="title-box">
          <div class="title">{{ title }}</div>
          <component :is="$slots.default" />
        </div>
      </DefineTemplate>

      <ReuseTemplate title="基本信息" />

      <el-descriptions class="ml-30px" :column="4" border label-width="200px">
        <el-descriptions-item width="15%" label="授信申请编号">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item width="15%" label="客户名称">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item width="15%" label="供应链项目名称">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item width="15%" label="核心企业名称">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="产品方案">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新日期">
          {{ '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新人">
          {{ '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <ReuseTemplate class="mt-10px" title="监管方信息">
        <el-button size="small" plain type="primary" @click="addRegulatorGroup">
          <Icon :size="14" icon="ep:plus" class="mr-5px" />
          新增监管方信息
        </el-button>
      </ReuseTemplate>

      <el-alert
        title="监管方信息非必输，支持维护多组；监管方名称及统一社会信用代码需从信贷建档客户中选择，协议编号和协议名称手工维护。"
        type="info"
        :closable="false"
        show-icon
        class="mx-30px mb-12px"
      />

      <el-table :data="regulatorGroups" border class="mx-30px regulator-table">
        <el-table-column type="index" label="序号" width="64" align="center" />
        <el-table-column label="监管方名称" min-width="220">
          <template #default="{ row }">
            <el-input v-model="row.regulatorName" readonly placeholder="请选择信贷建档客户">
              <template #append>
                <el-button @click="openRegulatorPicker(row)">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="监管方统一社会信用代码" min-width="220">
          <template #default="{ row }">
            <el-input v-model="row.socialCreditCode" readonly placeholder="选择监管方后自动带出" />
          </template>
        </el-table-column>
        <el-table-column label="协议编号" min-width="190">
          <template #default="{ row }">
            <el-input v-model.trim="row.agreementNo" maxlength="50" placeholder="请输入协议编号" />
          </template>
        </el-table-column>
        <el-table-column label="协议名称" min-width="210">
          <template #default="{ row }">
            <el-input v-model.trim="row.agreementName" maxlength="100" placeholder="请输入协议名称" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="danger" @click="removeRegulatorGroup(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!regulatorGroups.length"
        description="暂无监管方信息，可按需新增"
        :image-size="68"
        class="mx-30px regulator-empty"
      />

      <ReuseTemplate class="mt-10px" title="债项规则配置">
        <el-button size="small" plain type="primary" @click="openHistoryDialog">
          <Icon :size="14" icon="ep:clock" class="mr-5px" />
          引入历史
        </el-button>
      </ReuseTemplate>

      <el-alert
        title="本期支持单一供应链项目配置多个标准产品的债项规则；多项目组合场景后续迭代。"
        type="info"
        :closable="false"
        show-icon
        class="mx-30px mb-12px"
      />

      <!-- 产品 -->
      <component :is="productRuleComp" class="ml-20px" @settingClick="settingClick" />

      <ReuseTemplate title="价衰配置" />

      <component :is="devalueSettingComp" class="ml-20px" />

      <ReuseTemplate title="回款检测账号配置" />

      <component :is="accountSettingComp" class="ml-20px" />

      <!-- <ReuseTemplate title="保证金账户配置" />

      <component :is="marginAccountSettingComp" class="ml-20px" /> -->
    </el-card>

    <ruleSettingPop ref="ruleSettingPopRef" />

    <el-dialog
      v-model="regulatorPickerVisible"
      title="选择信贷建档客户"
      width="760px"
      destroy-on-close
      append-to-body
    >
      <el-alert
        title="选择后将同时回填监管方名称和统一社会信用代码。"
        type="info"
        :closable="false"
        class="mb-16px"
      />
      <el-table
        :data="regulatorCustomerOptions"
        border
        highlight-current-row
        @row-click="selectedRegulatorCustomer = $event"
      >
        <el-table-column width="54" align="center">
          <template #default="{ row }">
            <el-radio :model-value="selectedRegulatorCustomer?.id" :value="row.id">
              <span class="sr-only">选择监管方</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="customerNo" label="客户编号" min-width="160" />
        <el-table-column prop="customerName" label="客户名称" min-width="220" />
        <el-table-column prop="socialCreditCode" label="统一社会信用代码" min-width="210" />
      </el-table>
      <template #footer>
        <el-button @click="regulatorPickerVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!selectedRegulatorCustomer" @click="confirmRegulatorCustomer">
          确认选择
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="historyVisible"
      title="引入历史债项规则"
      width="880px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-alert
        title="请选择当前客户历史授信编号下的产品债项规则；确认后将覆盖当前产品的规则配置。"
        type="info"
        :closable="false"
        class="mb-16px"
      />
      <el-table
        :data="historyRuleOptions"
        border
        highlight-current-row
        @row-click="selectedHistoryRule = $event"
      >
        <el-table-column width="54" align="center">
          <template #default="{ row }">
            <el-radio :model-value="selectedHistoryRule?.id" :value="row.id">
              <span class="sr-only">选择历史规则</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="creditNo" label="历史授信编号" min-width="180" />
        <el-table-column prop="productPlan" label="产品方案" min-width="180" />
        <el-table-column prop="ruleName" label="债项规则方案" min-width="190" />
        <el-table-column prop="updatedAt" label="最近更新日期" width="130" />
        <el-table-column prop="updatedBy" label="更新人" width="110" />
      </el-table>
      <template #footer>
        <el-button @click="historyVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!selectedHistoryRule" @click="confirmHistoryImport">
          确认引入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { hydrateOnIdle } from 'vue'
import { ElMessage } from 'element-plus'
import ruleSettingPop from './components/ruleSetting/pop.vue'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

// 优化加载时间，做动态处理
const productRuleComp = defineAsyncComponent({
  loader: () => import('./components/productRuleComp/index.vue'),
  hydrate: hydrateOnIdle(250) // 最迟mounted 250ms后才加载该组件，否则空闲时再加载
})

const accountSettingComp = defineAsyncComponent({
  loader: () => import('./components/accountSettingComp/index.vue'),
  hydrate: hydrateOnIdle(300)
})

const marginAccountSettingComp = defineAsyncComponent({
  loader: () => import('./components/marginAccountSettingComp/index.vue'),
  hydrate: hydrateOnIdle(350)
})
const devalueSettingComp = defineAsyncComponent({
  loader: () => import('./components/devalueSettingComp/index.vue'),
  hydrate: hydrateOnIdle(350)
})

onBeforeMount(() => {
  console.log('1111111', Date.now())
})

onMounted(() => {
  console.log('2222222', Date.now())
})

const ruleSettingPopRef = ref()
const settingClick = () => {
  ruleSettingPopRef.value.open()
}

const regulatorGroups = ref([
  {
    id: 1,
    regulatorName: '宁波通商监管服务有限公司',
    socialCreditCode: '91330201MA2J7R8X6P',
    agreementNo: 'JGXY20260701001',
    agreementName: '存货质押监管合作协议'
  }
])
const regulatorPickerVisible = ref(false)
const regulatorTargetId = ref()
const selectedRegulatorCustomer = ref()
const regulatorCustomerOptions = [
  {
    id: 1,
    customerNo: 'C2025031800000091',
    customerName: '宁波通商监管服务有限公司',
    socialCreditCode: '91330201MA2J7R8X6P'
  },
  {
    id: 2,
    customerNo: 'C2025042600000116',
    customerName: '浙江安信仓储监管有限公司',
    socialCreditCode: '91330106MA28UQ9K3C'
  },
  {
    id: 3,
    customerNo: 'C2025050800000132',
    customerName: '华东供应链监管有限公司',
    socialCreditCode: '91310115MA1H8M6Y7T'
  }
]

const addRegulatorGroup = () => {
  regulatorGroups.value.push({
    id: Date.now(),
    regulatorName: '',
    socialCreditCode: '',
    agreementNo: '',
    agreementName: ''
  })
}

const removeRegulatorGroup = (id) => {
  regulatorGroups.value = regulatorGroups.value.filter((item) => item.id !== id)
}

const openRegulatorPicker = (row) => {
  regulatorTargetId.value = row.id
  selectedRegulatorCustomer.value = regulatorCustomerOptions.find(
    (item) => item.customerName === row.regulatorName
  )
  regulatorPickerVisible.value = true
}

const confirmRegulatorCustomer = () => {
  const target = regulatorGroups.value.find((item) => item.id === regulatorTargetId.value)
  if (!target || !selectedRegulatorCustomer.value) return
  target.regulatorName = selectedRegulatorCustomer.value.customerName
  target.socialCreditCode = selectedRegulatorCustomer.value.socialCreditCode
  regulatorPickerVisible.value = false
}

const historyVisible = ref(false)
const selectedHistoryRule = ref()
const historyRuleOptions = [
  {
    id: 1,
    creditNo: 'CR202506180006',
    productPlan: '钢材库存质押融资方案',
    ruleName: '存货类标准产品债项规则（2026版）',
    updatedAt: '2026-06-18',
    updatedBy: '张晨'
  },
  {
    id: 2,
    creditNo: 'CR202503120015',
    productPlan: '钢材库存质押融资方案',
    ruleName: '存货类标准产品债项规则（历史版）',
    updatedAt: '2026-03-12',
    updatedBy: '李敏'
  }
]

const openHistoryDialog = () => {
  selectedHistoryRule.value = undefined
  historyVisible.value = true
}

const confirmHistoryImport = () => {
  if (!selectedHistoryRule.value) return
  historyVisible.value = false
  ElMessage.success(
    `已引入授信编号 ${selectedHistoryRule.value.creditNo} 的产品债项规则（Mock）`
  )
}
</script>

<style lang="scss" scoped>
.rule-test {
  :deep(.el-card__header) {
    background-color: #f5f7fa;
    padding: 10px 15px;

    .card-header {
      font-size: 15px;
      font-weight: bold;
      color: #1a3a6b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .title-box {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;

    .title {
      font-weight: bold;
      color: #1a3a6b;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 3px;
        background: #1a3a6b;
        border-radius: 2px;
        height: 14px;
      }
    }
  }

  .regulator-table {
    width: calc(100% - 60px);
  }

  .regulator-empty {
    border: 1px solid var(--el-border-color-lighter);
  }
}
</style>
