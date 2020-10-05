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
  },
  add_article(state, article) {
    state.articles.push(article)
  }
}

export const actions = {
  async fetch_article_list_action({commit}, is_read) {
    const response = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
      params: {
        is_read: is_read
      }
    })
    commit('set_article_list', response )
  },
  async fetch_categorised_article_list_action({commit}, {is_read, category_id}) {
    const response = await this.$axios.$get('/api/v1/categorised_articles', {
      params: {
        is_read: is_read,
        category_id: category_id
      }
    })
    commit('set_article_list', response )
  },
  async add_article_action({commit}, article) {
    commit('add_article', article)
  }

}