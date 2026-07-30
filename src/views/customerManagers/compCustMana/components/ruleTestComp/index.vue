<template>
  <div class="rule-test">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规则配置-线上债项</span>
          <div class="btns">
            <el-button>暂 停</el-button>
            <el-button type="primary">保 存</el-button>
          </div>
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

      <ReuseTemplate class="mt-10px" title="债项规则配置">
        <el-button size="small" plain type="primary">
          <Icon :size="14" icon="ep:clock" class="mr-5px" />
          引入历史
        </el-button>
      </ReuseTemplate>

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
  </div>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { hydrateOnIdle } from 'vue'
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
}
</style>
