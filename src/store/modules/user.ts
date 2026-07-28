import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken,removeLoginForm } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getInfo, loginOut } from '@/api/login'

const { wsCache } = useCache()

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface UserInfoVO {
  // USER 缓存
  permissions: string[]
  roles: string[]
  roleIds: string[]
  isSetUser: boolean
  user: UserVO
  dept: Recordable
  quickMenus: Recordable[],
  menus: Recordable[]
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: [],
    roles: [],
    roleIds: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    },
    dept: {},
    menus: [],
    quickMenus: [],
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      // 本地 Mock 开发期间菜单经常调整，刷新页面时优先重新获取权限，避免命中旧菜单缓存。
      let userInfo =
        import.meta.env.VITE_USE_MOCK === 'true' ? await getInfo() : wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        userInfo = await getInfo()
      }
      console.log('[ userInfo ] >', userInfo)
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.roleIds = userInfo.roleIds
      this.user = userInfo.user
      this.dept = userInfo.dept
      this.menus = userInfo.menus
      this.quickMenus = userInfo.quickMenus
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    async updateQuickMenus() {
      const userInfo = await getInfo()
      this.quickMenus = userInfo.quickMenus
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserAvatarAction(avatar: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.avatar = avatar
      userInfo.user.avatar = avatar
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserNicknameAction(nickname: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.nickname = nickname
      userInfo.user.nickname = nickname
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async loginOut() {
      await loginOut()
      removeToken()
      deleteUserCache() // 删除用户缓存
      removeLoginForm()
      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
