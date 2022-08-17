<template>
  <v-container style="height: 100%" fluid class="pa-0 ma-0">
    <v-row style="height: 100%" no-gutters>
      <v-col :cols="menu.cols" class="pa-0 borders" v-for="menu in menus" :key="menu.title">
        <v-card
        width="100%"
        height="100%"
        :color="menu.color"
        :style="`background: url(${menu.src}); background-size: cover`"
        class="d-flex justify-center align-center flex-column"
        tile
        @click="goTo(menu.route)"
        >
          <v-icon size="150" color="#fff">{{menu.icon}}</v-icon>
          <span class="menu-title">{{menu.title}}</span>
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
        { title: "Pedidos", cols: "12", color: "var(--primary-color)", icon: "mdi-basket", route: '/orders', src: 'https://p4.wallpaperbetter.com/wallpaper/470/622/407/burger-4k-background-image-hd-wallpaper-preview.jpg' },
        { title: "Administrativo", cols: "6", color: "green", icon: "mdi-food", src: 'https://img.freepik.com/fotos-gratis/vista-lateral-de-batatas-fritas-com-tempero_141793-4899.jpg?w=2000', route: '/adm' },
        { title: "Configurações", cols: "6", color: "yellow", icon: "mdi-cog", src: 'http://i.mlcdn.com.br/portaldalu/fotosconteudo/43225.jpg', route: '/configs' },
      ]
    }
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
}

.borders:nth-child(2) {
  border-right: 6px solid #fff;
}

.menu-title {
  color: #fff;
  font-family: 'Kaushan Script', sans-serif;
  letter-spacing: 4px;
  font-weight: bold;
  font-size: 2.5em;
  text-shadow: 1px 1px 3px black!important;
}
</style>
