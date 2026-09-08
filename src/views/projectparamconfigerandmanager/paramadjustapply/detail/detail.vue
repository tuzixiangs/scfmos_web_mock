<template>
  <ContentWrap v-loading="loading">
    <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="tempTab in tempTabsList"
        :key="tempTab.dockid"
        :name="tempTab.dockid"
        :label="tempTab.dockname"
        lazy
      >
        <ActionBar :buttons="visibleBtns" />
        <div class="mb-2 text-gray-400" v-if="isEdit || projectPartnerAdmin">
          <p v-if="tempTab.dockid === 'BasicPart_HEAD'">说明：由分行合作方管理员维护，项目参数调整申请中无法维护</p>
          <p v-else>说明：只显示当前项目所属供应链产品管理的参数，如果项目所属产品未配置，则不显示。</p>
        </div>
        <el-scrollbar max-height="calc(100vh - 300px)">
          <dynamicForm
            :key="tempTab.dockid"
            :ref="(el) => handleSetFormRef(el, tempTab.dockid)"
            :dockList="tempTab.dockList"
            :formData="formData"
            :formTempList="tempTab.templates"
            :customVisible="customVisible"
            :customRequired="customRequired"
            label-width="auto"
            @pop-confirm="popConfirm"
            @select-input-click="handleSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="handleRenderFinished"
          >
            <!-- 参与方维护 （列表，只展示） -->
            <template #ParticpantsPart>
              <ParticpantsPart
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
              />
            </template>
            <!-- 出账相关受托支付账号限制 -->
            <template #AccountsNumberPart>
              <AccountsNumberPart
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
              />
            </template>
            <!-- 核心企业子公司扣款账户维护 -->
            <template #subentcortacctlist="{ formInfo }">
              <div class="mb-1 font-bold"> {{ formInfo.colheader }} </div>
              <SubentCortAcctList
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
              />
            </template>
            <!-- 核心企业保证金账户 -->
            <template #guarantyaccountno="{ formInfo }">
              <el-form-item
                class="form-unit"
                :class="formInfo['formItemClass']"
                :style="{ width: `${formInfo['formItemStyle']}` }"
                :label="formInfo['colheader']"
                :prop="formInfo['colname']"
              >
               <div class="flex items-center">
                  <el-input
                    class="!w-1/1"
                    v-model="formData[formInfo['colname']]"
                    :disabled="formInfo['iscolreadonly']"
                    :maxlength="formInfo['collimit']"
                    showWordLimit
                    clearable
                    :iscolrequired="formInfo['iscolrequired']"
                  >
                    <template #append>
                      <el-button :icon="Plus" @click="handleSelectInputClick(formInfo)" />
                    </template>
                  </el-input>

                  <el-tag class="ml-10px" style="height: 100%" v-if="formInfo['newcolunit']">
                    <div class="tag p-1" v-html="formInfo['newcolunit']"> </div>
                  </el-tag>
               </div>
                
              </el-form-item>
            </template>
            <!-- 核心企业保证金其他账户列表 -->
            <template #GuarantyAccountNoPart>
              <GuarantyAccountNoPart
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
                @list-change="listChange"
              />
            </template>
            <!-- 账户出入金管理相关 列表 -->
            <template #accountopenlist>
              <Accountopenlist
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
              />
            </template>
            <!-- 核心企业子公司信息列表 -->
            <template #projectsettlerlist="{ formInfo }">
              <div class="mb-1 font-bold"> {{ formInfo.colheader }} </div>
              <TeamworkSettlerList
                :save-key="saveKey"
                :project-details-is-admin="projectDetailsIsAdmin"
                :temp-type="props.params?.tempType"
                :serialno="props.params.serialno"
                :customer-id="formData.customerid"
                :project-id="formData.projectid"
                :is-edit="isEdit"
              />
            </template>
            <template #entcortacctlist="{formInfo}">
              <p class="font-bold text-sm">{{ formInfo.colheader }}</p>
            </template>
            
          </dynamicForm>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <!-- 担保客户名称 -->
    <CustomerNameDialog
      key="rzdbcustomername"
      :ref="(el) => setMapRef(el, `rzdbcustomername`)"
      @confirm="(item) => popConfirm('rzdbcustomername', item)"
    />
    <!-- 监管方名称 -->
    <CustomerNameDialog
      key="jgfcustomername"
      :ref="(el) => setMapRef(el, `jgfcustomername`)"
      @confirm="(item) => popConfirm('jgfcustomername', item)"
    />
    <!-- 贷款投向 -->
    <industrytypePop
      :ref="(el) => setMapRef(el, `directionname`)"
      @confirm="(item) => popConfirm('directionname', item)"
    />
    <!-- 涉农分类 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `farmingtypename`)"
      @confirm="(item) => popConfirm('farmingtypename', item)"
    />
    <!-- 主要担保方式 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `vouchtypename`)"
      @confirm="(item) => popConfirm('vouchtypename', item)"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import useFormChange from './hooks/useFormChange'
import { getTemplateInfo, getTemplateValue, paramAdjustSaveApply } from '../api'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useEmitt } from '@/hooks/web/useEmitt'
import CustomerNameDialog from './components/CustomerNameDialog/index.vue'
import industrytypePop from '@/views/creditapplication/pendding/peddingDetail/components/customerProfile/components/industrytypePop.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import ParticpantsPart from './components/ParticpantsPart/index.vue'
import AccountsNumberPart from './components/AccountsNumberPart/index.vue'
import SubentCortAcctList from './components/SubentCortAcctList/index.vue'
import GuarantyAccountNoPart from './components/GuarantyAccountNoPart/index.vue'
import Accountopenlist from './components/Accountopenlist/index.vue'
import ViewHistory from './components/ViewHistory/index.vue'
import TeamworkSettlerList from './components/TeamworkSettlerList/index.vue'
import { addDialog } from '@/components/Dialog'
import { ParamAdjustApplyDetailPropsParams, TempType } from './type'
import ProjectCoAuditList from '../../projectInfoQuery/details/components/ProjectCoAuditList/index.vue'
import { checkRoleIds } from '@/utils/permission'
import { Plus } from '@element-plus/icons-vue'
import { useTagsView } from '@/hooks/web/useTagsView'
import { getCheckBeforeSave } from '@/api/common/index'
import { bcByProjectId } from '@/views/singBusMana/channelEntryMana/applicationMGM/applicationMGMDetail/api'

defineOptions({
  name: 'ParamAdjustApplyDetailComponents'
})

const props = withDefaults(
  defineProps<{
    params: ParamAdjustApplyDetailPropsParams
  }>(),
  {}
)

const router = useRouter()
const route = useRoute()

const { setTitle, setTitleByFullPath } = useTagsView()
// 处理title
if(props.params.title) {
  setTitle(props.params.title, route.path)
}

const templateNoMap: Record<TempType, any> = {
  ParamAdjustApplyDetail: 'ParamAdjustInfo',
  ProjectDetails: 'TeamworkProjectInfo'
}

const templateNo = computed(() => {
  return templateNoMap[props.params?.tempType ?? 'ParamAdjustApplyDetail']
})
const routeQuery = computed(() => {
  return {
    serialno: (props.params?.serialno || '') as string
  }
})
// 合作方管理员
const isPartnerAdmin = checkRoleIds(['024', '224', '424'])
/** 是否合作方管理员 */
const projectPartnerAdmin = computed(() => {
  return isPartnerAdmin && props.params?.tempType === 'ProjectDetails' && !!props.params?.isMaintainProjectInfo
})
// 供应链系统管理员
const isAdmin = checkRoleIds(['0GG'])
/** 项目详情页面 是否是管理员 */ 
const projectDetailsIsAdmin = computed(() => {
  return isAdmin && props.params?.tempType === 'ProjectDetails' && !!props.params?.isMaintainProjectInfo
})
const isEdit = computed(() => {
  return props.params?.type === 'edit' || projectDetailsIsAdmin.value
})
const loading = ref(false)
const activeTabName = ref('BasicPart_HEAD')
// ---- 查看历史相关 -----
if(props.params?.activeTabName) {
  nextTick(()=> {
    activeTabName.value = props.params.activeTabName as string
  })
}
if(props.params?.isHistory === '1') {
  setTitleByFullPath(`项目参数详情-${routeQuery.value.serialno}`, route.fullPath)
}

const handleTabChange = (tabName) => {
  const formRef = formRefMap.value[tabName]
  if (!formRef.isRendering) {
    if(formRef.ref) {
      btns.value[0].loading = false
      formRef.isRendering = true
      return
    }
    btns.value[0].loading = true
  }else {
    btns.value[0].loading = false
  }
}

onBeforeMount(() => {
  handleTempData()
})

// ====== 获取并处理模板、模板数据 ======
const dynamicFormRef = ref()
const activeDynamicFormRef = computed(() => {
  return formRefMap.value[activeTabName.value]?.ref ?? null
})

interface FormRefMap {
  [key: string]: {
    isRendering: boolean
    ref: any
  }
}
const formRefMap = ref<FormRefMap>({
  BasicPart_HEAD: {
    isRendering: false,
    ref: null
  },
  CreditPart_HEAD: {
    isRendering: false,
    ref: null
  },
  ContractPart_HEAD: {
    isRendering: false,
    ref: null
  },
  OperationsPart_HEAD: {
    isRendering: false,
    ref: null
  },
  SCPart_HEAD: {
    isRendering: false,
    ref: null
  }
})
const handleSetFormRef = (el, tabName) => {
  formRefMap.value[tabName].ref = el
}

const handleRenderFinished = () => {
  const isRendering = formRefMap.value[activeTabName.value].isRendering
  if (!isRendering) {
    console.log('[ isRendering ] >', isRendering)
    formRefMap.value[activeTabName.value].isRendering = true
    btns.value[0].loading = false
  }
}

const tempTabsList = ref<Recordable[]>([])
const formData = reactive<Recordable>({})
async function handleTempData() {
  try {
    loading.value = true
    const temp = await getTemplateInfo({ templateNo: templateNo.value })

    const tempValue = await getTemplateValue({
      templateno: templateNo.value,
      serialno: routeQuery.value.serialno
    })
    const { docks = [], headdocks = [], templates = [] } = temp
    for (const temp of templates) {
      temp.slotName = temp.colname
    }

    for (const dock of docks) {
      dock.slotName = dock.dockid
      // 默认隐藏核心企业保证金其他账户列表
      if (dock.dockid === 'GuarantyAccountNoPart') {
        dock.isHidden = true
      }
      dock.templates = templates.filter((item) => item.dockid === dock.dockid)
    }
    for (const head of headdocks) {
      head.dockList = docks.filter((item) => item.grouphead === head.dockid)
      head.templates = head.dockList.map((item) => [...item.templates]).flat()
      if (props.params.type === 'detail') {
        head.templates = head.templates.map((item) => ({
          ...item,
          colreadonly: '1'
        }))
        if (projectPartnerAdmin.value && head.dockid === 'BasicPart_HEAD') {
          head.templates = head.templates.map((item) => ({
            ...item,
            colreadonly: item.colname === 'customername' ? '1' : '0'
          }))
        }
        if (projectDetailsIsAdmin.value) {
          head.templates = head.templates.map((item) => ({
            ...item,
            colreadonly: '0'
          }))
        }
        // 项目类型字段永远不允许修改
        head.templates = head.templates.map((item) => ({
          ...item,
          colreadonly: item.colname === 'ProjectType' ? '1' : item.colreadonly
        }))
      }
    }
    tempTabsList.value = headdocks
    // Object.assign(formData, tempValue)
    nextTick(() => {
      Object.assign(formData, activeDynamicFormRef.value?.formDataFixToShow(tempValue) ?? tempValue) // 这里重新取数后，要作数据转换
    })
  } finally {
    loading.value = false
  }
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, customVisible, customRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)

const listChange = (length) => {
  if(length) {
    showGuarantyAccountNoPart.value = false
    formRefMap.value.ContractPart_HEAD.ref?.hiddenDock(
      'GuarantyAccountNoPart',
      showGuarantyAccountNoPart.value
    )
  }else {
    showGuarantyAccountNoPart.value = true
    formRefMap.value.ContractPart_HEAD.ref?.hiddenDock(
      'GuarantyAccountNoPart',
      showGuarantyAccountNoPart.value
    )
  }
}

const showGuarantyAccountNoPart = ref(true)
const handleSelectInputClick = (formInfo) => {
  if (formInfo.colname === 'guarantyaccountno') {
    showGuarantyAccountNoPart.value = !showGuarantyAccountNoPart.value
    formRefMap.value.ContractPart_HEAD.ref?.hiddenDock(
      'GuarantyAccountNoPart',
      showGuarantyAccountNoPart.value
    )
    return
  }
  formSelectInputClick(formInfo)
}

const popConfirm = (colname: string, row: Recordable) => {
  switch (colname) {
    case 'rzdbcustomername':
      formData.rzdbcustomername = row.customerName
      formData.rzdbcustomerid = row.customerId
      break
    case 'jgfcustomername':
      formData.jgfcustomername = row.customerName
      formData.jgfcustomerid = row.customerId
      break
    case 'directionname': // 贷款投向
      formData.direction = row.key
      formData.directionname = row.title
      break
    case 'farmingtypename': // 支农分类
      formData.farmingtype = row.key
      formData.farmingtypename = row.title
      break
    case 'vouchtypename': // 主要担保方式
      formData.vouchtype = row.key
      formData.vouchtypename = row.title
      break
    default:
      break
  }
}

const showSaveBtn = () => {
  if(projectDetailsIsAdmin.value) {
    return true
  }
  if(projectPartnerAdmin.value) {
    return ['BasicPart_HEAD'].includes(activeTabName.value)
  }
  return !['BasicPart_HEAD'].includes(activeTabName.value) && isEdit.value
}

// ====== 操作按钮 ======
const btns = ref<ActionButton[]>([
  {
    key: 'save',
    label: '保存',
    loading: false,
    plain: true,
    show: () => showSaveBtn(),
    onClick: (btn) => save(btn)
  },
  {
    key: 'viewHistory',
    label: '查看历史',
    loading: false,
    show: () => {
      return (
        (props.params?.tempType ?? 'ParamAdjustApplyDetail') === 'ParamAdjustApplyDetail' &&
        !['BasicPart_HEAD'].includes(activeTabName.value) && !props.params?.isHiddenBtn
      )
    },
    plain: true,
    onClick: (btn) => viewHistory(btn)
  },
  {
    key: 'creditLineDetails',
    label: '授信额度详情',
    plain: true,
    show: () => {
      return props.params?.tempType === 'ProjectDetails'
    },
    onClick: (btn) => handleCreditLineDetails(btn)
  },
  {
    key: 'projectCoAudit',
    label: '查看协审详情',
    plain: true,
    show: () => {
      return (
        (props.params?.tempType ?? 'ParamAdjustApplyDetail') === 'ParamAdjustApplyDetail' &&
        ['BasicPart_HEAD'].includes(activeTabName.value) && !props.params?.isHiddenBtn
      )
    },
    onClick: (btn) => handleProjectCoAudit(btn)
  }
])
const visibleBtns = computed(() => {
  return btns.value
})

const viewHistory = (btn: ActionButton) => {
  addDialog({
    title: '查看历史',
    width: '1200px',
    hideFooter: true,
    contentRenderer: () => (
      <ViewHistory activeTabName={activeTabName.value} customerId={formData.customerid} project-id={formData.projectid} />
    )
  })
}

const handleCreditLineDetails = async (btn: ActionButton) => {
  let serialNoByList = props.params?.serialNoByList
  if (!serialNoByList) {
    btn.loading = true
    serialNoByList = await bcByProjectId({ projectId: props.params?.serialno }).finally(()=> btn.loading = false)
    if (!serialNoByList) {
      return ElMessage.warning('当前项目没有有效的授信额度，请确定！')
    } 
  }
    
  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: props.params?.businessType,
      customerID: props.params?.customerId,
      serialNo: serialNoByList,
      readonly: '1',
      t: Date.now()
    }
  })
}

const handleProjectCoAudit = (btn: ActionButton) => {
  addDialog({
    title: '协审详情',
    width: '1200px',
    hideFooter: true,
    contentRenderer: () => <ProjectCoAuditList params={{ projectId: formData.projectid }} />
  })
}
//====== 保存 ======
const { emitter } = useEmitt()
const saveApplyMap = {
  CreditPart_HEAD: 'creditadjust',
  ContractPart_HEAD: 'putoutadjust',
  OperationsPart_HEAD: 'operateadjust',
  SCPart_HEAD: 'gylbranchadjust'
}
const saveKey = computed(() => {
  return saveApplyMap[activeTabName.value]
})
const save = async (btn: ActionButton) => {
  const valid = await activeDynamicFormRef.value?.validate()
  if (!valid) return
  if(!projectDetailsIsAdmin.value && !projectPartnerAdmin.value) {
    const res = await getCheckBeforeSave({ objectNo: routeQuery.value.serialno, objectType: 'ParamAdjustGYL' })
    if(!res) return
  }
  const form = activeDynamicFormRef.value?.formDataFixToSave()
  const params = {
    ...form,
    serialno: routeQuery.value.serialno
  }
  if (activeTabName.value === 'ContractPart_HEAD') {
    if (params.issinglepaycontrol === '1') {
      if (!params.singlepaymonth && !params.singlepayday) {
        ElMessage.warning('“每笔出账业务，不超过**月/每笔出账业务，不超过**年**月**日”不能同时为空')
        return
      }
    }
  }
  if (!projectDetailsIsAdmin.value && !projectPartnerAdmin.value) {
    await ElMessageBox.confirm('保存后项目参数调整流程将提交至对应岗位审批，是否确认保存', '提示', {
      type: 'warning'
    })
  }
  btn.loading = true
  if ((!projectDetailsIsAdmin.value && !projectPartnerAdmin.value) || activeTabName.value !== 'BasicPart_HEAD') {
    if (params.debtproject) {
      delete params.debtproject
    }
  }
  
  if(saveKey.value) {
    params[saveKey.value] = 1
  }
  // 项目详情页 管理员保存多传一个参数
  if (projectDetailsIsAdmin.value || projectPartnerAdmin.value) {
    params['operatetype'] = 1
  }
  await paramAdjustSaveApply(params).finally(() => (btn.loading = false))
  ElMessage.success('保存成功')
  emitter.emit('refresh-ParamAdJustApplyList')
}
</script>

<style scoped></style>
