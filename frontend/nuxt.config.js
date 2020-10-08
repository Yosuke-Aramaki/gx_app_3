
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
    title: 'leo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'leo' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://leo.sakigake.tech'},
      { hid: 'og:title', property: 'og:title', content: 'leo - 情報を逃さず知識の定着を図るアプリ' },
      { hid: 'og:description', property: 'og:description', content: 'あとて読みたいサイトや何について書かれた記事かを覚えるために、メモと一緒にそれらの記事を保存できるサービスです。' },
      { hid: 'og:image', property: 'og:image', content: '/images/leo_header_icon.svg' },
      { name: 'twitter:card', content: 'summary' },　
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/leo_icon.ico' }
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
    '/api': process.env.api
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
    push_app_key: process.env.push_app_key,
    api: process.env.api,
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}