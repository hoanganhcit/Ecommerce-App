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

  // Admin Dashboard Routes
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DashboardPage.vue') }],
  },

  // Product Management Routes
  {
    path: '/products',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/products/ProductListPage.vue') },
      { path: 'add', component: () => import('pages/products/AddProductPage.vue') },
      { path: 'edit/:id', component: () => import('pages/products/AddProductPage.vue') },
      { path: 'categories', component: () => import('pages/products/CategoryPage.vue') },
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
