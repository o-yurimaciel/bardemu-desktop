<template>
  <v-container fluid class="pa-0 ma-0 wrapper">
    <v-col class="pa-0 d-flex flex-column flex-grow-0 pt-10 pb-10">
      <v-col offset="1" class="pa-0">
        <v-breadcrumbs
          class="pa-0"
          :items="breadCrumbs"
          divider="/"
        ></v-breadcrumbs>
      </v-col>
      <v-col class="pa-0 d-flex justify-center pt-10">
        <span class="orderStatus text-center">
          {{ formatStatus(order.orderStatus) }}
        </span>
      </v-col>
      <v-col cols="8" class="pa-0 d-flex justify-center pt-3 align-center mx-auto" v-if="order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED'">
        <v-icon color="var(--primary-color)">mdi-map-marker</v-icon>
        <span class="ml-2">
          Entregar em: {{ formatDeliveryAt(order) }}
        </span>
      </v-col>
      <v-col class="pa-0 d-flex justify-center">
        <a @click="openWeb">https://www.bardemu.com.br/pedido/{{order._id}}</a>
      </v-col>
      <v-col lg="6" cols="12" class="pa-0 mx-auto pt-10">
        <v-timeline
          reverse
        >
          <v-timeline-item
            color="var(--primary-color)"
            v-for="(item, i) in order.orderStatusHistory"
            :key="i"
            class="pa-5 ma-5"
            fill-dot
            :icon="getTimelineIcon(item.status)"
          >
            <span style="font-weight: 700">{{ formatDate(item.date) }}</span><br>
            {{ formatStatusHistory(item.status) }} <br>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col lg="6" cols="11" class="pa-0 mx-auto pt-10">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Detalhamento
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-col
              v-for="userDetail in userDetails" :key="userDetail.description"
              class="pa-0" 
              cols="12">
                <v-row no-gutters class="d-flex align-center" v-if="userDetail.value">
                  <v-col lg="8" cols="12" class="pa-0 d-flex flex-column">
                    <v-col class="pa-0">
                      <span class="product-title">
                        {{ userDetail.description }}
                      </span>
                    </v-col>
                  </v-col>
                  <v-col class="pa-0 d-flex justify-lg-end justify-start">
                    <span class="product-price">
                      {{ userDetail.value }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <hr class="mt-5 mb-5">
              <v-col
              v-for="product in order.products" :key="product._id"
              class="pa-0" 
              cols="12">
                <v-row no-gutters class="d-flex align-center">
                  <v-col lg="8" cols="12" class="pa-0 d-flex flex-column">
                    <v-col class="pa-0">
                      <span class="product-title">
                        {{product.quantity + 'x'}} {{product.name}}
                      </span>
                    </v-col>
                    <v-col class="pa-0" v-if="product.note">
                      <span class="product-description">
                        Observação: {{product.note}}
                      </span>
                    </v-col>
                  </v-col>
                  <v-col class="pa-0 d-flex justify-lg-end justify-start">
                    <span class="product-price">
                      {{product.price * product.quantity | currency}}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <hr class="mt-5 mb-5">
              <v-col
              v-for="detail in details" :key="detail.description"
              class="pa-0" 
              cols="12">
                <v-row no-gutters class="d-flex align-center" v-if="detail.value">
                  <v-col lg="8" cols="12" class="pa-0 d-flex flex-column">
                    <v-col class="pa-0">
                      <span class="product-title">
                        {{ detail.description }}
                      </span>
                    </v-col>
                  </v-col>
                  <v-col class="pa-0 d-flex justify-lg-end justify-start">
                    <span class="product-price">
                      {{ detail.value | currency }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED'">
            <v-expansion-panel-header>
              Atualizar status
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-col class="pa-0">
                <span class="product-title">Qual status deseja adicionar?</span>
              </v-col>
              <v-select
              v-model="orderStatus"
              :items="statusOptions"
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-selection">{{data.item.label}}</span>
                </template>
                <template slot="item" slot-scope="data">
                  <span class="select-item">{{data.item.label}}</span>
                </template>
              </v-select>
              <v-col class="pa-0 d-flex justify-center pt-5">
                <v-btn
                :outlined="false"
                width="100%"
                dense
                v-model="orderStatus"
                @click="updateOrderStatus"
                color="var(--primary-color)"
                >
                  <span style="color: #fff">
                    <v-icon color="#fff">mdi-refresh</v-icon>
                    Atualizar
                  </span>
                </v-btn>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
      breadCrumbs: [
        { text: 'Home', to: '/' },
        { text: 'Pedidos', to: '/orders' }
      ],
      order: {},
      details: [],
      userDetails: [],
      statusOptions: [
        { label: "Pedido confirmado", value: orderHistoryStatusOptions.CONFIRMED },
        { label: "Pedido saiu para entrega", value: orderHistoryStatusOptions.OUT_FOR_DELIVERY },
        { label: "Pedido entregue", value: orderHistoryStatusOptions.DELIVERED },
        { label: "Pedido cancelado", value: orderHistoryStatusOptions.CANCELLED }
      ],
      orderStatus: {}
    }
  },
  mounted() {
    this.orderStatus = this.statusOptions[0]
    this.getOrder(this.$router.history.current.params.id)
  },
  methods: {
    openWeb() {
      const { shell } = require('electron')
      shell.openExternal(`https://www.bardemu.com.br/pedido/${this.order._id}`)
    },
    getOrder(id) {
      bardemu.get('/order', {
        params: {
          _id: id
        }
      }).then((res) => {
        this.order = res.data
        this.userDetails = [
          { description: 'Nome', value: this.order.clientName },
          { description: 'Telefone', value: this.order.clientPhone },
          { description: 'Tipo de Pagamento', value: this.order.paymentType },
          { description: 'Bandeira', value: this.order.flag }
        ]
        this.details = [
          { description: 'Entrega', value: '0' },
          { description: 'Total a pagar', value: this.order.totalValue },
          { description: 'Troco', value: this.order.cashChange },
        ]
        this.updateStatusOptions()
        console.log(res)
      }).catch((e) => {
        console.log(e.response)
      })
    },
    getTimelineIcon(status) {
      switch(status) {
        case orderHistoryStatusOptions.PENDING:
          return "mdi-cart-arrow-up"
        case orderHistoryStatusOptions.CONFIRMED:
          return "mdi-cart-check"
        case orderHistoryStatusOptions.OUT_FOR_DELIVERY:
          return "mdi-bike-fast"
        case orderHistoryStatusOptions.DELIVERED:
          return "mdi-check-circle"
        case orderHistoryStatusOptions.CANCELLED:
          return "mdi-cancel"
      }
    },
    formatDate(date) {
      const { format } = require('date-fns')
      return new Date(date).toLocaleDateString().concat(" ").concat(format(new Date(date), "HH:mm:ss"))
    },
    formatStatus(status) {
      switch(status) {
        case orderHistoryStatusOptions.PENDING:
          return "Pedido aguardando confirmação"
        case orderHistoryStatusOptions.CONFIRMED:
          return "O pedido está sendo preparado e logo sairá para entrega"
        case orderHistoryStatusOptions.OUT_FOR_DELIVERY:
          return "O pedido saiu para entrega"
        case orderHistoryStatusOptions.DELIVERED:
          return "O pedido foi entregue"
        case orderHistoryStatusOptions.CANCELLED:
          return "O pedido foi cancelado"
      }
    },
    formatStatusHistory(status) {
      switch(status) {
        case orderHistoryStatusOptions.PENDING:
          return "Pedido realizado"
        case orderHistoryStatusOptions.CONFIRMED:
          return "Pedido confirmado"
        case orderHistoryStatusOptions.OUT_FOR_DELIVERY:
          return "Pedido saiu para entrega"
        case orderHistoryStatusOptions.DELIVERED:
          return "Pedido entregue"
        case orderHistoryStatusOptions.CANCELLED:
          return "Pedido cancelado"
      }
    },
    formatDeliveryAt(order) {
      let string = ""

      if(order.clientAddress) {
        string = string.concat(order.clientAddress)
      }

      if(order.clientAddressNumber) {
        string = string.concat(", " + order.clientAddressNumber)
      }

      if(order.clientAddressData) {
        string = string.concat(" Complemento: " + order.clientAddressData)
      }

      return string
    },
    updateOrderStatus() {
      bardemu.put('/order', {
        orderStatus: this.orderStatus
      }, {
        params: {
          _id: this.order._id
        }
      }).then((res) => {
        this.getOrder(this.order._id)
        console.log(res)
      }).catch((e) => {
        console.log(e)
      })
    },
    updateStatusOptions() {
      this.order.orderStatusHistory.map((history) => {
        this.statusOptions.map((status, index) => {
          if(status.value === history.status) {
            this.statusOptions.splice(index, 1)
            this.orderStatus = this.statusOptions[0].value
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.orderStatus {
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: bold;
}
</style>