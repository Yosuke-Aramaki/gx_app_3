<template>
  <v-app class="body-contents">
    <v-container>
      <Header />
      <p>{{ this.errors }}</p>
      <v-row justify="center">
        <v-col cols="2" class="category_section">
          <v-list rounded dense>
            <!-- <v-subheader>カテゴリー</v-subheader> -->
            <v-list-item-group v-model="item" color="#5294E2">
              <v-list-item @click="fetchArticles(0)" >
                <v-list-item-icon style="margin-right: 14px;">
                  <v-icon>mdi-book</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>未読記事</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <div class="category-list">
                <v-list-item v-for="category in categories" :key="'unread_category' + category.id">
                  <v-list-item-content @click="fetch_categorised_article(0, category.id)">
                    <v-list-item-title>{{ category.category_name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <v-list-item @click="fetchArticles(1)">
                <v-list-item-icon style="margin-right: 14px;">
                  <v-icon>mdi-book-open</v-icon>
                </v-list-item-icon>
                <v-list-item-title>既読記事</v-list-item-title>
              </v-list-item>
              <div class="category-list">
                <v-list-item v-for="category in categories" :key="'read_category' + category.id">
                  <v-list-item-content @click="fetch_read_categorised_article(1, category.id)">
                    <v-list-item-title>{{ category.category_name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
          <div>
            <v-dialog v-model="dialog" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="add_category_button"
                  color="#1E65DC"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  追加
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">新規カテゴリーを追加する</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <v-subheader>カテゴリー名</v-subheader>
                      </v-col>
                      <v-col cols="9">
                        <v-text-field
                          v-model="category_form.category_name"
                          label="追加したいカテゴリー名"
                          name="category_name"
                          required
                          prepend-inner-icon="mdi-folder-multiple"
                          outlined
                          hide-details=false
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                  <v-btn color="blue darken-1" text @click="add_category()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-col>
        <v-col cols="10" class="article_section">
          <div v-if="show_unread_articles" class="unread-article-list">
            <div v-for="(article, index) in articles" :key="'unread_article' + article.id">
              <div class="article_saved_date" v-if="index == 0">{{dataFormat(article.created_at)}}</div>
              <div v-else>
                <div class="article_saved_date" v-if="sameDate(index)">{{dataFormat(article.created_at)}}</div>
              </div>
              <a :href="article.article_url" @click="article_url_clicked(article.id)">
                <div class="unread-article-item">
                    <div class="image_section">
                      <img class="image_size" border="0" :src="article.og_image_url" :alt="article.title">
                    </div>
                    <div class="article_information">
                      <div class="article_title">{{ article.title }}</div>
                      <div class="article_description"><small>{{ article.article_note }}</small></div>
                    </div>
                </div>  
              </a>
            </div>
          </div>
          <div v-else class="read-article-list">
            <v-row>
              <v-col cols="4" v-for="article in readArticles" :key="'read_article' + article.id">
                <div class="read-article-item">
                  <a :href="article.article_url" @click="article_url_clicked(article.id)">
                    <div class="image_section" style="margin:auto;">
                      <img class="image_size" border="0" :src="article.og_image_url" :alt="article.title">
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
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import EditModal from '@/components/EditModal'
export default {
  components: {
    Header,
    EditModal
  },
  data() {
    return {
      articles: [],
      readArticles: [],
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
    sameDate: function() {
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
    async toggle() {
      this.active = !!this.active
    },
    async fetchArticles(is_read) {
      let test = await this.$axios.$get('/api/v1/already_saved', {
        params: {
          article_url: "https://note.com/komakine/n/n251dc619435c"
        }
      })
      let res = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
        params: {
          is_read: is_read
        }
      })
      if (is_read == 0) {
        this.articles =[]
        this.articles = res
        this.show_unread_articles = true
      } else {
        this.readArticles =[]
        this.readArticles = res
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
    async fetch_categorised_article(is_read, category_id) {
      let res = await this.$axios.$get('/api/v1/categorised_articles', {
        params: {
          is_read: is_read,
          category_id: category_id
        }
      })
      this.articles =[]
      this.articles = res
      this.show_unread_articles = true
    },
    async fetch_read_categorised_article(is_read, category_id) {
      let res = await this.$axios.$get('/api/v1/categorised_articles', {
        params: {
          is_read: is_read,
          category_id: category_id
        }
      })
      this.articles = []
      this.readArticles = []
      this.readArticles = res
      this.show_unread_articles = false
      // console.log(this.show_unread_articles) // falseが700回くらい反応してる
    },
    async fetchCategories() {
      this.categories = await this.$axios.$get('/api/v1/categories')
    },
    async add_category() {
      this.$axios.$post(
        '/api/v1/categories', 
        { category: this.category_form } 
      )
      .then((response) => {
        this.categories.push(response)
        this.dialog = false
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          this.errors = []
          this.errors = error.response.data.messages
        }
      })
    },
    async delete_article(article_id) {
      let article_array = this.readArticles
      await this.$axios.$delete('api/v1/articles/' + article_id )
      article_array.some(function(v, i) {
        if (v.id === article_id) article_array.splice(i,1)
      })
      this.readArticles = article_array
    }
  }
}
</script>

<style scoped>
.body-contents {
  background-color: #fafafa;
}

.wrapper {
  display: flex;
}

.v-list {
  padding: 0px;
  background-color: #fafafa;
}

.v-list-item__icon {
  margin-right: 12px;
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

.add_category_button {
  margin-right: 16px;
  width: 100%;
}

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
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.article_section .col {
  padding-top: 0px;
}

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

.v-card {
  padding: 16px 32px;
}

.headline {
  margin: 18px auto;
  font-weight: 700;
}

</style>