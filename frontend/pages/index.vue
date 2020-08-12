<template>
  <div>
    <Header />
    <p>{{ this.errors }}</p>
    <button @click="notifyMe()">Notify me!</button>
    <div class="wrapper">
      <div class="category_section">
        <p>あとで読む</p>
        <div class="category-list" v-for="category in categories" :key="'category' + category.id">
          <p @click="fetch_categorised_article(0, category.id)">{{ category.category_name }}</p>
        </div>
        <p>-------------</p>
        <p>読んだ</p>
        <div class="category-list" v-for="category in categories" :key="'category' + category.id">
          <p @click="fetch_read_categorised_article(1, category.id)">{{ category.category_name }}</p>
        </div>
        <div>
          <input type="text" v-model="category_form.category_name" placeholder="category name" name="category_name"/>
          <button type="submit" @click="add_category()">カテゴリーを追加</button>
        </div>
      </div>
      <div class="article_section">
        <div v-if="show_unread_articles" class="unread-article-list">
          <div v-for="article in articles" :key="article.id">
            <div class="unread-article-item">
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
        <div v-else class="read-article-list">
          <div v-for="article in read_articles" :key="article.id">
            <div class="read-article-item">
              <p>{{ article.title }}</p>
              <div class="image_section">
                <img class="image_size" border="0" :src="article.og_image_url" :alt="article.title">
              </div>
              <div class="article_information">
                <p><small>{{ article.article_note }}</small></p>
                <p><a :href="article.article_url" @click="article_url_clicked(article.id)">{{ article.article_url }}</a></p>
              </div>
            </div>
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
      read_articles: [],
      categories: [],
      category_form: {
        category_name: ''
      },
      errors: '',
      show_unread_articles: true,
    }
  },
  created() {
    this.enable_notification()
    // this.fetch_articles(),
    // this.fetch_categories()
  },
  computed: {
  },
  methods: {
    async notifyMe() {
      // ブラウザが通知をサポートしているか確認
      // if (!('Notification' in window)) {
      //   alert('未対応のブラウザです');
      // }
      // else {
      //   // 通知を許可するポップアップを生成
      //   Notification.requestPermission()
      //     .then((permission) => {
      //       if (permission == 'granted') {
      //         // 許可
      //         console.log(1)
      //       } else if (permission == 'denied') {
      //         // 拒否
      //       } else if (permission == 'default') {
      //         // 無視
      //       }
      //     });
      // }
      console.log(1)
      this.$OneSignal.push(['sendTag', 'customId', 1, function(tagsSent) {
        console.log(1)
      }]); 
      this.$OneSignal.push(() => {
        console.log(1)
        this.$OneSignal.on('subscriptionChange', function (isSubscribed) {
          console.log(1)
          console.log(isSubscribed)
                  if (isSubscribed == true) {
                      this.$OneSignal.setExternalUserId(this.$cookies.get('user_id'));
                      this.$OneSignal.getExternalUserId().then(function (id) {
                        console.log(id)
                      });
                  } else if (isSubscribed == false) {
                      this.$OneSignal.removeExternalUserId();
                  }
              });
      })
    },
    async enable_notification() {
      this.$OneSignal.push(() => {
        this.$OneSignal.getUserId(function(userId) {
          console.log("OneSignal User ID:", userId);
          // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316    
        });
        this.$OneSignal.push(["getNotificationPermission", function(permission) {
            console.log("Site Notification Permission:", permission);
            // (Output) Site Notification Permission: default
        }]);
        this.$OneSignal.on('permissionPromptDisplay', function () {
          console.log("The prompt displayed");
        });
        this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
          if (isEnabled) {
            console.log('Push notifications are enabled!')
          } else {
            console.log('Push notifications are not enabled yet.')
          }
        })
      console.log(1)
      })
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
    async fetch_categorised_article(is_read, category_id) {
      let res = await this.$axios.$get('/api/v1/categorised_articles', {
        params: {
          is_read: is_read,
          category_id: category_id
        }
      })
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

.article_section {
  width: 80%;
}

.unread-article-item {
  display: flex;
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

.read-article-list {
  display: flex;
  flex-wrap: wrap;
}

.read-article-item {
  margin-left: 1.25%;
  width: 360px;
  border: 1px solid #000;
}

.read-article-list .image_size {
  width: 190px;
  height: 100px;
}

.read-article-list .image_section {
  width: 190px;
  height: 100px;
}

</style>