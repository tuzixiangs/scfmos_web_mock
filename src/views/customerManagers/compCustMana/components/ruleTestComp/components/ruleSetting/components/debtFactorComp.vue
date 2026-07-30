<template>
  <div class="select-credit-purpose-comp">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>债项因子</span>
          </div>
          <div class="header-right">
            <span v-if="selectedPurpose" class="selected-info">
              当前选择：{{ selectedPurpose.label }}
            </span>
          </div>
        </div>
      </template>

      <div class="purpose-selector">
        <div class="form-item">
          <label class="form-label">是否开启应收账款登记/变更校验</label>
          <el-select
            v-model="enableVerification"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option label="是" value="yes" />
            <el-option label="否" value="no" />
          </el-select>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const emit = defineEmits(['update:modelValue', 'next', 'prev'])

// 是否开启应收账款登记/变更校验
const enableVerification = ref('no')

// 验证选项
const verificationOptions = [
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' }
]

const selectedPurpose = computed(() => {
  return verificationOptions.find((item) => item.value === enableVerification.value) || null
})

const goPrev = () => {
  emit('prev', selectedPurpose.value)
}

const goNext = () => {
  emit('next', selectedPurpose.value)
}

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

  .form-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;

    .form-label {
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      min-width: 200px;
      text-align: right;
    }
  }
}
</style>
