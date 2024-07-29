<script setup>
import AnalyticsAward from '@/components/dashboards/analytics/AnalyticsAward.vue'
import AnalyticsTransactions from '@/components/dashboards/analytics/AnalyticsTransactions.vue'

</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsAward />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsTransactions />
    </VCol>
  </VRow>
</template>
