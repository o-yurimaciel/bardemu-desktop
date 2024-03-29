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
import { bardemu } from './services'
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

ipcRenderer.on('print-reply', (event, printed) => {
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

function wsConnect() {
  try {
    const server = process.env.VUE_APP_WS_SERVER
  
    var connection = new WebSocket(server)
    
    connection.onopen = (event) => {
      store.dispatch('openAlert', {
        message: 'A conexão com o servidor foi estabelecida.',
        type: 'success'
      })
      log.info(`[WS] open ${JSON.stringify(event)}`)
    }
  
    connection.onclose = (event) => {
      log.info(`[WS] onclose ${JSON.stringify(event)}`)
      store.dispatch('openAlert', {
        message: 'A comunicação com o servidor foi perdida.',
        type: 'error'
      })
  
      connection.onerror = null
  
      setTimeout(() => {
        wsConnect()
      }, 5000);
    }
    
    connection.onerror = (event) => {
      log.info(`[WS] onerror ${JSON.stringify(event)}`)
      store.dispatch('openAlert', {
        message: 'A comunicação com o servidor foi perdida.',
        type: 'error'
      })
  
      connection.onclose = null
  
      setTimeout(() => {
        wsConnect()
      }, 5000);
    }
    
    connection.onmessage = (event) => {
      const data = event && event.data ? JSON.parse(event.data) : null

      if(data && data.type && data._doc) {
        switch(data.type) {
          case "order":
            ipcRenderer.send('order-notification')
            EventBus.$emit('new-order', data._doc)
            break
          case "feedback":
            ipcRenderer.send('feedback-notification', data._doc)
            break
        }
      }
    }
  
    setInterval(() => {
      if(connection.readyState === connection.OPEN) {
        connection.send("hello")
      }
    }, 1000);
  } catch (error) {
    log.error(`[WS] ${JSON.stringify(error)}`)
  }
}

wsConnect()

bardemu.interceptors.response.use(
  res => res,
  err => {
    const statusCode = err.response.status
    if (statusCode === 401) {
      store.commit('setToken', null)
      store.dispatch('openAlert', {
        message: 'A autenticação falhou. Por favor, faça o login.',
        type: "error"
      })
      router.push('/')
      return
    } else {
      if(!err.response || !err.response.data) {
        store.dispatch('openAlert', {
          message: 'Ocorreu um problema. Tente novamente mais tarde.',
          type: "error"
        })
      } else {
        throw err
      }
    }
    throw err
  }
)
