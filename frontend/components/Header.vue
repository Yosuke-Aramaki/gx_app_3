<template>
  <header>
    <nuxt-link to="/" no-prefetch>
      <h1><img src="" class="logo" />GX_APP_3</h1>
    </nuxt-link>
    <nav>
      <div v-if="hasCookies">
        <div class="button--grey" @click="logout">ログアウト</div>
      </div>
      <div v-else>
        <nuxt-link to="/sign_up" class="button--grey" no-prefetch
          >ユーザー登録</nuxt-link
        >
        <nuxt-link to="/login" class="button--grey" no-prefetch
          >ログイン</nuxt-link
        >
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      viewSignout: false
    }
  },
  computed: {
    hasCookies: function() {
      return !!this.$cookies.get('user_id')
    }
  },
  methods: {
    async logout() {
      try {
        this.$cookies.remove('user_id')
        location.replace('/')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 16px;
  line-height: 1.5;
  background-color: white;
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
  margin-left: auto;
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