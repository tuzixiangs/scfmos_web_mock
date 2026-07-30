<template>
  <ContentWrap :body-style="{ padding: '18px 22px' }">
    <div class="title">{{ params?.title || '业务资料' }}</div>
    <el-alert
      title="该节点暂未提供内网专属组件，已展示本地演示资料。"
      type="info"
      :closable="false"
      show-icon
      class="mb-18px"
    />
    <el-descriptions :column="2" border>
      <el-descriptions-item label="客户名称">{{ detail.enterprisename || detail.customername || '洋寻华柳自动化有限公司' }}</el-descriptions-item>
      <el-descriptions-item label="项目编号">{{ detail.projectno || 'PJ202607010001' }}</el-descriptions-item>
      <el-descriptions-item label="业务品种">{{ detail.businessType || '供应链流动资金贷款' }}</el-descriptions-item>
      <el-descriptions-item label="当前状态">{{ detail.status || detail.phaseName || '待处理' }}</el-descriptions-item>
      <el-descriptions-item label="申请编号">{{ detail.serialno || detail.applicationno || 'BA202607200000001' }}</el-descriptions-item>
      <el-descriptions-item label="资料来源">本地 Mock 数据</el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <ContentWrap :body-style="{ padding: '14px 22px 22px' }">
    <div class="sub-title">{{ params?.title || '业务资料' }}记录</div>
    <el-table :data="records" border>
      <el-table-column prop="recordNo" label="记录编号" min-width="180" />
      <el-table-column prop="name" label="资料名称" min-width="220" />
      <el-table-column prop="status" label="状态" min-width="120" />
      <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
      <el-table-column label="操作" min-width="160">
        <template #default>
          <el-button link type="primary">查看详情</el-button>
          <el-button link type="primary">查看影像</el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script setup>
import { computed, unref } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const detail = computed(() => unref(props.params?.detailInfo) || {})
const records = computed(() => [
  {
    recordNo: `${props.params?.key || '010010'}-001`,
    name: `${props.params?.title || '业务资料'}基础记录`,
    status: detail.value.status || '有效',
    updatedAt: detail.value.updatedate || detail.value.createdate || '2026/07/28'
  }
])
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.sub-title {
  margin-bottom: 12px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}
</style>
