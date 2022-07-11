const { ipcMain } = require('electron')
const isDev = process.env.NODE_ENV !== "production"
const { fork } = require('child_process')
const path = require('path')

ipcMain.on('ws', (event) => {
  let child

  if(isDev) {
    child = fork(path.join(__dirname, "../src/native/websocket.js"))
  } else {
    child = fork(path.join(process.resourcesPath, "src/native/websocket.js"))
  }

  child.send({})

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