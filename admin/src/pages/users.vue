<script setup>
import { ref, onMounted, watch } from 'vue'
import { VDataTableServer } from 'vuetify/lib/labs/components.mjs'
import Create from '@/components/users/Create.vue'
import Edit from '@/components/users/Edit.vue'
import Delete from '@/components/users/Delete.vue'
import { useMessageStore, useUserStore } from '@/store'
import { debounce } from 'lodash-es'

// Initialize the user store and message store from Pinia
const userStore = useUserStore()
const messageStore = useMessageStore()

// State variables for component behavior
const editing = ref(false) // Indicates if a user is being edited
const creating = ref(false) // Indicates if a user is being created
const loading = ref(false) // Indicates if data is being loaded
const user = ref({}) // Holds the user data for editing/creating

// Filter state variables
const search = ref('') // Used for triggering data reload
const name = ref('') // Filter by username
const email = ref('') // Filter by email
const selectedRoles = ref([]) // Filter by selected roles
const isActive = ref(null) // Filter by active status

// Load initial data when the component is mounted
onMounted(async () => {
  await userStore.init() // Initialize the user store
})

// Function to load items from the store with filters, sorting, and pagination
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  try {
    loading.value = true // Set loading state to true
    const filter = {
      username: name.value, // Username filter
      email: email.value, // Email filter
      roles: selectedRoles.value, // Roles filter
      isActive: isActive.value, // Active status filter
    }
    // Set users in the store with the current filters, pagination, and sorting
    await userStore.setUsers(page, itemsPerPage, sortBy, filter)
    loading.value = false // Set loading state to false after loading
  } catch (error) {
    loading.value = false // Set loading state to false if an error occurs
    console.error('loadItems :>> error', error) // Log the error
  }
}

// Function to set up editing mode with the selected user data
const edit = value => {
  user.value = { ...value } // Copy the selected user data to the user ref
  creating.value = false // Disable creating mode
  editing.value = true // Enable editing mode
}

// Function to set up creating mode
const create = () => {
  user.value = {} // Clear the user data
  editing.value = false // Disable editing mode
  creating.value = true // Enable creating mode
}

// Headers for the data table
const headers = ref([
  { title: 'Id', key: '_id', align: ' d-none' }, // ID column
  { title: 'Username', key: 'username' }, // Username column
  { title: 'E-Mail', key: 'email' }, // Email column
  { title: 'Roles', key: 'roles' }, // Roles column
  { title: 'isActive', key: 'isActive' }, // Active status column
  { title: 'Created Time', key: 'createdTime' }, // Created time column
  { title: 'Action', key: 'action', width: '180px' }, // Action column
])

// Function to clear all filters
const clearFilters = () => {
  name.value = '' // Clear username filter
  email.value = '' // Clear email filter
  selectedRoles.value = [] // Clear roles filter
  isActive.value = null // Clear active status filter
  search.value = String(Date.now()) // Trigger data reload
}

// Debounced search function to reduce the number of queries
const debouncedSearch = debounce(() => {
  search.value = String(Date.now()) // Trigger data reload with debounce
}, 300)

// Watch for changes in filter variables and trigger the debounced search
watch([name, email, selectedRoles, isActive], debouncedSearch)
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

  <!-- Edit component -->
  <Edit
    v-if="editing"
    :editing="editing"
    :user="user"
    @updateEditing="val => (editing = val)"
  />

  <!-- Create component -->
  <Create
    v-if="creating"
    :creating="creating"
    @updateCreating="val => (creating = val)"
  />

  <!-- Button to create a new user -->
  <VBtn
    v-show="!creating && !editing"
    @click="create()"
    style="margin-bottom: 20px"
  >
    <VIcon icon="mdi-plus" />
  </VBtn>

  <!-- Data table for users -->
  <VDataTableServer
    v-if="!editing && !creating"
    v-model:items-per-page="userStore.pageSize"
    :headers="headers"
    :items="userStore.users"
    :items-length="userStore.total"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
    class="elevation-1"
  >
    <!-- Header template for search filters -->
    <template v-slot:thead>
      <tr>
        <td>
          <v-text-field
            v-model="name"
            class="ma-2"
            density="compact"
            placeholder="Search username..."
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="email"
            class="ma-2"
            density="compact"
            placeholder="Search email..."
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-select
            v-model="selectedRoles"
            class="ma-2"
            density="compact"
            :items="userStore.roles"
            item-title="name"
            item-value="_id"
            multiple
            placeholder="Select roles"
            hide-details
          ></v-select>
        </td>
        <td>
          <v-select
            v-model="isActive"
            class="ma-2"
            density="compact"
            :items="[
              { text: 'Active', value: true },
              { text: 'Inactive', value: false },
            ]"
            item-title="text"
            item-value="value"
            placeholder="Select status"
            hide-details
          ></v-select>
        </td>
        <td></td>
        <td>
          <VBtn @click="clearFilters">Clear</VBtn>
        </td>
      </tr>
    </template>

    <!-- Template for displaying the active status -->
    <template v-slot:item.isActive="{ value }">
      <VBtn
        :color="value ? 'success' : 'error'"
        disabled
      >
        {{ value ? 'Active' : 'Disabled' }}
      </VBtn>
    </template>

    <!-- Template for displaying roles -->
    <template v-slot:item.roles="{ value }">
      {{ value.map(role => role.name).join(', ') }}
    </template>

    <!-- Template for action buttons (edit and delete) -->
    <template v-slot:item.action="{ item }">
      <VBtn
        @click="edit(item)"
        class="mr-2"
      >
        <VIcon icon="mdi-pencil" />
      </VBtn>

      <Delete
        :user="user"
        @click="user = item"
      />
    </template>

    <!-- Template for displaying the created time -->
    <template v-slot:item.createdTime="{ value }">
      <span v-if="value">{{ value.substring(0, 16).replace('T', ', ') }}</span>
    </template>
  </VDataTableServer>
</template>
