import Vue from 'vue'
import Vuex from 'vuex'
import { EventBus } from '../EventBus'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
  },
  actions: {
    openAlert(context, alert) {
      EventBus.$emit('alert', alert)
    }
  },
  modules: {
  }
})
