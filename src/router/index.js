import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Orders from '../views/Orders.vue'
import Order from '../views/Order.vue'
import Products from '../views/Products.vue'
import ProductItem from '../views/ProductItem.vue'
import Categories from '../views/Categories.vue'
import CategoryItem from '../views/CategoryItem.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, 
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: Order
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/product/:id',
    name: 'product-item',
    component: ProductItem
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories
  },
  {
    path: '/category/:id',
    name: 'category-item',
    component: CategoryItem
  },
  
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
