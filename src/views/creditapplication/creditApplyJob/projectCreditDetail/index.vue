<template>
  <div v-loading="loading" class="project-credit-detail">
    <div class="detail-tabs">
      <el-button
        v-for="tab in detail?.tabs || []"
        :key="tab.key"
        :type="activeTab === tab.key ? 'primary' : 'default'"
        plain
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </el-button>
    </div>

    <template v-if="detail">
      <section v-if="activeTab === 'detail'" class="detail-workspace">
        <aside class="detail-sidebar">
          <div class="customer-heading">
            <span class="customer-avatar">项</span>
            <div>
              <p>{{ detail.customerName }}</p>
              <span>{{ detail.customerId }}</span>
            </div>
          </div>

          <el-collapse v-model="openedGroup" accordion class="detail-menu">
            <el-collapse-item
              v-for="group in detail.menuGroups"
              :key="group.key"
              :name="group.key"
            >
              <template #title>
                <Icon icon="ep:folder-opened" class="menu-folder" />
                <span>{{ group.title }}</span>
              </template>
              <button
                v-for="item in group.items"
                :key="item.key"
                type="button"
                class="detail-menu-item"
                :class="{ 'is-active': activeSection === item.key }"
                @click="selectSection(group.key, item.key)"
              >
                <span class="menu-dot"></span>
                {{ item.label }}
              </button>
            </el-collapse-item>
          </el-collapse>
        </aside>

        <main class="detail-content">
          <div class="detail-toolbar">
            <div>
              <h1>{{ detail.title }}</h1>
              <p>申请编号：{{ detail.applicationNo }}</p>
            </div>
            <div class="toolbar-actions">
              <el-tag type="warning" effect="light">{{ detail.status }}</el-tag>
              <template v-if="isBasicSection">
                <el-button v-if="!editingBasic" @click="startBasicEdit">
                  <Icon icon="ep:edit-pen" class="mr-5px" />编辑基本信息
                </el-button>
                <template v-else>
                  <el-button @click="cancelBasicEdit">取消</el-button>
                  <el-button type="primary" :loading="saving" @click="handleSave">
                    <Icon icon="ep:document" class="mr-5px" />保存
                  </el-button>
                </template>
              </template>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">
              <span>{{ activeSectionData.title }}</span>
              <small v-if="activeSectionData.description">{{ activeSectionData.description }}</small>
            </div>

            <div v-if="isBasicSection && editingBasic" class="field-grid field-grid--editing">
              <div
                v-for="(field, index) in basicDraft"
                :key="field.key || field.label"
                class="field-row field-row--editing"
                :class="{ 'field-row--full': field.span === 2 }"
              >
                <label class="field-label" :for="`basic-field-${field.key || index}`">
                  {{ field.label }}<em v-if="field.required" class="field-required">*</em>
                </label>
                <el-date-picker
                  v-if="field.editor === 'date'"
                  :id="`basic-field-${field.key || index}`"
                  v-model="field.value"
                  type="date"
                  value-format="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                  class="field-input"
                />
                <el-select
                  v-else-if="field.editor === 'select'"
                  :id="`basic-field-${field.key || index}`"
                  v-model="field.value"
                  class="field-input"
                >
                  <el-option
                    v-for="option in field.options || []"
                    :key="option"
                    :label="option"
                    :value="option"
                  />
                </el-select>
                <el-input-number
                  v-else-if="field.editor === 'number'"
                  :id="`basic-field-${field.key || index}`"
                  v-model="field.value"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  class="field-input"
                />
                <el-checkbox-group
                  v-else-if="field.editor === 'checkbox'"
                  v-model="field.value"
                  class="field-checkboxes"
                >
                  <el-checkbox v-for="option in field.options || []" :key="option" :label="option">
                    {{ option }}
                  </el-checkbox>
                </el-checkbox-group>
                <el-input
                  v-else-if="field.editor === 'textarea'"
                  :id="`basic-field-${field.key || index}`"
                  v-model="field.value"
                  type="textarea"
                  :rows="3"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  maxlength="400"
                  show-word-limit
                  class="field-input"
                />
                <el-input
                  v-else-if="field.editor === 'picker'"
                  :id="`basic-field-${field.key || index}`"
                  :model-value="displayFieldValue(field)"
                  readonly
                  class="field-input"
                >
                  <template #append>
                    <el-button :data-testid="`picker-${field.key}`" @click="openPicker(field)">选择</el-button>
                  </template>
                </el-input>
                <el-input
                  v-else
                  :id="`basic-field-${field.key || index}`"
                  v-model="field.value"
                  class="field-input"
                />
                <small v-if="field.unit" class="field-unit">{{ field.unit }}</small>
              </div>
            </div>

            <div v-else-if="activeSectionData.fields?.length" class="field-grid">
              <div
                v-for="field in activeSectionData.fields"
                :key="field.key || field.label"
                class="field-row"
                :class="{ 'field-row--full': field.span === 2 }"
              >
                <span class="field-label">{{ field.label }}</span>
                <span class="field-value">
                  {{ displayFieldValue(field) }}<small v-if="field.unit" class="field-unit">{{ field.unit }}</small>
                </span>
              </div>
            </div>

            <el-table
              v-if="activeSectionData.rows?.length"
              :data="activeSectionData.rows"
              border
              stripe
              class="detail-table"
            >
              <el-table-column
                v-for="column in activeSectionData.columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                min-width="140"
              />
            </el-table>
          </div>
        </main>
      </section>

      <section v-else-if="activeTab === 'customer'" class="customer-detail-tab">
        <div class="detail-toolbar">
          <div>
            <h1>客户详情</h1>
            <p>客户基础资料（本地 Mock）</p>
          </div>
          <el-tag type="success" effect="light">已核验</el-tag>
        </div>
        <div class="section-card">
          <div class="section-title"><span>客户基本信息</span></div>
          <div class="field-grid">
            <div
              v-for="field in detail.customer.fields"
              :key="field.label"
              class="field-row"
              :class="{ 'field-row--full': field.span === 2 }"
            >
              <span class="field-label">{{ field.label }}</span>
              <span class="field-value">{{ field.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="attachments-tab">
        <div class="detail-toolbar">
          <div>
            <h1>影像系统资料</h1>
            <p>以下为本地演示使用的影像资料清单</p>
          </div>
          <el-tag type="info" effect="light">Mock 数据</el-tag>
        </div>
        <div class="attachment-list">
          <el-card v-for="file in detail.attachments" :key="file.name" shadow="never" class="attachment-card">
            <div class="attachment-icon"><Icon icon="ep:document" /></div>
            <div class="attachment-main">
              <strong>{{ file.name }}</strong>
              <span>{{ file.type }} · {{ file.date }}</span>
            </div>
            <el-tag :type="file.status === '已归档' ? 'success' : 'warning'" effect="plain">
              {{ file.status }}
            </el-tag>
          </el-card>
        </div>
      </section>
    </template>

    <el-dialog v-model="pickerVisible" :title="pickerDialogTitle" width="680px" append-to-body>
      <p class="picker-tip">请选择一条 Mock 数据，确认后会回填到当前基本信息表单。</p>
      <el-table :data="pickerOptions" border highlight-current-row @row-click="selectPickerOption">
        <el-table-column prop="code" label="编码" width="150" />
        <el-table-column prop="label" label="名称" min-width="190" />
        <el-table-column prop="description" label="说明" min-width="220" />
        <el-table-column label="选择" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="selectedPickerValue === row.value" type="primary" effect="light">已选择</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="pickerVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedPickerValue" @click="confirmPicker">确认选择</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import {
  getProjectCreditDetail,
  saveProjectCreditDetail
} from '@/api/creditapplication/creditApplyJob/projectCreditDetail'

type PickerType = 'enterprise' | 'businessType' | 'guarantee'

interface DetailFieldBase {
  key?: string
  label: string
  span?: number
  required?: boolean
  unit?: string
}

interface TextDetailField extends DetailFieldBase {
  value: string
  editor?: 'text' | 'date' | 'select' | 'textarea' | 'picker'
  options?: string[]
  picker?: PickerType
}

interface NumberDetailField extends DetailFieldBase {
  value: number | undefined
  editor: 'number'
}

interface CheckboxDetailField extends DetailFieldBase {
  value: string[]
  editor: 'checkbox'
  options: string[]
}

type DetailField = TextDetailField | NumberDetailField | CheckboxDetailField
type FieldValue = DetailField['value']

interface DetailSection {
  title: string
  description?: string
  fields?: DetailField[]
  columns?: Array<{ prop: string; label: string }>
  rows?: Array<Record<string, string>>
}

interface DetailData {
  title: string
  applicationNo: string
  customerName: string
  customerId: string
  status: string
  tabs: Array<{ key: string; label: string }>
  menuGroups: Array<{ key: string; title: string; items: Array<{ key: string; label: string }> }>
  sections: Record<string, DetailSection>
  customer: { fields: DetailField[] }
  attachments: Array<{ name: string; type: string; date: string; status: string }>
}

interface PickerOption {
  code: string
  label: string
  value: string
  description: string
}

defineOptions({ name: 'ProjectCreditDetail' })

const route = useRoute()
const detail = ref<DetailData>()
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('detail')
const activeSection = ref('basic')
const openedGroup = ref('application')
const editingBasic = ref(false)
const basicDraft = ref<DetailField[]>([])
const pickerVisible = ref(false)
const pickerTarget = ref<PickerType>()
const pickerFieldKey = ref('')
const selectedPickerValue = ref('')

const pickerSource: Record<PickerType, PickerOption[]> = {
  enterprise: [
    { code: 'SC2025040300000003', label: '阿姆特拉斯供应链有限公司', value: '阿姆特拉斯供应链有限公司', description: '核心企业 · 上海市' },
    { code: 'SC2025040300000004', label: '新城贸易有限公司', value: '新城贸易有限公司', description: '核心企业 · 上海市' },
    { code: 'SC2025040300000005', label: '华东制造集团有限公司', value: '华东制造集团有限公司', description: '核心企业 · 江苏省' }
  ],
  businessType: [
    { code: '3030010', label: '单一客户综合授信', value: '单一客户综合授信', description: '综合授信额度产品' },
    { code: '3030070', label: '供应链群额度', value: '供应链群额度', description: '供应链核心企业群额度产品' },
    { code: '3030030', label: '供应链间接授信额度', value: '供应链间接授信额度', description: '供应链间接授信产品' }
  ],
  guarantee: [
    { code: 'G001', label: '保证、应收账款质押', value: '保证、应收账款质押', description: '集团保证与应收账款质押组合' },
    { code: 'G002', label: '连带责任保证', value: '连带责任保证', description: '核心企业或集团公司保证' },
    { code: 'G003', label: '应收账款质押', value: '应收账款质押', description: '以贸易项下应收账款质押' },
    { code: 'G004', label: '保证金质押', value: '保证金质押', description: '以保证金账户质押' }
  ]
}

const activeSectionData = computed<DetailSection>(() =>
  detail.value?.sections[activeSection.value] || { title: '详情信息' }
)
const isBasicSection = computed(() => activeTab.value === 'detail' && activeSection.value === 'basic')
const pickerOptions = computed<PickerOption[]>(() =>
  pickerTarget.value ? pickerSource[pickerTarget.value] : []
)
const pickerDialogTitle = computed(() => {
  const field = basicDraft.value.find((item) => item.key === pickerFieldKey.value)
  return `选择${field?.label || '数据'}`
})

const displayFieldValue = (field: DetailField) => {
  if (Array.isArray(field.value)) return field.value.join('、')
  if (typeof field.value === 'number') {
    return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(field.value)
  }
  return field.value || '-'
}

const cloneDetailFields = (fields: DetailField[]): DetailField[] =>
  fields.map((field) => {
    if (field.editor === 'checkbox') {
      return { ...field, value: [...field.value], options: [...field.options] }
    }
    return { ...field }
  })

const loadDetail = async () => {
  loading.value = true
  try {
    detail.value = await getProjectCreditDetail({
      serialNo: route.query.serialNo || route.query.objectNo
    })
    editingBasic.value = false
    basicDraft.value = []
  } finally {
    loading.value = false
  }
}

const selectSection = (groupKey: string, sectionKey: string) => {
  if (sectionKey !== 'basic') cancelBasicEdit()
  openedGroup.value = groupKey
  activeSection.value = sectionKey
}

const selectTab = (tabKey: string) => {
  if (tabKey !== 'detail') cancelBasicEdit()
  activeTab.value = tabKey
}

const startBasicEdit = () => {
  const fields = detail.value?.sections.basic?.fields || []
  basicDraft.value = cloneDetailFields(fields)
  editingBasic.value = true
}

const cancelBasicEdit = () => {
  editingBasic.value = false
  basicDraft.value = []
}

const openPicker = (field: DetailField) => {
  if (!field.key || !field.picker) return
  pickerFieldKey.value = field.key
  pickerTarget.value = field.picker
  selectedPickerValue.value = typeof field.value === 'string' ? field.value : ''
  pickerVisible.value = true
}

const selectPickerOption = (option: PickerOption) => {
  selectedPickerValue.value = option.value
}

const confirmPicker = () => {
  const field = basicDraft.value.find((item) => item.key === pickerFieldKey.value)
  if (field && selectedPickerValue.value) field.value = selectedPickerValue.value
  pickerVisible.value = false
}

const isEmptyFieldValue = (value: FieldValue) =>
  Array.isArray(value) ? value.length === 0 : value === '' || value === undefined

const handleSave = async () => {
  if (!detail.value || !editingBasic.value) return

  const requiredField = basicDraft.value.find((field) => field.required && isEmptyFieldValue(field.value))
  if (requiredField) {
    ElMessage.warning(`请填写${requiredField.label}`)
    return
  }

  saving.value = true
  try {
    const savedFields = cloneDetailFields(basicDraft.value)
    await saveProjectCreditDetail({
      serialNo: detail.value?.applicationNo,
      activeSection: activeSection.value,
      basicFields: savedFields
    })
    detail.value.sections.basic.fields = savedFields

    const customerName = savedFields.find((field) => field.label === '核心企业名称')?.value
    if (typeof customerName === 'string' && customerName) {
      detail.value.customerName = customerName
      const customerField = detail.value.customer.fields.find((field) => field.label === '客户名称')
      if (customerField) customerField.value = customerName
    }

    cancelBasicEdit()
    ElMessage.success('基本信息已保存到本地 Mock 数据')
  } finally {
    saving.value = false
  }
}

watch(
  () => [route.query.serialNo, route.query.objectNo],
  () => loadDetail(),
  { immediate: true }
)
</script>

<style scoped lang="scss">
.project-credit-detail {
  min-height: calc(100vh - 130px);
  padding: 8px;
  background: var(--el-bg-color-page);
}

.detail-tabs {
  display: flex;
  gap: 0;
  padding: 0 4px 8px;

  .el-button {
    margin: 0;
    border-radius: 0;
  }
}

.detail-workspace {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 178px);
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.detail-sidebar {
  overflow: auto;
  padding: 14px 10px;
  background: #f6f8fb;
  border-right: 1px solid var(--el-border-color-lighter);
}

.customer-heading {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 2px 8px 16px;

  p {
    margin: 0 0 3px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:not(.customer-avatar) {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.customer-avatar {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #367cf6, #154fb7);
  border-radius: 50%;
  place-items: center;
}

.detail-menu {
  border-top: 0;
  border-bottom: 0;
}

.menu-folder {
  margin-right: 7px;
  color: #7789a4;
}

.detail-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 34px;
  padding: 0 12px 0 24px;
  color: var(--el-text-color-regular);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;

  &:hover,
  &.is-active {
    color: var(--el-color-primary);
    background: #eaf2ff;
  }

  &.is-active {
    font-weight: 600;
  }
}

.menu-dot {
  width: 5px;
  height: 5px;
  margin-right: 9px;
  background: #63b36d;
  border-radius: 50%;
}

.detail-content,
.customer-detail-tab,
.attachments-tab {
  min-width: 0;
  padding: 24px 28px;
  background: var(--el-bg-color);
}

.detail-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;

  h1 {
    margin: 0 0 8px;
    color: var(--el-text-color-primary);
    font-size: 20px;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.toolbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.section-card {
  padding: 20px 22px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.section-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  span {
    color: var(--el-text-color-primary);
    font-size: 17px;
    font-weight: 700;
  }

  small {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}

.field-row {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr);
  align-items: start;
  min-height: 42px;
  border-bottom: 1px solid #f0f2f5;

  &--full {
    grid-column: 1 / -1;
  }

  &--editing {
    align-items: center;
    grid-template-columns: 138px minmax(0, 1fr) auto;
  }
}

.field-label {
  padding: 11px 10px 10px 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 20px;
}

.field-value {
  padding: 11px 0 10px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
}

.field-required {
  margin-left: 3px;
  color: var(--el-color-danger);
  font-style: normal;
}

.field-unit {
  margin-left: 7px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  font-style: normal;
  white-space: nowrap;
}

.field-grid--editing {
  .field-row {
    min-height: 52px;
  }
}

.field-input {
  width: 100%;
  margin: 6px 0;
}

.field-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 14px;
  padding: 10px 0;

  :deep(.el-checkbox) {
    margin-right: 0;
  }
}

.picker-tip {
  margin: 0 0 14px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.detail-table {
  margin-top: 4px;
}

.attachment-list {
  display: grid;
  gap: 12px;
}

.attachment-card :deep(.el-card__body) {
  display: flex;
  gap: 14px;
  align-items: center;
}

.attachment-icon {
  display: grid;
  width: 38px;
  height: 38px;
  color: var(--el-color-primary);
  font-size: 21px;
  background: #edf4ff;
  border-radius: 6px;
  place-items: center;
}

.attachment-main {
  display: grid;
  flex: 1;
  gap: 4px;

  strong {
    color: var(--el-text-color-primary);
    font-size: 14px;
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

@media (max-width: 900px) {
  .detail-workspace {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .field-row--full {
    grid-column: auto;
  }

  .field-row--editing {
    grid-template-columns: 118px minmax(0, 1fr) auto;
  }
}
</style>
