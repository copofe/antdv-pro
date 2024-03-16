<script setup lang="ts">
import type { VNodeChild } from 'vue'
import { useLayoutMenuInject } from './context.ts'
import { isFunction } from '::/view/utils/tools.ts'
import { useLayoutState } from '::/view/layouts/basic-layout/context'

defineProps<{
  title?: string
}>()
defineSlots<{
  default: (props: any) => any
  title: (props: any) => any
  content: (props: any) => any
  extraContent: (props: any) => any
  extra: (props: any) => any
  footer: (props: any) => any
}>()
const { layoutMenu: layoutMenuStore, appStore } = useLayoutMenuInject()
const { layoutSetting } = storeToRefs(appStore)
const { menuDataMap } = storeToRefs(layoutMenuStore)
const route = useRoute()
function getCurrentItem() {
  const key: string = route.meta?.originPath ?? route.path
  if (key && menuDataMap.value.has(key))
    return menuDataMap.value.get(key)
  return {} as any
}
const currentItem = shallowRef(getCurrentItem())
onBeforeMount(() => {
  currentItem.value = getCurrentItem()
})

let timer: ReturnType<typeof setTimeout> | undefined
watch(() => route.path, () => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
  timer = setTimeout(() => {
    currentItem.value = getCurrentItem()
  }, 300)
})

const { contentWidth } = useLayoutState()
const contentCls = computed(() => {
  const cls: string[] = [
    'flex flex-col flex-1',
  ]
  if (contentWidth.value === 'Fluid')
    cls.push('w-full')

  else if (contentWidth.value === 'Fixed')
    cls.push(...['max-w-[1200px] w-[1200px]', 'mx-auto'])

  return cls
})
function renderTitle(title: VNodeChild | (() => VNodeChild)) {
  if (isFunction(title))
    return title()

  return title
}
</script>

<template>
  <div class="ant-pro-page-container">
    <div class="bg-[var(--bg-color)] px-4 mb-4 -mx-4 -mt-4" :class="layoutSetting.multiTab ? 'pb-4 pt-2' : 'py-4'">
      <a-breadcrumb v-if="!currentItem.hideInBreadcrumb">
        <template v-if="currentItem.matched?.length">
          <a-breadcrumb-item v-for="item in currentItem.matched" :key="item.path">
            {{ renderTitle(item.title) }}
          </a-breadcrumb-item>
        </template>
        <a-breadcrumb-item>
          {{ renderTitle(currentItem.title) }}
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="flex mt-2 justify-between">
        <div class="flex items-center my-1 of-hidden">
          <slot name="title">
            <span class="text-xl line-height-8 mr-3 mb-0 truncate font-semibold">{{ renderTitle(title ?? currentItem.title) }}</span>
          </slot>
        </div>
        <div>
          <slot name="extra" />
        </div>
      </div>
      <div v-if="$slots.content || $slots.extraContent" class="pt-3">
        <div class="flex w-full">
          <div class="flex-auto">
            <slot name="content" />
          </div>
          <div class="flex-shrink-0">
            <slot name="extraContent" />
          </div>
        </div>
      </div>
      <slot name="footer" />
    </div>
    <div :class="contentCls">
      <slot />
    </div>
  </div>
</template>
