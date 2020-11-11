<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="3">
        <nuxt-link to="/" no-prefetch>
        <h1><img src="/images/leo_icon_header.png" class="logo" /></h1>
        </nuxt-link>
      </v-col>
      <v-col cols="5">
        <nav>
          <div v-if="hasCookies">
            <!-- <RemindModal /> -->
            <AddArticleModal
              @listener_for_add_article="$listeners['add_article_from_modal']" />
            <v-menu 
              transition="slide-x-transition"
              offset-y
              left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon 
                    color="#1E65DC"
                    large
                  >
                    mdi-account-circle
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <div class="button--blue" @click="logout">ログアウト</div>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div v-else>
            <nuxt-link to="/signup" class="button--blue" no-prefetch
              >ユーザー登録</nuxt-link
            >
            <nuxt-link to="/signin" class="button--blue" no-prefetch
              >ログイン</nuxt-link
            >
          </div>
        </nav>
      </v-col>
    </v-row>
  </v-container>
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
    }
  },
  computed: {
    hasCookies: function() {
      return !!this.$cookies.get('token')
    }
  },
  methods: {
    async logout() {
      try {
        this.$axios.$post(
          '/api/v1/logout'
        )
        .then((response) => {
          this.$cookies.remove('token')
          location.replace('/')
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
header {
  width: 100%;
  display: flex;
  padding: 16px;
  text-align: center;
  justify-content: center;
}

h1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
}

.logo {
  padding-left: 12px;
  height: 35px;
  vertical-align: middle;
}

/* v-elseのクラス名がわからないためcol-5で指定 */
.col-5 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

nav {
  text-align: right;
}

.header-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button--blue {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #1E65DC;
  color: #1E65DC;
  text-decoration: none;
  padding: 5px 10px;
  margin-left: 15px;
  vertical-align: middle;
}

.button--blue:hover {
  color: #fff;
  background-color: #1E65DC;
}

.document {
  font-size: 15px;
  font-weight: 600;
  color: blue;
  text-decoration: underline;
}

p {
  font-size: 13px;
  padding-left: 3%;
}

a {
  text-decoration: none;
  color: black;
}
</style>