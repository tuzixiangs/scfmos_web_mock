<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :defaultMenuParams="props"
    :default-component="customerProfile"
    :get-component="getComponent"
    :menu-select="menuSelect"
    :show-customer-name="showCustomerName"
  />
</template>

<script setup>
import * as Api from './api.js'
import customerProfile from './components/customerProfile/index.vue'
import customerQualification from './components/customerQualification/index.vue'
import customerSection from './components/customerSection/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'customerDetail'
})

const props = defineProps({
  customerIdByProps: {
    type: String
  }
})

// 默认展示客户概况
const activeMenu = ref('010010')
const route = useRoute()

const menuList = ref([])
const showCustomerName = ref(true)

const customerId = computed(()=>route.query?.customerId || route.query?.customerID || route.query?.customerid || props.customerIdByProps)


// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ codeNo: 'EnterpriseView', customerId:customerId.value })
    .then((res) => {
    
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const getComponent = (menu) => {
  if (menu.key === '010005') {
    return customerQualification
  }
  if (menu.value === '@/components/busiComp/crmsIframe/index.vue') {
    return customerSection
  }
  if (menu.value === './components/customerProfile/index.vue') {
    return customerProfile
  }
}
const menuSelect = (menu) => {
  const isIframeVh = ['020010','020030'].includes(menu?.key)
   console.log('menumenumenu',menu,menu.key);
  return {
    tpserialno:customerId.value,
    customerId: customerId.value,
    iframeVh:isIframeVh ? '100vh' : '100%'
  }
}




</script>
