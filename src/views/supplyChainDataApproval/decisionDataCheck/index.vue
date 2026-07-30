<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :default-openeds="['01']"
    :get-component="getComponent"
    :menu-select="menuSelect"
  />
</template>

<script setup lang="ts">
  import { getMenuList } from './api'
  import { supplyChainDecisionCheckMenu } from '@/mock/supply-chain-decision-data'
  import dynamicContainer from '@/components/dynamicContainer/index.vue'

  const modules = import.meta.glob('./lists/*/index.vue')

  defineOptions({
    name: 'DecisionDataCheck'
  })
  // 默认展示客户概况
  const activeMenu = ref('010010')

  const menuList = ref([])
  const loading = ref(false)

  // 获取菜单列表
  const getMenu = async () => {
    try {
      loading.value = true
      const res = await getMenuList()
      menuList.value = Array.isArray(res) && res.some((item) => item?.children?.length)
        ? res
        : supplyChainDecisionCheckMenu
    } catch {
      menuList.value = supplyChainDecisionCheckMenu
    } finally {
      loading.value = false
    }
  }
  onBeforeMount(()=> {
    getMenu()
  })

  const getComponent = () => {
    // if (menu.value === './components/toRegistered/index.vue') {
    //   return toRegistered
    // }
  }
  const menuSelect = () => {
    return {
      // tpserialno: route.query.customerID
    }
  }
</script>
