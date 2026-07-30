<template>
  <el-steps :active="activeStep" align-center>
    <el-step
      v-for="step in stepList"
      :key="step.key"
      :title="step.title"
      :description="step.description"
    />
  </el-steps>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  steps: {
    type: Array,
    default: () => []
  }
})

const stepList = computed(() => props.steps.map((v) => ({ ...v, description: '-' })))

const activeStep = ref(0)

const next = (index) => {
  if (index || index === 0) {
    activeStep.value = index + 1
  } else {
    activeStep.value++
  }
  return activeStep.value
}

const last = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
  return activeStep.value
}

const setDescription = (params) => {
  stepList.forEach((v, i) => {
    v.description = params[i]?.label || params[i]?.name || '-'
  })
}

defineExpose({
  next,
  last,
  setDescription
})
</script>
