<template>
  <div class="select-commodity-comp">
    <!-- <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>选择商品</span>
          </div>

          <div class="header-right">
            <span v-if="selectedProduct" class="selected-info">
              当前选择：{{ selectedProduct.label }}
            </span>
            <el-button type="danger" size="small" v-if="selectedProduct" @click="clearSelected"
              >清除选择</el-button
            >
          </div>
        </div>
      </template> -->

      <!-- 搜索区域 -->
      <!-- <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称/编码"
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

      <!-- 商品分类树 + 商品表格 -->
      <div class="content-area">
        <!-- 左侧分类树 -->
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
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <el-icon v-if="data.type === 'big'" class="category-icon big-category">
                    <Folder />
                  </el-icon>
                  <el-icon v-else-if="data.type === 'middle'" class="category-icon middle-category">
                    <FolderOpened />
                  </el-icon>
                  <el-icon v-else class="category-icon small-category">
                    <Document />
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

        <!-- 右侧商品列表 -->

        <div class="product-list">
          <table-title title="商品列表">
            <!-- 当前选中路径展示 -->
            <div class="current-path" v-if="currentPath.length > 0">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in currentPath" :key="index">
                  <span
                    :class="{ 'path-node': true, 'path-category': item.type !== 'product' }"
                    @click="handlePathClick(item)"
                    v-if="item.type !== 'product'"
                  >
                    {{ item.label }}
                  </span>
                  <span v-else>{{ item.label }}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </table-title>

          <!-- 商品表格 -->
          <Table
            :columns="productColumns"
            :data="filteredProducts"
            :loading="false"
            :pagination="{
              total: total,
              size: 'small'
            }"
            highlight-current-row
            v-model:pageSize="pageSize"
            v-model:currentPage="currentPage"
            @page-change="handlePageChange"
            @row-click="handleRowClick"
          >
            <template #price="{ row }"> ¥{{ row.price?.toFixed(2) }} </template>
          </Table>
        </div>
      </div>
    <!-- </el-card> -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Folder, FolderOpened, Document, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import Table from '@/components/Table/src/Table.vue'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'next'])

// ==================== 模拟数据 ====================

// 分类树数据（大类 -> 中类 -> 小类 -> 商品）
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
        children: [
          {
            id: 10101,
            label: 'HRB400螺纹钢',
            type: 'small',
            productCount: 3,
            children: [
              {
                id: 1010101,
                label: 'HRB400螺纹钢 Φ12mm',
                name: 'HRB400螺纹钢 Φ12mm',
                code: 'RG-HRB400-12',
                specification: 'Φ12mm×12m',
                unit: '吨',
                price: 4250,
                category: '钢材类/螺纹钢/HRB400螺纹钢',
                type: 'product'
              },
              {
                id: 1010102,
                label: 'HRB400螺纹钢 Φ14mm',
                name: 'HRB400螺纹钢 Φ14mm',
                code: 'RG-HRB400-14',
                specification: 'Φ14mm×12m',
                unit: '吨',
                price: 4200,
                category: '钢材类/螺纹钢/HRB400螺纹钢',
                type: 'product'
              },
              {
                id: 1010103,
                label: 'HRB400螺纹钢 Φ16mm',
                name: 'HRB400螺纹钢 Φ16mm',
                code: 'RG-HRB400-16',
                specification: 'Φ16mm×12m',
                unit: '吨',
                price: 4150,
                category: '钢材类/螺纹钢/HRB400螺纹钢',
                type: 'product'
              }
            ]
          },
          {
            id: 10102,
            label: 'HRB500螺纹钢',
            type: 'small',
            productCount: 2,
            children: [
              {
                id: 1010201,
                label: 'HRB500螺纹钢 Φ12mm',
                name: 'HRB500螺纹钢 Φ12mm',
                code: 'RG-HRB500-12',
                specification: 'Φ12mm×12m',
                unit: '吨',
                price: 4450,
                category: '钢材类/螺纹钢/HRB500螺纹钢',
                type: 'product'
              },
              {
                id: 1010202,
                label: 'HRB500螺纹钢 Φ14mm',
                name: 'HRB500螺纹钢 Φ14mm',
                code: 'RG-HRB500-14',
                specification: 'Φ14mm×12m',
                unit: '吨',
                price: 4400,
                category: '钢材类/螺纹钢/HRB500螺纹钢',
                type: 'product'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        label: '线材',
        type: 'middle',
        children: [
          {
            id: 10201,
            label: '普通线材',
            type: 'small',
            productCount: 2,
            children: [
              {
                id: 1020101,
                label: 'Q235线材 Φ6.5mm',
                name: 'Q235线材 Φ6.5mm',
                code: 'XN-Q235-65',
                specification: 'Φ6.5mm',
                unit: '吨',
                price: 3950,
                category: '钢材类/线材/普通线材',
                type: 'product'
              },
              {
                id: 1020102,
                label: 'Q235线材 Φ8mm',
                name: 'Q235线材 Φ8mm',
                code: 'XN-Q235-08',
                specification: 'Φ8mm',
                unit: '吨',
                price: 3900,
                category: '钢材类/线材/普通线材',
                type: 'product'
              }
            ]
          }
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
        children: [
          {
            id: 20101,
            label: 'T2铜杆',
            type: 'small',
            productCount: 2,
            children: [
              {
                id: 2010101,
                label: 'T2铜杆 Φ10mm',
                name: 'T2铜杆 Φ10mm',
                code: 'TJ-T2-10',
                specification: 'Φ10mm×10m',
                unit: '吨',
                price: 68500,
                category: '铜材类/铜杆/T2铜杆',
                type: 'product'
              },
              {
                id: 2010102,
                label: 'T2铜杆 Φ12mm',
                name: 'T2铜杆 Φ12mm',
                code: 'TJ-T2-12',
                specification: 'Φ12mm×10m',
                unit: '吨',
                price: 68200,
                category: '铜材类/铜杆/T2铜杆',
                type: 'product'
              }
            ]
          }
        ]
      },
      {
        id: 202,
        label: '铜管',
        type: 'middle',
        children: [
          {
            id: 20201,
            label: '无缝铜管',
            type: 'small',
            productCount: 3,
            children: [
              {
                id: 2020101,
                label: 'T2无缝铜管 Φ20×1mm',
                name: 'T2无缝铜管 Φ20×1mm',
                code: 'GT-T2-201',
                specification: 'Φ20mm×1mm×5m',
                unit: '吨',
                price: 72000,
                category: '铜材类/铜管/无缝铜管',
                type: 'product'
              },
              {
                id: 2020102,
                label: 'T2无缝铜管 Φ25×1.5mm',
                name: 'T2无缝铜管 Φ25×1.5mm',
                code: 'GT-T2-2515',
                specification: 'Φ25mm×1.5mm×5m',
                unit: '吨',
                price: 71500,
                category: '铜材类/铜管/无缝铜管',
                type: 'product'
              },
              {
                id: 2020103,
                label: 'T2无缝铜管 Φ30×2mm',
                name: 'T2无缝铜管 Φ30×2mm',
                code: 'GT-T2-302',
                specification: 'Φ30mm×2mm×5m',
                unit: '吨',
                price: 71000,
                category: '铜材类/铜管/无缝铜管',
                type: 'product'
              }
            ]
          }
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
        children: [
          {
            id: 30101,
            label: '铝杆 1系',
            type: 'small',
            productCount: 2,
            children: [
              {
                id: 3010101,
                label: '1060铝杆 Φ15mm',
                name: '1060铝杆 Φ15mm',
                code: 'LJ-1060-15',
                specification: 'Φ15mm×9m',
                unit: '吨',
                price: 19800,
                category: '铝材类/铝杆/铝杆 1系',
                type: 'product'
              },
              {
                id: 3010102,
                label: '1060铝杆 Φ20mm',
                name: '1060铝杆 Φ20mm',
                code: 'LJ-1060-20',
                specification: 'Φ20mm×9m',
                unit: '吨',
                price: 19600,
                category: '铝材类/铝杆/铝杆 1系',
                type: 'product'
              }
            ]
          }
        ]
      },
      {
        id: 302,
        label: '铝板',
        type: 'middle',
        children: [
          {
            id: 30201,
            label: '防锈铝板',
            type: 'small',
            productCount: 2,
            children: [
              {
                id: 3020101,
                label: '3003防锈铝板 1mm',
                name: '3003防锈铝板 1mm',
                code: 'BH-3003-1',
                specification: '1220mm×2440mm×1mm',
                unit: '吨',
                price: 21500,
                category: '铝材类/铝板/防锈铝板',
                type: 'product'
              },
              {
                id: 3020102,
                label: '3003防锈铝板 2mm',
                name: '3003防锈铝板 2mm',
                code: 'BH-3003-2',
                specification: '1220mm×2440mm×2mm',
                unit: '吨',
                price: 21200,
                category: '铝材类/铝板/防锈铝板',
                type: 'product'
              }
            ]
          }
        ]
      }
    ]
  }
])

// 计算每个分类的商品数量
const calculateProductCount = (node) => {
  if (!node.children || node.children.length === 0) {
    return node.type === 'product' ? 1 : 0
  }
  let count = 0
  node.children.forEach((child) => {
    if (child.type === 'product') {
      count++
    } else {
      count += calculateProductCount(child)
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
  isLeaf: (data) => data.type === 'small' || data.type === 'product'
}

// ==================== 状态 ====================

const treeRef = ref(null)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const currentCategory = ref(null) // 当前选中的分类节点
const selectedProduct = ref(props.modelValue) // 当前选中的商品（单选）
const allProducts = ref([]) // 当前显示的所有商品
const currentRowKey = ref('') // 当前高亮行的key

// 当前选中路径
const currentPath = ref([])

// 商品表格列配置
const productColumns = [
  { label: '商品编码', field: 'code', minWidth: 150 },
  { label: '商品名称', field: 'name', minWidth: 200 },
  { label: '规格型号', field: 'specification', minWidth: 150 },
  { label: '单位', field: 'unit', minWidth: 80 },
  { label: '所属分类', field: 'category', minWidth: 180 },
  { label: '参考价格', field: 'price', minWidth: 120 }
]

// 过滤后的商品列表（分页后）
const filteredProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allProducts.value.slice(start, end)
})

const total = computed(() => allProducts.value.length)

// ==================== 方法 ====================

// 分页变化
const handlePageChange = () => {
  // 重新计算过滤后的商品
}

// 表格行点击
const handleRowClick = (row) => {
  // 单选模式，直接选择
  handleSelect(row)
}

// 树节点过滤
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value) || (data.code && data.code.includes(value))
}

// 搜索
const handleSearch = () => {
  if (treeRef.value) {
    treeRef.value.filter(searchKeyword.value)
  }
  // 如果搜索关键词匹配到商品，也显示商品
  if (searchKeyword.value && currentCategory.value?.type === 'product') {
    filterProductsByName(searchKeyword.value)
  }
}

// 按名称过滤商品
const filterProductsByName = (keyword) => {
  allProducts.value = allProducts.value.filter(
    (p) => p.name.includes(keyword) || p.code.includes(keyword)
  )
}

const scrollbarRef = ref()
// 树节点点击
const handleNodeClick = (data, node) => {
  if (data.type === 'product') {
    // 点击商品，选择它（单选）
    selectedProduct.value = data
    currentRowKey.value = data.id.toString()
    emit('update:modelValue', selectedProduct.value)
  } else if (data.type === 'small') {
    // 点击小类，显示下面的商品
    currentCategory.value = data
    currentPath.value = buildPath(node)
    allProducts.value = data.children || []
    currentPage.value = 1
    currentRowKey.value = ''
  } else if (data.type === 'middle' || data.type === 'big') {
    // 点击大类或中类，展开查看
    currentPath.value = buildPath(node)
    allProducts.value = []
    currentRowKey.value = ''
  }

  // 强制刷新，出现滚动条
  nextTick(() => {
    scrollbarRef.value?.update()
  })
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

// 选择单个商品（单选）
const handleSelect = (row) => {
  selectedProduct.value = row
  currentRowKey.value = row.id.toString()
  emit('update:modelValue', selectedProduct.value)
}

// 清除选择
const clearSelected = () => {
  selectedProduct.value = null
  currentRowKey.value = ''
  emit('update:modelValue', null)
}

// 确定选择
const handleConfirm = () => {
  if (!selectedProduct.value) {
    // 可以加一个提示
    return
  }
  emit('confirm', selectedProduct.value)
}

const goNext = () => {
  emit('next', selectedProduct.value)
}

const goPrev = () => {
  emit('prev', selectedProduct.value)
}
</script>

<style lang="scss" scoped>
.select-commodity-comp {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }

  .search-area {
    margin-bottom: 16px;
  }

  .content-area {
    display: flex;
    gap: 20px;
    // min-height: 450px;

    .category-tree {
      width: 280px;
      flex-shrink: 0;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      // padding: 12px;
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

      // 自定义滚动条样式
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

    .product-list {
      flex: 1;
      min-width: 0;

      .current-path {
        background: #f5f7fa;
        border-radius: 4px;

        .path-node {
          cursor: pointer;
          color: #409eff;

          &:hover {
            text-decoration: underline;
          }
        }

        .path-category {
          font-weight: 500;
        }
      }

      .pagination-area {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .selected-info {
    color: #409eff;
    font-weight: 500;
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

      &.small-category {
        color: #e6a23c;
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
