export const state = () => ({
  token: '',
})

export const mutations = {
  set_current_user(state, token) {
    state.token = token
  }
}

export const actions = {
  async set_user_token({ commit }, response ) {
    let token = response.token
    this.$cookies.set('token', token )
    commit('set_current_user', { token })
  }
}