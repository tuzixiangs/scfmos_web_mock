<template>
  <div class="rule-comp">
    <DefineTemplate v-slot="{ $slots, title }">
      <div class="title-box">
        <div class="title">{{ title }}</div>
        <component :is="$slots.default" />
      </div>
    </DefineTemplate>

    <ReuseTemplate title="选择规则" />

    <el-form class="ml-20px" label-width="120px">
      <el-form-item label="规则类型">
        <selectInputComp @openClick="openClick1" />
      </el-form-item>
    </el-form>

    <ReuseTemplate title="债项因子" />

    <el-form class="ml-20px" label-width="120px">
      <el-form-item label="是否开启">
        <el-input />
      </el-form-item>
      <el-form-item label="期限天数">
        <el-input />
      </el-form-item>
    </el-form>

    <ReuseTemplate title="债项资产类型" />

    <el-form class="ml-20px" label-width="120px">
      <el-form-item label="选择商品">
        <selectInputComp @openClick="openClick2" />
      </el-form-item>
      <el-form-item label="采购方式">
        <el-select placeholder="请选择采购方式">
          <el-option label="招标采购" value="招标采购" />
          <el-option label="竞争性谈判" value="竞争性谈判" />
          <el-option label="单一来源采购" value="单一来源采购" />
          <el-option label="询价采购" value="询价采购" />
          <el-option label="框架协议采购" value="框架协议采购" />
          <el-option label="电子采购" value="电子采购" />
        </el-select>
      </el-form-item>
      <el-form-item label="授信用途">
        <el-select placeholder="请选择授信用途">
          <el-option label="流动资金贷款" value="流动资金贷款" />
          <el-option label="票据贴现" value="票据贴现" />
          <el-option label="保理" value="保理" />
          <el-option label="信用证" value="信用证" />
          <el-option label="保函" value="保函" />
          <el-option label="供应链融资" value="供应链融资" />
        </el-select>
      </el-form-item>
    </el-form>

    <selectRuleTypePop ref="selectRuleTypePopRef" />
    <selectCommodityPop ref="selectCommodityPopRef" />
  </div>
</template>

<script setup>
import selectInputComp from '@/components/selectInput/index.vue'
import selectRuleTypePop from './components/selectRuleTypePop.vue'
import selectCommodityPop from './components/selectCommodityPop.vue'
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const selectRuleTypePopRef = ref()
const openClick1 = () => {
  selectRuleTypePopRef.value.open()
}
const selectCommodityPopRef = ref()
const openClick2 = () => {
  selectCommodityPopRef.value.open()
}
</script>

<style lang="scss" scoped>
.rule-comp {
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
}
</style>
