<template>
  <q-page class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Dark Mode Toggle Button -->
    <button
      @click="toggleDarkMode"
      class="fixed top-4 right-4 p-3 rounded-full !bg-white dark:!bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 z-50"
    >
      <svg
        v-if="isDark"
        class="w-6 h-6 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        v-else
        class="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>

    <div class="w-full max-w-md px-6">
      <div class="!bg-white dark:!bg-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-10 dark:!bg-gray-800 p-8 text-center">
          <div class="text-3xl font-bold text-white mb-2">Create Account</div>
          <p class="text-blue-100 dark:text-blue-200">Sign up to get started</p>
        </div>

        <!-- Form -->
        <div class="p-8">
          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Name Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Full Name</label
              >
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-blue-10 dark:!text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-10 dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <p v-if="nameError" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ nameError }}
              </p>
            </div>

            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Email Address</label
              >
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-blue-10 dark:!text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-10 dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <p v-if="emailError" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ emailError }}
              </p>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Password</label
              >
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-blue-10 dark:!text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  placeholder="Create a password"
                  required
                  class="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-10 dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    @click="isPwd = !isPwd"
                    class="text-gray-400 dark:text-gray-500 hover:text-blue-10 dark:hover:text-blue-400 transition-colors focus:outline-none"
                  >
                    <svg
                      v-if="isPwd"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="passwordError" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ passwordError }}
              </p>
            </div>

            <!-- Terms & Conditions -->
            <div class="flex items-start">
              <input
                v-model="agreeTerms"
                type="checkbox"
                class="h-4 w-4 mt-1 text-blue-10 dark:text-blue-500 focus:ring-blue-10 dark:focus:ring-blue-500 border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 rounded"
              />
              <span class="small text-gray-600 dark:text-gray-400 pl-2" style="font-size: 12px">
                I agree to the
                <router-link
                  to="#"
                  class="text-blue-10 dark:!text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Terms and Conditions
                </router-link>
                and
                <router-link
                  to="#"
                  class="text-blue-10 dark:!text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Privacy Policy
                </router-link>
              </span>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading || !agreeTerms"
                class="w-full bg-blue-10 dark:bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 !bg-white dark:!bg-gray-700 text-gray-500 dark:text-gray-400"
                >Or sign up with</span
              >
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button
              class="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 rounded-lg hover:!bg-gray-50 dark:hover:!bg-gray-600 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </button>
            <button
              class="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-800 !bg-white dark:!bg-gray-800 rounded-lg hover:!bg-gray-50 dark:hover:!bg-gray-600 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
            </button>
          </div>

          <!-- Sign In Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <router-link
                to="/login"
                class="font-medium text-blue-10 dark:!text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © 2025 EcommerceApp. All rights reserved.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const name = ref('')
const email = ref('')
const password = ref('')
const isPwd = ref(true)
const agreeTerms = ref(false)
const loading = ref(false)
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const isDark = ref(false)

// Dark mode functions
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

onMounted(() => {
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedDarkMode === 'false') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    }
  }
})

const isValidEmail = (val) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(val)
}

const validateForm = () => {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''

  if (!name.value) {
    nameError.value = 'Name is required'
    return false
  }

  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  }

  if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email'
    return false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  }

  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }

  return true
}

const onSubmit = async () => {
  if (!agreeTerms.value) {
    $q.notify({
      color: 'warning',
      message: 'Please agree to the terms and conditions',
      icon: 'warning',
      position: 'top',
    })
    return
  }

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    $q.notify({
      color: 'positive',
      message: 'Account created successfully!',
      icon: 'check_circle',
      position: 'top',
    })

    // Redirect to dashboard or login
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Registration failed. Please try again.',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>
