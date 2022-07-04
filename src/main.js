import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import './filters'
import './plugins/currency-field'
import './plugins/v-mask'
import log from './logConfig'
import { ipcRenderer } from 'electron'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
  log.error(`Vue: ${err.toString()} on: ${router.history.current.path}`)
  log.error(`info: ${info}`)
}

ipcRenderer.on('router-redirect', (event, route) => {
  if(router.history.current.path !== route) {
    router.push(route)
  }
})
