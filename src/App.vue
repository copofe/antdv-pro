<script setup lang="ts">
import { useLayoutMenuProvide } from '::/components/page-container/context.ts'

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { antd } = useI18nLocale()
const layoutMenu = useLayoutMenu()
useLayoutMenuProvide(layoutMenu, appStore)
</script>

<template>
  <a-config-provider :theme="theme" :locale="antd">
    <a-style-provider hash-priority="high">
      <a-app class="h-full font-chinese antialiased">
        <TokenProvider>
          <RouterView />
        </TokenProvider>
      </a-app>
    </a-style-provider>
  </a-config-provider>
</template>
