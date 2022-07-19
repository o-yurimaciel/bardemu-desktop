const { ipcMain } = require('electron')
const isDev = process.env.NODE_ENV !== "production"
const { fork } = require('child_process')
const path = require('path')
const log = require('../logConfig')

ipcMain.on('ws', (event) => {
  let child

  let wsServer;

  if(isDev) {
    child = fork(path.join(__dirname, "../src/native/websocket.js"))
    wsServer = "ws://localhost:5050"
  } else {
    child = fork(path.join(process.resourcesPath, "src/native/websocket.js"))
    wsServer = "wss://bardemu-backend.herokuapp.com/"
  }

  log.info(`WS-SERVER: ${wsServer}`)

  child.send(wsServer)

  child.on('message', (msg) => {
    event.reply('ws-reply', msg)  
  }).setMaxListeners(0)

  child.on('exit', (code) => {
    console.log('wss exit', code)
  })

  ipcMain.on('ws-kill', () => {
    child.kill()
  })
}).setMaxListeners(0)