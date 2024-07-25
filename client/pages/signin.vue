<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 p-5">
        <Login />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import Login from '@/components/user/Login';
import { onMounted } from 'vue';

definePageMeta({
  layout: 'user'
});

const userStore = useUserStore();

onMounted(() => {
  userStore.init();
});
</script>

<style scoped lang="scss"></style>
