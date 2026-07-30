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
import pendPutOutApplyList from './components/pendPutOutApplyList/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { loanApplicationMenu } from '@/mock/loan-application'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'loanApplication'
})

// 默认展示客户概况
const route = useRoute()
const activeMenu = ref(route.query.key || '1010')

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getMenuList = () => {
  loading.value = true
  Api.getMenuList({ codeNo: 'PutOutApplyMain' })
    .then((res) => {
      menuList.value = Array.isArray(res) && res.some((item) => item.children?.length)
        ? res
        : loanApplicationMenu
    })
    .catch(() => {
      menuList.value = loanApplicationMenu
    })
    .finally((_) => (loading.value = false))
}
getMenuList()

const getComponent = (menu) => {
  if (menu.value === './components/pendPutOutApplyList/index.vue') {
    return pendPutOutApplyList
  }
}
const menuSelect = (menu) => {
  return {
    // tpserialno: route.query.customerID
  }
}
</script>
