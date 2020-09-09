<template>
  <v-row justify="space-between">
    <v-col cols="3">
      <nuxt-link to="/" no-prefetch>
      <h1><img src="" class="logo" />loe</h1>
      </nuxt-link>
    </v-col>
    <v-col cols="5">
      <nav>
        <div v-if="hasCookies">
          <RemindModal />
          <AddArticleModal />
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
                <div class="button--grey" @click="logout">ログアウト</div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-else>
          <nuxt-link to="/signUp" class="button--grey" no-prefetch
            >ユーザー登録</nuxt-link
          >
          <nuxt-link to="/login" class="button--grey" no-prefetch
            >ログイン</nuxt-link
          >
        </div>
      </nav>
    </v-col>
  </v-row>
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
  line-height: 1.5;
}

h1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
}

.logo {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}

nav {
  text-align: right;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 5px 10px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
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