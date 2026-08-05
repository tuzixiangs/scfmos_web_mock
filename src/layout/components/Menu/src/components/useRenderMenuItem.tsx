import { ElSubMenu, ElMenuItem } from 'element-plus'
import { hasOneShowingChild } from '../helper'
import { isUrl } from '@/utils/is'
import { useRenderMenuTitle } from './useRenderMenuTitle'
import { pathResolve } from '@/utils/routerHelper'

const { renderMenuTitle } = useRenderMenuTitle()

export const useRenderMenuItem = () =>
  // allRouters: AppRouteRecordRaw[] = [],
  {
    const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/', level?: number) => {
      return routers
        .filter((v) => !v.meta?.hidden)
        .map((v) => {
          const meta = v.meta ?? {}
          const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
          const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // getAllParentPath<AppRouteRecordRaw>(allRouters, v.path).join('/')
          // 空 path 的目录仅用于组织菜单。它们和父级会共享同一个路由地址，
          // 但 ElMenu 需要独立的 index，否则会将不同层级误判为同一菜单并同时展开。
          const menuIndex = v.path
            ? fullPath
            : `${fullPath}/__menu-group-${String(meta.title ?? 'directory')}`

          if (
            oneShowingChild &&
            (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
            !meta?.alwaysShow
          ) {
            return (
              <ElMenuItem
                class={level === 1 ? 'level1-menu' : ''}
                index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}
              >
                {{
                  default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
                }}
              </ElMenuItem>
            )
          } else {
            return (
              <ElSubMenu class={level === 1 ? 'level1-menu' : ''} index={menuIndex} hide-timeout={700}>
                {{
                  title: () => renderMenuTitle(meta),
                  default: () => renderMenuItem(v.children!, fullPath)
                }}
              </ElSubMenu>
            )
          }
        })
    }

    return {
      renderMenuItem
    }
  }
