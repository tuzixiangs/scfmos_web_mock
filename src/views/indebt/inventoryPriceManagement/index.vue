<template>
  <InventoryPriceDetail v-if="showDetail" />
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
import { inventoryPriceApplicationMenus, inventoryPriceApprovalMenus } from './common'
import InventoryPriceDetail from './detail/index.vue'

defineOptions({ name: 'InventoryPriceManagement' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const isApprovalEntry = computed(() => String(route.path).includes('inventoryPriceApproval'))
const menuList = computed(() =>
  isApprovalEntry.value ? inventoryPriceApprovalMenus : inventoryPriceApplicationMenus
)
const activeMenu = computed(() =>
  String(route.query?.key || (isApprovalEntry.value ? 'current' : 'pending'))
)
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
