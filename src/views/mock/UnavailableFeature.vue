<template>
  <div class="mock-unavailable-feature">
    <el-result
      icon="warning"
      title="功能页面暂未包含在当前前端包中"
      sub-title="菜单已按内网权限数据保留；待补齐对应页面后即可直接接入。"
    />
  </div>
</template>

<style scoped>
.mock-unavailable-feature {
  min-height: 320px;
  padding: 48px 24px;
  background: var(--el-bg-color-page);
}
</style>
