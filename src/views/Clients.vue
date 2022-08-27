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
          <span class="page-title">Clientes</span>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 mx-auto content pt-10">
        <table style="width: 100%" class="elevation-1">
          <tr style="backgroundColor: #fff">
            <th>Nome</th>
            <th>Celular</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
          <tbody v-for="client in clients" :key="client._id">
            <tr>
              <td>{{client.fullName}}</td>
              <td>{{client.phone}}</td>
              <td>{{client.email}}</td>
              <th>
                <v-icon @click="openWhatsApp(client.phone)" title="Falar com o cliente" size="25" color="green">mdi-whatsapp</v-icon>
              </th>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import { bardemu } from '../services'
import log from '../logConfig'

  export default {
    data: () => ({
      clients:[],
      items: [
        { text: 'Home', to: '/home' },
        { text: 'Administrativo', to: '/adm' },
      ]
    }),
    mounted() {
      this.getClients()
    },
    methods: {
      openWhatsApp(phone) {
        const { shell } = require('electron')
        const formatPhone = phone.replace(/[^0-9]/g, '')
        shell.openExternal(`https://api.whatsapp.com/send?phone=${formatPhone}`)
      },
      getClients() {
        bardemu.get('/users', {
          headers: {
            "x-access-token": this.$store.state.token,
            "x-user-id": this.$store.state.userId,
          }
        })
        .then((res) => {
          this.clients = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName))
        }).catch((e) => {
          if(e.response && e.response.data) {
            log.error('Erro ao consultar categorias ' + JSON.stringify(e.response.data))
            this.$store.dispatch('openAlert', {
              message: e.response.data ? e.response.data.message : `Erro ao consultar categorias`,
              type: 'error'
            })
          }
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