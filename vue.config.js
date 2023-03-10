'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://lzys522.cn/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
  // 例如，如果你的应用被部署在 https://lzys522.cn/admin/，则设置 baseUrl 为 /admin/。



  // 如果你只是想运行一下 index 直接 ./
  publicPath:  "./",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  configureWebpack: {
    name: "",
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
