<template>
  <ContentWrap v-loading="loading">
    <el-result icon="success" title="页面跳转" sub-title="请前往相应页面查看">
      <template #extra>
        <el-button tpye="" @click="openAgain">再次前往</el-button>
      </template>
    </el-result>
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'

const route = useRoute() // 路由对象

const loading = ref(false)
let result 
const getData = () => {
  loading.value = true
  Api.entAccountDetailUrl({ customerID: route.query.customerID || route.query.customerId }).then(res => {
    result = res?.frUrl
    window.open(result)
  }).finally(_ => loading.value = false)
}

getData()

const openAgain = () => {
  if (result) {
    window.open(result)
  } else {
    getData()
  }
}
</script>