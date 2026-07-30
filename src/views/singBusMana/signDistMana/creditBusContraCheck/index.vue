
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
import { linkedBusinessApprovalMenus } from '@/mock/linked-contract-approval'

defineOptions({
  name: 'singCreditBusContraCheck'
})

// 取数回调前，保持数组为空
const menuListY = ref()
const menuListN = ref()

const menuSelect = (menu) => {
  return {
    objectType: 'BusinessContract'
  }
}

// 获取当前
const loading = ref(false)
const ywContractTaskList = (flag) => {
  Api.ywContractTaskList({ objectType: 'BusinessContract', flowNo: 'BusinessContractFlow', flag,creditSourceFlag:'02' }).then(
    (res) => {
      const menuList = Array.isArray(res) && res.every((item) => item?.phaseName && item?.workCount !== undefined)
        ? res
        : linkedBusinessApprovalMenus[flag]
      if (flag === 'Y') menuListY.value = menuList
      else if (flag === 'N') menuListN.value = menuList
    }
  ).catch(() => {
    if (flag === 'Y') menuListY.value = linkedBusinessApprovalMenus.Y
    else menuListN.value = linkedBusinessApprovalMenus.N
  })
}

const doFetch = () => {
  loading.value = true
  Promise.all([ywContractTaskList('Y'), ywContractTaskList('N')])
    .then()
    .finally(() => (loading.value = false))
}
doFetch()
</script>
