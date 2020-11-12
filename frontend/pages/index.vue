<template>
  <v-app class="body-contents" style="background-color: #fafafa;">
    <Header
      @add_article_from_modal="add_article" />
    <v-container class="main-contents" >
      <p>{{ this.errors }}</p>
      <v-row justify="center">
        <v-col cols="2">
          <v-list color="#fafafa" rounded dense>
            <!-- <v-subheader>カテゴリー</v-subheader> -->
            <v-list-item-group v-model="item" color="#5294E2">
              <v-list-item @click="fetchArticles(0)" >
                <v-list-item-icon style="margin-right: 14px;">
                  <v-icon>mdi-book</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="caterory-name">
                      未読記事
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <div class="category-list">
                <v-list-item v-for="category in categories" :key="'unread_category' + category.id">
                  <v-list-item-content @click="fetch_categorised_article(0, category.id)">
                    <v-list-item-title>
                      <span class="caterory-name">
                        {{ category.category_name }}
                      </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <v-list-item @click="fetchArticles(1)">
                <v-list-item-icon style="margin-right: 14px;">
                  <v-icon>mdi-book-open</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  <span class="caterory-name">
                    既読記事
                  </span>
                </v-list-item-title>
              </v-list-item>
              <div class="category-list">
                <v-list-item v-for="category in categories" :key="'read_category' + category.id">
                  <v-list-item-content @click="fetch_categorised_article(1, category.id)">
                    <v-list-item-title>
                      <span class="caterory-name">
                        {{ category.category_name }}
                      </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
          <AddCategoryModal @send_category="add_category" />
        </v-col>
        <v-col cols="10" class="article_section">
          <div v-if="show_unread_articles" class="unread-article-list">
            <div v-for="(article, index) in articles" :key="'unread_article' + article.id">
              <div class="article_saved_date" v-if="index == 0">
                {{dataFormat(article.created_at)}}
              </div>
              <div v-else>
                <div class="article_saved_date" v-if="sameDate(index)">{{dataFormat(article.created_at)}}</div>
              </div>
              <div class="unread-article-item">
                <div class="image_section">
                  <a :href="article.article_url" @click="article_url_clicked(article.id)" target="_blank" rel="noopener noreferrer">
                    <img class="image_size" border="0" v-lazy="article.og_image_url" :alt="article.title">
                  </a>
                </div>
                <div>
                  <div class="article_information">
                    <a :href="article.article_url" @click="article_url_clicked(article.id)" target="_blank" rel="noopener noreferrer">
                      <div class="article_title">{{ article.title }}</div>
                      <div class="article_description"><small>{{ article.article_note }}</small></div>
                    </a>
                  </div>
                  <div class="unread_article_footer">
                    <EditModal :form="article" />
                    <v-icon small class="article_footer_button" @click="delete_article(article.id)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>  
            </div>
          </div>
          <div v-else class="read-article-list">
            <v-row>
              <v-col cols="4" v-for="article in reverseArticles" :key="'read_article' + article.id">
                <div class="read-article-item">
                  <a :href="article.article_url" @click="article_url_clicked(article.id)" target="_blank" rel="noopener noreferrer">
                    <div class="image_section" style="margin:auto;">
                      <img class="image_size" border="0" v-lazy="article.og_image_url" :alt="article.title">
                    </div>
                    <div class="article_title">{{ article.title }}</div>
                    <div class="article_read_date"><small>{{dataFormat(article.updated_at)}}</small></div>
                    <div class="article_note">
                      <p><small>{{ article.article_note }}</small></p>
                    </div>
                  </a>
                  <div class="article_footer">
                    <EditModal :form="article" />
                    <!-- <v-icon small class="article_footer_button">mdi-circle-edit-outline</v-icon> -->
                    <v-icon small class="article_footer_button" @click="delete_article(article.id)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </v-app>
</template>

<script>
// import { mapState, mapActions } from 'vuex';
import Header from '@/components/Header'
import AddCategoryModal from '@/components/AddCategoryModal'
import EditModal from '@/components/EditModal'
import Footer from '@/components/Footer'

export default {
  head() {
    return {
      title: 'home'
    }
  },
  components: {
    Header,
    AddCategoryModal,
    EditModal,
    Footer,
  },
  data() {
    return {
      articles: [],
      categories: [],
      category_form: {
        category_name: ''
      },
      errors: '',
      show_unread_articles: true,
      dialog: false,
      model:'',
      item: 0,
    }
  },
  created() {
    this.fetchArticles(0),
    this.fetchCategories()
  },
  computed: {
    // ...mapState({
    //   articles: (state) => state.article.articles,
    //   reverseArticles: (state) => state.article.articles.slice().reverse(),
    // }),
    reverseArticles: function() {
      return this.articles.slice().reverse()
    },
    sameDate: function({ state }) {
      return function(value) {
        return this.articles[value-1].created_at.substr(0, 10) != this.articles[value].created_at.substr(0, 10)
      }
    },
    dataFormat: function() {
      return function(value) {
        return value.substr(0, 10)
      }
    }
  },
  methods: {
    // ...mapActions({
    //   fetch_article_list_action: "article/fetch_article_list_action",
    //   fetch_categorised_article_list_action: "article/fetch_categorised_article_list_action",
    //   delete_article_action: "article/delete_article_action"
    // }),
    async fetchArticles( is_read ) {
      const response = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
        params: {
          is_read: is_read
        }
      })
      this.articles = response
      this.article_handler(is_read)
    },
    async fetch_categorised_article(is_read, category_id) {
      const response = await this.$axios.$get('/api/v1/categorised_articles', {
        params: {
          is_read: is_read,
          category_id: category_id
        }
      })
      this.articles = response
      this.article_handler(is_read)
    },
    article_handler(is_read) {
      if (is_read == 0) {
        this.show_unread_articles = true
      } else {
        this.show_unread_articles = false
      }
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
    add_article(article_data) {
      this.articles.push(article_data)
    },
    add_category(category_data) {
      this.categories.push(category_data)
    },
    async fetchCategories() {
      this.categories = await this.$axios.$get('/api/v1/categories')
    },
    async delete_article(article_id) {
      await this.$axios.$delete('api/v1/articles/' + article_id )
      const article_array = this.articles
      article_array.some(function(v, i) {
        if (v.id === article_id) article_array.splice(i,1)
      })
      this.articles = article_array
    }
  }
}
</script>

<style scoped>

.body-contents {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
}

.main-contents {
  flex: 1;
}
/* ======= カテゴリーリスト ===================== */

.v-list {
  padding: 0px;
  background-color: #fafafa;
}

.v-list-item__icon {
  margin-right: 12px;
}

.caterory-name {
  /* font-weight: 550; */
}

.category_section {
  background-color: #fafafa;
}

.category-list {
  padding-left: 16px;
}

.category_name {
  padding: 6px 8px 6px 12px;
  margin-bottom: 8px;
  border-radius: 18px;
  vertical-align: middle;
}

/* ======= 記事共通 ===================== */

.article_section {
  /* width: 80%; */
}

.article_saved_date {
  font-weight: 600;
  margin-bottom: 24px;
}

a {
  text-decoration: none;
}

/* ======= 未読記事リスト ===================== */

.unread-article-item {
  display: flex;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 0.5px solid #7b7b7b;
}

.unread-article-list .image_size {
  width: 190px;
  height: 100px;
}

.unread-article-list .image_section {
  width: 190px;
  height: 100px;
}

.unread-article-list .article_information {
  padding-left: 16px;
}

.unread_article_footer {
  margin-top: 4px;
  display: flex;
  padding-left: 16px;
  justify-content: flex-start;
}

.article_information {
 
}

.article_information .article_title {
  color: #000000;
  overflow: hidden;
  width: 100%;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.article_information .article_description small {
  color: #7B7B7B;
  overflow: hidden;
  height: 57px;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.article_section .col {
  padding-top: 0px;
}

/* ======= 既読記事リスト ===================== */

.read-article-item {
  /* border: 1px solid #000; */
  padding: 16px;
  height: 380px;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
  background-color: #ffffff;
}

.article_read_date {
  text-align: right;
  color: #7B7B7B;
}

.read-article-list .image_section {
  width: 100%;
  height: 48%;
}

.read-article-list .image_size {
  width: 100%;
  max-height: 100%;
  border-radius: 8px;
}


.read-article-item .article_title {
  overflow: hidden;
  height: 48px;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.read-article-item .article_note p {
  color: #000000;
  overflow: hidden;
  height: 96px;
  width: 100%;
  margin-bottom: 0px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

/* 既読記事アイテムのフッター部分 */
.article_footer {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.article_footer_button {
  margin-left: 8px;
  cursor: pointer;
}

</style>