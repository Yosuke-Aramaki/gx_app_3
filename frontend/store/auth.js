export const state = () => ({
  userId: '',
})

export const mutations = {
  setCurrentUser(state, userId) {
    state.userId = userId
  }
}

export const actions = {
  async sign_up({ commit }, userId ) {
    this.$cookies.set('user_id', userId )
    commit('setCurrentUser', { userId })
  }
}