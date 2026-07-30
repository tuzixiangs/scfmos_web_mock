<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :get-component="getComponent"
    :menu-select="menuSelect"
  />
</template>

<script setup lang="ts">
  import { getMenuList } from './api'
  import { projectParamAdjustmentMenu } from '@/mock/project-param-adjustment'
  import dynamicContainer from '@/components/dynamicContainer/index.vue'

  const modules = import.meta.glob('./components/list/index.vue')

  defineOptions({
    name: 'ParamAdjustApply'
  })
  // 默认展示客户概况
  const activeMenu = ref('1010')


  console.log('ParamAdjustApply');
  

  const menuList = ref([])
  const loading = ref(false)

  // 获取菜单列表
  const getMenu = async () => {
    try {
      loading.value = true
      let res = await getMenuList({ codeNo: 'ParamAdjustApplyMain' })
      if (!Array.isArray(res) || !res.some((item) => item?.key)) {
        res = projectParamAdjustmentMenu
      }
      res = res.map(item => ({
        ...item,
        btns: item.value,
        value: './components/list/index.vue'
      }))
      console.log('[ res ] >', res)
      menuList.value = res || projectParamAdjustmentMenu
    } catch {
      menuList.value = projectParamAdjustmentMenu.map((item) => ({
        ...item,
        btns: item.value,
        value: './components/list/index.vue'
      }))
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
