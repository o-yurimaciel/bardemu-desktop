<template>
  <v-dialog 
  v-model="dialog"
  width="500px"
  ref="dialog"
  @click:outside="closeDialog"
  >
    <v-card
    height="300px"
    class="elevation-1 d-flex align-center"
    rounded
    >
      <v-col class="pa-0 d-flex flex-column justify-center pa-3">
        <v-col class="pa-0 d-flex justify-center">
          <span style="fontSize: 30px">{{orders.length > 1 ? `${orders.length} novos pedidos!` : "Novo pedido!"}}</span>
        </v-col>
        <v-col class="pa-0 d-flex justify-center pt-5">
          <v-btn 
          
          class="text-capitalize"
          color="var(--primary-color)"
          @click="goToOrder(orders[0]._id)" 
          v-if="orders.length < 2">
            <v-icon
            color="#fff"
            class="mr-2"
            >mdi-arrow-right-circle</v-icon>
            <span style="color: #fff">Pedido</span>
          </v-btn>
          <v-btn
          class="text-capitalize"
          color="var(--primary-color)"
          v-else 
          @click="goToOrders">
            <v-icon
            color="#fff"
            class="mr-2"
            >mdi-arrow-right-circle</v-icon>
            <span style="color: #fff">Pedidos</span>
          </v-btn>
        </v-col>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    orders: Array,
    closeDialog: Function
  },
  data() {
    return {
      dialog: true
    }
  },
  watch: {
    orders() {
      console.log('orders change')
    }
  },
  methods: {
    goToOrder(id) {
      this.$router.push('/order/'+id)
      this.$destroy()
    },
    goToOrders() {
      this.$router.push('/orders')
      this.$destroy()
    }
  },
  beforeDestroy() {
    this.closeDialog()
  }
}
</script>

<style>

</style>