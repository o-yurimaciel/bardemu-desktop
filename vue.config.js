module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "BarDeMu Lanches",
        publish: {
          provider: 'github',
          private: true,
          owner: "yrimaciel",
          repo: "bardemu-desktop",
          token: "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"
        },
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
        },
        extraResources: [
          './build/app-tray-icon.png',
          './src/native/websocket.js'
        ]
      }
    }
  }
}
