<template>
  <v-container fluid class="pa-0 ma-0 wrapper-configs">
    <v-col offset="1" class="pa-0 pt-10 d-flex flex-column">
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
        {{edit ? `Editar Bairro "${oldName}"` : 'Criar Bairro' }}
      </span>
    </v-col>
    <v-col class="pa-0 pt-15 d-flex justify-center">
      <v-card 
      width="70%"
      rounded
      class="elevation-3 pa-10"
      color="#fff"
      >
        <v-row no-gutters class="d-flex justify-center">
          <v-col cols="6" class="pa-0">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <v-text-field
                outlined
                label="Nome"
                autofocus
                color="var(--primary-color)"
                v-model="district.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <v-currency-field
                v-model="district.price"
                outlined
                color="var(--primary-color)"
                label="Preço"
                id="description"
                >
                </v-currency-field>
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
      @click="edit? updateDistrict() : createDistrict()"
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
      district: {
        name: "",
        price: 0
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
        { text: 'Bairros', to: '/delivery-config' },
      ]
    }
  },
  mounted() {
    if(this.$router.history.current.params.id) {
      this.id = this.$router.history.current.params.id
      this.edit = true
      this.getDistrict()
    }
  },
  methods: {
    createDistrict() {
      bardemu.post('/district', this.district, {
        headers: {
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/delivery-config')
        this.$store.dispatch('openAlert', {
          message: 'Bairro criado!',
          type: 'success'
        })
      }).catch((e =>  {
        if(e.response && e.response.data) {
          log.error('Erro ao criar bairro' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao criar categoria`,
            type: 'error'
          })
        }
      }))
    },
    updateDistrict() {
      bardemu.put('/district', this.district, {
        params: {
          _id: this.id
        },
        headers: {
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/delivery-config')
        this.$store.dispatch('openAlert', {
          message: 'Bairro atualizado!',
          type: 'success'
        })
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao atualizar bairro ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao atualizar bairro`,
            type: 'error'
          })
        }
      })
    },
    getDistrict() {
      bardemu.get('/district', {
        params: {
          _id: this.id
        },
        headers: {
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        this.oldName = res.data.name
        this.district = res.data
        console.log(res)
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao consultar bairros ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar bairros`,
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
  font-family: 'Kaushan Script', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 3em;
  text-shadow: 1px 1px 3px black!important;
}

.wrapper {
  background: url('https://images.alphacoders.com/276/276653.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>