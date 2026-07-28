<template>
  <div class="dynamic-container order-contract-ledger-layout">
    <DynamicNavmenu
      class="dynamic-navmenu"
      :active-menu="activeMenu"
      :menu-list="menuList"
      :customer-openeds="defaultOpeneds"
      @menu-select="handleMenuSelect"
    />
    <main class="component">
      <OrderContractLedgerWorkList :params="{ productPlan }" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import OrderContractLedgerWorkList from './components/workList/index.vue'

defineOptions({ name: 'OrderContractLedgerQuery' })

type ProductPlanKey = 'prepayment' | 'pledge'

const route = useRoute()
const initialPlan: ProductPlanKey = String(route.path || '').includes('/pledge') ? 'pledge' : 'prepayment'
const activePlan = ref<ProductPlanKey>(initialPlan)
const activeMenu = ref(`${initialPlan}-ledger`)
const productPlan = computed(() => activePlan.value === 'pledge' ? '货押融资' : '先票/款后货')
const defaultOpeneds = [initialPlan]
const menuList = [
  {
    key: 'prepayment',
    title: '先票/款后货',
    children: [{ key: 'prepayment-ledger', title: '订单/合同台账查询', plan: 'prepayment' }]
  },
  {
    key: 'pledge',
    title: '货押融资',
    children: [{ key: 'pledge-ledger', title: '订单/合同台账查询', plan: 'pledge' }]
  }
]

const handleMenuSelect = (menu: { key: string; plan?: ProductPlanKey }) => {
  if (menu.plan) activePlan.value = menu.plan
  activeMenu.value = menu.key
}
</script>

<style scoped lang="scss">
.order-contract-ledger-layout {
  display: flex;
  min-height: calc(100vh - 150px);
  margin: 0;
  background: #f5f6f8;
}

.dynamic-navmenu {
  width: 228px;
  min-width: 228px;
  flex: 0 0 228px;
  background: #f1f1f1 !important;
}

.component {
  min-width: 0;
  flex: 1;
  overflow: auto;
}

@media (max-width: 900px) {
  .dynamic-navmenu { width: 198px; min-width: 198px; flex-basis: 198px; }
}
</style>
