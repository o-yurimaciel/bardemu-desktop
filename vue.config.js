module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "BarDeMu Lanches",
        win: {
          icon: './build/app-icon.png'
        },
        nsis: {
          artifactName: 'setup_bardemu_v${version}.${ext}',
          oneClick: false,
          runAfterFinish: true,
          perMachine: true,
          menuCategory: true,
          deleteAppDataOnUninstall: true,
          include: './build/installer.nsh'
        },
        electronDownload: {
          isVerifyChecksum: false
        }
      }
    }
  }
}
