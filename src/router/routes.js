const routes = [
  // Landing/Store Routes
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/LandingPage.vue') },
      { path: 'shop', component: () => import('pages/home/ProductsListPage.vue') },
      { path: 'shop/:category', component: () => import('pages/home/ProductsListPage.vue') },
      { path: 'product/:slug', component: () => import('pages/home/ProductDetailPage.vue') },
      { path: 'checkout', component: () => import('pages/home/CheckoutPage.vue') },
      { path: 'account', component: () => import('pages/home/MyAccountPage.vue') },
      { path: 'orders', component: () => import('pages/home/MyOrdersPage.vue') },
    ],
  },

  // Auth Routes
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignUpPage.vue') }],
  },

  // Admin Routes
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'orders', component: () => import('pages/OrdersDashboardPage.vue') },
      { path: 'customers', component: () => import('pages/CustomersDashboardPage.vue') },
      { path: 'analytics', component: () => import('pages/AnalyticsDashboardPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsDashboardPage.vue') },
      { path: 'products', component: () => import('pages/products/ProductListPage.vue') },
      { path: 'products/add', component: () => import('pages/products/AddProductPage.vue') },
      { path: 'products/edit/:id', component: () => import('pages/products/AddProductPage.vue') },
      { path: 'products/categories', component: () => import('pages/products/CategoryPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
