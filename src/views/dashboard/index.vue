<template>
  <div>
    dashboard
    <el-button @click="toggle">主题切换</el-button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dashboard' })

const { toggle } = useTheme()
</script>

<style lang="scss" scoped></style>
