
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    'plugins/axios'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/dotenv',
    ['cookie-universal-nuxt', { parseJSON: false }],
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': 'http://[::1]:3000'
    // '/api': { 
    //   target: 'http://[::1]', 
    //   pathRewrite: {'^/api': ''}
    // }
  },
  oneSignal: {
    init: {
      appId: process.env.push_app_key,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: false
      },
      notifyButton: {
        enable: true,
      },
    },
    importScripts: ['https://cdn.onesignal.com/sdks/OneSignalSDK.js'],
  },
  pwa: {
    workbox: {
      dev: true, // devモードで起動した時でもServiceWorkerを有効にする
    },
    manifest: {
      name: 'test',
      short_name: 'test',
      title: 'test',
      'og:title': 'test',
      description: 'test',
      'og:description': 'test',
      lang: 'ja',
      theme_color: '#ffffff',
      background_color: '#ffffff'
    },
  },
  env: {
    push_app_key: process.env.push_app_key
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}