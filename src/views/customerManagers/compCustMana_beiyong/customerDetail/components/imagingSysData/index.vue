<template>
  <ContentWrap>
    <Image :data="data" />
  </ContentWrap>
</template>

<script setup>
import Image from '@/components/Image/src/Image.vue'
const props = defineProps({
  params: Object
})
const route = useRoute()
const data = reactive({
  treeNodes: [
    {
      treeId: 'customerGSKH',
      bizReferenceId: props.params?.detailInfo?.mfcustomerid ?? ''
    }
  ],
  canDelete: true,
  canUpload: true
})
</script>
