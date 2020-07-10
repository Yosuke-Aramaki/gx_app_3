export const state = () => ({
  userId: '',
})

export const mutations = {
  setCurrentUser(state, userId) {
    state.userId = userId
  }
}

export const actions = {
  async signup({ commit }, userId ) {
    this.$cookies.set('user_id', userId )
    commit('setCurrentUser', { userId })
  },
  async login({ commit }, userId ) {
    this.$cookies.set('user_id', userId )
    commit('setCurrentUser', { userId })
  }
}