<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="warehouseApplicationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { warehouseApplicationMenus } from './common'

defineOptions({ name: 'WarehouseManagement' })

const route = useRoute()
const isApprovalEntry = computed(() => String(route.path).includes('warehouseApproval'))
const activeMenu = computed(() =>
  String(route.query?.key || (isApprovalEntry.value ? 'reviewing' : 'pending'))
)
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
