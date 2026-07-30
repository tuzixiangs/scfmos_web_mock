
<template>
  <dynamicContainer2
    :loading="loading"
    :menu-list-y="menuListY"
    :menu-list-n="menuListN"
    :component="workList"
    :menu-select="menuSelect"
  />
</template>

<script setup>
import * as Api from './api.js'
import workList from './components/workList/index.vue'
import dynamicContainer2 from '@/components/dynamicContainer2/index.vue'
import { loanApprovalMenus } from '@/mock/loan-approval'

defineOptions({
  name: 'signAppliApprCheck'
})

// 取数回调前，保持数组为空
const menuListY = ref()
const menuListN = ref()

const menuSelect = (menu) => {
  return {
    objectType: 'PutOutApply'
  }
}

// 获取当前
const loading = ref(false)
const getApprovePutOutApplyMenu = (type) => {
  Api.getApprovePutOutApplyMenu({ type,creditSourceFlag:'01'}).then(
    (res) => {
      const menuList = Array.isArray(res) && res.every((item) => item.phaseName && item.workCount !== undefined)
        ? res
        : loanApprovalMenus[type]
      if (type === 'Y') menuListY.value = menuList
      else if (type === 'N') menuListN.value = menuList
    }
  ).catch(() => {
    if (type === 'Y') menuListY.value = loanApprovalMenus.Y
    else if (type === 'N') menuListN.value = loanApprovalMenus.N
  })
}

const doFetch = () => {
  loading.value = true
  Promise.all([getApprovePutOutApplyMenu('Y'), getApprovePutOutApplyMenu('N')])
    .then()
    .finally(() => (loading.value = false))
}
doFetch()
</script>
