<template>
  <div class="select-commodity-comp">
    <!-- 搜索区域 -->
    <!-- <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索分类名称"
        clearable
        style="width: 280px"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div> -->

    <!-- 分类树 + 小类列表 -->
    <div class="content-area">
      <!-- 左侧分类树（只显示大类和中类） -->
      <div class="category-tree">
        <el-scrollbar ref="scrollbarRef" height="100%">
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            :props="treeProps"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            :default-expanded-keys="expandedKeys"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-icon v-if="data.type === 'big'" class="category-icon big-category">
                  <Folder />
                </el-icon>
                <el-icon v-else-if="data.type === 'middle'" class="category-icon middle-category">
                  <FolderOpened />
                </el-icon>
                <span>{{ node.label }}</span>
                <span class="product-count" v-if="data.productCount > 0"
                  >({{ data.productCount }})</span
                >
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>

      <!-- 右侧小类列表 -->
      <div class="small-category-list">
        <table-title title="小类列表">
          <div class="current-path" v-if="currentPath.length > 0">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item, index) in currentPath" :key="index">
                <span
                  :class="{ 'path-node': true, 'path-category': true }"
                  @click="handlePathClick(item)"
                >
                  {{ item.label }}
                </span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </table-title>

        <!-- 小类表格 -->
        <Table
          :columns="smallCategoryColumns"
          :data="smallCategories"
          :loading="false"
          :pagination="{
            total: smallCategoryTotal,
            size: 'small'
          }"
          highlight-current-row
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          @page-change="handlePageChange"
          @row-click="handleRowClick"
        >
        </Table>

        <!-- 底部操作按钮 -->
        <!-- <div class="footer-actions">
          <el-button @click="handleClear">清除选择</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Folder, FolderOpened } from '@element-plus/icons-vue'
import Table from '@/components/Table/src/Table.vue'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'next'])

// ==================== 模拟数据（大中小类，小类为最终层级） ====================

const categoryTree = ref([
  // 大类1：钢材类
  {
    id: 1,
    label: '钢材类',
    type: 'big',
    children: [
      {
        id: 101,
        label: '螺纹钢',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 10101, label: 'HRB400螺纹钢', type: 'small' },
          { id: 10102, label: 'HRB500螺纹钢', type: 'small' }
        ]
      },
      {
        id: 102,
        label: '线材',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 10201, label: '普通线材', type: 'small' },
          { id: 10202, label: '高线', type: 'small' }
        ]
      },
      {
        id: 103,
        label: '盘螺',
        type: 'middle',
        productCount: 1,
        children: [
          { id: 10301, label: 'CRB400盘螺', type: 'small' }
        ]
      }
    ]
  },
  // 大类2：铜材类
  {
    id: 2,
    label: '铜材类',
    type: 'big',
    children: [
      {
        id: 201,
        label: '铜杆',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 20101, label: 'T2铜杆', type: 'small' },
          { id: 20102, label: 'T3铜杆', type: 'small' }
        ]
      },
      {
        id: 202,
        label: '铜管',
        type: 'middle',
        productCount: 3,
        children: [
          { id: 20201, label: '无缝铜管', type: 'small' },
          { id: 20202, label: '焊接铜管', type: 'small' },
          { id: 20203, label: '波纹铜管', type: 'small' }
        ]
      },
      {
        id: 203,
        label: '铜板',
        type: 'middle',
        productCount: 1,
        children: [
          { id: 20301, label: 'T2铜板', type: 'small' }
        ]
      }
    ]
  },
  // 大类3：铝材类
  {
    id: 3,
    label: '铝材类',
    type: 'big',
    children: [
      {
        id: 301,
        label: '铝杆',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 30101, label: '1系铝杆', type: 'small' },
          { id: 30102, label: '3系铝杆', type: 'small' }
        ]
      },
      {
        id: 302,
        label: '铝板',
        type: 'middle',
        productCount: 3,
        children: [
          { id: 30201, label: '防锈铝板', type: 'small' },
          { id: 30202, label: '氧化铝板', type: 'small' },
          { id: 30203, label: '彩绘铝板', type: 'small' }
        ]
      },
      {
        id: 303,
        label: '铝管',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 30301, label: '无缝铝管', type: 'small' },
          { id: 30302, label: '焊接铝管', type: 'small' }
        ]
      }
    ]
  },
  // 大类4：不锈钢类
  {
    id: 4,
    label: '不锈钢类',
    type: 'big',
    children: [
      {
        id: 401,
        label: '不锈钢板',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 40101, label: '304不锈钢板', type: 'small' },
          { id: 40102, label: '316L不锈钢板', type: 'small' }
        ]
      },
      {
        id: 402,
        label: '不锈钢管',
        type: 'middle',
        productCount: 2,
        children: [
          { id: 40201, label: '304不锈钢管', type: 'small' },
          { id: 40202, label: '316L不锈钢管', type: 'small' }
        ]
      }
    ]
  }
])

// 计算每个中类的商品数量（小类数量）
const calculateProductCount = (node) => {
  if (!node.children || node.children.length === 0) {
    return 0
  }
  let count = 0
  node.children.forEach((child) => {
    if (child.type === 'small') {
      count++
    }
  })
  node.productCount = count
  return count
}

// 初始化商品数量
categoryTree.value.forEach((big) => calculateProductCount(big))

// 树形属性
const treeProps = {
  label: 'label',
  children: 'children',
  isLeaf: (data) => data.type === 'middle'
}

// ==================== 状态 ====================

const treeRef = ref(null)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const currentMiddleCategory = ref(null) // 当前选中的中类
const selectedSmallCategory = ref(props.modelValue) // 当前选中的小类（单选）
const smallCategories = ref([]) // 当前显示的小类列表
const expandedKeys = ref([]) // 展开的节点key

// 当前选中路径
const currentPath = ref([])

// 小类表格列配置
const smallCategoryColumns = [
  { label: '小类编码', field: 'code', minWidth: 150 },
  { label: '小类名称', field: 'label', minWidth: 200 },
  { label: '所属中类', field: 'middleLabel', minWidth: 180 },
  { label: '所属大类', field: 'bigLabel', minWidth: 180 }
]

// 小类总数
const smallCategoryTotal = computed(() => smallCategories.value.length)

// ==================== 方法 ====================

// 分页变化
const handlePageChange = () => {
  // 重新计算分页
}

// 展开全部
const expandAll = () => {
  if (treeRef.value) {
    treeRef.value.store.nodesMap && Object.values(treeRef.value.store.nodesMap).forEach(node => {
      if (node.children && node.children.length > 0) {
        node.expanded = true
      }
    })
  }
}

// 收起全部
const collapseAll = () => {
  if (treeRef.value) {
    treeRef.value.store.nodesMap && Object.values(treeRef.value.store.nodesMap).forEach(node => {
      node.expanded = false
    })
  }
}

// 树节点过滤
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

// 搜索
const handleSearch = () => {
  if (treeRef.value) {
    treeRef.value.filter(searchKeyword.value)
  }
}

const scrollbarRef = ref

// 树节点点击
const handleNodeClick = (data) => {
  if (data.type === 'middle') {
    // 点击中类，显示下面的小类
    currentMiddleCategory.value = data
    currentPage.value = 1
    
    // 构建路径
    if (treeRef.value) {
      const currentNode = treeRef.value.store.nodesMap[data.id]
      if (currentNode) {
        currentPath.value = buildPath(currentNode)
      }
    }
    
    // 准备小类数据
    const smallCats = (data.children || []).map(small => ({
      id: small.id,
      label: small.label,
      code: `SC-${String(small.id).padStart(6, '0')}`,
      middleLabel: data.label,
      bigLabel: findBigLabel(data),
      type: 'small'
    }))
    
    smallCategories.value = smallCats
  }
}

// 查找大类名称
const findBigLabel = (middleNode) => {
  for (const big of categoryTree.value) {
    for (const middle of big.children || []) {
      if (middle.id === middleNode.id) {
        return big.label
      }
    }
  }
  return ''
}

// 构建路径
const buildPath = (node) => {
  const path = []
  let current = node
  while (current) {
    path.unshift({
      id: current.data?.id || current.id,
      label: current.data?.label || current.label,
      type: current.data?.type || current.type
    })
    current = current.parent
  }
  return path
}

// 点击路径
const handlePathClick = (item) => {
  // 找到对应的节点并选中
  if (treeRef.value) {
    treeRef.value.setCurrentKey(item.id)
  }
}

// 表格行点击
const handleRowClick = (row) => {
  selectedSmallCategory.value = row
}

// 选择单个小类（单选）
const handleSelect = (row) => {
  selectedSmallCategory.value = row
}

// 清除选择
const handleClear = () => {
  selectedSmallCategory.value = null
  emit('update:modelValue', null)
}

// 确定选择
const handleConfirm = () => {
  if (!selectedSmallCategory.value) {
    return
  }
  emit('confirm', selectedSmallCategory.value)
  emit('update:modelValue', selectedSmallCategory.value)
}

const goNext = () => {
  emit('next', selectedSmallCategory.value)
}

const goPrev = () => {
  emit('prev', selectedSmallCategory.value)
}

// 监听外部模型值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedSmallCategory.value = newVal
  }
})
</script>

<style lang="scss" scoped>
.select-commodity-comp {
  .search-area {
    margin-bottom: 16px;
  }

  .content-area {
    display: flex;
    gap: 20px;
    min-height: 400px;

    .category-tree {
      width: 280px;
      flex-shrink: 0;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      height: 400px;

      :deep(.el-scrollbar) {
        height: 100%;
      }

      :deep(.el-tree) {
        background: transparent;
      }

      :deep(.el-tree-node__content) {
        height: 36px;
        padding: 0 8px;
      }

      :deep(.el-scrollbar__bar) {
        width: 4px;
        opacity: 0.6;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }

      :deep(.el-scrollbar__thumb) {
        background-color: #c0c4cc;
        border-radius: 4px;

        &:hover {
          background-color: #909399;
        }
      }
    }

    .small-category-list {
      flex: 1;
      min-width: 0;

      .current-path {
        background: #f5f7fa;
        border-radius: 4px;
        padding: 8px 12px;

        .path-node {
          cursor: pointer;
          color: #409eff;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .footer-actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    }
  }

  // 树节点样式
  .custom-tree-node {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;

    .category-icon {
      font-size: 16px;

      &.big-category {
        color: #409eff;
      }

      &.middle-category {
        color: #67c23a;
      }
    }

    .product-count {
      color: #909399;
      font-size: 12px;
      margin-left: 4px;
    }
  }
}
</style>
