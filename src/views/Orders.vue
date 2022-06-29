<template>
  <v-app>
    <v-col cols="10" offset="1" class="pa-0 pt-10">
      <v-col class="pa-0 d-flex flex-column" style="position: relative">
        <v-breadcrumbs
          class="pa-0"
          :items="breadCrumbs"
          divider="/"
        ></v-breadcrumbs>
        <v-icon 
        @click="getOrders" 
        title="Atualizar"
        size="50" 
        style="position: absolute; top: 0; right: 0"
        color="var(--primary-color)">
          mdi-refresh
        </v-icon>
        <h1>Pedidos</h1>
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
          <tbody v-for="(order) in orders" :key="order._id">
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
  </v-app>
</template>

<script>
const orderHistoryStatusOptions = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED'
})

import { bardemu } from '../services'
export default {
  data() {
    return {
      orders: [],
      breadCrumbs: [
        { text: 'Home', href: '/' }
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
      }
    },
  }
}
</script>

<style>

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
  cursor: pointer;
  margin: 10px;
}

table tbody:hover {
  background-color: #cecece;
}
</style>