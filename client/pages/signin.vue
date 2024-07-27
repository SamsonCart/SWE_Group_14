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
import Login from '@/components/user/Login';

definePageMeta({
  layout: 'user'
});
</script>

<style scoped lang="scss"></style>
