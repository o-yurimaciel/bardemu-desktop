<template>
  <v-container style="height: 100%" fluid class="pa-0 ma-0">
    <v-row style="height: 100%" no-gutters>
      <v-col cols="6" class="pa-0 borders" v-for="menu in menus" :key="menu.title">
        <v-card
        width="100%"
        height="100%"
        :color="menu.color"
        class="d-flex justify-center align-center flex-column"
        tile
        @click="goTo(menu.route)"
        >
          <v-icon size="200" color="#fff">{{menu.icon}}</v-icon>
          <h1 style="color: #fff">{{menu.title}}</h1>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      menus: [
        { title: "Pedidos", color: "var(--primary-color)", icon: "mdi-basket", route: '/orders' },
        { title: "Produtos", color: "grey", icon: "mdi-food", route: '/products' },
        { title: "Categorias", color: "#708090", icon: "mdi-format-list-bulleted-square", route: '/categories' },
        { title: "Configurações", color: "#8B0000", icon: "mdi-cog", route: '/configs' },
      ]
    }
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.borders:nth-child(1) {
  border-bottom: 6px solid #fff;
  border-right: 6px solid #fff;
}

.borders:nth-child(2) {
  border-bottom: 6px solid #fff;
}

.borders:nth-child(3) {
  border-right: 6px solid #fff;
}
</style>
