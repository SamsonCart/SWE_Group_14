<script setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()

const props = defineProps({
  creating: Boolean,
  user: Object,
})

const emit = defineEmits(['updateCreating'])

const initialFormValues = { username: '', email: '', isActive: false, password: '', roles: [] }
const form = ref({ ...initialFormValues })

const isPasswordVisible = ref(false)

const create = () => {
  if (!valid.value) {
    const error = 'Please fill the form correctly!'
    messageStore.setError({ error })
  } else {
    userStore.createUser({ ...form.value })
    emit('updateCreating', false)
  }
}

const valid = ref()
const rules = {
  username: [v => !!v || 'Username is required'],
  password: [v => !v || !!v || 'Password is required'],
  roles: [v => v.length > 0 || 'Roles is required'],
  email: v => {
    if (/^(([\w{1,100}-]+\.?)+\w+){1,100}@([a-zA-Z0-9+-]{1,100}\.){1,100}[a-zA-Z]{1,100}$/.test(v)) return true

    return 'Must be a valid e-mail'
  },
}
onMounted(() => {
  form.value = { ...props.user }
})
</script>

<template>
  <VForm
    v-if="creating"
    v-model="valid"
    lazy-validation
    style="margin-bottom: 20px;"
    @submit.prevent="() => {}"
  >
    <VRow>
      <h2>Create a new user</h2>
      <!-- Username -->
      <VCol cols="12">
        <VTextField
          v-model="form.username"
          label="Username"
          :rules="rules.username"
        />
      </VCol>

      <!-- email -->
      <VCol cols="12">
        <VTextField
          v-model="form.email"
          :rules="[rules.email]"
          label="Email"
          type="email"
        />
      </VCol>

      <!-- password -->
      <VCol cols="12">
        <VTextField
          v-model="form.password"
          label="Password"
          :rules="rules.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          hint="You can not display users' current passwords here"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </VCol>

      <VCol cols="12">
        <VSelect
          v-model="form.roles"
          :rules="rules.roles"
          :items="userStore.getRoles"
          item-title="name"
          item-value="_id"
          label="Select Roles"
          multiple
          hint="Select the user roles"
        />
      </VCol>

      <VCol cols="6">
        <VBtn
          block
          color="error"
          @click="emit('updateCreating', false)"
        >
          Cancel
        </VBtn>
      </VCol>

      <VCol cols="6">
        <VBtn
          block
          @click="create"
        >
          Create
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
