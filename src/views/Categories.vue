<template>
  <v-container fluid class="pa-0 ma-0 wrapper">
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
          <h1 style="color: #fff">Categorias</h1>
        </v-col>
        <v-col class="pa-0 d-flex justify-end pt-lg-0">
          <v-btn 
          color="green"
          class="text-capitalize"
          >
            <span @click="addCategory" style="color: #fff">Adicionar Categoria</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 mx-auto content pt-10">
        <table style="width: 100%" class="elevation-1">
          <tr style="backgroundColor: #fff">
            <th>Nome</th>
            <th>Ordem</th>
            <th>Ações</th>
          </tr>
          <tbody v-for="category in categories" :key="category._id">
            <tr>
              <td>{{category.name}}</td>
              <td>{{category.order}}</td>
              <td>
                <v-btn 
                class="mr-2"
                color="green"
                small
                @click="editCategory(category._id)"
                >
                  <v-icon color="#FFF">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                color="red"
                small
                @click="deleteCategory(category._id)"
                >
                  <v-icon color="#fff">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import { bardemu } from '../services'
  export default {
    data: () => ({
      categories:[],
      items: [
        { text: 'Home', to: '/' }
      ]
    }),
    mounted() {
      this.getCategories()
    },
    methods: {
      getCategories() {
        bardemu.get('/categories')
        .then((res) => {
          this.categories = res.data.sort((a,b) => a.order - b.order)
          console.log(res)
        }).catch((e) => {
          console.log(e.response)
        })
      },
      addCategory() {
        this.$router.push({
          name: 'category-item'
        })
      },
      deleteCategory(id) {
        bardemu.delete('/category', {
          data: {
            _id: id
          }
        }).then((res) => {
          console.log(res)
          this.getCategories()
        }).catch((e) => {
          console.log(e.response)
        })
      },
      editCategory(id) {
        this.$router.push(`/category/${id}`)
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
  background: url('https://images.alphacoders.com/276/276653.jpg')!important;
  background-size: cover!important;
  background-repeat: no-repeat;
}
</style>