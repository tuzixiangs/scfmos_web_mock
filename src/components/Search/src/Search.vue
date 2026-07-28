<script lang="ts" setup>
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'

import { useForm } from '@/hooks/web/useForm'
import { findIndex } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { FormSchema } from '@/types/form'

defineOptions({ name: 'Search' })

const { t } = useI18n()

const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  labelPosition: propTypes.string.def('left'),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('bottom'),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('left'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(true),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(false),
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  defaultExpand: propTypes.bool.def(false)
})

const emit = defineEmits(['search', 'reset'])

const visible = ref(props.defaultExpand)

const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema)
  // if (props.expand && props.expandField && !unref(visible)) {
  //   const index = findIndex(schema, (v: FormSchema) => v.field === props.expandField)
  //   if (index > -1) {
  //     const length = schema.length
  //     schema.splice(index + 1, length)
  //   }
  // }
  if (!props.inline) {
    schema = schema.map((item) => {
      return {
        ...item,
        componentProps: {
          ...(item?.componentProps ?? {}),
          style: {
            ...(item.componentProps?.style ?? {}),
            maxWidth: '300px'
          }
        }
      }
    })
  }
  if (props.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px'
        }
      }
    ])
  }
  return schema
})

const { register, elFormRef, methods } = useForm({
  model: props.model || {}
})

const search = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      const { getFormData } = methods
      const model = await getFormData()
      emit('search', model)
    }
  })
}

const reset = async () => {
  unref(elFormRef)?.resetFields()
  const { getFormData } = methods
  const model = await getFormData()
  emit('reset', model)
}

const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as 'left' | 'center' | 'right'
  }
})

const setVisible = () => {
  unref(elFormRef)?.resetFields()
  visible.value = !unref(visible)
}
defineExpose({
  methods
})
</script>

<template>
  <div class="flex items-center mb-2 cursor-pointer w-[110px]" @click="setVisible">
    <Icon v-show="!visible" class="mr-4px" icon="ep:plus" />
    <Icon v-show="visible" class="mr-4px" icon="ep:minus" />
    <el-button link> 查询条件 </el-button>
  </div>
  <div v-show="visible" class="search-scroll-area mb-2">
    <!-- update by 芋艿：class="-mb-15px" 用于降低和 ContentWrap 组件的底部距离，避免空隙过大 -->
    <Form
      v-show="visible"
      :inline="inline"
      :is-col="isCol"
      :is-custom="false"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :schema="newSchema"
      class="search-form"
      hide-required-asterisk
      @register="register"
      @keyup.enter="search"
    >
      <template #action>
        <div v-if="layout === 'inline'">
          <!-- update by 芋艿：去除搜索的 tpye=""，颜色变淡一点 -->
          <ElButton v-if="showSearch" size="default" tpye="" @click="search">
            <Icon class="mr-5px" icon="ep:search" />
            {{ t('common.query') }}
          </ElButton>
          <!-- update by 芋艿：将 icon="ep:refresh-right" 修改成 icon="ep:refresh"，和 ruoyi-vue 搜索保持一致  -->
          <ElButton v-if="showReset" size="default" @click="reset">
            <Icon class="mr-5px" icon="ep:refresh" />
            {{ t('common.reset') }}
          </ElButton>
          <!-- <ElButton v-if="expand" text @click="setVisible">
            {{ t(visible ? 'common.shrink' : 'common.expand') }}
            <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
          </ElButton> -->
          <!-- add by 芋艿：补充在搜索后的按钮 -->
          <slot name="actionMore"></slot>
        </div>
      </template>
      <template v-for="name in Object.keys($slots)" :key="name" #[name]>
        <slot :name="name"></slot>
      </template>
    </Form>
  </div>
  <template v-if="layout === 'bottom'">
    <div :style="bottonButtonStyle" class="mb-2" v-show="visible">
      <ElButton v-if="showSearch" tpye="" @click="search">
        <Icon class="mr-5px" icon="ep:search" />
        {{ t('common.query') }}
      </ElButton>
      <ElButton v-if="showReset" @click="reset">
        <Icon class="mr-5px" icon="ep:refresh-right" />
        {{ t('common.reset') }}
      </ElButton>
      <!-- <ElButton v-if="expand" text @click="setVisible">
          {{ t(visible ? 'common.shrink' : 'common.expand') }}
          <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
        </ElButton> -->
      <!-- add by 芋艿：补充在搜索后的按钮 -->
      <slot name="actionMore"></slot>
    </div>
  </template>
</template>

<style scoped>
.search-scroll-area {
  max-height: 180px;
  overflow: auto;
}
</style>
