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
        {{edit ? `Editar Categoria "${oldName}"` : 'Criar Categoria' }}
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
          v-model="category.active"
          style="position: absolute;top:0px;left:28%;z-index: 100"
          :label="category.active ? 'Ativo' : 'Inativo'"
        ></v-switch>
        <v-row no-gutters class="d-flex justify-center pt-6">
          <v-col cols="6" class="pa-0">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <v-text-field
                outlined
                label="Nome"
                autofocus
                color="var(--primary-color)"
                v-model="category.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                label="Ordem"
                outlined
                color="var(--primary-color)"
                v-model="category.order"
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
      @click="edit? updateCategory() : createCategory()"
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
      category: {
        name: "",
        order: 1,
        active: false
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
        { text: 'Categorias', to: '/categories' }
      ]
    }
  },
  mounted() {
    if(this.$router.history.current.params.id) {
      this.id = this.$router.history.current.params.id
      this.edit = true
      this.getCategory()
    }
  },
  methods: {
    createCategory() {
      bardemu.post('/category', this.category, {
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/categories')
        this.$store.dispatch('openAlert', {
          message: 'Categoria criada!',
          type: 'success'
        })
      }).catch((e =>  {
        if(e.response && e.response.data) {
          log.error('Erro ao criar categoria' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao criar categoria`,
            type: 'error'
          })
        }
      }))
    },
    updateCategory() {
      bardemu.put('/category', this.category, {
        params: {
          _id: this.id
        },
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/categories')
        this.$store.dispatch('openAlert', {
          message: 'Categoria atualizada!',
          type: 'success'
        })
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao atualizar categoria ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao atualizar categoria`,
            type: 'error'
          })
        }
      })
    },
    getCategory() {
      bardemu.get('/category', {
        params: {
          _id: this.id
        }
      }).then((res) => {
        this.oldName = res.data.name
        this.category = res.data
        console.log(res)
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao consultar categorias ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar categorias`,
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