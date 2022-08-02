<template>
  <v-container fluid class="pa-0 ma-0 wrapper">
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
        <v-row no-gutters class="d-flex justify-center">
          <v-col cols="6" class="pa-0">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <label for="name">Nome</label>
                <v-text-field
                outlined
                rounded
                autofocus
                v-model="category.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <label for="order">Ordem</label>
                <v-text-field
                outlined
                rounded
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
        order: 1
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/' },
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
      console.log(this.category)
      bardemu.post('/category', this.category).then((res) => {
        console.log(res)
        this.$router.push('/categories')
        this.$store.dispatch('openAlert', {
          message: 'Categoria criada!',
          type: 'success'
        })
      }).catch((e =>  {
        log.error('Erro ao criar categoria' + JSON.stringify(e.response.data))
        this.$store.dispatch('openAlert', {
          message: 'Erro ao criar Categoria ',
          type: 'error'
        })
        console.log(e.response)
      }))
    },
    updateCategory() {
      bardemu.put('/category', this.category, {
        params: {
          _id: this.id
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/categories')
        this.$store.dispatch('openAlert', {
          message: 'Categoria atualizada!',
          type: 'success'
        })
      }).catch((e) => {
        log.error('Erro ao atualizar categoria ' + JSON.stringify(e.response.data))
        this.$store.dispatch('openAlert', {
          message: 'Erro ao atualizar Categoria',
          type: 'error'
        })
        console.log(e.response)
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
        log.error('Erro ao consultar categorias ' + JSON.stringify(e.response.data))
        this.$store.dispatch('openAlert', {
          message: 'Erro ao consultar Categoria',
          type: 'error'
        })
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
  font-size: 3.5em;
  text-shadow: 1px 1px 3px black!important;
}

.wrapper {
  background: url('https://images.alphacoders.com/276/276653.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>