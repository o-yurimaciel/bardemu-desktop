<template>
  <v-container fluid class="pa-0 ma-0 wrapper">
    <v-col offset="1" cols="10" class="pa-0 pt-10 d-flex flex-column">
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
        {{edit ? `Editar Produto "${oldName}"` : 'Criar Produto' }}
      </span>
    </v-col>
    <v-col class="pa-0 pt-15 pb-15 d-flex justify-center">
      <v-card 
      width="70%"
      class="elevation-3 pa-10"
      color="#fff">
        <v-row no-gutters class="d-flex justify-center">
          <v-col lg="7" cols="10" class="pa-0">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <label for="category">Categoria</label>
                <v-select
                outlined
                :items="categories"
                rounded
                :value="product.category"
                v-model="product.category"
                id="category"
                >
                </v-select>
              </v-col>
              <v-col class="pa-0">
                <label for="name">Nome</label>
                <v-text-field
                outlined
                rounded
                v-model="product.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <label for="name">Descrição</label>
                <v-text-field
                outlined
                rounded
                v-model="product.description"
                id="description"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <label for="name">Preço</label>
                <v-currency-field
                v-model="product.price"
                outlined
                rounded
                id="description"
                >
                </v-currency-field>
              </v-col>
              <v-col class="pa-0">
                <label for="name">Foto</label>
                <v-file-input
                  truncate-length="15"
                  @change="changeFile"
                ></v-file-input>
              </v-col>
              <v-col class="pa-0 d-flex justify-center pt-5">
                <v-btn
                color="green"
                :outlined="false"
                @click="edit? updateProduct() : createProduct()"
                >
                  <span style="color: #fff">{{edit ? 'Atualizar' : 'Criar'}}</span>
                </v-btn>
              </v-col>
            </v-form>
          </v-col>
          <v-col cols="10" lg="5" class="pa-0 d-flex flex-grow-0 justify-center pt-lg-0 pt-10">
              <v-card
                class="mx-auto"
                min-width="400"
                max-width="400"
                max-height="400"
                min-height="400"
              >
                <v-img
                  height="200"
                  max-width="400"
                  :src="product.image ? product.image : 'https://fermello.com.br/wp-content/themes/consultix/images/no-image-found-360x260.png'"
                ></v-img>
                <v-card-title>{{product.name}}</v-card-title>
                <v-card-text>
                  <div>
                    <span class="product-description" style="fontSize: 1em" v-if="product.description">
                      {{product.description}}
                    </span>
                  </div>
                </v-card-text>
                <v-card-text>
                  <div>
                    <span class="product-price">
                      {{product.price ? product.price : '0' | currency}}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { bardemu } from '../services'
export default {
  data() {
    return {
      id: "",
      edit: false,
      isFormValid: false,
      categories: [],
      product: {
        name: "",
        description: "",
        price: 0,
        image: null,
        category: null
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/' },
        { text: 'Produtos', to: '/products' },
      ]
    }
  },
  mounted() {
    this.getCategories()

    if(this.$router.history.current.params.id) {
      this.id = this.$router.history.current.params.id
      this.edit = true
      this.getProduct()
    }
  },
  methods: {
    getCategories() {
      bardemu.get('/categories').then((res) => {
        console.log(res)
        const data = res.data
        data.filter((category) => {
          this.categories.push(category.name)
        })
      }).catch((e) => {
        console.log(e.response)
        this.$store.dispatch('openAlert', {
          message: 'Erro ao consultar lista de Categorias',
          type: 'error'
        })
      })
    },
    createProduct() {
      console.log(this.product)
      bardemu.post('/product', this.product).then((res) => {
        console.log(res)
        this.$router.push('/produtos')
        this.$store.dispatch('openAlert', {
          message: 'Produto criado!',
          type: 'success'
        })
      }).catch((e =>  {
        this.$store.dispatch('openAlert', {
          message: 'Erro ao criar o produto',
          type: 'error'
        })
        console.log(e.response)
      }))
    },
    updateProduct() {
      bardemu.put('/product', this.product, {
        params: {
          _id: this.id
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/produtos')
        this.$store.dispatch('openAlert', {
          message: 'Produto atualizado!',
          type: 'success'
        })
      }).catch((e) => {
        this.$store.dispatch('openAlert', {
          message: 'Erro ao atualizar Produto',
          type: 'error'
        })
        console.log(e.response)
      })
    },
    getProduct() {
      bardemu.get('/product', {
        params: {
          _id: this.id
        }
      }).then((res) => {
        console.log(res)
        this.oldName = res.data.name
        this.product = res.data
        console.log(res)
      }).catch((e) => {
        this.$store.dispatch('openAlert', {
          message: 'Erro ao consultar Produto',
          type: 'error'
        })
        console.log(e.response)
      })
    },
    changeFile(e) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(e)
        reader.onload = function () {
          console.log(reader)
          resolve(reader.result.toString())
        }
        reader.onerror = function () {
          reject()
          console.log('error')
        }
      }).then(async (base64) => {
        this.product.image = await base64
        await this.$forceUpdate()
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: url('https://img.freepik.com/fotos-gratis/vista-lateral-de-batatas-fritas-com-tempero_141793-4899.jpg?w=2000')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}

.page-title {
  color: #fff;
  font-family: 'Kaushan Script', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 3.5em;
  text-shadow: 1px 1px 3px black!important;
}
</style>