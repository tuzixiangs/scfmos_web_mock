<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="handleSearch"
      @reset="handleSearch"
    />

    <ActionBar :buttons="buttons" />

    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{ total: tableObject.total }"
      highlight-current-row
      :onRowClick="handleRowClick"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === '有效' ? 'success' : 'info'" effect="light">
          {{ row.status }}
        </el-tag>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" title="基于当前品类新增" @click.stop="openCreateFromReference(row)">
          <Icon icon="ep:plus" class="mr-3px" />
          新增
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog
    v-model="formVisible"
    :title="formTitle"
    width="780px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-steps :active="createStep" finish-status="success" align-center class="category-create-steps">
      <el-step title="商品大类" description="填写大类名称" />
      <el-step title="商品中类" description="填写中类名称" />
      <el-step title="商品小类" description="填写小类并保存" />
    </el-steps>

    <el-alert
      v-if="createMode === 'based' && referenceRecord"
      :title="`已带入“${referenceRecord.smallCategoryName}”的层级信息，可在各步骤中修改`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <el-alert
      title="商品编码将在保存时按名称的拼音首字母自动生成；新增的层级名称不能与已有商品分类重复。"
      type="warning"
      :closable="false"
      class="mb-16px"
    />

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="112px">
      <template v-if="createStep === 0">
        <el-form-item label="商品大类名称" prop="largeCategoryName">
          <el-input v-model.trim="formData.largeCategoryName" placeholder="请输入商品大类名称" />
        </el-form-item>
        <el-form-item label="编码预览">
          <el-input :model-value="codePreview.largeCategoryCode" readonly />
        </el-form-item>
      </template>

      <template v-else-if="createStep === 1">
        <div class="category-parent-node">
          <span>商品大类</span>
          <strong>{{ formData.largeCategoryName }}</strong>
          <code>{{ codePreview.largeCategoryCode }}</code>
        </div>
        <el-form-item label="商品中类名称" prop="middleCategoryName">
          <el-input v-model.trim="formData.middleCategoryName" placeholder="请输入商品中类名称" />
        </el-form-item>
        <el-form-item label="编码预览">
          <el-input :model-value="codePreview.middleCategoryCode" readonly />
        </el-form-item>
      </template>

      <template v-else>
        <div class="category-parent-node category-parent-node--stacked">
          <span>商品大类</span>
          <strong>{{ formData.largeCategoryName }}</strong>
          <code>{{ codePreview.largeCategoryCode }}</code>
          <span>商品中类</span>
          <strong>{{ formData.middleCategoryName }}</strong>
          <code>{{ codePreview.middleCategoryCode }}</code>
        </div>
        <el-form-item label="商品小类名称" prop="smallCategoryName">
          <el-input v-model.trim="formData.smallCategoryName" placeholder="请输入商品小类名称" />
        </el-form-item>
        <el-form-item label="编码预览">
          <el-input :model-value="codePreview.smallCategoryCode" readonly />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入该商品品类的适用说明"
          />
        </el-form-item>
        <el-form-item label="默认状态">
          <el-tag type="success">有效</el-tag>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button v-if="createStep > 0" @click="createStep -= 1">上一步</el-button>
      <el-button v-if="createStep < 2" type="primary" @click="nextCreateStep">下一步</el-button>
      <el-button v-else type="primary" :loading="saveLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="categoryViewVisible" title="有效商品品类视图" width="90%" destroy-on-close>
    <div v-loading="categoryViewLoading" class="category-mind-map">
      <div v-if="categoryMindMap.length" class="mind-map-content">
        <div class="mind-map-root">
          <span class="mind-map-root-title">有效商品分类</span>
          <span class="mind-map-root-count">{{ activeCategoryCount }} 个商品小类</span>
        </div>

        <div class="mind-map-branches">
          <section
            v-for="largeCategory in categoryMindMap"
            :key="largeCategory.id"
            class="mind-map-large-branch"
          >
            <div class="mind-map-large-node">
              <span class="mind-map-code">{{ largeCategory.code }}</span>
              <span>{{ largeCategory.name }}</span>
            </div>

            <div class="mind-map-middle-list">
              <div
                v-for="middleCategory in largeCategory.children"
                :key="middleCategory.id"
                class="mind-map-middle-branch"
              >
                <div class="mind-map-middle-node">
                  <span class="mind-map-code">{{ middleCategory.code }}</span>
                  <span>{{ middleCategory.name }}</span>
                </div>
                <div class="mind-map-small-list">
                  <div
                    v-for="smallCategory in middleCategory.children"
                    :key="smallCategory.id"
                    class="mind-map-small-node"
                  >
                    <span class="mind-map-code">{{ smallCategory.code }}</span>
                    <span>{{ smallCategory.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <el-empty v-else-if="!categoryViewLoading" description="暂无有效商品分类" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as InventoryGoodsApi from '@/api/indebt/inventoryGoods'
import {
  createUniqueCategoryCode,
  generateInventoryGoodsCodes,
  getCategoryNameInitials
} from '@/utils/productCategoryCode'

defineOptions({ name: 'InventoryGoodsManagement' })

type CategoryMindMapNode = {
  id: string
  code: string
  name: string
  children: CategoryMindMapNode[]
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '商品大类编码',
    field: 'largeCategoryCode',
    fixed: 'left',
    minWidth: 145,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入大类编码' } }
  },
  {
    label: '商品大类名称',
    field: 'largeCategoryName',
    minWidth: 165,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入大类名称' } }
  },
  { label: '商品中类编码', field: 'middleCategoryCode', minWidth: 145 },
  { label: '商品中类名称', field: 'middleCategoryName', minWidth: 165 },
  { label: '商品小类编码', field: 'smallCategoryCode', minWidth: 145 },
  { label: '商品小类名称', field: 'smallCategoryName', minWidth: 165 },
  { label: '备注', field: 'remark', minWidth: 220 },
  {
    label: '状态',
    field: 'status',
    minWidth: 100,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '全部', value: '' },
          { label: '有效', value: '有效' },
          { label: '历史', value: '历史' }
        ]
      }
    }
  },
  { label: '维护时间', field: 'maintainTime', minWidth: 170 },
  { label: '维护人', field: 'maintainer', minWidth: 110 },
  { label: '操作', field: 'action', fixed: 'right', width: 90 }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, tableMethods } = useTable<InventoryGoodsApi.InventoryGoodsRecord>({
  getListApi: InventoryGoodsApi.getInventoryGoodsPage
})
const { getList, setSearchParams } = tableMethods

const currentRow = ref<InventoryGoodsApi.InventoryGoodsRecord>()
const formVisible = ref(false)
const createMode = ref<InventoryGoodsApi.InventoryGoodsCreateMode>('direct')
const createStep = ref(0)
const referenceRecord = ref<InventoryGoodsApi.InventoryGoodsRecord>()
const categoryViewVisible = ref(false)
const categoryViewLoading = ref(false)
const saveLoading = ref(false)
const formRef = ref<FormInstance>()
const categoryMindMap = ref<CategoryMindMapNode[]>([])
const activeCategoryCount = ref(0)

const initialFormData = (): InventoryGoodsApi.InventoryGoodsForm => ({
  largeCategoryName: '',
  middleCategoryName: '',
  smallCategoryName: '',
  remark: ''
})

const formData = reactive<InventoryGoodsApi.InventoryGoodsForm>(initialFormData())
const formRules: FormRules<InventoryGoodsApi.InventoryGoodsForm> = {
  largeCategoryName: [{ required: true, message: '请输入商品大类名称', trigger: 'blur' }],
  middleCategoryName: [{ required: true, message: '请输入商品中类名称', trigger: 'blur' }],
  smallCategoryName: [{ required: true, message: '请输入商品小类名称', trigger: 'blur' }]
}

const formTitle = computed(() =>
  createMode.value === 'based' ? '基于原有品类新增' : '新增商品品类'
)

const codePreview = computed(() => {
  const generatedCodes = generateInventoryGoodsCodes(formData)
  const source = referenceRecord.value
  const existingRecords = tableObject.tableList
  const reuseLargeCategory =
    createMode.value === 'based' && !!source && formData.largeCategoryName === source.largeCategoryName
  const largeCategoryCode = reuseLargeCategory
    ? source!.largeCategoryCode
    : createUniqueCategoryCode(
        generatedCodes.largeCategoryCode,
        existingRecords.map((record) => record.largeCategoryCode)
      )
  const reuseMiddleCategory =
    reuseLargeCategory && formData.middleCategoryName === source?.middleCategoryName
  const middleCategoryCode = reuseMiddleCategory
    ? source!.middleCategoryCode
    : createUniqueCategoryCode(
        `${largeCategoryCode}-${getCategoryNameInitials(formData.middleCategoryName)}`,
        existingRecords.map((record) => record.middleCategoryCode)
      )

  return {
    largeCategoryCode,
    middleCategoryCode,
    smallCategoryCode: createUniqueCategoryCode(
      `${middleCategoryCode}-${getCategoryNameInitials(formData.smallCategoryName)}`,
      existingRecords.map((record) => record.smallCategoryCode)
    )
  }
})

const buildCategoryMindMap = (
  records: InventoryGoodsApi.InventoryGoodsRecord[]
): CategoryMindMapNode[] => {
  const largeCategories = new Map<string, CategoryMindMapNode>()

  records.forEach((record) => {
    const largeId = `large-${record.largeCategoryCode}`
    let largeCategory = largeCategories.get(largeId)
    if (!largeCategory) {
      largeCategory = {
        id: largeId,
        code: record.largeCategoryCode,
        name: record.largeCategoryName,
        children: []
      }
      largeCategories.set(largeId, largeCategory)
    }

    const middleId = `${largeId}-middle-${record.middleCategoryCode}`
    let middleCategory = largeCategory.children.find((item) => item.id === middleId)
    if (!middleCategory) {
      middleCategory = {
        id: middleId,
        code: record.middleCategoryCode,
        name: record.middleCategoryName,
        children: []
      }
      largeCategory.children.push(middleCategory)
    }

    middleCategory.children.push({
      id: `small-${record.id}`,
      code: record.smallCategoryCode,
      name: record.smallCategoryName,
      children: []
    })
  })

  return Array.from(largeCategories.values())
}

const buttons = ref<ActionButton[]>([
  {
    key: 'create',
    label: '新增品类',
    icon: 'ep:plus',
    plain: true,
    onClick: () => openCreate('direct')
  },
  {
    key: 'create-based',
    label: '基于原有品类新增',
    icon: 'ep:circle-plus',
    plain: true,
    onClick: () => openCreateFromSelected()
  },
  {
    key: 'history',
    label: '置为历史',
    icon: 'ep:folder-delete',
    plain: true,
    onClick: (button) => handleSetHistory(button)
  },
  {
    key: 'category-view',
    label: '品类视图',
    icon: 'ep:share',
    plain: true,
    onClick: () => openCategoryView()
  }
])

const handleRowClick = (row: InventoryGoodsApi.InventoryGoodsRecord) => {
  currentRow.value = row
  tableObject.currentRow = row
}

const clearCurrentRow = () => {
  currentRow.value = undefined
  tableObject.currentRow = null
}

const refreshList = async () => {
  clearCurrentRow()
  await getList()
}

const handleSearch = (params: Recordable) => {
  clearCurrentRow()
  setSearchParams(params)
}

const openCategoryView = async () => {
  categoryViewVisible.value = true
  categoryViewLoading.value = true
  try {
    const activeRecords = await InventoryGoodsApi.getActiveInventoryGoods()
    categoryMindMap.value = buildCategoryMindMap(activeRecords)
    activeCategoryCount.value = activeRecords.length
  } finally {
    categoryViewLoading.value = false
  }
}

const openCreate = (
  mode: InventoryGoodsApi.InventoryGoodsCreateMode,
  source?: InventoryGoodsApi.InventoryGoodsRecord
) => {
  createMode.value = mode
  referenceRecord.value = source
  createStep.value = 0
  Object.assign(
    formData,
    source
      ? {
          largeCategoryName: source.largeCategoryName,
          middleCategoryName: source.middleCategoryName,
          smallCategoryName: source.smallCategoryName,
          remark: source.remark
        }
      : initialFormData()
  )
  formRef.value?.clearValidate()
  formVisible.value = true
}

const openCreateFromSelected = () => {
  if (!currentRow.value) {
    ElMessage.warning('请先点击选择一条商品品类数据，再点击“基于原有品类新增”')
    return
  }
  openCreate('based', currentRow.value)
}

const openCreateFromReference = (row: InventoryGoodsApi.InventoryGoodsRecord) => {
  openCreate('based', row)
}

const nextCreateStep = async () => {
  const fields = createStep.value === 0 ? ['largeCategoryName'] : ['middleCategoryName']
  const valid = await formRef.value?.validateField(fields).then(() => true).catch(() => false)
  if (valid) createStep.value += 1
}

const handleCreate = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saveLoading.value = true
  try {
    const result = await InventoryGoodsApi.createInventoryGoods({
      ...formData,
      createMode: createMode.value,
      sourceId: referenceRecord.value?.id
    })
    if (!result.success) {
      createStep.value =
        result.duplicateLevel === 'large' ? 0 : result.duplicateLevel === 'middle' ? 1 : 2
      ElMessage.error(result.message || '新增失败，请检查商品分类名称')
      return
    }

    ElMessage.success('商品品类已新增，状态默认为有效')
    formVisible.value = false
    await refreshList()
  } finally {
    saveLoading.value = false
  }
}

const handleSetHistory = async (button: ActionButton) => {
  if (!currentRow.value) {
    ElMessage.warning('请先点击选择一条商品品类数据')
    return
  }
  if (currentRow.value.status === '历史') {
    ElMessage.warning('当前品类已经是历史状态')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认将“${currentRow.value.smallCategoryName}”置为历史吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  button.loading = true
  try {
    await InventoryGoodsApi.setInventoryGoodsHistory([currentRow.value.id])
    ElMessage.success('已置为历史')
    await refreshList()
  } finally {
    button.loading = false
  }
}

watch(
  () => [tableObject.currentPage, tableObject.pageSize],
  () => clearCurrentRow()
)

onMounted(refreshList)
</script>

<style scoped lang="scss">
.category-create-steps {
  margin: 0 10px 24px;
}

.category-parent-node {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 10px 12px;
  color: #496078;
  background: #f6faff;
  border: 1px solid #d7e7f8;
  border-radius: 6px;

  span {
    color: #7b8ea5;
    font-size: 12px;
  }

  strong {
    color: #245f9f;
  }

  code {
    padding: 2px 6px;
    color: #3976b3;
    background: #eaf4ff;
    border-radius: 3px;
  }
}

.category-parent-node--stacked {
  flex-wrap: wrap;
}

.category-mind-map {
  min-height: 420px;
  overflow: auto;
  padding: 8px 4px 20px;
}

.mind-map-content {
  min-width: 920px;
  padding: 8px 20px;
}

.mind-map-root {
  position: relative;
  display: flex;
  width: fit-content;
  min-width: 190px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 0 auto 42px;
  padding: 14px 24px;
  color: #fff;
  background: linear-gradient(135deg, #1d74d8, #4c9cf5);
  border-radius: 12px;
  box-shadow: 0 8px 18px rgb(43 119 209 / 22%);
}

.mind-map-root::after {
  position: absolute;
  bottom: -26px;
  width: 2px;
  height: 26px;
  content: '';
  background: #9fc3ef;
}

.mind-map-root-title {
  font-size: 17px;
  font-weight: 600;
}

.mind-map-root-count {
  font-size: 12px;
  opacity: 0.9;
}

.mind-map-branches {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 30px 24px;
}

.mind-map-branches::before {
  position: absolute;
  top: -17px;
  right: 9%;
  left: 9%;
  height: 1px;
  content: '';
  background: #9fc3ef;
}

.mind-map-large-branch {
  position: relative;
}

.mind-map-large-branch::before {
  position: absolute;
  top: -17px;
  left: 50%;
  width: 1px;
  height: 17px;
  content: '';
  background: #9fc3ef;
}

.mind-map-large-node,
.mind-map-middle-node,
.mind-map-small-node {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.mind-map-large-node {
  justify-content: center;
  padding: 10px 14px;
  color: #175ca8;
  font-weight: 600;
  background: #eaf4ff;
  border: 1px solid #acd0f8;
}

.mind-map-middle-list {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.mind-map-middle-branch {
  position: relative;
  padding-left: 22px;
  border-left: 1px solid #b9d5f4;
}

.mind-map-middle-branch::before {
  position: absolute;
  top: 17px;
  left: 0;
  width: 20px;
  height: 1px;
  content: '';
  background: #b9d5f4;
}

.mind-map-middle-node {
  padding: 8px 10px;
  color: #256c4e;
  background: #effaf5;
  border: 1px solid #bce5d2;
}

.mind-map-small-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.mind-map-small-node {
  padding: 6px 8px;
  color: #5a6778;
  font-size: 12px;
  background: #f7f9fc;
  border: 1px solid #dce5ef;
}

.mind-map-code {
  color: #3976b3;
  font-family: var(--el-font-family-monospace);
  font-size: 12px;
  white-space: nowrap;
}

</style>
