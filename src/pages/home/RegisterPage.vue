<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mt-6 text-center text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</div>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link to="/home/login" class="font-medium text-blue-600 hover:text-blue-500">
            đăng nhập vào tài khoản có sẵn
          </router-link>
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="mt-8 space-y-5">
        <div class="rounded-md space-y-4">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-user text-gray-400"></i>
              </div>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                placeholder="Nguyễn Văn A"
                @blur="validateFullName"
              />
            </div>
            <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
              {{ errors.fullName }}
            </p>
          </div>

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

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-phone text-gray-400"></i>
              </div>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                placeholder="0123456789"
                @blur="validatePhone"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
              {{ errors.phone }}
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
                @blur="validatePassword"
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
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fal fa-lock text-gray-400"></i>
              </div>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                placeholder="••••••••"
                @blur="validateConfirmPassword"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  :class="showConfirmPassword ? 'fal fa-eye-slash' : 'fal fa-eye'"
                  class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="acceptTerms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
          </div>
          <label for="acceptTerms" class="ml-2 block text-sm text-gray-900 cursor-pointer">
            Tôi đồng ý với
            <a href="#" class="text-blue-600 hover:text-blue-500">Điều khoản sử dụng</a>
            và
            <a href="#" class="text-blue-600 hover:text-blue-500">Chính sách bảo mật</a>
          </label>
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
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">Hoặc đăng ký với</span>
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
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const errors = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

// Validations
const validateFullName = () => {
  if (!form.fullName) {
    errors.fullName = 'Vui lòng nhập họ tên'
  } else if (form.fullName.length < 3) {
    errors.fullName = 'Họ tên phải có ít nhất 3 ký tự'
  } else {
    errors.fullName = ''
  }
}

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

const validatePhone = () => {
  const phoneRegex = /^[0-9]{10,11}$/
  if (!form.phone) {
    errors.phone = 'Vui lòng nhập số điện thoại'
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
  } else {
    errors.phone = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  } else {
    errors.password = ''
  }
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Mật khẩu không khớp'
  } else {
    errors.confirmPassword = ''
  }
}

// Form submission
const onSubmit = async () => {
  // Validate all fields
  validateFullName()
  validateEmail()
  validatePhone()
  validatePassword()
  validateConfirmPassword()

  // Check if there are any errors
  if (
    errors.fullName ||
    errors.email ||
    errors.phone ||
    errors.password ||
    errors.confirmPassword
  ) {
    return
  }

  if (!form.acceptTerms) {
    $q.notify({
      type: 'warning',
      message: 'Bạn phải đồng ý với điều khoản sử dụng',
      position: 'top',
    })
    return
  }

  loading.value = true

  try {
    // Call API register
    const response = await axios.post('http://localhost:5000/api/customers/register', {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })

    if (response.data.success) {
      // Auto login after successful registration
      login(response.data.data.customer, response.data.data.token)

      $q.notify({
        type: 'positive',
        message: 'Đăng ký thành công!',
        position: 'top',
      })

      // Redirect to home page
      router.push('/')
    }
  } catch (error) {
    console.error('Register error:', error)
    console.error('Error response:', error.response?.data)

    // Hiển thị lỗi validation chi tiết
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join('\n')

      $q.notify({
        type: 'negative',
        message: errorMessages || 'Validation failed',
        position: 'top',
        timeout: 5000,
        multiLine: true,
      })
    } else {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
        position: 'top',
      })
    }
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
