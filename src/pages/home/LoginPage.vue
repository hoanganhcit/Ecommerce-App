<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập thành viên
        </div>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link to="/home/register" class="font-medium text-blue-600 hover:text-blue-500">
            tạo tài khoản mới
          </router-link>
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
        <div class="rounded-md space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                placeholder="example@email.com"
                @blur="validateEmail"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  :class="showPassword ? 'fal fa-eye-slash' : 'fal fa-eye'"
                  class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500"> Quên mật khẩu? </a>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập với</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="socialLogin('google')"
            class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <i class="fab fa-google mr-2 text-red-500"></i>
            Google
          </button>
          <button
            type="button"
            @click="socialLogin('facebook')"
            class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <i class="fab fa-facebook-f mr-2 text-blue-600"></i>
            Facebook
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/useAuthStore'
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()
const { login } = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive({
  email: '',
})

const showPassword = ref(false)
const loading = ref(false)

// Validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Vui lòng nhập email'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Email không hợp lệ'
  } else {
    errors.email = ''
  }
}

// Form submission
const onSubmit = async () => {
  validateEmail()

  if (errors.email) {
    return
  }

  loading.value = true

  try {
    // Call API login
    const response = await axios.post('http://localhost:5000/api/customers/login', {
      email: form.email,
      password: form.password,
    })

    if (response.data.success) {
      // Save to auth store
      login(response.data.data.customer, response.data.data.token)

      $q.notify({
        type: 'positive',
        message: 'Đăng nhập thành công!',
        position: 'top',
      })

      // Redirect to home page
      router.push('/')
    }
  } catch (error) {
    console.error('Login error:', error)
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Social login
const socialLogin = (provider) => {
  $q.notify({
    type: 'info',
    message: `Đăng nhập với ${provider} (Chức năng đang phát triển)`,
    position: 'top',
  })
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
