# Vue3 Element-Plus CRUD Code Generator

This skill instructs the agent on how to generate new modules (pages, dialog forms, API files, and routes) that perfectly conform to the architecture of the `yudao-ui-admin-vue3` framework used in this project.

## Core Rules

1. **UI Framework**: Element Plus (`el-form`, `el-table`, `el-button`, etc.) combined with **UnoCSS** utility classes. Do NOT import or use Tailwind CSS styles. Do NOT write custom `<style>` tags unless absolutely necessary.
2. **Setup Script**: Always use `<script setup lang="ts">`.
3. **Options Define**: Define name options using `defineOptions({ name: 'ModuleName' })`.
4. **Icons**: Use the custom `<Icon>` component mapping ep icons, e.g., `<Icon icon="ep:plus" />`.
5. **State & Utilities**:
   - For dialog message alerts: `const message = useMessage()`.
   - For translation: `const { t } = useI18n()`.
   - For dictionaries: `import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'`.
   - For time formatting: `import { dateFormatter } from '@/utils/formatTime'`.
6. **Permissions**: Wrap actions in `v-hasPermi="['permission:key:action']"`.

---

## Code Templates

### 1. API Template (`api.ts`)

```typescript
import request from '@/config/axios'

export interface ModelVO {
  id?: number
  // Add entity fields here
  createTime?: Date
}

export const ModelApi = {
  // Get list page
  getModelPage: async (params: any) => {
    return await request.get({ url: `/path/to/page`, params })
  },
  // Get details
  getModel: async (id: number) => 
    return await request.get({ url: `/path/to/get?id=` + id })
  },
  // Create new entity
  createModel: async (data: ModelVO) => {
    return await request.post({ url: `/path/to/create`, data })
  },
  // Update entity
  updateModel: async (data: ModelVO) => {
    return await request.put({ url: `/path/to/update`, data })
  },
  // Delete entity
  deleteModel: async (id: number) => {
    return await request.delete({ url: `/path/to/delete?id=` + id })
  },
  // Export list
  exportModel: async (params: any) => {
    return await request.download({ url: `/path/to/export`, params })
  }
}
```

### 2. Main List Template (`index.vue`)

```vue
<template>
  <ContentWrap>
    <!-- Search Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['module:model:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['module:model:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- Table List -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['module:model:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['module:model:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Dialog Form -->
  <ModelForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ModelApi, ModelVO } from '@/api/module/model'
import ModelForm from './ModelForm.vue'

defineOptions({ name: 'ModelList' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<ModelVO[]>([])
const total = ref(0)
const exportLoading = ref(false)
const queryFormRef = ref()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined
})

const getList = async () => {
  loading.value = true
  try {
    const data = await ModelApi.getModelPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await ModelApi.deleteModel(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await ModelApi.exportModel(queryParams)
    download.excel(data, '数据导出.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>
```

### 3. Dialog Form Template (`Form.vue`)

```vue
<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ModelApi, ModelVO } from '@/api/module/model'

defineOptions({ name: 'ModelForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<ModelVO>({
  id: undefined,
  name: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增' : '编辑'
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ModelApi.getModel(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    const data = formData.value as ModelVO
    if (formType.value === 'create') {
      await ModelApi.createModel(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelApi.updateModel(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined
  }
  formRef.value?.resetFields()
}
</script>
```
