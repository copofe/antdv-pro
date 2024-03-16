<script setup lang="ts">
import IntroduceRow from '::/view/pages/dashboard/analysis/introduce-row.vue'
import SalesCard from '::/view/pages/dashboard/analysis/sales-card.vue'
import TopSearch from '::/view/pages/dashboard/analysis/components/top-search.vue'
import ProportionSales from '::/view/pages/dashboard/analysis/proportion-sales.vue'
import OfflineData from '::/view/pages/dashboard/analysis/offline-data.vue'

defineOptions({
  name: 'Analysis',
})

const loading = ref(false)

const visitData = ref([])
</script>

<template>
  <page-container>
    <Suspense :fallback="null">
      <IntroduceRow :loading="loading" :visit-data="visitData" />
    </Suspense>

    <Suspense :fallback="null">
      <SalesCard />
    </Suspense>

    <a-row
      :gutter="24"
      :style="{ marginTop: '24px' }"
    >
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <TopSearch />
        </Suspense>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <ProportionSales />
        </Suspense>
      </a-col>
    </a-row>

    <Suspense :fallback="null">
      <OfflineData />
    </Suspense>
  </page-container>
</template>
