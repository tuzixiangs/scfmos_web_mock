<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="assetArrivalApplicationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { assetArrivalApplicationMenus } from './common'

defineOptions({ name: 'AssetArrivalManagement' })

const route = useRoute()
const activeMenu = computed(() => String(route.query?.key || 'pending'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
