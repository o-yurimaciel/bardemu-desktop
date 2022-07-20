<template>
  <v-app>
    <v-main>
      <router-view/>
      <OrderAlert 
      v-if="openDialogOrders" 
      :orders="newestOrders" 
      :closeDialog="closeDialog" />
    </v-main>
  </v-app>
</template>

<script>
import OrderAlert from './components/orderAlert.vue'
import { EventBus } from './EventBus'
import { ipcRenderer } from 'electron'

export default {
  name: 'App',
  data: () => ({
    openDialogOrders: false,
    newestOrders: []
  }),
  components: {
    OrderAlert
  },
  mounted() {
    EventBus.$on('new-order', (order) => {
      this.openDialogOrders = true
      this.newestOrders.push(order)
    })
  },
  methods: {
    closeDialog() {
      this.openDialogOrders = false
      this.newestOrders = []
    }
  }
};
</script>

<style>
  @import url('../src/assets/fonts.css');
  :root {
    --primary-color: #e41c38;
  }

  html {
    background-color: #fff;
  }

  .product-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.4em;
    letter-spacing: 1.5px;
    color: black;
  }

  .product-description {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1em;
    color: black;
  }

  .product-price {
    font-family: 'Roboto', sans-serif;
    font-size: 1.5em;
    font-weight: 700;
    color: #e41c38;
  }

  .bread-item {
    font-size: 1.3em;
    text-shadow: 1px 1px 1px black;
  }

  .wrapper {
    /* background: linear-gradient(180deg, var(--primary-color) 50%, #fff 50%); */
    background: url('https://img.freepik.com/vetores-gratis/colecao-isometrica-de-fast-food-com-diferentes-produtos-e-bebidas_1284-34490.jpg?w=2000')!important;
    background-size: 25% 100%;
    height: 300px;
  }
</style>
