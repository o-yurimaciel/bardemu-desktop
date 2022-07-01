<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
  @import url('../src/assets/fonts.css');
  :root {
    --primary-color: #e41c38;
  }

  .product-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.4em;
    letter-spacing: 1.5px;
    color: black;
  }

  .product-description {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1em;
    color: black;
  }

  .product-price {
    font-family: 'Roboto', sans-serif;
    font-size: 1.5em;
    font-weight: 700;
    color: #e41c38;
  }
</style>
