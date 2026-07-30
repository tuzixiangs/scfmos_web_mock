<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    width="500px"
    append-to-body
    top="20vh"
    v-model="visible"
    title="新增"
  >
    <div class="rule-comp">
      <el-form class="ml-20px" label-width="120px">
        <el-form-item label="选择商品类型">
          <selectInputComp @openClick="openClick1" />
        </el-form-item>
        <el-form-item label="剩余有效期（月）" v-if="type == 1">
          <el-input-number
            v-model="formData.b"
            :precision="0"
            :min="0"
            :controls="false"
          >
            <template #suffix>
              <span>个月</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="在库时长（天）" v-if="type == 2">
          <el-input-number
            v-model="formData.c"
            :precision="0"
            :min="0"
            :controls="false"
          >
            <template #suffix>
              <span>天</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="价衰系数（%）">
          <el-input-number
            v-model="formData.d"
            :precision="2"
            :min="0"
            :max="100"
            :controls="false"
          >
            <template #suffix>
              <span>%</span>
            </template>
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="p-20px pt-0">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </template>
    <selectCommodityPop ref="selectCommodityPopRef" />
  </Dialog>
</template>

<script setup>
import selectInputComp from '@/components/selectInput/index.vue'
import selectCommodityPop from '../selectCommodity/selectCommodityPop.vue'

const props = defineProps({
  type: {
    type: String,
    default: '1'
  }
})

const visible = ref(false)

const formData = reactive({})

const open = () => {
  visible.value = true
  
  formData.a = ''
  formData.b = ''
  formData.c = ''
  formData.d = ''
}

const selectCommodityPopRef = ref()
const openClick1 = () => {
  selectCommodityPopRef.value.open()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.rule-comp {
  .title-box {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;

    .title {
      font-weight: bold;
      color: #1a3a6b;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 3px;
        background: #1a3a6b;
        border-radius: 2px;
        height: 14px;
      }
    }
  }
}
</style>
