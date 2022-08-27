<template>
  <v-app class="wrapper-configs">
    <v-col offset="1" cols="10" class="pa-0 pt-10 pb-10">
      <v-row no-gutters class="d-flex justify-space-between">
        <v-col cols="12" class="pa-0 d-flex flex-column">
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
          <span class="page-title">Cupons</span>
        </v-col>
        <v-col class="pa-0 d-flex justify-end pt-lg-0">
          <v-btn 
          color="green"
          class="text-capitalize"
          >
            <span @click="addProduct" style="color: #fff">Adicionar Cupom</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 mx-auto content pt-10 mb-15">
        <table style="width: 100%" class="elevation-1">
          <tr style="backgroundColor: #fff">
            <th>Código</th>
            <th>Desconto</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
          <tbody v-for="coupon in coupons" :key="coupon._id">
            <tr>
              <td>{{coupon.name}}</td>
              <td>{{getCouponFieldText(coupon.field)}} ({{coupon.percent}}%)</td>
              <td v-if="coupon.active">
                <v-icon color="green">mdi-check-circle</v-icon>
              </td>
              <td v-else>
                <v-icon color="red">mdi-close-circle</v-icon>
              </td>
              <td>
                <v-btn 
                class="mr-2"
                color="green"
                small
                @click="editCoupon(coupon._id)"
                >
                  <v-icon color="#FFF">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                color="red"
                small
                @click="deleteCoupon(coupon._id, coupon.name)"
                >
                  <v-icon color="#fff">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-col>
  </v-app>
</template>

<script>
import { bardemu } from '../services'
import log from '../logConfig'
import { remote } from 'electron'

export default {
  data() {
    return {
      coupons: [],
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
      ]
    }
  },
  mounted() {
    this.getCouponList()
  },
  methods: {
    getCouponFieldText(field) {
      switch(field) {
        case "totalValue":
          return "Total a pagar"
        case "orderValue":
          return "Pedido"
        case "deliveryPrice":
          return "Entrega"
        default:
          return ""
      }
    },
    editCoupon(id) {
      this.$router.push(`/coupon/${id}`)
    },
    addProduct() {
      this.$router.push({
        name: 'coupon-item'
      })
    },
    deleteCoupon(id, name) {
        const dialogOpts = {
          type: "question",
          buttons: [
            'Sim', 'Não'
          ],
          title: 'Remover cupom',
          detail: `Tem certeza que deseja remover o cupom "${name}"?`
        }

        remote.dialog.showMessageBox(dialogOpts).then((res) => {
          if (res && res.response == 0) {
            bardemu.delete('/coupon', {
              data: {
                _id: id
              },
              headers: {
                "x-user-id": this.$store.state.userId,
                "x-access-token": this.$store.state.token
              }
            }).then((res) => {
              console.log(res)
              this.$store.dispatch('openAlert', {
                message: 'Cupom removido',
                type: 'success'
              })
              this.getCouponList()
            }).catch((e) => {
              if(e.response && e.response.data) {
                log.error('Erro ao remover cupom ' + JSON.stringify(e.response.data))
                this.$store.dispatch('openAlert', {
                  message: e.response.data ? e.response.data.message : `Erro ao remover cupom`,
                  type: 'error'
                })
              }
            })
          }
        })
      },
    getCouponList() {
      bardemu.get('/coupons', {
        headers: {
          "x-access-token": this.$store.state.token,
          "x-user-id": this.$store.state.userId
        }
      }).then((res) => {
        this.coupons = res.data.sort((a, b) => a.name.localeCompare(b.name))
        console.log(res)
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao consultar cupons ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar cupons`,
            type: 'error'
          })
        }
        console.log(e.response)
      })
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
  background: url('https://img.freepik.com/fotos-gratis/vista-lateral-de-batatas-fritas-com-tempero_141793-4899.jpg?w=2000')!important;
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