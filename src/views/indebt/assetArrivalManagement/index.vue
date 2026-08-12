<template>
  <AssetConfirmationDetail v-if="showDetail" mode="arrival" />
  <dynamicContainer
    v-else
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="assetArrivalApplicationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { assetArrivalApplicationMenus } from './common'
import AssetConfirmationDetail from '../components/AssetConfirmationDetail.vue'

defineOptions({ name: 'AssetArrivalManagement' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const activeMenu = computed(() => String(route.query?.key || 'pending'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
