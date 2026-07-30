
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

<script setup>
import * as Api from './api.js'
import toRegistered from './components/toRegistered/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { contractRegistrationMenu } from '@/mock/contract-registration'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'contractRegiPro'
})

// 默认展示客户概况
const activeMenu = computed(()=> route.query?.key ?? '010')
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ codeNo: 'BookInContractMain' })
    .then((res) => {
      menuList.value = Array.isArray(res) && res.some((item) => item.children?.length)
        ? res
        : contractRegistrationMenu
    })
    .catch(() => {
      menuList.value = contractRegistrationMenu
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const getComponent = (menu) => {
  if (menu.value === './components/toRegistered/index.vue') {
    return toRegistered
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.customerID
  }
}
</script>
