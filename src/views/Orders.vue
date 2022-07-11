<template>
  <v-container fluid class="wrapper pa-0 ma-0">
    <v-col cols="10" offset="1" class="pa-0 pt-10">
      <v-col cols="12" class="pa-0 d-flex flex-column" style="position: relative">
        <v-breadcrumbs
          class="pa-0"
          :items="breadCrumbs"
          divider="/"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item style="cursor: pointer" :to="item.to">
              <span class="bread-item" style="color: #fff">
                {{ item.text }}
              </span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <h1 style="color: #fff">Pedidos</h1>
      </v-col>
      <v-col cols="12" class="pa-0 pt-10 content">
        <table style="width: 100%" class="elevation-1">
          <tr style="backgroundColor: #fff">
            <th>Data</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Pagamento</th>
            <th>Valor</th>
          </tr>
          <tbody @click="openOrder(order)" v-for="(order) in orders" :key="order._id">
            <tr>
              <td>{{new Date(order.createdAt).toLocaleDateString()}}</td>
              <td>{{formatHour(order.createdAt)}}</td>
              <td>{{order.clientName}}</td>
              <td>{{order.clientPhone}}</td>
              <td>{{formatStatus(order.orderStatus)}}</td>
              <td>{{order.paymentType}}</td>
              <td>{{order.totalValue | currency}}</td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
const orderHistoryStatusOptions = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
})

import { bardemu } from '../services'

export default {
  data() {
    return {
      orders: [],
      breadCrumbs: [
        { text: 'Home', to: '/' }
      ]
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    formatHour(date) {
      const { format } = require('date-fns')
      return format(new Date(date), 'HH:mm')
    },
    getOrders() {
      bardemu.get('/orders').then((res) => {
        console.log(res)
        this.orders = res.data.sort((a, b) => {
          return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
        })
      }).catch((e) => {
        console.log(e.response)
      })
    },
    formatStatus(status) {
      switch(status) {
        case orderHistoryStatusOptions.PENDING:
          return "Aguardando confirmação"
        case orderHistoryStatusOptions.CONFIRMED:
          return "Confirmado"
        case orderHistoryStatusOptions.OUT_FOR_DELIVERY:
          return "Saiu p/ entrega"
        case orderHistoryStatusOptions.DELIVERED:
          return "Entregue"
        case orderHistoryStatusOptions.CANCELLED:
          return "Cancelado"
      }
    },
    openOrder(order) {
      this.$router.push(`/order/${order._id}`)
    }
  }
}
</script>

<style scoped>

table {
  border-collapse: collapse;
}

table tbody {
  padding: 20px;
}

table th {
  text-align: center;
  font-weight: bold;
  color: #707070;
  border-bottom: 3px solid rgba(0, 0, 0, .1);
}

table td {
  text-align: center;
  border-bottom: 3px solid rgba(0, 0, 0, .1);
}

table tr {
  height: 3em;
}

table tbody {
  background-color: #fff;
  cursor: pointer;
  margin: 10px;
}

table tbody:hover {
  background-color: #cecece;
}

h1 {
  font-size: 3em;
  text-shadow: 1px 1px 2px black;
}

.wrapper {
  background: url('https://p4.wallpaperbetter.com/wallpaper/470/622/407/burger-4k-background-image-hd-wallpaper-preview.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>