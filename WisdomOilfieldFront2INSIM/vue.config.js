const path = require('path')

module.exports =  {
     // publicPath: '/znyt',
        // 输出文件目录
        outputDir: 'dist',
        // eslint-loader 是否在保存的时候检查
        lintOnSave: false,
        // 是否使用包含运行时编译器的 Vue 构建版本
        runtimeCompiler: false,
        // 生产环境是否生成 sourceMap 文件
        productionSourceMap: false,
        // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
        integrity: false,
        configureWebpack:{
            performance:{
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000
            }
        },


      configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
          // 生产环境
          config.mode = 'production'
        } else {
          // 开发环境
          config.mode = 'development'
        }

      },

  devServer: {
    open: true,
    host: 'localhost',
    port: 9521,
    https: false,

    //http代理配置，主要处理服务请求的跨域问题
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}
