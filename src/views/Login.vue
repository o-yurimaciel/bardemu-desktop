<template>
  <v-container fluid class="pa-0 ma-0">
    <v-row no-gutters>
      <v-col cols="8" class="pa-0 d-flex align-center justify-center" style="height: 100vh">
        <img width="500" src="../assets/logo_transparent_background.png" alt="">
      </v-col>
      <v-col class="pa-0 d-flex align-center" style="height: 100vh;background-color: #cecece">
        <v-col cols="12" lg="8" class="pa-0 d-flex flex-column justify-center mx-auto pa-10">
          <v-col class="pa-0 pb-3">
            <v-text-field
            id="login"
            label="Usuário"
            color="var(--primary-color)"
            autofocus
            outlined
            dense
            v-model="email"
            :rules="[rules.required, rules.email]"
            background-color="#fff"
            @keyup.enter.native="login"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-0">
            <v-text-field
            color="var(--primary-color)"
            label="Senha"
            id="password"
            background-color="#fff"
            v-model="password"
            outlined
            dense
            :rules="[rules.required]"
            :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="hidePassword ? 'password' : 'text'"
            @click:append="() => (hidePassword = !hidePassword)"
            @keyup.enter.native="login"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-0 pt-5 d-flex justify-center">
            <v-btn
            color="var(--primary-color)"
            width="100%"
            @click="login"
            >
              <span style="color: #fff; font-weight: bold" v-if="!handlingh">Entrar</span>
              <v-progress-circular
                v-else
                indeterminate
                size="25"
                color="#fff"
              ></v-progress-circular>
            </v-btn>
          </v-col>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { bardemu } from '../services';
export default {
  data() {
    return {
      email: "",
      password: "",
      hidePassword: true,
      handlingh: false,
      rules: {
        required: field => !!field || "*Campo obrigatório.",
        email: email => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(email) || "*Necessita ser um email válido.";
        }
      },
    }
  },
  methods: {
    login() {
      this.handlingh = true

      bardemu.post('/login', {
        email: this.email,
        password: this.password
      }).then((res) => {
        console.log(res)
        this.$store.commit('setToken', res.data.token)
        this.handlingh = false
        this.$router.push('/home')
      }).catch((e) => {
        console.log(e.response)
        this.handlingh = false
        if(e.response && e.response.data) {
          this.$store.dispatch('openAlert', {
            message: e.response.data ? e.response.data.message : `Erro de autenticação`,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>