// console.log(process.env.NODE_ENV)
// let proxyHost
// if(process.env.NODE_ENV === 'develop') {
//   proxyHost = 'http://54.183.216.222:8100/'
// } else if(process.env.NODE_ENV === 'product') {
//   proxyHost = 'http://54.183.216.222:8100/'
// }
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'b2b_console',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'b2b console with vue/nuxt' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // ----------------------  ElementUI  --------------------- 
  css: [
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  router: {
    middleware: 'i18n'
  },
  plugins: [
    '@/plugins/utils',
    '~/plugins/i18n.js',
    '@/plugins/element-ui',
    '@/plugins/filter',
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~plugins/http', ssr: true }
  ],
  // ----------------------  ElementUI  --------------------- 
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  modules: [
    ['@nuxtjs/proxy'],
  ],
  proxy: [
    ['/api', 
      { 
        target: 'http://0.0.0.0:8088/',
        secure: false,
        changeOrigin: true, // 这个属性去了就404,具体原因不详
        cookieDomainRewrite: '127.0.0.1'
    }],
    // ['/voljin',
    //   { 
    //     target: 'http://52.53.224.45:8100/',
    //     secure: false,
    //     changeOrigin: true, // 这个属性去了就404,具体原因不详
    //     cookieDomainRewrite: '127.0.0.1'
    // }]
  ],
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.devtool = 'source-map'
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['axios']
  }
}
