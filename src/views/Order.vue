<template>
  <v-container fluid class="pa-0 ma-0 wrapper">
    <v-col class="pa-0 d-flex flex-column flex-grow-0 pt-10">
      <v-col offset="1" class="pa-0">
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
      </v-col>
      <v-col class="pa-0 d-flex justify-center pt-15 pb-15" style="position: relative">
        <v-card
        width="70%"
        color="#fff"
        class="elevation-3 pa-10"
        >
          <div style="width: 100px; position: absolute; right: 10px; top: 10px">
            <v-row no-gutters class="d-flex justify-space-between">
              <v-icon 
              size="30" 
              @click="getOrder(order._id)" 
              color="var(--primary-color)" 
              title="Atualizar"
              :class="handlingh ? 'rotatingAnimation' : ''" 
              >mdi-refresh-circle</v-icon>
              <v-icon size="30" @click="openWhatsApp" color="green" title="Falar com o cliente">mdi-whatsapp</v-icon>
              <v-icon size="30" @click="printOrder" color="black" title="Imprimir detalhamento">mdi-printer</v-icon>
            </v-row>
          </div>
          <v-col class="pa-0 d-flex justify-center">
            <span class="orderStatus text-center">
              {{ formatStatus(order.orderStatus) }}
            </span>
          </v-col>
          <v-col cols="10" class="pa-0 d-flex justify-center pt-3 align-center mx-auto" v-if="order.estimatedTime">
            <v-icon color="var(--primary-color)">mdi-clock-fast</v-icon>
            <span class="ml-2">
              Tempo estimado para entrega: {{order.estimatedTime}}min
            </span>
          </v-col>
          <v-col cols="10" class="pa-0 d-flex justify-center pt-3 align-center mx-auto" v-if="order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED'">
            <v-icon color="var(--primary-color)">mdi-map-marker</v-icon>
            <span class="ml-2">
              Entregar em: {{ formatDeliveryAt(order) }}
            </span>
          </v-col>
          <v-col class="pa-0 d-flex justify-center">
            <a @click="openWeb">https://www.bardemu.com.br/pedido/{{order._id}}</a>
          </v-col>
          <v-col lg="6" cols="10" class="pa-0 mx-auto pt-10">
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
          <v-col cols="11" class="pa-0 mx-auto pt-10">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Detalhamento
                </v-expansion-panel-header>
                <v-expansion-panel-content id="detail">
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
                  <v-form v-model="statusFormValid" @submit.prevent>
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
                    <v-col class="pa-0 pt-5 pb-5" v-if="orderStatus === 'CONFIRMED'">
                      <span class="product-title">Tempo estimado para entrega em minutos?</span>
                      <v-text-field
                      v-model="estimatedTime"
                      :error="!estimatedTime"
                      :autofocus="true"
                      >
                      </v-text-field>
                    </v-col>
                  </v-form>
                  <v-col class="pa-0 d-flex justify-center pt-5">
                    <v-btn
                    :outlined="false"
                    width="100%"
                    dense
                    :disabled="!statusFormValid"
                    @click="statusFormValid ? updateOrderStatus() : null"
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
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Feedback
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-col class="pa-0">
                    <v-col class="pa-0" v-if="!order.feedback">
                      <span>Não há nenhum feedback.</span>
                    </v-col>
                    <v-col class="pa-0 d-flex flex-column">
                      <span style="font-weight: bold">O que {{order.clientName}} achou do pedido?</span>
                      <v-col cols="6" class="pa-0 pt-5">
                        <v-row no-gutters class="d-flex align-center justify-space-between">
                          <span style="font-weight: bold">{{order.feedback.rating}}</span>
                          <v-rating
                            v-model="order.feedback.rating"
                            icon-label="custom icon label text {0} of {1}"
                            :title="order.feedback.rating + ' estrelas'"
                            color="yellow"
                            dense
                            background-color="var(--primary-color)"
                          ></v-rating>
                          <span>{{formatDate(order.feedback.createdAt)}}</span>
                        </v-row>
                      </v-col>
                      <span class="pt-3">Comentário: {{order.feedback.message}}</span>
                    </v-col>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-card>
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
      orderStatus: {},
      estimatedTime: 60,
      statusFormValid: false,
      handlingh: false
    }
  },
  mounted() {
    this.orderStatus = this.statusOptions[0].value
    this.getOrder(this.$router.history.current.params.id)
  },
  methods: {
    openWeb() {
      const { shell } = require('electron')
      shell.openExternal(`https://www.bardemu.com.br/pedido/${this.order._id}`)
    },
    getOrder(id) {
      this.handlingh = true
      bardemu.get('/order', {
        params: {
          _id: id
        }
      }).then((res) => {
        this.handlingh = false
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
        this.handlingh = false
        log.error('Erro ao consultar ordem ' + JSON.stringify(e.response.data))
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
        string = string.concat(" Comp: " + order.clientAddressData)
      }

      return string
    },
    updateOrderStatus() {
      bardemu.put('/order', {
        orderStatus: this.orderStatus,
        estimatedTime: this.estimatedTime
      }, {
        params: {
          _id: this.order._id
        }
      }).then((res) => {
        if(res.data.message) {
          this.openWhatsApp(res.data.message)
        }
        this.getOrder(this.order._id)
        console.log(res)
      }).catch((e) => {
        log.error('Erro ao atualizar ordem ' + JSON.stringify(e.response.data))
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
    },
    openWhatsApp(message) {
      const { shell } = require('electron')
      const phone = this.order.clientPhone.replace(/[^0-9]/g, '')
      if(message) {
        shell.openExternal(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`)
      } else {
        shell.openExternal(`https://api.whatsapp.com/send?phone=${phone}`)
      }
    },
    printOrder() {
      const { ipcRenderer } = require('electron')
      const receipt = require('../utils/receipt').default
      receipt(this.order).then((res) => {
        console.log(res)
        ipcRenderer.send('print-pdf')
      }).catch((e) => {
        log.error('Erro ao gerar comprovante ' + JSON.stringify(e))
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: url('https://p4.wallpaperbetter.com/wallpaper/470/622/407/burger-4k-background-image-hd-wallpaper-preview.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}

.orderStatus {
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: bold;
}
</style>