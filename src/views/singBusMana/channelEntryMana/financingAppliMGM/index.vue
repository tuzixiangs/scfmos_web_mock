
<template>
  <dynamicContainer
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :active-menu="activeMenu"
    :default-openeds="defaultOpeneds"
    :get-component="getComponent"
    :menu-select="menuSelect"
  />
</template>

<script setup>
import * as Api from './api.js'
import applicationList from './components/applicationList/index.vue'
import letterTicketList from './components/letterTicketList/index.vue'
import letterTicketList2 from './components/letterTicketList2/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { financingApplicationMenu } from '@/mock/financing-application-management'
const modules = import.meta.glob('./components/*/index.vue')

/**
 * 进件管理
 */
defineOptions({
  name: 'financingAppliMGM'
})

// 默认展示客户概况
const activeMenu = ref('1010')
const defaultOpeneds = ref(['01'])
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ codeNo: 'TSELCreditApplyMain' })
    .then((res) => {
      menuList.value = Array.isArray(res) && res.some((item) => item.children?.length)
        ? res
        : financingApplicationMenu
    })
    .catch(() => {
      menuList.value = financingApplicationMenu
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const getComponent = (menu) => {
  if (menu.value === './components/applicationList/index.vue') return applicationList
  if (menu.value === './components/letterTicketList/index.vue') return letterTicketList
  if (menu.value === './components/letterTicketList2/index.vue') return letterTicketList2
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.customerID
  }
}
</script>
