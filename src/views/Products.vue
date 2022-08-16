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
          <span class="page-title">Produtos</span>
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
          <v-col cols="6" lg="4" class="pa-0 pa-5" v-for="product in products" :key="product._id">
            <v-card
              class="mx-auto"
              width="350"
              title="Editar Produto"
              height="100%"
              @click="editProduct(product)"
            >
              <v-img
                height="200"
                max-width="100%"
                style="object-fit: contain"
                :src="product.image ? product.image : 'https://fermello.com.br/wp-content/themes/consultix/images/no-image-found-360x260.png'"
              ></v-img>
              <v-card-title style="word-break: break-word">{{product.name}}</v-card-title>
              <v-card-text>
                <div>
                  <span class="product-description" style="fontSize: 1em" v-if="product.category">
                    Categoria: {{product.category}}
                  </span>
                  <span class="product-description" style="fontSize: 1em" v-else>
                    Sem categoria
                  </span>
                </div>
              </v-card-text>
              <v-card-text>
                <div>
                  <span class="product-description" style="fontSize: 1em;word-break: break-word" v-if="product.description">
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
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-app>
</template>

<script>
import { bardemu } from '../services'
import log from '../logConfig'

export default {
  data() {
    return {
      products: [],
      items: [
        { text: 'Home', to: '/home', icon: 'mdi-home' }
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
    getProductList() {
      bardemu.get('/products').then((res) => {
        this.products = res.data
        console.log(res)
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao consultar produtos ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar produtos`,
            type: 'error'
          })
        }
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

.page-title {
  color: #fff;
  font-family: 'Kaushan Script', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 3em;
  text-shadow: 1px 1px 3px black!important;
}
</style>