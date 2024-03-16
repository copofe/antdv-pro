<script setup lang="ts">
const { locale, setLocale } = useI18nLocale()
function handleClick({ key }: any) {
  setLocale(key)
}
</script>

<template>
  <a-menu :selected-keys="[locale]" @click="handleClick">
    <a-menu-item key="zh-CN">
      <template #icon>
        <span>
          🇨🇳
        </span>
      </template>
      简体中文
    </a-menu-item>
    <a-menu-item key="en-US">
      <template #icon>
        <span>
          🇺🇸
        </span>
      </template>
      English
    </a-menu-item>
  </a-menu>
</template>
