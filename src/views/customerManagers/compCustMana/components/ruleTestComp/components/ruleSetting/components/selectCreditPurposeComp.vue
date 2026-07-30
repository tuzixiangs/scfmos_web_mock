<template>
  <div class="select-credit-purpose-comp">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>授信用途</span>
          </div>
          <div class="header-right">
            <span v-if="selectedPurpose" class="selected-info">
              当前选择：{{ selectedPurpose.label }}
            </span>
          </div>
        </div>
      </template>

      <div class="purpose-selector">
        <el-radio-group v-model="selectedPurposeKey">
          <el-radio-button
            v-for="item in purposeOptions"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const emit = defineEmits(['update:modelValue', 'next', 'prev'])

// 授信用途选项
const purposeOptions = [
  { label: '流动资金', value: 'working_capital' },
  { label: '固定资产购置', value: 'fixed_asset' },
  { label: '项目建设', value: 'project_construction' },
  { label: '并购重组', value: 'merger_acquisition' },
  { label: '国际贸易', value: 'international_trade' },
  { label: '国内贸易', value: 'domestic_trade' },
  { label: '其他用途', value: 'other' }
]

const selectedPurposeKey = ref('')

const selectedPurpose = computed(() => {
  return purposeOptions.find((item) => item.value === selectedPurposeKey.value) || null
})

const goNext = () => {
  emit('next', selectedPurpose.value)
}

const goPrev = () => {
  emit('prev', selectedPurpose.value)
}

// 监听外部变化
watch(
  () => selectedPurposeKey.value,
  (newVal) => {
    emit('update:modelValue', purposeOptions.find((item) => item.value === newVal) || null)
  }
)
</script>

<style lang="scss" scoped>
.select-credit-purpose-comp {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .selected-info {
      color: #409eff;
      font-weight: 500;
    }
  }

  .purpose-selector {
    padding: 20px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
