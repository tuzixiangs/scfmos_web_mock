<template>
  <OrderContractModificationDetail v-if="showDetail" />
  <OrderContractModificationWorkList v-else :params="{ mode: activeMenu }" />
</template>

<script setup lang="ts">
import OrderContractModificationWorkList from './components/workList/index.vue'
import OrderContractModificationDetail from './detail/index.vue'

defineOptions({ name: 'OrderContractModification' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
// 顶层菜单拆分后，“查询”入口默认定位到历史修改记录；原页面内切换仍然可用。
const activeMenu = computed(() =>
  String(route.name) === 'OrderContractModificationRecordQuery'
    ? 'record'
    : String(route.query?.key || 'application')
)
</script>
