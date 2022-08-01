'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, shell, ipcMain, Notification, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import log from './logConfig'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
import { autoUpdater } from 'electron-updater'
import './ipcEvents'
const { version } = require('../package.json')

autoUpdater.logger = log
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.autoDownload = false
autoUpdater.allowDowngrade = false
autoUpdater.channel = "latest"

let isSingleInstance = app.requestSingleInstanceLock()

if(!isSingleInstance) {
  app.quit()
}

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win
let tray = null

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    center: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      webSecurity: false
    },
    title: `BarDeMu Lanches ${version}`
  })
  win.removeMenu()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if(isDevelopment) {
      win.webContents.openDevTools()
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

app.on('second-instance', () => {
  if(win) {
    if(win.isMinimized()) {
      win.restore()
    } else {
      win.focus()
    }
  }
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow().then(() => {
    win.show()
    autoUpdater.checkForUpdates()
    win.setTitle(`BarDeMu Lanches ${version}`)
    tray = new Tray(path.join(__dirname, '../build/app-tray-icon.png'))
  
    let contextMenu;
  
    if(isDevelopment) {
      contextMenu = Menu.buildFromTemplate([
        { label: "Abrir", type: "normal", click: () => {
          win.focus();
        }},
        { label: "Reload", type: "normal", click: () => {
          win.reload()
        }},
        { label: "Abrir DevTools", type: "normal", click: () => {
          win.webContents.openDevTools()
        }},
        { label: "Redefinir Tela", type: "normal", click: () => {
          win.setSize(1200, 800)
        }},
        { label: "Ver logs", type: "normal", click: () => {
          if(isDevelopment) {
            shell.openPath(path.join(app.getAppPath(), '../logs'));
          } else {
            shell.openPath(path.join(app.getAppPath(), '../../../logs'));
          }
        }},
        { label: "Fechar", type: "normal", click: () => {
          win.closable = true
          win.close()
        }}
      ])
    } else {
      contextMenu = Menu.buildFromTemplate([
        { label: "Abrir", type: "normal", click: () => {
          win.focus();
        }},
        { label: "Pedidos", type: "normal", click: () => {
          win.webContents.send('router-redirect', '/orders');
          win.focus();
        }},
        { label: "Ver logs", type: "normal", click: () => {
          if(isDevelopment) {
            shell.openPath(path.join(app.getAppPath(), '../logs'));
          } else {
            shell.openPath(path.join(app.getAppPath(), '../../../logs'));
          }
        }},
        { label: "Verificar Atualização", type: "normal", click: () => {
          autoUpdater.checkForUpdates()
        }},
        { label: "Fechar", type: "normal", click: () => {
          win.closable = true
          win.close()
        }}
      ])
    }
  
    tray.setToolTip('BarDeMu Lanches')
    tray.setContextMenu(contextMenu)
  })
})

autoUpdater.on('update-available', (info) => {
  const dialogOpts = {
    type: "none",
    icon: path.join(__dirname, '../build/app-tray-icon.png'),
    buttons: [
      'Sim', 'Não'
    ],
    title: 'Atualização BarDeMu Lanches',
    detail: `Nova versão v${info.version} está disponível. Deseja baixar agora?`
  }
  
  dialog.showMessageBox(dialogOpts).then((res) => {
    if (res && res.response == 0) {
      autoUpdater.downloadUpdate()
    }
  })
});

autoUpdater.on('update-downloaded', () => {
  const dialogOpts = {
    type: "none",
    icon: path.join(__dirname, '../build/app-tray-icon.png'),
    buttons: [
      'Reiniciar Agora', 'Reiniciar mais tarde'
    ],
    title: 'Atualização',
    detail: "Uma nova versão foi recebida, reinicie para instalar a atualização."
  }
  
  win.setTitle(`BarDeMu Lanhes - Reinicie para instalar a atualização`)
  dialog.showMessageBox(dialogOpts).then((res) => {
    if (res && res.response == 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  })
});

autoUpdater.on('download-progress', (obj) => {
  let percent;

  if(obj.percent) {
    percent = obj.percent.toString().split('.')[0] + "%"
    win.setTitle(`BarDeMu Lanches - Baixando atualização... ${percent}`)
  }
})

ipcMain.on('notification', () => {
  let notify = new Notification({
    title: "Um novo pedido foi recebido.",
    body: "Clique para mais detalhes",
    icon: path.join(__dirname, '../build/app-tray-icon.png'),
    urgency: 'critical'
  })
  notify.show()
  notify.on('click', () => {
    win.alwaysOnTop = true
    win.show()
    win.alwaysOnTop = false
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
