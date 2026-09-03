<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :default-component="personalProfile"
    :get-component="getComponent"
    :menu-select="menuSelect"
    showCustomerName
  />
</template>

<script setup>
import * as Api from './api.js'
import personalProfile from './components/personalProfile/index.vue'
import customerSection from '@/views/customerManagers/compCustMana/customerDetail/components/customerSection/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'CustomerPersonalDetail'
})

// 默认展示客户概况
const activeMenu = ref('010010')
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ codeNo: 'IndEconomicView', customerId: route.query.customerId || route.query.customerID || route.query.customerid })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

const getComponent = (menu) => {
  if (menu.value === '@/components/busiComp/crmsIframe/index.vue') {
    return customerSection
  }
  if (menu.value === './components/personalProfile/index.vue') {
    return personalProfile
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.customerId || route.query.customerID,
    iframeVh:menu.key === '030010' ? '100vh' : '100%'
  }
}
</script>
