<script setup lang="ts">
const route = useRoute()
const url = computed(() => route?.meta?.url)
const loading = ref(true)
function finishLoading() {
  loading.value = false
}
</script>

<template>
  <div
    class="bg-[var(--bg-color)] w-full h-full b-rd-8px overflow-hidden flex flex-col flex-1 ant-pro-iframe-wrap"
  >
    <a-spin
      :spinning="loading"
      wrapper-class-name="b-rd-8px of-hidden w-full h-full flex flex-col flex-1"
    >
      <iframe w-full class="h-full flex flex-col flex-1" :src="url" style="border: none" @load="finishLoading" />
    </a-spin>
  </div>
</template>

<style lang="less">
.ant-pro-iframe-wrap {
  .ant-spin-container {
    height: 100% !important;
    width: 100% !important;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
