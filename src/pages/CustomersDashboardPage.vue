<template>
  <q-page class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900">Quản lý khách hàng</div>
      <p class="text-gray-600 mt-1">Theo dõi và quản lý thông tin khách hàng</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center', stat.bgColor]">
            <i :class="[stat.icon, 'text-xl', stat.iconColor]"></i>
          </div>
        </div>
        <div v-if="stat.change" class="mt-2 text-xs">
          <span :class="stat.changeColor">{{ stat.change }}</span>
        </div>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Tìm tên, email, SĐT..."
          class="col-span-2"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="filterStatus"
          :options="statusOptions"
          outlined
          dense
          label="Trạng thái"
          emit-value
          map-options
          class="col-span-1"
        />

        <q-input
          v-model="filterJoinDate"
          outlined
          dense
          label="Ngày tham gia"
          type="date"
          class="col-span-1"
        />

        <div class="flex gap-2">
          <q-btn label="Lọc" color="primary" unelevated class="flex-1" @click="applyFilters" />
          <q-btn label="Xóa" outline color="grey" class="flex-1" @click="clearFilters" />
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <q-table
        :rows="filteredCustomers"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        flat
        class="customers-table"
      >
        <!-- Customer Column -->
        <template v-slot:body-cell-customer="props">
          <q-td :props="props">
            <div class="flex items-center gap-3">
              <q-avatar size="48px">
                <img :src="props.row.avatar" :alt="props.row.name" />
              </q-avatar>
              <div>
                <div class="font-semibold text-gray-900">{{ props.row.name }}</div>
                <div class="text-sm text-gray-500">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Phone Column -->
        <template v-slot:body-cell-phone="props">
          <q-td :props="props">
            <div class="flex items-center gap-2">
              <i class="fal fa-phone text-gray-400"></i>
              <span class="text-sm text-gray-600">{{ props.value }}</span>
            </div>
          </q-td>
        </template>

        <!-- Address Column -->
        <template v-slot:body-cell-address="props">
          <q-td :props="props">
            <div class="text-sm text-gray-600 max-w-xs truncate" :title="props.value">
              {{ props.value }}
            </div>
          </q-td>
        </template>

        <!-- Join Date Column -->
        <template v-slot:body-cell-joinDate="props">
          <q-td :props="props">
            <div class="text-sm text-gray-600">{{ props.value }}</div>
          </q-td>
        </template>

        <!-- Total Orders Column -->
        <template v-slot:body-cell-totalOrders="props">
          <q-td :props="props">
            <div class="text-center">
              <q-chip color="blue-2" text-color="blue-8" size="sm" class="font-medium">
                {{ props.value }} đơn
              </q-chip>
            </div>
          </q-td>
        </template>

        <!-- Total Spent Column -->
        <template v-slot:body-cell-totalSpent="props">
          <q-td :props="props">
            <div class="font-semibold text-gray-900">{{ formatPrice(props.value) }}</div>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.value)"
              text-color="white"
              size="sm"
              class="font-medium"
            >
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <!-- Last Order Column -->
        <template v-slot:body-cell-lastOrder="props">
          <q-td :props="props">
            <div class="text-sm text-gray-600">{{ props.value }}</div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="flex gap-1">
              <q-btn
                flat
                dense
                round
                icon="visibility"
                size="sm"
                color="primary"
                @click="viewCustomer(props.row)"
              >
                <q-tooltip>Xem chi tiết</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="edit"
                size="sm"
                color="blue-grey"
                @click="editCustomer(props.row)"
              >
                <q-tooltip>Chỉnh sửa</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="shopping_bag"
                size="sm"
                color="green"
                @click="viewOrders(props.row)"
              >
                <q-tooltip>Xem đơn hàng</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Customer Detail Dialog -->
    <q-dialog v-model="showCustomerDetail" full-width>
      <q-card style="max-width: 700px" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Chi tiết khách hàng</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedCustomer">
          <!-- Customer Avatar & Basic Info -->
          <div class="flex items-start gap-4 mb-6">
            <q-avatar size="80px">
              <img :src="selectedCustomer.avatar" :alt="selectedCustomer.name" />
            </q-avatar>
            <div class="flex-1">
              <div class="text-xl font-bold text-gray-900 mb-1">{{ selectedCustomer.name }}</div>
              <div class="text-sm text-gray-600 space-y-1">
                <div class="flex items-center gap-2">
                  <i class="fal fa-envelope text-gray-400"></i>
                  <span>{{ selectedCustomer.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fal fa-phone text-gray-400"></i>
                  <span>{{ selectedCustomer.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fal fa-map-marker-alt text-gray-400"></i>
                  <span>{{ selectedCustomer.address }}</span>
                </div>
              </div>
            </div>
            <q-chip
              :color="getStatusColor(selectedCustomer.status)"
              text-color="white"
              class="font-medium"
            >
              {{ getStatusLabel(selectedCustomer.status) }}
            </q-chip>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {{ selectedCustomer.totalOrders }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Tổng đơn hàng</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {{ formatPrice(selectedCustomer.totalSpent) }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Tổng chi tiêu</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">
                {{ formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders) }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Giá trị TB/đơn</div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Mã khách hàng:</span>
              <span class="font-semibold text-gray-900">{{ selectedCustomer.id }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Ngày tham gia:</span>
              <span class="font-semibold text-gray-900">{{ selectedCustomer.joinDate }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Đơn hàng gần nhất:</span>
              <span class="font-semibold text-gray-900">{{ selectedCustomer.lastOrder }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Đóng" color="grey" outline v-close-popup />
          <q-btn
            label="Xem đơn hàng"
            color="primary"
            unelevated
            @click="viewOrders(selectedCustomer)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Customer Dialog -->
    <q-dialog v-model="showEditCustomer">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Chỉnh sửa thông tin khách hàng</div>
          <div class="text-grey-7 text-sm">{{ selectedCustomer?.id }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="space-y-4">
            <q-input v-model="editForm.name" outlined label="Họ và tên" />
            <q-input v-model="editForm.email" outlined label="Email" type="email" />
            <q-input v-model="editForm.phone" outlined label="Số điện thoại" />
            <q-input v-model="editForm.address" outlined label="Địa chỉ" type="textarea" rows="2" />
            <q-select
              v-model="editForm.status"
              :options="statusOptions.filter((s) => s.value !== 'all')"
              outlined
              label="Trạng thái"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Hủy" color="grey" flat v-close-popup />
          <q-btn label="Lưu" color="primary" unelevated @click="updateCustomer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

// Get admin auth header
const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// State
const customers = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const filterJoinDate = ref('')
const showCustomerDetail = ref(false)
const showEditCustomer = ref(false)
const selectedCustomer = ref(null)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  status: '',
})

// Pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

// Status Options
const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoạt động', value: 'active' },
  { label: 'VIP', value: 'vip' },
  { label: 'Không hoạt động', value: 'inactive' },
]

// Table Columns
const columns = [
  {
    name: 'customer',
    label: 'Khách hàng',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    field: 'address',
    align: 'left',
  },
  {
    name: 'joinDate',
    label: 'Ngày tham gia',
    field: 'joinDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'totalOrders',
    label: 'Tổng đơn',
    field: 'totalOrders',
    align: 'center',
    sortable: true,
  },
  {
    name: 'totalSpent',
    label: 'Tổng chi tiêu',
    field: 'totalSpent',
    align: 'right',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Trạng thái',
    field: 'status',
    align: 'center',
  },
  {
    name: 'lastOrder',
    label: 'Đơn gần nhất',
    field: 'lastOrder',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Thao tác',
    field: 'actions',
    align: 'center',
  },
]

// Load customers from API
onMounted(() => {
  loadCustomers()
})

const loadCustomers = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:5000/api/customers', {
      headers: getAdminAuthHeader(),
    })

    if (response.data.success) {
      customers.value = response.data.data.map((customer) => {
        return {
          id: customer._id,
          name: customer.fullName || customer.name || 'N/A',
          email: customer.email || 'N/A',
          phone: customer.phone || 'N/A',
          address: customer.address || 'N/A',
          avatar: customer.avatar || 'https://cdn.quasar.dev/img/avatar.png',
          joinDate: formatDate(customer.createdAt),
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
          status: customer.status || 'active',
          lastOrder: customer.lastOrder ? formatDate(customer.lastOrder) : 'Chưa có',
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        }
      })
      pagination.value.rowsNumber = customers.value.length
    }
  } catch (error) {
    console.error('Load customers error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể tải danh sách khách hàng',
      position: 'top-right',
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Computed Stats
const stats = computed(() => {
  const total = customers.value.length
  const active = customers.value.filter((c) => c.status === 'active').length
  const vip = customers.value.filter((c) => c.status === 'vip').length
  const totalRevenue = customers.value.reduce((sum, c) => sum + c.totalSpent, 0)

  return [
    {
      label: 'Tổng khách hàng',
      value: total,
      icon: 'fal fa-users',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Đang hoạt động',
      value: active,
      icon: 'fal fa-user-check',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Khách VIP',
      value: vip,
      icon: 'fal fa-crown',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Tổng doanh thu',
      value: formatPrice(totalRevenue),
      icon: 'fal fa-dollar-sign',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ]
})

// Filtered Customers
const filteredCustomers = computed(() => {
  let result = [...customers.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query),
    )
  }

  // Filter by status
  if (filterStatus.value && filterStatus.value !== 'all') {
    result = result.filter((customer) => customer.status === filterStatus.value)
  }

  // Filter by join date
  if (filterJoinDate.value) {
    result = result.filter((customer) => {
      const customerDate = customer.joinDate.split('/').reverse().join('-')
      return customerDate === filterJoinDate.value
    })
  }

  return result
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getStatusLabel = (status) => {
  const option = statusOptions.find((s) => s.value === status)
  return option ? option.label : status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    vip: 'orange',
    inactive: 'grey',
  }
  return colors[status] || 'grey'
}

const applyFilters = () => {
  $q.notify({
    type: 'positive',
    message: 'Đã áp dụng bộ lọc',
    position: 'top-right',
    timeout: 1000,
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
  filterJoinDate.value = ''
  $q.notify({
    type: 'info',
    message: 'Đã xóa bộ lọc',
    position: 'top-right',
    timeout: 1000,
  })
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showCustomerDetail.value = true
}

const editCustomer = (customer) => {
  selectedCustomer.value = customer
  editForm.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    status: customer.status,
  }
  showEditCustomer.value = true
}

const updateCustomer = async () => {
  if (selectedCustomer.value) {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/customers/${selectedCustomer.value.id}`,
        {
          fullName: editForm.value.name,
          email: editForm.value.email,
          phone: editForm.value.phone,
          address: editForm.value.address,
          status: editForm.value.status,
        },
        { headers: getAdminAuthHeader() },
      )

      if (response.data.success) {
        Object.assign(selectedCustomer.value, editForm.value)
        showEditCustomer.value = false
        // Reload customers to get updated data
        await loadCustomers()
        $q.notify({
          type: 'positive',
          message: 'Cập nhật thông tin thành công',
          position: 'top-right',
        })
      }
    } catch (error) {
      console.error('Update customer error:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Không thể cập nhật thông tin',
        position: 'top-right',
      })
    }
  }
}

const viewOrders = (customer) => {
  $q.notify({
    type: 'info',
    message: `Đang chuyển đến đơn hàng của ${customer.name}`,
    position: 'top-right',
  })
  router.push(`/admin/orders?customer=${customer.id}`)
}
</script>

<style scoped>
:deep(.customers-table .q-table__top) {
  padding: 16px;
}

:deep(.customers-table .q-table thead tr),
:deep(.customers-table .q-table tbody td) {
  height: 70px;
}

:deep(.customers-table .q-table th) {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

:deep(.customers-table .q-table tbody tr:hover) {
  background-color: #f9fafb;
}
</style>
