<template>
  <div class="select-procurement-comp">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>采购方式</span>
          </div>
          <div class="header-right">
            <span v-if="selectedProcurement" class="selected-info">
              当前选择：{{ selectedProcurement.label }}
            </span>
          </div>
        </div>
      </template>

      <div class="procurement-selector">
        <el-radio-group v-model="selectedProcurementKey">
          <el-radio-button v-for="item in procurementOptions" :key="item.value" :label="item.value">
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

const emit = defineEmits(['next', 'prev'])

// 采购方式选项
const procurementOptions = [
  { label: '公开招标', value: 'open_bidding' },
  { label: '邀请招标', value: 'invited_bidding' },
  { label: '竞争性谈判', value: 'competitive_negotiation' },
  { label: '单一来源采购', value: 'single_source' },
  { label: '询价采购', value: 'inquiry' },
  { label: '框架协议采购', value: 'framework_agreement' },
  { label: '直接采购', value: 'direct_procurement' }
]

const selectedProcurementKey = ref('')

const selectedProcurement = computed(() => {
  return procurementOptions.find((item) => item.value === selectedProcurementKey.value) || null
})

const goNext = () => {
  emit('next', selectedProcurement.value)
}

const goPrev = () => {
  emit('prev', selectedProcurement.value)
}
</script>

<style lang="scss" scoped>
.select-procurement-comp {
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

  .procurement-selector {
    padding: 20px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
