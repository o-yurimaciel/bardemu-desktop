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
          <span class="page-title">Configurações</span>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 pt-5">
        <v-row no-gutters>
          <v-col cols="12" class="pa-0 mt-5" v-for="element in elements" :key="element.title">
            <v-card
            class="elevation-3"
            :to="element.to"
            >
              <v-card-title class="text-h5">
                <v-icon class="mr-2">{{element.icon}}</v-icon> {{element.title}}
              </v-card-title>
              <v-card-subtitle>{{element.description}}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-app>
</template>

<script>

export default {
  data() {
    return {
      items: [
        { text: 'Home', to: '/home', icon: 'mdi-home' }
      ],
      elements: [
        { icon: 'mdi-food', title: "Categorias", description: "Crie, edite ou remova uma categoria.", to: '/categories'},
        { icon: 'mdi-food', title: "Produtos", description: "Crie, edite ou remova um produto.", to: '/products' },
        { icon: 'mdi-bike-fast', title: "Entregas", description: "Configure as entregas.", to: '/delivery-config' },
        { icon: 'mdi-ticket-percent', title: "Cupons", description: "Crie, edite ou remova um cupom.", to: '/coupons' },
        { icon: 'mdi-clock', title: "Horário de funcionamento", description: "Configure o horário de funcionamento.", to: '/configs' },
      ]
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 3em;
  text-shadow: 1px 1px 2px black;
}

.wrapper {
  background: url('http://i.mlcdn.com.br/portaldalu/fotosconteudo/43225.jpg')!important;
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