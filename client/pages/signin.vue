<script setup>
import Login from '@/components/user/Login'
import { useUserStore } from '@/store'

const route = useRouter()
const userStore = useUserStore()
const getToken = computed(() => userStore.getToken)

watch(getToken, (newV, _oldV) => {
  if (newV) {
    route.push('/user')
  }
})
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 p-5">
        <Login />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
