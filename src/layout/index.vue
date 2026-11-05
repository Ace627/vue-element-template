<template>
  <div :class="classes">
    <AppMain />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Layout' })
import AppMain from './components/AppMain/index.vue'

const classes = computed(() => ['app-container'])
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
}
</style>
