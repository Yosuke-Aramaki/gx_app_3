<template>
  <div>
    <Header />
     <p>{{ this.errors }}</p>
    <div>
      <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
      <button type="submit" @click="add_category()">カテゴリーを追加</button>
    </div>
    <div class="category-list" v-for="category in categories" :key="'category' + category.id">
      <p>{{ category.category_name }}</p>
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
      categories: [],
      category_form: {
        category_name: ''
      },
      errors: '',
    }
  },
  created() {
    this.fetch_articles(),
    this.fetch_categories()
  },
  computed: {
  },
  methods: {
    async fetch_articles() {
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
    async fetch_categories() {
      let res = await this.$axios.$get('/api/v1/categories')
      console.log(res)
      this.categories = res
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
