<template>
  <div class="dynamic-container">
    <dynamicNavmenu
      class="dynamic-navmenu"
      :activeMenu="_activeMenu"
      :loading="loading"
      :menuList="_menuList"
      :customer-openeds="defaultOpeneds"
      @menu-select="menuSelect"
      :customer-name="customerName"
    />

    <div class="component">
      <keep-alive :max="20">
        <component
          ref="dynamicCompRef"
          :is="componentId"
          :key="curMenu.key"
          :params="curMenu"
          @send-info="sendInfo"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import dynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'
import loadingComp from './components/loadingComp.vue'
import mockDetailFallback from './components/mockDetailFallback.vue'

defineOptions({
  name: 'dynamicContainer'
})

const props = defineProps({
  // 当前激活菜单
  activeMenu: {
    type: String,
    default: ''
  },

  // 所有组件的module一般是 -> import.meta.glob('./components/*/index.vue')
  compModules: Object,

  // 从接口获取的菜单列表
  menuList: {
    type: Array,
    default: () => []
  },

  // 菜单获取loading
  loading: Boolean,

  // 指定特殊逻辑下，需要反显的数组
  getComponent: Function,

  // 默认展示的组件-点击就能展示，
  defaultComponent: Object,

  // 默认菜单参数
  defaultMenuParams: {
    type: Object,
    default: () => {}
  },
  // 菜单选择后需要传入的额外的参数
  menuSelect: Function,
  // 默认展开的defaultOpeneds
  defaultOpeneds: {
    type: Array,
    default: () => ([])
  },
  // 展示客户名称
  showCustomerName: Boolean
})

const _menuList = ref()

const route = useRoute()

const _activeMenu = ref(props.activeMenu)


const customerName = computed(()=> {
  console.log('props.showCustomerName',props.showCustomerName,detailInfo.value);
  if(props.showCustomerName) {
      return detailInfo.value?.enterprisename || detailInfo.value?.fullname || detailInfo.value?.customername
  }
  return ''
})

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const _getComponent = (menu) => {
  const comp = props.getComponent?.(menu)
  if (comp) return comp

  if (menu.value === '@/components/busiComp/crmsIframe/index.vue') {
    return crmsIframe
  }
  return props.compModules[menu.value]
    ? defineAsyncComponent({
        loader: () => props.compModules[menu.value]().then((m) => m.default || m),
        loadingComponent: loadingComp,
        delay: 50
      })
    : mockDetailFallback
}
const emits = defineEmits(['sendData'])
const detailInfo = ref()
const sendInfo = (info) => {
  detailInfo.value = info
  emits('sendData', info)
}

const dynamicCompRef = ref()
const curMenu = ref({ key: props.activeMenu, ...props.defaultMenuParams })
const menuSelect = (menu) => {
  curMenu.value = {
    key: menu.key,
    detailInfo: computed(() => detailInfo.value),
    itemNo: menu.itemNo,
    dealtype: menu.dealtype,
    codeNo: menu.codeNo,
    tpopentype: menu.tpopentype,
    objectType: menu.objectType,
    title: menu.title,
    phaseNo:menu.phaseNo // 阶段编号
  }
  console.log('[ menu ] >', menu)
  console.log('[ curMenu ] >', curMenu.value)
  if (props.menuSelect) {
    Object.assign(curMenu.value, props.menuSelect(menu))
  }
  componentId.value = toRaw(menu.component)

  nextTick(() => {
    dynamicCompRef.value?.activeComp?.()
  })
}

const componentId = shallowRef()
const resetMenuList = (list) => {
  list.forEach((v) => {
    if (v.isLeaf && v.value) {
      v.component = _getComponent(v)

      if (!props.defaultComponent && !props.activeMenu && !componentId.value) {
        _activeMenu.value = v.key
        menuSelect(v)
      } else if (!props.defaultComponent && props.activeMenu && v.key === props.activeMenu) {
        menuSelect(v)
      }
    }

    if (v.children?.length) {
      return resetMenuList(v.children)
    }
  })

  return list
}

componentId.value = props.defaultComponent

const stopEffect = watchEffect(() => {
  if (props.menuList?.length) {
    _menuList.value = resetMenuList(props.menuList)
    nextTick(() => {
      stopEffect()
    })
  }
})

</script>

<style lang="scss" scoped>
.dynamic-container {
  display: flex;

  .dynamic-navmenu {
    min-width: 198px;
    background: #f1f1f1 !important;
  }
  .component {
    flex: 1;
    overflow: auto;
  }
}
</style>
