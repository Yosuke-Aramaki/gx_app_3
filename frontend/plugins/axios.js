export default function({ app, $axios, redirect }) {
  $axios.setToken('access_token')
  
  // API通信時にトークンをセットする
  $axios.onRequest(config => {
    config.headers.common['Authorization'] =
      'Token ' + app.$cookies.get('user_id')

    return config
  })

  $axios.onResponse(config => {
    $axios.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  })
}