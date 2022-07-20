import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import './filters'
import './plugins/currency-field'
import './plugins/v-mask'
import log from './logConfig'
import { ipcRenderer } from 'electron'
import { EventBus } from './EventBus'

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

process.on('uncaughtException', (err) => {
  log.error(`[MAIN-PROCESS] uncaughtException ${err}`)
})

process.on('unhandledRejection', (err) => {
  log.error(`[MAIN-PROCESS] unhandledRejection ${err}`)
})

process.on('uncaughtExceptionMonitor', (err) => {
  log.error(`[MAIN-PROCESS] uncaughtExceptionMonitor ${err}`)
})

process.on('exit', function(code) {
  log.error(`[MAIN-PROCESS] exit ${code}`)
});

process.on('error', function(err) {
  log.error(`[MAIN-PROCESS] error ${JSON.stringify(err)}`)
});

const server = process.env.VUE_APP_WS_SERVER
const connection = new WebSocket(server)

connection.onmessage = (event) => {
  ipcRenderer.send('notification')
  EventBus.$emit('new-order', JSON.parse(event.data))
}

connection.onerror = (error) => {
  log.error(`[WS] ${error}`)
}
