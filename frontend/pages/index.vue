<template>
  <v-app class="body-contents">
    <Header />
    <p>{{ this.errors }}</p>
    <v-container>
      <v-row justify="center">
        <v-col cols="2" class="category_section">
          <v-item-group mandatory>
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? '#5294E2' : '#fafafa'"
                :flat="active ? false : true"
                @click="toggle"
              >
                <div @click="fetch_articles(0)">未読記事</div>
              </v-card>
            </v-item>
            <div class="category-list" v-for="category in categories" :key="'unread_category' + category.id">
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  :color="active ? '#5294E2' : '#fafafa'"
                  :flat="active ? false : true"
                  @click="toggle"
                >
                  <div @click="fetch_categorised_article(0, category.id)">{{ category.category_name }}</div>
                </v-card>
              </v-item>
            </div>
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? '#5294E2' : '#fafafa'"
                :flat="active ? false : true"
                @click="toggle"
              >
                <div @click="fetch_articles(1)">既読記事</div>
              </v-card>
            </v-item>
            <div class="category-list" v-for="category in categories" :key="'read_category' + category.id">
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  :color="active ? '#5294E2' : '#fafafa'"
                  :flat="active ? false : true"
                  @click="toggle"
                >
                  <div @click="fetch_read_categorised_article(1, category.id)">{{ category.category_name }}</div>
                </v-card>
              </v-item>
            </div>
          </v-item-group>
          <div>
            <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
            <button type="submit" @click="add_category()">カテゴリーを追加</button>
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
              <v-col cols="4" v-for="article in read_articles" :key="'read_article' + article.id">
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
      read_articles: [],
      categories: [],
      category_form: {
        category_name: ''
      },
      errors: '',
      show_unread_articles: true,
      active: false,
    }
  },
  created() {
    this.fetch_articles(0),
    this.fetch_categories()
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
    async fetch_articles(is_read) {
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
        this.read_articles =[]
        this.read_articles = res
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
      this.read_articles = []
      this.read_articles = res
      this.show_unread_articles = false
      // console.log(this.show_unread_articles) // falseが700回くらい反応してる
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
        this.categories.push(response)
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

.article_title {
  color: #000000;
  font-weight: 500;
}

.article_description {
  color: #7B7B7B;
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


.article_title {
  overflow: hidden;
  height: 48px;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article_note p {
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