<script setup>
// Import necessary modules and utilities
import { useUserStore } from '@/store/user';
import { useMessageStore } from '@/store/message';
import { regexEmail } from '@/utils/regex';

// Initialize stores
const userStore = useUserStore();
const messageStore = useMessageStore();

const emit = defineEmits(['updateComponent']); // Define emit for event handling

// Define reactive variables for the component's state
const visibleEye = ref(true);
const isSubmitting = ref(false);
const formData = ref({ email: 'business@example.com', password: 'password' });

// Function to handle login
const login = async () => {
  isSubmitting.value = true;

  try {
    // Validate form data
    for (const [key, value] of Object.entries(formData.value)) {
      let error;

      if (!value) {
        error = `${key} is a mandatory field!`;
      } else if (key === 'email' && !regexEmail(value)) {
        error = 'You must enter a valid email address';
      }

      if (error) {
        messageStore.setError({ error });
        setTimeout(() => {
          isSubmitting.value = false;
        }, 2000); // Prevent serial clicks
        return;
      }
    }
    // Attempt login
    await userStore.login({ ...formData.value });
    isSubmitting.value = false;
  } catch (error) {
    messageStore.setError({ error });
    isSubmitting.value = false;
  }
};

// On component mount, handle account activation if necessary
// onMounted(async () => {
//   await nextTick();
//   const { type, email, authCode } = useRoute().query;

//   if (type === 'activate') {
//     userStore.activate({ email, authCode }).then((res) => {
//       if (res) {
//         useRouter().push('/dashboard');
//       }
//     });
//   }
// });
</script>

<template>
  <!-- Display error or success messages -->
  <utilsGetErrorSuccess />

  <div id="signinup" class="card">
    <div class="card-body">
      <!-- Email Input Field -->
      <div class="form-group row mb-2">
        <label for="email" class="col-sm-4 col-form-label">Email</label>
        <div class="col-sm-8">
          <input
            type="email"
            autocomplete="false"
            class="form-control"
            id="email"
            placeholder="Email"
            v-model="formData.email"
          />
        </div>
      </div>

      <!-- Password Input Field -->
      <div class="form-group row mb-2">
        <label for="password" class="col-sm-4 col-form-label">Password</label>
        <div class="col-sm-8">
          <div id="passwordColumn">
            <input
              :type="visibleEye ? 'password' : 'text'"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="formData.password"
            />
          </div>
        </div>
      </div>

      <!-- Remember Me Checkbox -->
      <div class="form-group row mb-2">
        <div class="col-sm-4"></div>
        <div class="col-sm-8">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="remember" />
            <label class="form-check-label" for="remember"> Remember me</label>
          </div>
        </div>
      </div>

      <!-- Sign In Button -->
      <div class="form-group row">
        <div class="col-sm-12 d-flex justify-content-end">
          <button
            @click="login()"
            :disabled="isSubmitting"
            class="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
      <hr />
      <!-- Link to Signup Page -->
      <div class="text-center">
        New on our platform?
        <router-link class="row-pointer" to="/signup"
          >Create an account</router-link
        >
      </div>
    </div>
  </div>
</template>
