<template>
  <ContentWrap class="debt-image-page">
    <div class="page-layout">
      <aside class="image-tree-panel">
        <div class="panel-title">债项影像目录</div>
        <el-tree :data="treeData" node-key="id" default-expand-all highlight-current @node-click="selectNode" />
      </aside>
      <main class="image-content">
        <div class="content-header"><div><h3>{{ selectedNode.label }}</h3><p>客户：阿姆特拉斯供应链有限公司　业务合同：BCT202607010001</p></div><el-upload action="#" :auto-upload="false"><el-button type="primary" plain><Icon icon="ep:upload" class="mr-4px" />上传影像</el-button></el-upload></div>
        <el-alert title="影像只能在发起人阶段删除；进入流程后可继续上传，但不能删除已有资料。" type="info" :closable="false" class="mb-16px" />
        <el-table :data="currentImages" border>
          <el-table-column type="index" label="序号" width="66" align="center" />
          <el-table-column prop="name" label="文件名称" min-width="260" />
          <el-table-column prop="node" label="影像节点" min-width="180" />
          <el-table-column prop="uploader" label="上传人" min-width="120" />
          <el-table-column prop="uploadedAt" label="上传时间" min-width="170" />
          <el-table-column prop="source" label="来源" min-width="140" />
          <el-table-column label="操作" width="150" fixed="right" align="center"><template #default="{ row }"><el-button link type="primary" @click="preview(row)">预览</el-button><el-button v-if="row.deletable" link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
        </el-table>
      </main>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'DebtImageManagement' })
interface TreeNode { id: string; label: string; children?: TreeNode[] }
interface ImageRow { id: number; name: string; node: string; uploader: string; uploadedAt: string; source: string; deletable: boolean }
const treeData: TreeNode[] = [{ id: 'customer', label: '债项管理材料', children: [{ id: 'trade', label: '贸易背景资料' }, { id: 'assets', label: '资产明细清单' }, { id: 'logistics', label: '物流单据' }, { id: 'invoice', label: '发票' }, { id: 'payment', label: '支付凭证' }, { id: 'warehouse', label: '仓储资料' }, { id: 'offline', label: '线下台账' }, { id: 'filing', label: '线下债项管理备案清单' }] }]
const selectedNode = ref<TreeNode>(treeData[0].children![0])
const images = ref<ImageRow[]>([
  { id: 1, name: '业务合同及订单扫描件.pdf', node: '贸易背景资料', uploader: '张晨', uploadedAt: '2026-08-26 09:20:00', source: '债项数据维护', deletable: false },
  { id: 2, name: '质物明细2026-08-27.pdf', node: '资产明细清单', uploader: '系统自动生成', uploadedAt: '2026-08-27 10:05:00', source: '动产登记', deletable: false },
  { id: 3, name: '本批物流提单.pdf', node: '物流单据', uploader: '张晨', uploadedAt: '2026-08-27 11:10:00', source: '发起人上传', deletable: true }
])
const currentImages = computed(() => images.value.filter((item) => selectedNode.value.id === 'customer' || item.node === selectedNode.value.label))
const selectNode = (node: TreeNode) => { selectedNode.value = node }
const preview = (row: ImageRow) => ElMessage.info(`正在预览“${row.name}”（Mock）`)
const remove = (row: ImageRow) => { images.value = images.value.filter((item) => item.id !== row.id); ElMessage.success('影像已删除') }
</script>

<style scoped lang="scss">
.page-layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); min-height: 560px; border: 1px solid #ebeef5; }
.image-tree-panel { padding: 16px; border-right: 1px solid #ebeef5; background: #fafafa; }
.panel-title { margin-bottom: 14px; color: #303133; font-weight: 600; }
.image-content { min-width: 0; padding: 18px 20px; }
.content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.content-header h3 { margin: 0 0 6px; font-size: 17px; }
.content-header p { margin: 0; color: #909399; font-size: 13px; }
@media (max-width: 900px) { .page-layout { grid-template-columns: 1fr; } .image-tree-panel { border-right: 0; border-bottom: 1px solid #ebeef5; } }
</style>
