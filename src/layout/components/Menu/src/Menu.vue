<script lang="tsx">
import { PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { LayoutType } from '@/types/layout'
import Icon from '@/components/Icon/src/Icon.vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']
      return vertical.includes(unref(layout)) ? 'vertical' : 'horizontal'
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      }
      return <ElScrollbar>{renderMenu()}</ElScrollbar>
    }

    const renderMenu = () => {
      const popperClass =
        unref(menuMode) === 'vertical'
          ? `${prefixCls}-popper--vertical`
          : `${prefixCls}-popper--horizontal`

      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          textColor="#333"
          popperClass={popperClass}
          onSelect={menuSelect}
          ellipsisIcon={()=> <Icon icon="ep:more-filled" color="#fff" />}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem()
              return renderMenuItem(unref(routers),'/',1)
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-menu;

.#{$prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

 .level1-menu {
    .v-menu__title {
      color: #fff !important;
    }
    :deep(.v-menu__icon) {
      margin-right: 0px !important;
      color: #fff !important;
    }
    :deep(.el-sub-menu__icon-arrow) {
      color: #fff !important;
    }
  }

  :deep(.#{$elNamespace}-menu) {
    width: 100% !important;
    border-right: none;
    background: var(--left-menu-bg-color);

    .#{$elNamespace}-menu-item,
    .#{$elNamespace}-sub-menu__title {
      position: relative;
      height: 40px !important;
      line-height: 40px !important;
      padding: 0 16px !important;
      margin: 4px 8px !important;
      font-size: 14px;
      font-weight: 400;
      color: var(--left-menu-text-color) !important;
      background: transparent !important;
      border-radius: 8px !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;

    .#{$namespace}-icon,
    .v-menu__icon,
    [class*='el-icon'] {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        font-size: 18px;
        color: var(--left-menu-text-color);
        transition:
          transform 0.25s ease,
          color 0.2s ease;
      }

      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background: var(--left-menu-hover-bg-color, rgba(255, 255, 255, 0.08)) !important;

        .#{$namespace}-icon,
        .v-menu__icon,
        [class*='el-icon'] {
          transform: scale(1.15);
          color: var(--left-menu-text-active-color);
        }
      }
    }

    .#{$elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background: var(--left-menu-bg-active-color) !important;
      font-weight: 500;

      &:hover {
        background: var(--left-menu-bg-active-color) !important;
      }
    }

    .#{$elNamespace}-menu-item.is-active,
    .#{$elNamespace}-sub-menu.is-active > .#{$elNamespace}-sub-menu__title {
      .#{$namespace}-icon,
      .v-menu__icon,
      [class*='el-icon'] {
        color: var(--left-menu-text-active-color);
      }
    }

    .#{$elNamespace}-sub-menu {
      .#{$elNamespace}-sub-menu__title {
        .#{$elNamespace}-sub-menu__icon-arrow {
          right: 12px;
          margin-right: 0;
          font-size: 12px;
          color: var(--left-menu-text-color);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }

      &.is-opened {
        > .#{$elNamespace}-sub-menu__title {
          color: var(--left-menu-text-active-color) !important;
          background: var(--left-menu-submenu-active-bg-color, rgba(0, 0, 0, 0.04)) !important;

          .#{$elNamespace}-sub-menu__icon-arrow {
            transform: rotate(90deg);
            color: var(--left-menu-text-active-color);
          }
        }
      }

      &.is-active {
        > .#{$elNamespace}-sub-menu__title {
          color: var(--left-menu-text-active-color) !important;
        }
      }
    }

    .#{$elNamespace}-menu {
      background: var(--left-menu-bg-light-color) !important;

      .#{$elNamespace}-menu-item {
        height: 36px !important;
        line-height: 36px !important;
        padding-left: 32px !important;
        font-size: 13px;

        &.is-active {
          color: var(--left-menu-text-active-color) !important;
          background: var(--left-menu-bg-active-color) !important;
          font-weight: 500;
        }

        &:hover {
          background: var(--left-menu-hover-bg-color, rgba(255, 255, 255, 0.06)) !important;
        }
      }

      .#{$elNamespace}-menu .#{$elNamespace}-menu-item {
        padding-left: 48px !important;
      }
    }
  }

  :deep(.#{$elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    .#{$elNamespace}-menu-item,
    .#{$elNamespace}-sub-menu__title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      margin: 4px 6px !important;

      .#{$prefix-cls}__title,
      span:not([class*='icon']) {
        display: none;
      }

      .#{$namespace}-icon,
      [class*='el-icon'] {
        margin-right: 0;
      }

      .#{$elNamespace}-sub-menu__icon-arrow {
        display: none;
      }
    }

    .#{$elNamespace}-menu-item.is-active {
      background: var(--left-menu-collapse-bg-active-color) !important;
      border-radius: 8px;
    }
  }

  :deep(.horizontal-collapse-transition) {
    .#{$prefix-cls}__title {
      display: none;
    }
  }

  &__horizontal {
    height: calc(var(--top-tool-height)) !important;

    :deep(.#{$elNamespace}-menu--horizontal) {
      height: calc(var(--top-tool-height));
      border-bottom: none;

      & > .#{$elNamespace}-sub-menu.is-active {
        .#{$elNamespace}-sub-menu__title {
          // border-bottom-color: var(--el-color-primary) !important;
          border: none !important;
        }
      }

      .#{$prefix-cls}__title {
        max-height: calc(var(--top-tool-height) - 2px) !important;
        line-height: calc(var(--top-tool-height) - 2px);
      }
    }
  }
}
</style>

<style lang="scss">
$prefix-cls: #{$namespace}-menu-popper;

.v-menu__horizontal {
  background: none !important;
}
.el-menu--horizontal {
   background: none !important;
}

.#{$prefix-cls}--vertical,
.#{$prefix-cls}--horizontal {
  border-radius: 8px !important;
  // padding: 8px !important;
  background: var(--el-bg-color-overlay) !important;
  border: 1px solid var(--el-border-color-lighter) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;

  .el-menu {
    border: none !important;
    background: transparent !important;
  }

  .el-menu-item,
  .el-sub-menu__title {
    height: 36px !important;
    line-height: 36px !important;
    margin: 2px 0 !important;
    padding: 0 12px !important;
    border-radius: 6px !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: var(--el-fill-color-light) !important;
      color: var(--el-color-primary) !important;
    }

    &.is-active {
      background: rgba(var(--el-color-primary-rgb), 0.15) !important;
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
