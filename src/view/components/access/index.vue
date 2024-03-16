<script setup lang="ts">
import type { AccessEnum } from '::/entities/app.model'

defineProps<{
  access: string | number | (string | number)[] | AccessEnum
}>()
const { hasAccess } = useAccess()
</script>

<template>
  <slot v-if="hasAccess(access)" />
</template>
