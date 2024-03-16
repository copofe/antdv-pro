<script setup lang="ts">
import SiderMenu from '../components/sider-menu/index.vue'
import DrawerMenu from '../components/drawer-menu/index.vue'
import GlobalFooter from '../components/global-footer/index.vue'
import { proLayoutProps } from './typing'
import { useLayoutProvider } from './context'

defineOptions({
  name: 'BasicLayout',
})
const props = defineProps(proLayoutProps)
const emit = defineEmits(['update:collapsed'])

/**
 * 处理展开收起的事件参数
 * @param collapsed 展开收起的事件参数
 */
function handleCollapsed(collapsed: boolean) {
  emit('update:collapsed', collapsed)
  props?.onCollapsed?.(collapsed)
}
// 依赖注入所有的配置项，对属性进行控制，减少传值
const { contentWidth, siderWidth, isMobile, theme } = useLayoutProvider(props, {
  handleCollapsed,
})
const contentCls = computed(() => {
  if (contentWidth.value === 'Fixed')
    return 'ant-pro-basicLayout-content-fixed'

  else
    return ''
})
const headerRef = shallowRef()
const { height } = useElementBounding(headerRef)
</script>

<template>
  <div class="ant-pro-basicLayout" :data-theme="theme">
    <a-layout>
      <template v-if="menu">
        <SiderMenu v-if="!isMobile" />
      </template>
      <a-layout>
        <div ref="headerRef" class="fixed right-0 top-0 z-50 bg-white dark:bg-[#242525]" :style="{ left: `${isMobile ? 0 : siderWidth}px` }">
          <slot name="contentPrefix" />
        </div>
        <a-layout-content class="ant-pro-basicLayout-content flex flex-col !m-4">
          <div class="h-full flex flex-col flex-1" :class="contentCls">
            <div
              :style="{ height: `${height}px` }"
            />
            <slot />
          </div>
        </a-layout-content>
        <a-layout-footer v-if="footer" style="background-color: transparent;">
          <slot name="footerRender">
            <GlobalFooter :copyright="copyright">
              <template v-if="$slots.renderFooterLinks" #renderFooterLinks>
                <footer-links />
              </template>
            </GlobalFooter>
          </slot>
        </a-layout-footer>
      </a-layout>
    </a-layout>
    <DrawerMenu v-if="menu" />
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
