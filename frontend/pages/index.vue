<template>
  <v-app class="body-contents">
    <Header />
    <p>{{ this.errors }}</p>
    <v-container>
      <v-row justify="center">
        <v-col cols="2" class="category_section">
          <v-list>
            <v-list-item-group v-model="model" mandatory color="indigo">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-wifi</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <div class="category_name" @click="fetchArticles(0)">未読記事</div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-wifi</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <div class="category_name" @click="fetchArticles(1)" style="margin-top: 8px;">既読記事</div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-item-group mandatory>
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? '#5294E2' : '#fafafa'"
                :flat="active ? false : true"
                @click="toggle"
              >
                <div class="category_name" @click="fetchArticles(0)">未読記事</div>
              </v-card>
            </v-item>
            <div class="category-list" v-for="category in categories" :key="'unread_category' + category.id">
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  :color="active ? '#5294E2' : '#fafafa'"
                  :flat="active ? false : true"
                  @click="toggle"
                >
                  <div class="category_name" @click="fetch_categorised_article(0, category.id)">{{ category.category_name }}</div>
                </v-card>
              </v-item>
            </div>
            <hr />
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? '#5294E2' : '#fafafa'"
                :flat="active ? false : true"
                @click="toggle"
              >
                <div class="category_name" @click="fetchArticles(1)" style="margin-top: 8px;">既読記事</div>
              </v-card>
            </v-item>
            <div class="category-list" v-for="category in categories" :key="'read_category' + category.id">
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  :color="active ? '#5294E2' : '#fafafa'"
                  :flat="active ? false : true"
                  @click="toggle"
                >
                  <div class="category_name" @click="fetch_read_categorised_article(1, category.id)">{{ category.category_name }}</div>
                </v-card>
              </v-item>
            </div>
          </v-item-group>
          <div>
            <v-dialog v-model="dialog" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  カテゴリーの追加
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">新規カテゴリーを追加する</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="category_form.category_name"
                    label="追加したいカテゴリー名"
                    name="category_name"
                    required
                  ></v-text-field>
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
                <a :href="article.article_url" @click="article_url_clicked(article.id)">
                  <div class="read-article-item">
                    <div class="image_section" style="margin:auto;">
                      <img class="image_size" border="0" :src="article.og_image_url" :alt="article.title">
                    </div>
                    <div class="article_title">{{ article.title }}</div>
                    <div class="article_read_date"><small>{{dataFormat(article.updated_at)}}</small></div>
                    <div class="article_note">
                      <p><small>{{ article.article_note }}</small></p>
                    </div>
                  </div>
                </a>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
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
      let res = await this.$axios.$get('/api/v1/all_unread_or_read_articles', {
        params: {
          is_read: is_read
        }
      })
      console.log(res)

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

.category-list {
  padding-left: 8px;
}

.category_name {
  margin-bottom: 8px;
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
  height: 360px;
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

</style>