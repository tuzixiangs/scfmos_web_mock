<template>
  <OfflineLedgerUpdateDetail v-if="showDetail" />
  <dynamicContainer
    v-else
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="offlineLedgerApplicationMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { offlineLedgerApplicationMenus } from './common'
import OfflineLedgerUpdateDetail from './detail/index.vue'

defineOptions({ name: 'OfflineLedgerUpdate' })

const route = useRoute()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const activeMenu = computed(() => String(route.query?.key || 'pending'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { phase: string }) => ({ phase: menu.phase })
</script>
