<template>
  <v-app class="wrapper-adm">
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
          <span class="page-title">Adminsitrativo</span>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-0 pt-5">
        <v-row no-gutters>
          <v-col cols="12" class="pa-0 mt-5" v-for="element in elements" :key="element.title">
            <v-card
            class="elevation-1"
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
        { icon: 'mdi-account-group', title: "Clientes", description: "Veja a lista de clientes cadastrados.", to: '/clients'},
        { icon: 'mdi-comment-quote', title: "Avaliações", description: "Veja a lista de avaliações.", to: '/feedbacks'},
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