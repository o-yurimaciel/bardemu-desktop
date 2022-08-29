<template>
  <v-container fluid class="pa-0 ma-0 wrapper-configs">
    <v-col offset="1" class="pa-0 pt-10 pb-10 d-flex flex-column">
      <v-breadcrumbs
        class="pa-0"
        :items="items"
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
      <span class="page-title">
        {{edit ? `Editar Cupom "${oldName}"` : 'Criar Cupom' }}
      </span>
    </v-col>
    <v-col class="pa-0 pt-15 d-flex justify-center">
      <v-card 
      width="70%"
      rounded
      class="elevation-3 pa-10"
      color="#fff"
      >
        <v-switch
          v-model="coupon.active"
          style="position: absolute;top:0px;left:28%;z-index: 100"
          :label="coupon.active ? 'Ativo' : 'Inativo'"
        ></v-switch>
        <v-row no-gutters class="d-flex justify-center pt-6">
          <v-col cols="6" class="pa-0">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <v-text-field
                outlined
                label="Código"
                color="var(--primary-color)"
                v-model="coupon.name"
                :error="!coupon.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <v-select
                outlined
                :items="fieldOptions"
                color="var(--primary-color)"
                :value="coupon.field"
                :error="!coupon.field"
                v-model="coupon.field"
                label="Desconto (Tipo)"
                id="field"
                >
                  <template slot="selection" slot-scope="data">
                    <span class="select-selection">{{data.item.name}}</span>
                  </template>
                  <template slot="item" slot-scope="data">
                    <span class="select-item">{{data.item.name}}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                label="Desconto (%)"
                outlined
                suffix="%"
                type="number"
                min="1"
                max="100"
                :rules="[rules.percent]"
                color="var(--primary-color)"
                v-model="coupon.percent"
                :error="!coupon.percent"
                v-mask="'###'"
                id="order"
                >
                </v-text-field>
              </v-col>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col class="pa-0 d-flex justify-center pt-5">
      <v-btn
      color="green"
      :outlined="false"
      :disabled="!isFormValid"
      @click="edit ? updateCoupon() : createCoupon()"
      >
        <span style="color: #fff">{{edit ? 'Atualizar' : 'Criar'}}</span>
      </v-btn>
    </v-col>
  </v-container>
</template>

<script>
import { bardemu } from '../services'
import log from '../logConfig'
export default {
  data() {
    return {
      id: "",
      edit: false,
      isFormValid: false,
      coupon: {
        name: "",
        percent: null,
        field: null,
        active: false
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
        { text: 'Cupons', to: '/coupons' }
      ],
      fieldOptions: [
        { name: "Pedido", value: "orderValue" },
        { name: "Entrega", value: "deliveryPrice" },
        { name: "Total a pagar", value: "totalValue" },
      ],
      rules: {
        percent: value => {
          if(value > 0 && value <= 100) {
            return true
          } else {
            return "Valor de porcentagem inválido (1 a 100)"
          }
        }
      }
    }
  },
  mounted() {
    if(this.$router.history.current.params.id) {
      this.id = this.$router.history.current.params.id
      this.edit = true
      this.getCoupon()
    }
  },
  methods: {
    createCoupon() {
      bardemu.post('/coupon', this.coupon, {
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/coupons')
        this.$store.dispatch('openAlert', {
          message: 'Cupom criado!',
          type: 'success'
        })
      }).catch((e =>  {
        if(e.response && e.response.data) {
          log.error('Erro ao criar cupom' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao criar cupom`,
            type: 'error'
          })
        }
      }))
    },
    updateCoupon() {
      bardemu.put('/coupon', this.coupon, {
        params: {
          _id: this.id
        },
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/coupons')
        this.$store.dispatch('openAlert', {
          message: 'Cupom atualizado!',
          type: 'success'
        })
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao atualizar cupom ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao atualizar cupom`,
            type: 'error'
          })
        }
      })
    },
    getCoupon() {
      bardemu.get('/coupon', {
        params: {
          _id: this.id
        },
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        this.oldName = res.data.name
        this.coupon = res.data
        console.log(res)
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao consultar cupom ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar cupom`,
            type: 'error'
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.page-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 2.2em;
  text-shadow: 1px 1px 3px black!important;
}

.wrapper {
  background: url('https://images.alphacoders.com/276/276653.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>