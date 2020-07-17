<template>
  <div>
    <nuxt-link to="/sign_up" no-prefetch>
      <p>ユーザー登録</p>
    </nuxt-link>
    <nuxt-link to="/login" no-prefetch>
      <p>ユーザー登録</p>
    </nuxt-link>
    <div v-if="hasCookies">
      <button @click="logout">logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form_login: {
      email: '',
      password: ''
    },
    errors: '',
  }),
  computed: {
    hasCookies: function() {
      return !!this.$cookies.get('user_id')
    }
  },
  methods: {
    async login () {
      this.$axios.$post('/api/v1/login', {session: this.form_login }).then((response) => {
        this.$store.dispatch('auth/login', res )
      })
    },
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
