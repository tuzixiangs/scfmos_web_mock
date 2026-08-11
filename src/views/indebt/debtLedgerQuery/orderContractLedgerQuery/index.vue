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
      <OrderContractLedgerWorkList :params="{ productPlan, ledgerStatus }" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import OrderContractLedgerWorkList from './components/workList/index.vue'

defineOptions({ name: 'OrderContractLedgerQuery' })

type ProductPlanKey = 'prepayment' | 'pledge'
type LedgerStatus = 'valid' | 'invalid'

const route = useRoute()
const initialPlan: ProductPlanKey = String(route.path || '').includes('/pledge') ? 'pledge' : 'prepayment'
const activePlan = ref<ProductPlanKey>(initialPlan)
const activeStatus = ref<LedgerStatus>('valid')
const activeMenu = ref(`${initialPlan}-valid`)
const productPlan = computed(() => activePlan.value === 'pledge' ? '货押融资' : '先票/款后货')
const ledgerStatus = computed(() => activeStatus.value)
const defaultOpeneds = [initialPlan]
const menuList = [
  {
    key: 'prepayment',
    title: '先票/款后货',
    children: [
      { key: 'prepayment-valid', title: '有效的订单/合同', plan: 'prepayment', status: 'valid' },
      { key: 'prepayment-invalid', title: '失效的订单/合同', plan: 'prepayment', status: 'invalid' }
    ]
  },
  {
    key: 'pledge',
    title: '货押融资',
    children: [
      { key: 'pledge-valid', title: '有效的订单/合同', plan: 'pledge', status: 'valid' },
      { key: 'pledge-invalid', title: '失效的订单/合同', plan: 'pledge', status: 'invalid' }
    ]
  }
]

const handleMenuSelect = (menu: { key: string; plan?: ProductPlanKey; status?: LedgerStatus }) => {
  if (menu.plan) activePlan.value = menu.plan
  if (menu.status) activeStatus.value = menu.status
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
