const { ipcMain } = require('electron')

ipcMain.on("print-pdf", (event) => {
  const { execFile } = require('child_process')
  const log = require('../logConfig')
  const isDev = process.env.NODE_ENV !== "production"
  const path = require('path')

  let sumatraexe = isDev ? 
  path.join(__dirname, "./SumatraPDF.exe") :
  path.join(__dirname, "../SumatraPDF.exe")
  
  let pdfpath = path.join(__dirname, `../receipt.pdf`)
  let printSettings = `noscale`;

  execFile(sumatraexe, [
    pdfpath,
    "-print-to-default",
    "-print-settings",
    printSettings,
    "-silent"
  ], function(err) {  
    if(!err) {
      log.info(`Impressão OK!\nPrintSettings: ${printSettings}`)
    } else {
      log.error(JSON.stringify(err))
    }
  });
})