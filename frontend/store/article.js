// 将来的にVuexを使うときのために

export const state = () => ({
  articles: [],
})

export const getters = {
  article: state => (article_id) => {
    return  state.articles.find(article => article.id === article_id)
  },
  articles: state => {
    return state.articles
  },
}

export const mutations = {
  set_article_list(state, article_list) {
    // state.articles = []
    state.articles = article_list
  },
  add_article(state, article) {
    state.articles.push(article)
  },
  delete_article(state, article_id) {
    const article_array = state.articles
    article_array.some(function(v, i) {
      if (v.id === article_id) article_array.splice(i,1)
    })
    state.articles = article_array
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
  },
  async delete_article_action({commit, state}, article_id) {
    await this.$axios.$delete('api/v1/articles/' + article_id )
    commit('delete_article', article_id )
  }

}