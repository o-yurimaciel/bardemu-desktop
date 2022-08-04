module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    output: {
      pathinfo: false
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    node: {
      module: "empty"
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: (config) => {
        config.module
        .rule("pdf")
        .test(/\.pdf$/)
        .use("file-loader")
        .options({
          name: '[name].[ext]'
        })
        .loader("file-loader")
        .end()
      },
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
          './build/app-tray-icon.png'
        ]
      }
    }
  }
}
