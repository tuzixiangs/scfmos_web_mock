<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="orderContractModificationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { orderContractModificationMenus } from './common'

defineOptions({ name: 'OrderContractModification' })

const route = useRoute()
const activeMenu = computed(() => String(route.query?.key || 'application'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { mode: 'application' | 'record' }) => ({ mode: menu.mode })
</script>
