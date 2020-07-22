<template>
  <div>
    <Header />
    <div class="item-list" v-for="article in articles" :key="article.id">
      <p>{{ article.id }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: []
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
  }
}
</script>
