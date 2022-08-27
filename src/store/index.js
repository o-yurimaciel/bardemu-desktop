import Vue from 'vue'
import Vuex from 'vuex'
import { EventBus } from '../EventBus'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: "",
    userId: ""
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserId(state, userId) {
      state.userId = userId
    }
  },
  actions: {
    openAlert(context, alert) {
      EventBus.$emit('alert', alert)
    }
  },
  modules: {
  }
})
