<template>
  <v-container fluid class="pa-0 ma-0 wrapper-adm">
    <v-col offset="1" cols="10" class="pa-0 d-flex justify-center flex-column mx-auto pt-10">
      <v-row no-gutters>
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
          <span class="page-title">Avaliações</span>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 pt-5">
        <v-row no-gutters>
          <v-col cols="12" class="pa-0 mt-5" v-for="feedback in feedbacks" :key="feedback._id">
            <v-card
            class="elevation-1 pa-3"
            >
              <v-card-title class="text-h5">
                <v-row no-gutters class="d-flex align-center">
                  <span>Avaliação:</span>
                  <v-rating
                    :value="feedback.rating"
                    icon-label="custom icon label text {0} of {1}"
                    :title="feedback.rating + ' estrelas'"
                    class="pr-2"
                    color="yellow"
                    dense
                    background-color="var(--primary-color)"
                  ></v-rating>
                </v-row>
              </v-card-title>

              <v-card-subtitle>Comentário: {{feedback.message}}</v-card-subtitle>
              <v-col class="pa-0 pl-3 d-flex justify-start">
                <v-btn
                outlined
                color="green"
                @click="goToOrder(feedback.orderId)"
                >Ver pedido</v-btn>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import { bardemu } from '../services'
import log from '../logConfig'

  export default {
    data: () => ({
      feedbacks:[],
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Administrativo', to: '/adm' },
      ]
    }),
    mounted() {
      this.getFeedbacks()
    },
    methods: {
      goToOrder(id) {
        this.$router.push(`/order/${id}`)
      },
      getFeedbacks() {
        bardemu.get('/feedbacks', {
          headers: {
            "x-access-token": this.$store.state.token,
            "role": "master"
          }
        })
        .then((res) => {
          console.log(res)
          this.feedbacks = res.data
        }).catch((e) => {
          if(e.response && e.response.data) {
            log.error('Erro ao consultar feedbacks ' + JSON.stringify(e.response.data))
            this.$store.dispatch('openAlert', {
              message: e.response.data ? e.response.data.message : `Erro ao consultar feedbacks`,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
h1 {
  font-size: 3em;
  text-shadow: 1px 1px 2px black;
}

.wrapper {
  background: url('https://images.alphacoders.com/276/276653.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}

.page-title {
  color: #fff;
  font-family: 'Kaushan Script', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 3em;
  text-shadow: 1px 1px 3px black!important;
}
</style>