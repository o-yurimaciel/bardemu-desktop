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
import store from './store'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
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

const server = process.env.VUE_APP_WS_SERVER_PROD
const connection = new WebSocket(server)

connection.onopen = (event) => {
  log.info(`[WS] open ${JSON.stringify(event)}`)
}

connection.onmessage = (event) => {
  ipcRenderer.send('notification')
  EventBus.$emit('new-order', JSON.parse(event.data))
}

connection.onerror = (error) => {
  log.error(`[WS] ${JSON.stringify(error)}`)
}

ipcRenderer.on('print-reply', (event, printed) => {
  console.log('print-reply', printed)
  if(printed) {
    store.dispatch('openAlert', {
      message: 'Enviado para área de impressão',
      type: 'success'
    })
  } else {
    store.dispatch('openAlert', {
      message: 'Erro ao tentar imprimir',
      type: 'error'
    })
  }
})
