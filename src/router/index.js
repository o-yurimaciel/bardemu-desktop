import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Orders from '../views/Orders.vue'
import Order from '../views/Order.vue'
import Products from '../views/Products.vue'
import ProductItem from '../views/ProductItem.vue'
import Categories from '../views/Categories.vue'
import CategoryItem from '../views/CategoryItem.vue'
import Login from '../views/Login.vue'
import store from '../store'
import log from '../logConfig'
import Administrative from '../views/Administrative.vue'
import Configs from '../views/Configs.vue'
import Clients from '../views/Clients.vue'
import Feedbacks from '../views/Feedbacks.vue'
import DeliveryConfig from '../views/DeliveryConfig.vue'
import DistrictItem from '../views/DistrictItem.vue'

Vue.use(VueRouter)

function auth(to, from, next) {
  const token = store.state.token

  if(token) {
    next()
  } else {
    log.warn("Usuário não autenticado")
    store.dispatch('openAlert', {
      message: 'Usuário não autenticado',
      type: 'error'
    })
    next('/')
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    component: Home
  }, 
  {
    path: '/adm',
    name: 'Administrative',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    component: Administrative
  }, 
  {
    path: '/configs',
    name: 'Configs',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    component: Configs
  }, 
  {
    path: '/orders',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'Orders',
    component: Orders
  },
  {
    path: '/order/:id?',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'Order',
    component: Order
  },
  {
    path: '/products',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'products',
    component: Products
  },
  {
    path: '/product/:id?',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'product-item',
    component: ProductItem
  },
  {
    path: '/categories',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'categories',
    component: Categories
  },
  {
    path: '/category/:id?',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'category-item',
    component: CategoryItem
  },
  {
    path: '/clients',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'clients',
    component: Clients
  },
  {
    path: '/feedbacks',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'feedbacks',
    component: Feedbacks
  }, 
  {
    path: '/delivery-config',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'delivery-config',
    component: DeliveryConfig
  },
  {
    path: '/district/:id?',
    beforeEnter: (to, from, next) => {
      auth(to, from, next)
    },
    name: 'district-item',
    component: DistrictItem
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
