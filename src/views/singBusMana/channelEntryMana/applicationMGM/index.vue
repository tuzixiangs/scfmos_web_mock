
<template>
  <dynamicContainer
    :comp-modules="modules"
    :menu-list="menuList"
    :active-menu="activeMenu"
    :menu-select="menuSelect"
    :default-openeds="defaultOpeneds"
  />
</template>

<script setup>
import dynamicContainer from '@/components/dynamicContainer/index.vue'
const modules = import.meta.glob('./components/*/index.vue')
import { defaultMenuList } from './common.js'
import { getChannel } from './api.js'

defineOptions({
  name: 'applicationMGM'
})

const loading = ref(false)
const menuList = ref([...defaultMenuList])

// async function setMenuList() {
//   loading.value = true
//   const res = await getChannel().finally(()=> loading.value = false)
//   console.log('[ res ] >', res)
//   menuList.value = defaultMenuList.filter(f=> res.includes(f.dealtype))
// }
// setMenuList()

const route = useRoute()
const router = useRouter()
const defaultOpeneds = ref(['01'])
async function getDealtype(dealtype){
  if(!dealtype) return activeMenu.value
  const menu = defaultMenuList.find(f => f.dealtype === dealtype)
  if(menu){
    defaultOpeneds.value = [menu.key]
    activeMenu.value = menu.children[0].key
    return 
  }
  defaultOpeneds.value = ['01']
  activeMenu.value = ''
}

// const activeMenu
// 无渠道参数时默认展示第一个业务节点，避免首次进入只显示空白内容区。
const activeMenu = ref('1010')
watch(()=> route.query?.channel,async (channel)=> {
  if(!channel) return
  getDealtype(channel)
},{ immediate: true })
const menuSelect = (menu) => {
  return {
    type: menu.type
  }
}
onActivated(()=> {
  // const nav = performance.getEntriesByType('navigation')[0]
  // if(nav?.type === 'reload') {
  //   console.log('[ reload ] >')
  //   router.replace({query:{}})
  // }
})
function setQuery() {
  if(route.query?.channel) {
    const query = route.query
    delete query.channel
    router.replace({query})
  }
}
onMounted(()=> {
  // window.addEventListener('beforeunload',setQuery)
})
onBeforeUnmount(()=> {
  // window.removeEventListener('beforeunload',setQuery)
})
</script>
