<script setup>
// Importing necessary modules and components
import { computed, ref, onMounted } from 'vue'
import { useMessageStore, useUserStore } from '@/store'
import Create from '@/components/users/Create.vue'
import Edit from '@/components/users/Edit.vue'
import Delete from '@/components/users/Delete.vue'

// Initialize user and message stores
const userStore = useUserStore()
const messageStore = useMessageStore()

// Computed property to get the list of users from the user store
const data = computed(() => userStore.getUsers)

// Reactive references to manage the state of editing and creating
const editing = ref(false)
const creating = ref(false)

// Reactive reference to store the user data for editing
const user = ref({})

// Fetch initial data when the component is mounted
onMounted(async () => {
  await userStore.init()
})

// Function to handle edit action
const edit = value => {
  user.value = { ...value }
  creating.value = false
  editing.value = true
}

// Function to handle create action
const create = () => {
  user.value = {}
  editing.value = false
  creating.value = true
}

// Table headers definition
const headers = ref([
  { title: 'Id', key: '_id', align: ' d-none' },
  { title: 'Username', key: 'username' },
  { title: 'E-Mail', key: 'email' },
  { title: 'Roles', key: 'roles' },
  { title: 'isActive', key: 'isActive' },
  { title: 'Created Time', key: 'createdTime' },
  { title: 'Action', key: 'action', width: '180px' },
])
</script>

<template>
  <!-- Container for alerts and messages -->
  <VContainer>
    <VRow>
      <VCol cols="12">
        <!-- Error alert -->
        <VAlert
          v-if="messageStore.error"
          border="bottom"
          color="error"
          dark
          class="mb-4"
          v-html="messageStore.error"
        />
        <!-- Success alert -->
        <VAlert
          v-if="messageStore.isSuccess"
          border="bottom"
          color="success"
          dark
          class="text-center mb-4"
        >
          {{ messageStore.isSuccess }}
        </VAlert>
      </VCol>
    </VRow>
  </VContainer>

  <!-- Edit user component -->
  <Edit
    v-if="editing"
    :editing="editing"
    :user="user"
    @updateEditing="val => (editing = val)"
  />

  <!-- Create user component -->
  <Create
    v-if="creating"
    :creating="creating"
    @updateCreating="val => (creating = val)"
  />

  <!-- Button to trigger create action -->
  <VBtn
    v-show="!creating && !editing"
    @click="create()"
    style="margin-bottom: 20px"
  >
    <VIcon icon="mdi-plus" />
  </VBtn>

  <!-- Data table to display users -->
  <VDataTable
    v-if="!editing && !creating"
    items-per-page="10"
    :headers="headers"
    :items="data"
    item-value="name"
    class="elevation-1"
  >
    <!-- Slot for isActive column -->
    <template v-slot:item.isActive="{ value }">
      <VBtn
        :color="value === true ? 'success' : 'error'"
        disabled
      >
        {{ value ? 'Active' : 'Not Active' }}
      </VBtn>
    </template>

    <!-- Slot for roles column -->
    <template v-slot:item.roles="{ value }">
      {{ value.map(role => role.name).join(', ') }}
    </template>

    <!-- Slot for action column -->
    <template v-slot:item.action="{ item }">
      <VBtn
        @click="edit(item)"
        class="mr-2"
      >
        <VIcon icon="mdi-pencil" />
      </VBtn>

      <!-- Delete user component -->
      <Delete
        :user="user"
        @click="user = item"
      />
    </template>

    <!-- Slot for createdTime column -->
    <template v-slot:item.createdTime="{ value }">
      <span v-if="value">{{ value.substring(0, 16).replace('T', ', 	') }}</span>
    </template>
  </VDataTable>
</template>
