<template>
  <div class="indebt-data">
    <modultTitle title="基本信息">
      <el-button type="primary">债项规则管理</el-button>
    </modultTitle>

    <baseInfo class="ml-20px" />

    <modultTitle title="债项数据维护" />

    <table1 ref="table1Ref" class="ml-20px" />

    <modultTitle title="债项资产明细清单" />

    <table2 ref="table2Ref" class="ml-20px" />
  </div>
</template>

<script setup>
import modultTitle from '@/components/busiComp/moduleTitle/index.vue'
import baseInfo from './components/baseInfo.vue'
import table1 from './components/table1/index.vue'
import table2 from './components/table2/index.vue'
</script>
