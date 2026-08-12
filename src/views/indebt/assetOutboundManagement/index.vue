<template>
  <AssetConfirmationDetail v-if="showDetail" mode="outbound" />
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
import { assetOutboundManagementApplicationMenus, assetOutboundManagementApprovalMenus } from './common'
import AssetConfirmationDetail from '../components/AssetConfirmationDetail.vue'

defineOptions({ name: 'AssetOutboundManagement' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const isApprovalEntry = computed(() => String(route.path).includes('outboundApproval'))
const menuList = computed(() =>
  isApprovalEntry.value ? assetOutboundManagementApprovalMenus : assetOutboundManagementApplicationMenus
)
const defaultKey = computed(() => (isApprovalEntry.value ? 'current' : 'pending'))
const activeMenu = computed(() => String(route.query?.key || defaultKey.value))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
