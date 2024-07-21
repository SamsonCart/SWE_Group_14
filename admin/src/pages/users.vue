<script setup>
import { useMessageStore, useUserStore } from '@/store'
import Create from '@/components/Users/Create.vue'
import Edit from '@/components/Users/Edit.vue'
import Delete from '@/components/Users/Delete.vue'

const userStore = useUserStore()
const messageStore = useMessageStore()

const data = computed(() => userStore.getUsers)
const editing = ref(false)
const creating = ref(false)

const user = ref({})

onMounted(async () => {
  await userStore.init()
})

const edit = value => {
  user.value = { ...value }
  creating.value = false
  editing.value = true
}

const create = () => {
  user.value = {}
  editing.value = false
  creating.value = true
}

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
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VAlert
          v-if="messageStore.error"
          border="bottom"
          color="error"
          dark
          class="mb-4"
          v-html="messageStore.error"
        />
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

  <Edit
    v-if="editing"
    :editing="editing"
    :user="user"
    @updateEditing="val => (editing = val)"
  />
  <Create
    v-if="creating"
    :creating="creating"
    @updateCreating="val => (creating = val)"
  />
  <VBtn
    v-show="!creating && !editing"
    @click="create()"
    style="margin-bottom: 20px"
  >
    <VIcon icon="mdi-plus" />
  </VBtn>
  <VDataTable
    v-if="!editing && !creating"
    items-per-page="10"
    :headers="headers"
    :items="data"
    item-value="name"
    class="elevation-1"
  >
    <template v-slot:item.isActive="{ value }">
      <VBtn
        :color="value === true ? 'success' : 'error'"
        disabled
      >
        {{ value ? 'Active' : 'Not Active' }}
      </VBtn>
    </template>
    <template v-slot:item.roles="{ value }">
      {{ value.map(role => role.name).join(', ') }}
    </template>
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
    <template v-slot:item.createdTime="{ value }">
      <span v-if="value">{{ value.substring(0, 16).replace('T', ', 	') }}</span>
    </template>
  </VDataTable>
</template>
