<template>
  <WarehouseManagementDetail v-if="showDetail" />
  <dynamicContainer
    v-else
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { warehouseApplicationMenus, warehouseApprovalMenus } from './common'
import WarehouseManagementDetail from './detail/index.vue'

defineOptions({ name: 'WarehouseManagement' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const isApprovalEntry = computed(() => String(route.path).includes('warehouseApproval'))
const menuList = computed(() =>
  isApprovalEntry.value ? warehouseApprovalMenus : warehouseApplicationMenus
)
const defaultKey = computed(() => (isApprovalEntry.value ? 'current' : 'pending'))
const activeMenu = computed(() => String(route.query?.key || defaultKey.value))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string; category?: string; isApproval?: boolean }) => ({
  phase: menu.phase,
  category: menu.category,
  isApproval: menu.isApproval
})
</script>
