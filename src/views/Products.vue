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
      <v-col cols="12" class="pa-0 mx-auto content pt-10 mb-15">
        <table style="width: 100%" class="elevation-1">
          <tr style="backgroundColor: #fff">
            <th>Categoria</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
          <tbody v-for="product in products" :key="product._id">
            <tr>
              <td>{{product.category}}</td>
              <td>{{product.name}}</td>
              <td>{{getDescription(product.description)}}</td>
              <td>{{product.price | currency}}</td>
              <td v-if="product.active">
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
                @click="editProduct(product._id)"
                >
                  <v-icon color="#FFF">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                color="red"
                small
                @click="deleteProduct(product._id, product.name)"
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
      products: [],
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Configurações', to: '/configs' },
      ]
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    getDescription(description) {
      if(description && description.length > 20) {
        return description.substring(0, 20).concat('...')
      } else {
        return description
      }
    },
    editProduct(id) {
      this.$router.push(`/product/${id}`)
    },
    addProduct() {
      this.$router.push({
        name: 'product-item'
      })
    },
    deleteProduct(id, name) {
        const dialogOpts = {
          type: "question",
          buttons: [
            'Sim', 'Não'
          ],
          title: 'Remover produto',
          detail: `Tem certeza que deseja remover o produto "${name}"?`
        }

        remote.dialog.showMessageBox(dialogOpts).then((res) => {
          if (res && res.response == 0) {
            bardemu.delete('/product', {
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
                message: 'Produto removido',
                type: 'success'
              })
              this.getCategories()
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
    getProductList() {
      bardemu.get('/products', {
        headers: {
          "without-images": true
        }
      }).then((res) => {
        this.products = res.data.sort((a, b) => a.name.localeCompare(b.name))
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