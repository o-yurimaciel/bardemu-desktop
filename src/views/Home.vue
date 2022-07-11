<template>
  <v-container style="height: 100%" fluid class="pa-0 ma-0">
    <v-row style="height: 100%" no-gutters>
      <v-col cols="6" class="pa-0 borders" v-for="menu in menus" :key="menu.title">
        <v-card
        width="100%"
        height="100%"
        :color="menu.color"
        :style="`background: url(${menu.src}); background-size: cover`"
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
// import { ipcRenderer } from 'electron'

export default {
  name: 'Home',
  data() {
    return {
      menus: [
        { title: "Pedidos", color: "var(--primary-color)", icon: "mdi-basket", route: '/orders', src: 'https://p4.wallpaperbetter.com/wallpaper/470/622/407/burger-4k-background-image-hd-wallpaper-preview.jpg' },
        { title: "Produtos", color: "green", icon: "mdi-food", src: 'https://img.freepik.com/fotos-gratis/vista-lateral-de-batatas-fritas-com-tempero_141793-4899.jpg?w=2000',route: '/products' },
        { title: "Categorias", color: "blue", icon: "mdi-format-list-bulleted-square", src: 'https://images.alphacoders.com/276/276653.jpg',route: '/categories' },
        { title: "Configurações", color: "yellow", icon: "mdi-cog", src: 'http://i.mlcdn.com.br/portaldalu/fotosconteudo/43225.jpg',route: '/' },
      ]
    }
  },
  mounted() {
    // ipcRenderer.send('ws-kill')
    // ipcRenderer.send('ws')
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    }
  },
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
