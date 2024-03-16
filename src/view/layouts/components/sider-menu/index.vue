<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useLayoutState } from '../../basic-layout/context'
import Menu from '../menu/index.vue'

const {
  collapsed,
  selectedMenus,
  splitMenus,
  layout,
  logo,
  theme,
  title,
  collapsedWidth,
  siderWidth,
  headerHeight,
  fixedSider,
  isMobile,
} = useLayoutState()

const prefixCls = shallowRef('ant-pro-sider')

const siderStyle = computed<CSSProperties>(() => {
  return {
    paddingTop: `${layout.value !== 'side' && !isMobile.value ? headerHeight.value : 0}px`,
    transition:
        'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s',
    overflow: 'hidden',
  }
})

const cls = computed(() => ({
  [prefixCls.value]: true,
  [`${prefixCls.value}-fixed`]: fixedSider.value,
  [`${prefixCls.value}-layout-${layout.value}`]: !!layout.value,
}))

const showLogo = computed(() => {
  return (layout.value === 'side' || isMobile.value) && layout.value !== 'mix'
})
</script>

<template>
  <div
    v-if="fixedSider"
    :style="{
      width: collapsed ? `${collapsedWidth}px` : `${siderWidth}px`,
      maxWidth: collapsed ? `${collapsedWidth}px` : `${siderWidth}px`,
      minWidth: collapsed ? `${collapsedWidth}px` : `${siderWidth}px`,
      ...siderStyle,
    }"
  />
  <a-layout-sider
    v-if="splitMenus ? (selectedMenus ?? []).length > 0 : true"
    :theme="theme === 'inverted' ? 'dark' : 'light'"
    :collapsed="collapsed && !isMobile"
    :trigger="null"
    :collapsed-width="collapsedWidth"
    :width="siderWidth"
    collapsible
    :class="cls"
    :style="siderStyle"
  >
    <div v-if="showLogo" class="ant-pro-sider-logo" :class="collapsed && !isMobile ? 'ant-pro-sider-collapsed' : ''">
      <a>
        <img :src="logo" alt="logo">
        <h1 v-if="!collapsed || isMobile">{{ title }}</h1>
      </a>
    </div>
    <div class="flex-1 overflow-x-hidden overflow-y-auto scrollbar">
      <Menu />
    </div>
    <a-divider class="!my-0" />
    <a-menu
      mode="inline"
      :theme="theme === 'inverted' ? 'dark' : 'light'"
      :selectable="false"
    >
      <a-menu-item>
        <UserAvatar />
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="less">
@import './index.less';
</style>
