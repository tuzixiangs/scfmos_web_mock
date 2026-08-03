import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { isRelogin } from '@/config/axios/service'
import { getAccessToken,removeToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { deleteUserCache } from '@/hooks/web/useCache'


const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const parseURL = (
  url: string | null | undefined
): { basePath: string; paramsObject: { [key: string]: string } } => {
  // 如果输入为 null 或 undefined，返回空字符串和空对象
  if (url == null) {
    return { basePath: '', paramsObject: {} }
  }

  // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
  const questionMarkIndex = url.indexOf('?')
  let basePath = url
  const paramsObject: { [key: string]: string } = {}

  // 如果找到了问号，说明有查询参数
  if (questionMarkIndex !== -1) {
    // 获取 basePath
    basePath = url.substring(0, questionMarkIndex)

    // 从 URL 中获取查询字符串部分
    const queryString = url.substring(questionMarkIndex + 1)

    // 使用 URLSearchParams 遍历参数
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      // 封装进 paramsObject 对象
      paramsObject[key] = value
    })
  }

  // 返回 basePath 和 paramsObject
  return { basePath, paramsObject }
}

// 路由不重定向白名单
const whiteList = [
  '/login',
  '/social-login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/oauthLogin/gitee',
  '/SingleSignOn'
]

// 路由加载前
router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取所有字典
      const dictStore = useDictStoreWithOut()
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      // const dictPromise = dictStore.getIsSetDict ? Promise.resolve() : dictStore.setDictMap()


      const createDictPromise = () => {

        if(dictStore.getIsSetDict) {
          return Promise.resolve()
        }

        const timeoutPromise = new Promise((_, reject) => {
           setTimeout(()=> {
              reject(new Error("字段加载超时"))
           },10000)
        })
         
        //使用 Promise.race 实现超时控制

        return Promise.race([
          dictStore.setDictMap().catch((error)=> {
            console.warn('字典加载失败，继续执行',error)
            return Promise.resolve()
          }),
          timeoutPromise.catch((timeoutError)=> {
            console.warn('字典加载失败，继续执行', timeoutError)
            return Promise.resolve()
          })
        ])
      }
        
       const dictPromise = createDictPromise()

      if (!userStore.getIsSetUser) {
        isRelogin.show = true
        try {
          await Promise.all([dictPromise, userStore.setUserInfoAction()])
          
        } catch (error) {
          // 如果用户信息加班失败（token 失效），跳转到登录页
          console.error('加载用户信息失败：',error)
          removeToken()
          deleteUserCache()
          next(`/login?redirect=${to.fullPath}`)
          return
        } finally {
          isRelogin.show = false
        }
        
        // 后端过滤菜单
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        // console.log('[ router ] >', router.getRoutes())
        const redirectPath = from.query.redirect || to.path
        // 修复跳转时不带参数的问题
        const redirect = decodeURIComponent(redirectPath as string)
        const { basePath, paramsObject: query } = parseURL(redirect)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
        next(nextData)
      } else {
        try {
          await dictPromise
        } catch (error) {
          console.warn('字典加班失败，继续执行路由跳转：',error)
        }
       
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } }) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
