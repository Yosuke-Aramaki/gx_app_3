<template>
  <div>
    <Header />
    <p>{{ this.errors }}</p>
    <div class="wrapper">
      <div class="category_section">
        <p>あとで読む</p>
        <div class="category-list" v-for="category in categories" :key="'category' + category.id">
          <p @click="fetch_categorised_crticle(0, category.id)">{{ category.category_name }}</p>
        </div>
        <p>-------------</p>
        <p>読んだ</p>
        <div class="category-list" v-for="category in categories" :key="'category' + category.id">
          <p @click="fetch_categorised_crticle(1, category.id)">{{ category.category_name }}</p>
        </div>
        <div>
          <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
          <button type="submit" @click="add_category()">カテゴリーを追加</button>
        </div>
      </div>
      <div class="article_section">
        <div class="unread-article-list" v-for="article in articles" :key="article.id">
          <div class="image_section">
            <img class="image_size" border="0" :src="article.og_image_url" :alt="article.title">
          </div>
          <div class="article_information">
            <p>{{ article.title }}</p>
            <p><small>{{ article.article_note }}</small></p>
            <p><a :href="article.article_url" @click="article_url_clicked(article.id)">{{ article.article_url }}</a></p>
          </div>
        </div>
      </div>
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
      modal: false,
      remind_modal: false
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
      let res = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
        params: {
          is_read: 0
        }
      })
      console.log(res)
      this.articles = res
    },
    async article_url_clicked(article_id) {
      this.$axios.$put(
        '/api/v1/articles/'+ article_id +'/update_is_read', 
        { is_read: 1 } //booleanをtrueにするため１を引数に
      )
      .then((response) => {
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
        }
      })
    },
    async fetch_categorised_crticle(is_read, category_id) {
      let res = await this.$axios.$get('/api/v1/categorised_articles', {
        params: {
          is_read: is_read,
          category_id: category_id
        }
      })
      this.articles = res
    },
    async fetch_categories() {
      let res = await this.$axios.$get('/api/v1/categories')
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

<style scoped>
.wrapper {
  display: flex;
}

.category_section {
  padding-left: 16px;
  width: 20%;
}

.category-list {
  padding-left: 8px;
}

.image_section {
  width: 190px;
  height: 100px;
}

.image_size {
  width: 190px;
  height: 100px;
}

.article_section {
  width: 80%;
}

.unread-article-list {
  display: flex;
}

.unread-article-list .article_information {
  padding-left: 16px;
}


</style>