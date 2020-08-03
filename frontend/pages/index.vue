<template>
  <div>
    <Header />
     <p>{{ this.errors }}</p>
    <button @click="openModal">記事を追加</button>
    <button @click="openRemindModal">リマインド</button>
    <div>
      <p>あとで読む</p>
      <div class="category-list" v-for="category in categories" :key="'category' + category.id">
        <p @click="fetch_categorised_crticle(0, category.id)">{{ category.category_name }}</p>
      </div>
      <p>-------------</p>
      <div class="category-list" v-for="category in categories" :key="'category' + category.id">
        <p>{{ category.category_name }}</p>
      </div>
    </div>
    <div>
      <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
      <button type="submit" @click="add_category()">カテゴリーを追加</button>
    </div>
    <div class="item-list" v-for="article in articles" :key="article.id">
      <p>{{ article.id }}</p>
      <p>{{ article.title }}</p>
      <p><a :href="article.article_url" @click="article_url_clicked(article.id)">{{ article.article_url }}</a></p>
    </div>
    <AddArticleModal @close="closeModal" v-if="modal" />
    <RemindModal @close="closeRemindModal" v-if="remind_modal" />
  </div>
</template>

<script>
import AddArticleModal from '@/components/AddArticleModal'
import RemindModal from '@/components/RemindModal'
export default {
  components: {
    AddArticleModal,
    RemindModal
  },
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
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
    openRemindModal() {
      this.remind_modal = true
    },
    closeRemindModal() {
      this.remind_modal = false
    },
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
