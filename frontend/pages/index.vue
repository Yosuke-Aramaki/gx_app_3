<template>
  <div>
    <Header />
     <p>{{ this.errors }}</p>
    <div>
      <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
      <button type="submit" @click="add_category()">カテゴリーを追加</button>
    </div>
    <div class="item-list" v-for="article in articles" :key="article.id">
      <p>{{ article.id }}</p>
      <p>{{ article.title }}</p>
      <p><a :href="article.article_url" @click="article_url_clicked(article.id)">{{ article.article_url }}</a></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: [],
      category_form: {
        category_name: ''
      },
      errors: '',
    }
  },
  created() {
    this.fetchArticles()
  },
  computed: {
  },
  methods: {
    async fetchArticles() {
      let res = await this.$axios.$get('/api/v1/articles')
      console.log(res)
      this.articles = res
    },
    async article_url_clicked(article_id) {
      this.$axios.$put(
        '/api/v1/articles/'+ article_id +'/update_is_read', 
        {is_read: 1 } //booleanをtrueにするため１を引数に
      )
      .then((response) => {
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
        }
      })
    },
    async add_category() {
      this.$axios.$post(
        '/api/v1/categories', 
        { category: this.category_form } 
      )
      .then((response) => {
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          this.errors = []
          this.errors = error.response.data.messages
        }
      })
    }
  }
}
</script>
