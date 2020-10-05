import Vuex from 'vuex'

export const state = () => ({
  articles: [],
})

export const getters = {
  articles: state => {
    return state.articles
  }
}

export const mutations = {
  set_article_list(state, article_list) {
    // state.articles = []
    state.articles = article_list
  }
}

export const actions = {
  async fetch_article_list_action({commit}, is_read) {
    const response = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
      params: {
        is_read: 0
      }
    })
    commit('set_article_list', response )
  }
}