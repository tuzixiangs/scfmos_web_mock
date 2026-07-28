<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { assetManagementApplicationMenus, assetManagementApprovalMenus } from './common'

defineOptions({ name: 'AssetManagement' })

const route = useRoute()
const isApprovalEntry = computed(() => String(route.path).includes('inboundApproval'))
const menuList = computed(() =>
  isApprovalEntry.value ? assetManagementApprovalMenus : assetManagementApplicationMenus
)
const defaultKey = computed(() => (isApprovalEntry.value ? 'current' : 'pending'))
const activeMenu = computed(() => String(route.query?.key || defaultKey.value))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
