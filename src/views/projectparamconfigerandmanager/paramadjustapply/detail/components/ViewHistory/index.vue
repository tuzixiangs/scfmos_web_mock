<template>
  <!-- <Search :schema="searchSchema" @search="search" @reset="reset" /> -->
  <div class="pb-8">
    <tempTable
      ref="tempTableRef"
      :selection="false"
      :api-func="getListValue"
      tempNo="ProjectParamAdjustHisList"
      :templateApiFunc="getTemplateFunc"
      :params="ListParams"
      :fetchCback="getFetchCback"
      :stripe="false"
    >
      <template #operation="{row}">
        <el-button link type="primary" @click="viewHistory(row)">查看历史详情</el-button>
      </template>
    </tempTable>
  </div>
  
</template>

<script setup lang="tsx">
import {
  getTemplateInfo,
  getListValue,
} from '../../../api'

const props = withDefaults(
  defineProps<{
    onClose: (args?: any) => void
    customerId: string
    projectId: string
    isEdit: boolean
    activeTabName?: string
  }>(),
  {}
)
const route = useRoute()
const tempTableRef = ref()
const router = useRouter()

const ListParams = ref({
  serialno: props.projectId,
  templateno: 'ProjectParamAdjustHisList'
})
const getTemplateFunc = () => {
  return getTemplateInfo({ templateNo: 'ProjectParamAdjustHisList' })
}
const getFetchCback = (list) => {
  console.log('[ list ] >', list)
}

const viewHistory = (row)=> {
  try{
    router.push({
      name: 'ParamAdjustApplyDetail',
      query: {
        serialno: row.serialNo || row.serialno,
        type: 'detail',
        _multiTab: 'true',
        isHistory: '1',
        activeTabName: props.activeTabName,
        t: Date.now()
      }
    })
    props.onClose?.({ command: 'cancel'})
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
    
}

</script>

<style scoped></style>
