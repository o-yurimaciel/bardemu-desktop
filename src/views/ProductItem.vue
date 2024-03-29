<template>
  <v-container fluid class="pa-0 ma-0 wrapper-configs">
    <v-col offset="1" cols="10" class="pa-0 pt-10 pb-10 d-flex flex-column">
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
    <v-col class="pa-0 pt-5 pb-15 d-flex justify-center">
      <v-card 
      width="70%"
      class="elevation-3 pa-10"
      color="#fff">
        <v-btn
          color="red"
          small
          v-if="product._id"
          style="position: absolute;top:5px;right:5px;z-index: 100"
          @click="deleteProduct(product, product.name)"
          title="Excluir produto"
        >
          <v-icon style="color: #fff">
            mdi-delete
          </v-icon>
        </v-btn>
        <v-switch
          v-model="product.active"
          style="position: absolute;top:0px;left:40px;z-index: 100"
          :label="product.active ? 'Ativo' : 'Inativo'"
        ></v-switch>
        <v-row no-gutters class="d-flex justify-space-between pt-5">
          <v-col cols="6" class="pa-0 pr-10">
            <v-form v-model="isFormValid" @submit.prevent>
              <v-col class="pa-0">
                <v-select
                outlined
                label="Categoria"
                :items="categories"
                color="var(--primary-color)"
                :value="product.category"
                v-model="product.category"
                :error="!product.category"
                id="category"
                >
                </v-select>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                outlined
                color="var(--primary-color)"
                label="Nome"
                v-model="product.name"
                :error="!product.name"
                id="name"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                outlined
                color="var(--primary-color)"
                label="Descrição"
                v-model="product.description"
                id="description"
                >
                </v-text-field>
              </v-col>
              <v-col class="pa-0">
                <v-currency-field
                v-model="product.price"
                :error="!product.price"
                outlined
                color="var(--primary-color)"
                label="Preço"
                id="description"
                >
                </v-currency-field>
              </v-col>
              <v-col class="pa-0">
                <v-file-input
                  truncate-length="15"
                  label="Foto"
                  :error="!product.image"
                  color="var(--primary-color)"
                  @change="changeFile"
                ></v-file-input>
              </v-col>
              <v-col class="pa-0 d-flex justify-center pt-5">
                <v-btn
                color="green"
                :outlined="false"
                :disabled="!isFormValid"
                @click="edit? updateProduct() : createProduct()"
                >
                  <span style="color: #fff">{{edit ? 'Atualizar' : 'Criar'}}</span>
                </v-btn>
              </v-col>
            </v-form>
          </v-col>
          <v-col cols="6" class="pa-0 d-flex flex-grow-0 justify-center pt-lg-0">
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
import { remote } from 'electron'
import log from '../logConfig'

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
        category: null,
        active: false
      },
      oldName: "",
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
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
        const data = res.data
        data.filter((category) => {
          this.categories.push(category.name)
        })
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
    createProduct() {
      bardemu.post('/product', this.product, {
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/products')
        this.$store.dispatch('openAlert', {
          message: 'Produto criado!',
          type: 'success'
        })
      }).catch((e =>  {
        if(e.response && e.response.data) {
          log.error('Erro ao criar produto ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao criar produto`,
            type: 'error'
          })
        }
        console.log(e.response)
      }))
    },
    updateProduct() {
      console.log(this.product)
      bardemu.put('/product', this.product, {
        params: {
          _id: this.id
        },
        headers: {
          "x-user-id": this.$store.state.userId,
          "x-access-token": this.$store.state.token
        }
      }).then((res) => {
        console.log(res)
        this.$router.push('/products')
        this.$store.dispatch('openAlert', {
          message: 'Produto atualizado!',
          type: 'success'
        })
      }).catch((e) => {
        if(e.response && e.response.data) {
          log.error('Erro ao atualizar produto ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao atualizar produto`,
            type: 'error'
          })
        }
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
        if(e.response && e.response.data) {
          log.error('Erro ao consultar produto ' + JSON.stringify(e.response.data))
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro ao consultar produto`,
            type: 'error'
          })
        }
      })
    },
    deleteProduct() {
      const dialogOpts = {
          type: "question",
          buttons: [
            'Sim', 'Não'
          ],
          title: 'Remover produto',
          detail: `Tem certeza que deseja remover o produto "${this.product.name}"?`
        }

        remote.dialog.showMessageBox(dialogOpts).then((res) => {
          if (res && res.response == 0) {
            bardemu.delete('/product', {
              data: {
                _id: this.product._id
              },
              headers: {
                "x-user-id": this.$store.state.userId,
                "x-access-token": this.$store.state.token
              }
            }).then((res) => {
              console.log(res)
              this.$router.push('/products')
              this.$store.dispatch('openAlert', {
                message: 'Produto removido',
                type: 'success'
              })
            }).catch((e) => {
              if(e.response && e.response.data) {
                log.error('Erro ao remover produto ' + JSON.stringify(e.response.data))
                this.$store.dispatch('openAlert', {
                  message: e.response.data ? e.response.data.message : `Erro ao remover produto`,
                  type: 'error'
                })
              }
            })
          }
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
  font-family: 'Poppins', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 2.2em;
  text-shadow: 1px 1px 3px black!important;
}
</style>