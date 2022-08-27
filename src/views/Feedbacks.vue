<template>
  <v-container fluid class="pa-0 ma-0 wrapper-adm">
    <v-col offset="1" cols="10" class="pa-0 d-flex justify-center flex-column mx-auto pt-10 pb-10">
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
              <div style="position: absolute; right: 10px;top: 10px;">
                <v-icon 
                v-if="feedback.favorite" 
                title="Desfavoritar" 
                color="red" 
                @click="desfavFeedback(feedback._id)" 
                size="30">mdi-heart</v-icon>
                <v-icon 
                v-else 
                color="red" 
                title="Favoritar"
                @click="favFeedback(feedback._id)" 
                size="30">mdi-heart-outline</v-icon>
              </div>
              <v-card-title class="text-h5">
                <v-row no-gutters class="d-flex align-center">
                  <span>{{feedback.name}}</span>
                </v-row>
              </v-card-title>
              <v-card-subtitle>
                <v-row no-gutters class="d-flex align-center">
                  <span class="mr-1" style="font-weight: bold">{{feedback.rating}}</span>
                  <v-rating
                    :value="feedback.rating"
                    icon-label="custom icon label text {0} of {1}"
                    :title="feedback.rating + ' estrelas'"
                    class="pr-2"
                    color="yellow"
                    dense
                    background-color="var(--primary-color)"
                  ></v-rating>
                  <span style="font-weight: bold">{{formatDate(feedback.createdAt)}}</span>
                </v-row>
                Comentário: {{feedback.message}}
              </v-card-subtitle>
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
      formatDate(date) {
        const { format } = require('date-fns')
        return new Date(date).toLocaleDateString().concat(" ").concat(format(new Date(date), "HH:mm:ss"))
      },
      goToOrder(id) {
        this.$router.push(`/order/${id}`)
      },
      getFeedbacks() {
        bardemu.get('/feedbacks', {
          headers: {
            "x-access-token": this.$store.state.token,
            "x-user-id": this.$store.state.userId,
          }
        })
        .then((res) => {
          this.feedbacks = res.data.reverse()
        }).catch((e) => {
          if(e.response && e.response.data) {
            log.error('Erro ao consultar feedbacks ' + JSON.stringify(e.response.data))
            this.$store.dispatch('openAlert', {
              message: e.response.data ? e.response.data.message : `Erro ao consultar feedbacks`,
              type: 'error'
            })
          }
        })
      },
      favFeedback(id) {
        bardemu.put('/feedback/favorite', {
          _id: id,
          favorite: true
        }, {
          headers: {
            "x-user-id": this.$store.state.userId,
            "x-access-token": this.$store.state.token
          }
        }).then(() => {
          this.getFeedbacks()
        }).catch((e) => {
          if(e.response && e.response.data) {
            log.error('Erro ao atualizar feedback ' + JSON.stringify(e.response.data))
            this.$store.dispatch('openAlert', {
              message: e.response.data ? e.response.data.message : `Erro ao atualizar feedback`,
              type: 'error'
            })
          }
        })
      },
      desfavFeedback(id) {
        bardemu.put('/feedback/favorite', {
          _id: id,
          favorite: false
        }, {
          headers: {
            "x-user-id": this.$store.state.userId,
            "x-access-token": this.$store.state.token
          }
        }).then(() => {
          this.getFeedbacks()
        }).catch((e) => {
          if(e.response && e.response.data) {
            log.error('Erro ao atualizar feedback ' + JSON.stringify(e.response.data))
            this.$store.dispatch('openAlert', {
              message: e.response.data ? e.response.data.message : `Erro ao atualizar feedback`,
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
  font-family: 'Poppins', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 2.2em;
  text-shadow: 1px 1px 3px black!important;
}
</style>