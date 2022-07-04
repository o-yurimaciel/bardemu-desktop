<template>
  <v-app class="wrapper">
    <v-col offset="1" cols="10" class="pa-0 pt-10">
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
          <h1 style="color: #fff">Produtos</h1>
        </v-col>
        <v-col class="pa-0 d-flex justify-end pt-lg-0">
          <v-btn 
          color="green"
          class="text-capitalize"
          >
            <span @click="addProduct" style="color: #fff">Adicionar Produto</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-col class="pa-0 pt-10">
        <v-row no-gutters>
          <v-col cols="4" lg="3" class="pa-0 pa-2" v-for="product in products" :key="product._id">
            <v-card
              class="mx-auto"
              min-width="200"
              title="Editar Produto"
              height="100%"
              @click="editProduct(product)"
            >
              <v-img
                height="200"
                style="object-fit: contain"
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
                  <span v-if="product.price" class="product-price" style="fontSize: 1.2em">
                    {{product.price | currency}}
                  </span>
                </div>
              </v-card-text>
              <v-btn
                color="red"
                style="position: absolute;top:5px;right:5px;z-index: 100"
                @click="deleteProduct(product)"
                title="Excluir produto"
              >
                <v-icon style="color: #fff">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-app>
</template>

<script>
import { bardemu } from '../services'

export default {
  data() {
    return {
      products: [],
      items: [
        { text: 'Home', to: '/' }
      ]
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    editProduct(product) {
      this.$router.push(`/product/${product._id}`)
    },
    addProduct() {
      this.$router.push({
        name: 'product-item'
      })
    },
    deleteProduct(product) {
      bardemu.delete('/product', {
        data: {
          _id: product._id
        }
      }).then((res) => {
        console.log(res)
        this.getProductList()
        this.$store.dispatch('openAlert', {
          message: 'Produto removido',
          type: 'success'
        })
      }).catch((e) => {
        console.log(e)
        this.$store.dispatch('openAlert', {
          message: 'Erro ao deletar Produto',
          type: 'error'
        })
      })
    },
    getProductList() {
      bardemu.get('/products').then((res) => {
        this.products = res.data
        console.log(res)
      }).catch((e) => {
        this.$store.dispatch('openAlert', {
          message: 'Erro ao consultar lista de Produtos',
          type: 'error'
        })
        console.log(e.response)
      })
    }
  }
}
</script>

<style>
h1 {
  font-size: 3em;
  text-shadow: 1px 1px 2px black;
}

.wrapper {
  background: url('https://img.freepik.com/fotos-gratis/vista-lateral-de-batatas-fritas-com-tempero_141793-4899.jpg?w=2000')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>