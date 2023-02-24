// const { run } = require('runjs')
// const config = require('../vue.config.js')
// const rawArgv = process.argv.slice(2)
// const args = rawArgv.join(' ')
//
// if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
//   run(`vue-cli-service build ${args}`)
//
//   const publicPath = config.publicPath
//
//   var connect = require('connect')
//   var serveStatic = require('serve-static')
//   const app = connect()
//
//   app.use(
//     publicPath,
//     serveStatic('./dist', {
//       index: ['index.html', '/']
//     })
//   )
//
// } else {
//   run(`vue-cli-service build ${args}`)
// }
