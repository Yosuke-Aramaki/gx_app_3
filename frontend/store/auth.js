export const state = () => ({
  userId: '',
})

export const mutations = {
  set_current_user(state, userId) {
    state.userId = userId
  }
}

export const actions = {
  async set_user_token({ commit }, response ) {
    let user_id = response.user_id
    this.$cookies.set('user_id', user_id )
    commit('set_current_user', { user_id })
  }
}