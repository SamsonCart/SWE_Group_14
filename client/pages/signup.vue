<script setup>
import Signup from '@/components/user/Signup';
import { useUserStore } from '@/store';

definePageMeta({
  layout: 'user'
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 p-5">
        <Signup />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
