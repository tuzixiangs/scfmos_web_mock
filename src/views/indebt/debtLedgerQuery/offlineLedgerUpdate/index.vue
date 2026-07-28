<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="offlineLedgerApplicationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { offlineLedgerApplicationMenus } from './common'

defineOptions({ name: 'OfflineLedgerUpdate' })

const route = useRoute()
const activeMenu = computed(() => String(route.query?.key || 'pending'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
