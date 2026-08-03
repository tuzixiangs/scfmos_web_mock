import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import qs from 'qs'
import { config } from '@/config/axios/config'
import { getAccessToken, getRefreshToken, getTenantId, removeToken, setToken } from '@/utils/auth'
import errorCode from './errorCode'

import router, { resetRouter } from '@/router'
import { deleteUserCache } from '@/hooks/web/useCache'
import { useUserStoreWithOut } from '@/store/modules/user'
import { mockAdapter } from '@/mock'
import { documentedApiPaths } from './documentedApiPaths'

const tenantEnable = import.meta.env.VITE_APP_TENANT_ENABLE
const { result_code, base_url, request_timeout } = config

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期' // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]
// 是否显示重新登录
export const isRelogin = { show: false }
// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
// 请求队列
const requestList: any[] = []
// 是否正在刷新中
const isRefreshToken = false
// 请求白名单，无须token的接口
const whiteList: string[] = ['/login', '/refresh-token']

export function isRequestCanceled(error) {
  return axios.isCancel(error)
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: base_url, // api 的 base_url
  timeout: request_timeout, // 请求超时时间
  withCredentials: false // 禁用 Cookie 等信息
})

// 本地演示模式：保持业务层 request 调用方式不变，由统一 mock 适配器返回数据。
// 仅本地开发环境开启；部署或接入真实后端时设置 VITE_USE_MOCK=false 即可。
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const useMockFallback = import.meta.env.VITE_API_FALLBACK_TO_MOCK === 'true'

const normalizeRequestPath = (url = '') => {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
  return path.replace(/^\/admin-api/, '')
}

if (useMock) {
  service.defaults.adapter = mockAdapter
  console.info('[mock] 本地 Mock 服务已启用')
} else if (useMockFallback) {
  const httpAdapter = axios.getAdapter('xhr')
  service.defaults.adapter = (requestConfig) => {
    const path = normalizeRequestPath(requestConfig.url)
    return documentedApiPaths.has(path) ? httpAdapter(requestConfig) : mockAdapter(requestConfig)
  }
  console.info('[api] 真实接口模式已启用；未在接口文档中的原型接口继续使用 Mock')
}

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    let isToken = (config!.headers || {}).isToken === false
    whiteList.some((v) => {
      if (config.url) {
        config.url.indexOf(v) > -1
        return (isToken = false)
      }
    })
    if (getAccessToken() && !isToken) {
      ;(config as Recordable).headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
    }
    // 设置租户
    if (tenantEnable && tenantEnable === 'true') {
      const tenantId = getTenantId()
      if (tenantId) (config as Recordable).headers['tenant-id'] = tenantId
    }
    const params = noSignQuery(config.params || {})
    const data = noSignQuery(config.data || false)
    if (
      config.method?.toUpperCase() === 'POST' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data)
    }
    // get参数编码
    if (config.method?.toUpperCase() === 'GET' && params) {
      config.params = {}
      const paramsStr = qs.stringify(params, { allowDots: true })
      if (paramsStr) {
        config.url = config.url + '?' + paramsStr
      }
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// 移除参数中包含%的查询条件
const noSignQuery = (params) => {
  if (!params) return {}

  if (!('pageNo' in params) || !('pageSize' in params)) return params

  Object.keys(params).forEach(key => {
    if (!params[key] || typeof params[key] !== 'string') return

    params[key] = params[key].replaceAll('%', '')
  })

  return params
}

// response 拦截器
service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    let { data } = response
    const config = response.config
    if (!data) {
      // 返回“[HTTP]请求没有返回值”;
      throw new Error()
    }
    const { t } = useI18n()
    // 未设置状态码则默认成功状态
    // 二进制数据则直接返回，例如说 Excel 导出
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      // 注意：如果导出的响应为 json，说明可能失败了，不直接返回进行下载
      if (response.data.type !== 'application/json') {
        return response.data
      }
      data = await new Response(response.data).json()
    }
    const code = data.code || result_code
    // 获取错误信息
    const msg = data.msg || errorCode[code] || errorCode['default']
    if (ignoreMsgs.indexOf(msg) !== -1) {
      // 如果是忽略的错误码，直接返回 msg 异常
      return Promise.reject(msg)
    } else if (code === 401) {
      return handleAuthorized()
    } else if (code === 500) {
      ElMessage.error(msg || t('sys.api.errMsg500'))
      return Promise.reject(new Error(msg))
    } else if (code === 901) {
      ElMessage.error({
        offset: 300,
        dangerouslyUseHTMLString: true,
        message:
          '<div>' +
          t('sys.api.errMsg901') +
          '</div>' +
          '<div> &nbsp; </div>' +
          '<div>参考 https://doc.iocoder.cn/ 教程</div>' +
          '<div> &nbsp; </div>' +
          '<div>5 分钟搭建本地环境</div>'
      })
      return Promise.reject(new Error(msg))
    } else if(code == 3001003 ){
      return {
        data,
        msg
      }
    }else if (code !== 200) {
      if (msg === '无效的刷新令牌') {
        // hard coding：忽略这个提示，直接登出
        console.log(msg)
      } else {
        ElNotification.error({ title: msg,position:'top-right',customClass:'notification-center' })
      }
      return Promise.reject('error')
    } else {
      return data
    }
  },
  (error: AxiosError) => {
    console.log(import.meta.env)
    let { message } = error
    console.log('[ message ] >', message)
    if (isRequestCanceled(error)) {
      console.log('请求已取消，跳过错误提示')
      return Promise.reject(error)
    }
    const { t } = useI18n()
    if (message === 'Network Error') {
      message = t('sys.api.errorMessage')
    } else if (message.includes('timeout')) {
      message = t('sys.api.apiTimeoutMessage')
    } else if (message.includes('Request failed with status code')) {
      message = t('sys.api.apiRequestFailed') + message.substr(message.length - 3)
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

const refreshToken = async () => {
   axios.defaults.headers.common['tenant-id'] = getTenantId()
  // return await axios.post(base_url + '/system/auth/refresh-token?refreshToken=' + getRefreshToken())
  try { 
    return await axios.post(base_url + '/system/auth/refresh-token?refreshToken=' + getRefreshToken())
  } catch (error) {
    console.log('error',error);
    
    // if(error?.response?.code ===400) {
    //   handleAuthorized()
    //   return Promise.reject(error)
    // }
    // throw error
  }

}


const relogin= () => {
  const { t } = useI18n()
  if (window.location.href.includes('login?redirect=')) {
    return
  }
  ElMessageBox.confirm(t('sys.api.timeoutMessage'), t('common.confirmTitle'), {
    showCancelButton: false,
    closeOnClickModal: false,
    showClose: false,
    confirmButtonText: t('login.relogin'),
    type: 'warning'
  }).then(() => {
    resetRouter() // 重置静态路由表
    deleteUserCache() // 删除用户缓存
    removeToken()
    isRelogin.show = false
    // 干掉token后再走一次路由让它过router.beforeEach的校验
    window.location.href = window.location.href
  })


  return Promise.reject(t('sys.api.timeoutMessage'))
}
const handleAuthorized = () => {
  const { t } = useI18n()
  if (!isRelogin.show) {
    // 如果已经到重新登录页面则不进行弹窗提示
    if (window.location.href.includes('login?redirect=')) {
      return
    }
    isRelogin.show = true
    ElMessageBox.confirm(t('sys.api.timeoutMessage'), t('common.confirmTitle'), {
      showCancelButton: false,
      closeOnClickModal: false,
      showClose: false,
      confirmButtonText: t('login.relogin'),
      type: 'warning'
    }).then(() => {
      resetRouter() // 重置静态路由表
      deleteUserCache() // 删除用户缓存
      removeToken()
      isRelogin.show = false
      // 干掉token后再走一次路由让它过router.beforeEach的校验
      window.location.href = window.location.href
      window.location.reload()
    })
  }
  return Promise.reject(t('sys.api.timeoutMessage'))
}



export { service }
