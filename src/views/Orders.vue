<template>
  <v-container fluid class="wrapper-orders pa-0 ma-0">
    <v-col cols="10" offset="1" class="pa-0 pt-10 pb-15">
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
        <v-row no-gutters class="d-flex align-center">
          <span class="page-title mr-5">Pedidos</span>
          <v-icon 
          title="Atualizar" 
          :class="handlingh ? 'rotatingAnimation' : ''" 
          @click="getOrders" 
          color="#fff" 
          size="50">mdi-refresh-circle</v-icon>
        </v-row>
      </v-col>
      <v-col cols="12" class="pa-0 pt-10 content" v-if="orders && orders.length > 0">
        <v-data-table
          :headers="headers"
          :items="orders"
          item-key="name"
          class="elevation-1"
          :items-per-page.sync="itemsPerPage"
          locale="pt-BR"
          :footer-props="{ 
            itemsPerPageOptions:[ 5, 10, 20, 30, -1 ],
            itemsPerPageText: 'Pedidos por página'
          }"
        >
        <template v-slot:item="{ item }">
          <tr @click="openOrder(item)" style="cursor: pointer">
            <td>{{new Date(item.createdAt).toLocaleDateString()}}</td>
            <td>{{formatHour(item.createdAt)}}</td>
            <td>{{item.clientName}}</td>
            <td>{{item.clientPhone}}</td>
            <td>{{item.paymentType}}</td>
            <td>{{item.totalValue | currency}}</td>
            <td>{{formatStatus(item.orderStatus)}}</td>
          </tr>
        </template>
        </v-data-table>
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
import log from '../logConfig'

export default {
  data() {
    return {
      orders: [],
      handlingh: false,
      itemsPerPage: 5,
      breadCrumbs: [
        { text: 'Home', to: '/home' }
      ],
      headers: [
        {
          text: 'Data',
          align: 'center',
          value: 'createdAt',
          sortable: false,
          filterable: false
        },
        {
          text: 'Hora',
          align: 'center',
          value: 'createdAt',
          sortable: false,
          filterable: false
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'clientName',
          sortable: false,
          filterable: false
        },
        { 
          text: 'Telefone', 
          value: 'clientPhone', 
          align: 'center',
          sortable: false,
          filterable: false 
        },
        { 
          text: 'Pagamento', 
          value: 'paymentType', 
          align: 'center',
          sortable: false,
          filterable: false
        },
        { 
          text: 'Valor', 
          value: 'totalValue', 
          align: 'center',
          sortable: false,
          filterable: false
        },
        { 
          text: 'Status', 
          value: 'orderStatus', 
          align: 'center',
          sortable: false,
          filterable: false
        },
      ],
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
      this.orders = []
      this.handlingh = true
      bardemu.get('/orders', {
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.orders = res.data.sort((a, b) => {
          return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
        })
        this.handlingh = false
      }).catch((e) => {
        console.log(e.response)
        this.handlingh = false
        if(e.response && e.response.data) {
          log.error('Erro ao consultar pedidos ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar pedidos`,
            type: 'error'
          })
        }
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
    formatStatusFilter(status) {
      switch(status) {
        case orderHistoryStatusOptions.PENDING:
          return "Pedidos aguardando confirmação"
        case orderHistoryStatusOptions.CONFIRMED:
          return "Pedidos em preparação"
        case orderHistoryStatusOptions.OUT_FOR_DELIVERY:
          return "Pedidos em entrega"
        case orderHistoryStatusOptions.DELIVERED:
          return "Pedidos entregues"
        case orderHistoryStatusOptions.CANCELLED:
          return "Pedidos cancelados"
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

.page-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 2.2em;
  text-shadow: 1px 1px 3px black!important;
}
</style>