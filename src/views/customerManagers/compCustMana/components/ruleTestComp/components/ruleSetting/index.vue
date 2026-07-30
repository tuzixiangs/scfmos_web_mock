<template>
  <div class="rule-setting-comp">
    <!-- 步骤条 -->
    <!-- <ruleStepComp ref="ruleStepCompRef" :steps="stepList" /> -->

    <!-- <div style="height: 400px"> -->
    <!-- <el-tabs v-model="activeTabName">
        <el-tab-pane v-for="comp in compList" :key="comp.index" :name="comp.index"> -->
    <component :is="compList[0].comp" />
    <!-- </el-tab-pane>
      </el-tabs> -->
    <!-- </div> -->

    <div class="footer">
      <el-button @click="emit('close')">关闭</el-button>
      <el-button type="primary" :icon="Select" @click="nextStep">
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { hydrateOnIdle } from 'vue'
import { ArrowLeft, ArrowRight, Select } from '@element-plus/icons-vue'
import ruleStepComp from './components/ruleStepComp.vue'
import ruleComp from './components/ruleComp/index.vue'
// import selectCommodityComp from './components/selectCommodityComp.vue'
// import selectProcurementComp from './components/selectProcurementComp.vue'
// import selectCreditPurposeComp from './components/selectCreditPurposeComp.vue'
// import selectRuleTypeComp from './components/selectRuleTypeComp.vue'
// import debtFactorComp from './components/debtFactorComp.vue'

const emit = defineEmits(['close'])

const handleConfirm = (product) => {
  console.log('确认选择的商品:', product)
}

const saveParams = reactive({})

const activeTabName = ref(0)

const ruleStepCompRef = ref()
const nextStep = (index, item) => {
  activeTabName.value = ruleStepCompRef.value.next()

  saveParams[index] = item
  ruleStepCompRef.value.setDescription(saveParams)
}

const prevStep = (index, item) => {
  activeTabName.value = ruleStepCompRef.value.last()

  saveParams[index] = item
  ruleStepCompRef.value.setDescription(saveParams)
}

// 组件
const compNameList = reactive([
  { stepName: '规则类型', compName: 'ruleComp' }
  // { stepName: '债项资产类型', compName: 'indebtAssetsType' },
])

const stepList = reactive(compNameList.map((v, i) => ({ title: v.stepName, key: i })))

const compList = ref([])
const initCompList = () => {
  compList.value = compNameList.map((v, i) => ({
    index: i,
    comp: ruleComp,
    // comp: defineAsyncComponent({
    //   loader: () => import(`./components/${v.compName}/index.vue`),
    //   hydrate: hydrateOnIdle(250) // 最迟mounted 250ms后才加载该组件，否则空闲时再加载
    // })
  }))
}

initCompList()
</script>

<style lang="scss" scoped>
.rule-setting-comp {
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }
}
</style>
