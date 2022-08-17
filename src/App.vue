<template>
  <v-app>
    <v-main>
      <v-alert 
      v-if="alert" 
      max-width="400px"
      :type="alert.type"
      class="alert">
        {{alert.message}}
      </v-alert>
      <OrderAlert 
      v-if="openDialogOrders" 
      :orders="newestOrders" 
      :closeDialog="closeDialog" />
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import OrderAlert from './components/orderAlert.vue'
import { EventBus } from './EventBus'

export default {
  name: 'App',
  data: () => ({
    alert: false,
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

    EventBus.$on('alert', (alert) => {
      this.alert = false

      setTimeout(() => {
        this.alert = alert
      }, 200);
      
      setTimeout(() => {
        this.alert = false
      }, 5000);
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
  @import url('../src/assets/global.css');

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

  .alert {
    position: absolute!important;
    top: 10px;
    right: 10px;
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
</style>
