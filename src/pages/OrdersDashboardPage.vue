<template>
  <q-page class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900">Quản lý đơn hàng</div>
      <p class="text-gray-600 mt-1">Theo dõi và xử lý đơn hàng của khách hàng</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Tìm mã đơn hàng..."
          class="col-span-1"
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
          v-model="filterDate"
          outlined
          dense
          label="Ngày đặt hàng"
          type="date"
          class="col-span-1"
        />

        <div class="flex gap-2">
          <q-btn label="Lọc" color="primary" unelevated class="flex-1" @click="applyFilters" />
          <q-btn label="Xóa" outline color="grey" class="flex-1" @click="clearFilters" />
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <q-table
        :rows="filteredOrders"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        flat
        class="orders-table"
      >
        <!-- Order ID Column -->
        <template v-slot:body-cell-id="props">
          <q-td :props="props">
            <div class="font-semibold text-blue-600 cursor-pointer hover:underline">
              #{{ props.value }}
            </div>
          </q-td>
        </template>

        <!-- Date Column -->
        <template v-slot:body-cell-date="props">
          <q-td :props="props">
            <div class="text-sm text-gray-600">{{ props.value }}</div>
          </q-td>
        </template>

        <!-- Customer Column -->
        <template v-slot:body-cell-customer="props">
          <q-td :props="props">
            <div class="flex items-center gap-2">
              <q-avatar size="32px" color="blue-2" text-color="blue-8">
                <i class="fal fa-user"></i>
              </q-avatar>
              <div>
                <div class="font-medium text-gray-900">{{ props.value }}</div>
                <div class="text-xs text-gray-500">{{ props.row.customerEmail }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Items Column -->
        <template v-slot:body-cell-items="props">
          <q-td :props="props">
            <div class="flex -space-x-2">
              <img
                v-for="(item, index) in props.row.items.slice(0, 3)"
                :key="item.id"
                :src="item.image"
                :alt="item.name"
                class="w-8 h-8 rounded border-2 border-white object-cover"
                :style="{ zIndex: 3 - index }"
              />
              <div
                v-if="props.row.items.length > 3"
                class="w-8 h-8 rounded bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
              >
                +{{ props.row.items.length - 3 }}
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ props.row.items.length }} sản phẩm</div>
          </q-td>
        </template>

        <!-- Total Column -->
        <template v-slot:body-cell-total="props">
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
                @click="viewOrder(props.row)"
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
                @click="editOrder(props.row)"
              >
                <q-tooltip>Cập nhật trạng thái</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="print"
                size="sm"
                color="green"
                @click="printOrder(props.row)"
              >
                <q-tooltip>In hóa đơn</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Order Detail Dialog -->
    <q-dialog v-model="showOrderDetail" full-width>
      <q-card style="max-width: 800px" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Chi tiết đơn hàng #{{ selectedOrder?.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedOrder">
          <!-- Customer Info -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm font-semibold text-gray-700 mb-2">Thông tin khách hàng</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Tên:</span>
                <span class="ml-2 font-medium">{{ selectedOrder.customer }}</span>
              </div>
              <div>
                <span class="text-gray-600">Email:</span>
                <span class="ml-2">{{ selectedOrder.customerEmail }}</span>
              </div>
              <div>
                <span class="text-gray-600">SĐT:</span>
                <span class="ml-2">{{ selectedOrder.customerPhone }}</span>
              </div>
              <div>
                <span class="text-gray-600">Ngày đặt:</span>
                <span class="ml-2">{{ selectedOrder.date }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-4">
            <div class="text-sm font-semibold text-gray-700 mb-2">Sản phẩm</div>
            <div class="space-y-2">
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="flex gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ item.name }}</div>
                  <div class="text-sm text-gray-600">
                    <span v-if="item.size">Size: {{ item.size }}</span>
                    <span v-if="item.color" class="ml-2">- Màu: {{ item.color }}</span>
                  </div>
                  <div class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</div>
                </div>
                <div class="font-semibold text-gray-900">{{ formatPrice(item.price) }}</div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t pt-4">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Tạm tính:</span>
              <span class="font-medium">{{ formatPrice(selectedOrder.total) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Phí vận chuyển:</span>
              <span class="font-medium">{{ formatPrice(30000) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>Tổng cộng:</span>
              <span class="text-blue-600">{{ formatPrice(selectedOrder.total + 30000) }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Đóng" color="grey" outline v-close-popup />
          <q-btn label="In hóa đơn" color="primary" unelevated @click="printOrder(selectedOrder)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Status Dialog -->
    <q-dialog v-model="showEditStatus">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-div">Cập nhật trạng thái đơn hàng</div>
          <div class="text-grey-7 text-sm">Đơn hàng #{{ selectedOrder?.id }}</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="newStatus"
            :options="statusOptions.filter((s) => s.value !== 'all')"
            outlined
            label="Trạng thái mới"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Hủy" color="grey" flat v-close-popup />
          <q-btn label="Cập nhật" color="primary" unelevated @click="updateOrderStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ordersData from 'src/data/ordersData.json'

const $q = useQuasar()

// State
const orders = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const filterDate = ref('')
const showOrderDetail = ref(false)
const showEditStatus = ref(false)
const selectedOrder = ref(null)
const newStatus = ref('')

// Pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

// Status Options
const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' },
]

// Table Columns
const columns = [
  {
    name: 'id',
    label: 'Mã đơn',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Ngày đặt',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'customer',
    label: 'Khách hàng',
    field: 'customer',
    align: 'left',
  },
  {
    name: 'items',
    label: 'Sản phẩm',
    field: 'items',
    align: 'left',
  },
  {
    name: 'total',
    label: 'Tổng tiền',
    field: 'total',
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
    name: 'actions',
    label: 'Thao tác',
    field: 'actions',
    align: 'center',
  },
]

// Load orders from JSON
onMounted(() => {
  loadOrders()
})

const loadOrders = () => {
  loading.value = true
  setTimeout(() => {
    orders.value = ordersData.orders.map((order) => ({
      ...order,
      customer: `Khách hàng ${order.id.slice(-3)}`,
      customerEmail: `customer${order.id.slice(-3)}@email.com`,
      customerPhone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
    }))
    pagination.value.rowsNumber = orders.value.length
    loading.value = false
  }, 500)
}

// Computed Stats
const stats = computed(() => {
  const total = orders.value.length
  const pending = orders.value.filter((o) => o.status === 'pending').length
  const processing = orders.value.filter((o) => o.status === 'processing').length
  const shipping = orders.value.filter((o) => o.status === 'shipping').length
  const delivered = orders.value.filter((o) => o.status === 'delivered').length
  const revenue = orders.value
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  return [
    {
      label: 'Tổng đơn hàng',
      value: total,
      icon: 'fal fa-shopping-cart',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Chờ xác nhận',
      value: pending,
      icon: 'fal fa-clock',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Đang xử lý',
      value: processing + shipping,
      icon: 'fal fa-truck',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Đã giao',
      value: delivered,
      icon: 'fal fa-check-circle',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Doanh thu',
      value: formatPrice(revenue),
      icon: 'fal fa-dollar-sign',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ]
})

// Filtered Orders
const filteredOrders = computed(() => {
  let result = [...orders.value]

  // Filter by search query
  if (searchQuery.value) {
    result = result.filter((order) =>
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Filter by status
  if (filterStatus.value && filterStatus.value !== 'all') {
    result = result.filter((order) => order.status === filterStatus.value)
  }

  // Filter by date
  if (filterDate.value) {
    result = result.filter((order) => {
      const orderDate = order.date.split('/').reverse().join('-')
      return orderDate === filterDate.value
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
    pending: 'orange',
    processing: 'blue',
    shipping: 'purple',
    delivered: 'green',
    cancelled: 'red',
  }
  return colors[status] || 'grey'
}

const applyFilters = () => {
  // Filters are applied automatically via computed property
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
  filterDate.value = ''
  $q.notify({
    type: 'info',
    message: 'Đã xóa bộ lọc',
    position: 'top-right',
    timeout: 1000,
  })
}

const viewOrder = (order) => {
  selectedOrder.value = order
  showOrderDetail.value = true
}

const editOrder = (order) => {
  selectedOrder.value = order
  newStatus.value = order.status
  showEditStatus.value = true
}

const updateOrderStatus = () => {
  if (selectedOrder.value && newStatus.value) {
    selectedOrder.value.status = newStatus.value
    showEditStatus.value = false
    $q.notify({
      type: 'positive',
      message: 'Cập nhật trạng thái thành công',
      position: 'top-right',
    })
  }
}

const printOrder = (order) => {
  $q.notify({
    type: 'info',
    message: `Đang in hóa đơn #${order.id}`,
    position: 'top-right',
  })
}
</script>

<style scoped>
:deep(.orders-table .q-table__top) {
  padding: 16px;
}

:deep(.orders-table .q-table thead tr),
:deep(.orders-table .q-table tbody td) {
  height: 60px;
}

:deep(.orders-table .q-table th) {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

:deep(.orders-table .q-table tbody tr:hover) {
  background-color: #f9fafb;
}
</style>
