<template>
  <div>
    <p>{{ this.errors }}</p>
    <form @submit.prevent="login">
      <p><input type="text" v-model="form_login.email" placeholder="email" name="email"/></p>
      <p><input type="password" v-model="form_login.password" placeholder="password" name="password"/></p>
      <div class="login-btn">
        <button type="submit">login</button>
      </div>
    </form>
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
  methods: {
    async login () {
      this.$axios.$post('api/v1/login', {session: this.form_login })
      .then((response) => {
        this.$store.dispatch('auth/set_user_token', response )
        location.replace('/')
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
