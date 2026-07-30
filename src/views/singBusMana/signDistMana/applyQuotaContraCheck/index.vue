
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
import { linkedQuotaApprovalMenus } from '@/mock/linked-contract-approval'

defineOptions({
  name: 'singApplyQuotaContraCheck'
})

// 取数回调前，保持数组为空
const menuListY = ref()
const menuListN = ref()

const menuSelect = () => {
  return {
    objectType: 'BusinessContract'
  }
}

// 获取当前
const loading = ref(false)
const ContractTaskList = (flag) => {
  Api.ContractTaskList({ objectType: 'BusinessContract', flowNo: 'CreditContractFlow', flag ,creditSourceFlag:'02'}).then(
    (res) => {
      const menuList = Array.isArray(res) && res.every((item) => item?.phaseName && item?.workCount !== undefined)
        ? res
        : linkedQuotaApprovalMenus[flag]
      if (flag === 'Y') menuListY.value = menuList
      else if (flag === 'N') menuListN.value = menuList
    }
  ).catch(() => {
    if (flag === 'Y') menuListY.value = linkedQuotaApprovalMenus.Y
    else menuListN.value = linkedQuotaApprovalMenus.N
  })
}

const doFetch = () => {
  loading.value = true
  Promise.all([ContractTaskList('Y'), ContractTaskList('N')])
    .then()
    .finally(() => (loading.value = false))
}
doFetch()
</script>
