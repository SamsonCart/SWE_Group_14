<script setup>
import { useAuthStore } from '@/store'
import AnalyticsAward from '@/components/dashboards/analytics/AnalyticsAward.vue'
import AnalyticsTransactions from '@/components/dashboards/analytics/AnalyticsTransactions.vue'
const authStore = useAuthStore()

</script>

<template>
  <VRow
    class="match-height"
    v-if="authStore.isAdmin() === true"
  >
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
