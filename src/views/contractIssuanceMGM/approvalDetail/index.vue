<template>
  <div class="pl-2 py-1" v-if="showTab">
    <el-button
      v-for="tab in tabs"
      class="rounded-0px!"
      :key="tab.key"
      :loading="tab.loading"
      @click="tab.onClick(tab)"
      :type="activeTabKey === tab.key ? 'primary' : 'default'"
      plain
    >
      {{ tab.label }}
    </el-button>
  </div>
  
  <div v-show="activeTabKey === 'detail'">
    <dynamicContainer
      :active-menu="activeMenu"
      :comp-modules="modules"
      :menu-list="menuList"
      :loading="loading"
      :defaultMenuParams="props"
      :default-component="baseInfo" 
      :get-component="getComponent"
      :menu-select="menuSelect"
      @send-data="setBaseInfo"
      showCustomerName
    />
  </div>
  <div v-if="activeTabKey === 'cusDetail'">
    <!-- 自雇 -->
    <customerDetail v-if="baseData.customerType === '0320'" />

    <!-- 授薪 -->
    <customerDetail2 v-else-if="baseData.customerType === '0310'" />

    <!-- 公司 -->
    <companyCustomerDetail v-else-if="baseData.customerType === '0110'" />
  </div>
  <div v-if="activeTabKey === 'opinion'">
    <viewApplyPhaseOpinion :serial-no="route.query.relativeserialno" />
  </div>
  <div v-if="activeTabKey === 'creditApplyJobDetail'">
    <CreditApplyJobDetail :show-tab="false" />
  </div>
  <div v-if="activeTabKey === 'imageSystem'">
    <ContentWrap>
      <IFrame :src="imageSystemUrl" />
    </ContentWrap>
  </div>
 
</template>

<script setup>
import * as Api from './api.js'
import baseInfo from './components/baseInfo/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { IFrame } from '@/components/IFrame'
import { getImageGalleryInfo } from '@/api/common'
import companyCustomerDetail from '@/views/customerManagers/compCustMana/customerDetail/index.vue'
import customerDetail from '@/views/customerManagers/indCustMana/personal/customerDetail/index.vue'
import customerDetail2 from '@/views/customerManagers/indCustMana/sxrs/customerDetail/index.vue'
import viewApplyPhaseOpinion from './components/viewApplyPhaseOpinion/index.vue'
import CreditApplyJobDetail from '@/views/creditapplication/creditApplyJob/customerDetail/index.vue'
import RuleTestComp from '@/views/customerManagers/compCustMana/components/ruleTestComp/index.vue'

const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'contractApprovalDetail'
})

const props = defineProps({
  showTab: {
    type: Boolean,
    default: true
  },
  serialNoByProps: {
    type: String,
    default: ''
  }
})

const baseData = ref({})
const setBaseInfo = (info)=> {
  baseData.value = info
  console.log('[ baseData ] >', baseData.value)
}

// 默认展示客户概况
const activeMenu = ref('010')
const route = useRoute()

const menuList = ref([])
const debtRuleConfigMenu = {
  key: 'debtRuleConfig',
  title: '债项规则配置',
  value: '__debt_rule_config__',
  isLeaf: true
}
// relativeserialNoByCreditLine为了兼容合同登记中展示批复详情
const serialNo = computed(()=> props.serialNoByProps || route.query.relativeserialNoByCreditLine || route.query.serialno || route.query.serialNo)


// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.approveLineMenu({
    objectType: 'ApproveApply',
    serialNo: serialNo.value
  })
    .then((res) => {
      const sourceMenus = Array.isArray(res) ? res : []
      menuList.value = [...sourceMenus, debtRuleConfigMenu]
    })
    .catch(() => {
      menuList.value = [debtRuleConfigMenu]
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const getComponent = (menu) => {
  if (menu.value === './components/customerProfile/index.vue') {
    return baseInfo
  }
  if (menu.value === debtRuleConfigMenu.value) {
    return RuleTestComp
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: serialNo.value,
    serialNo: serialNo.value,
    serialNoByProps: props.serialNoByProps
  }
}

// ====== tabs 相关 ======
const activeTabKey = ref('detail')

const handleTabsChange = (btn) => {
  activeTabKey.value = btn.key
  switch (btn.key) {
    case 'imageSystem':
      toImageInfo(btn)
      break;
  
    default:
      break;
  }
}

const tabs = ref([
  {
    key: 'detail',
    label: '批复详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'cusDetail',
    label: '客户详情',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'opinion',
    label: '审批意见',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'creditApplyJobDetail',
    label: '申请信息',
    onClick: (btn) => handleTabsChange(btn)
  },
  {
    key: 'imageSystem',
    label: '影像系统资料',
    loading: false,
    onClick: (btn) => handleTabsChange(btn)
  }
])

// ====== 影像系统资料 ======
const imageSystemUrl = ref('')
const toImageInfo = async (btn) => {
  try {
    btn.loading = true
    const params = {
      objectNo: serialNo.value,
      objectType: 'ApproveApply',
      customerID: route.query.customerid
    }
    const res = await getImageGalleryInfo(params)
    imageSystemUrl.value = res
  } finally {
    btn.loading = false
  }
}

</script>
