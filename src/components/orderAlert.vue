<template>
  <v-dialog 
  v-model="dialog"
  width="500px"
  ref="dialog"
  @click:outside="closeDialog"
  >
    <v-card
    height="300px"
    class="elevation-1"
    rounded
    >
      <v-col class="pa-0 d-flex flex-column pa-3">
        <v-col class="pa-0 d-flex justify-center">
          <span style="fontSize: 30px">{{orders.length > 1 ? `${orders.length} novos pedidos!` : "Novo pedido!"}}</span>
        </v-col>
        <v-col class="pa-0 d-flex justify-center pt-15">
          <v-btn @click="goToOrder(orders[0]._id)" v-if="orders.length < 2">
            Ir para pedido
          </v-btn>
          <v-btn v-else @click="goToOrders">
            Ir para pedidos
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