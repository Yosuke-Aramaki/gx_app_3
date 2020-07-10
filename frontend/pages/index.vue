<template>
  <div>
    <div class="signup-form">
      <form @submit.prevent="signup">
        <p><input type="text" v-model="form.name" placeholder="name" name="name"/></p>
        <p><input type="text" v-model="form.email" placeholder="email" name="email"/></p>
        <p><input type="password" v-model="form.password" placeholder="password" name="password"/></p>
        <p><input type="password" v-model="form.password_confirmation" placeholder="password_confirmation" name="password_confirmation"/></p>
        <div class="signup-btn">
          <button type="submit">signup</button>
        </div>
      </form>
      <form @submit.prevent="login">
        <p><input type="text" v-model="form_login.email" placeholder="email" name="email"/></p>
        <p><input type="password" v-model="form_login.password" placeholder="password" name="password"/></p>
        <div class="login-btn">
          <button type="submit">login</button>
        </div>
      </form>
    </div>
    <div v-if="hasCookies">
      <button @click="logout">logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    },
    form_login: {
      email: '',
      password: ''
    },
  }),
  computed: {
    hasCookies: function() {
      return !!this.$cookies.get('user_id')
    }
  },
  methods: {
    async signup () {
      this.$axios.$post('/api/v1/users', {user: this.form }).then((res) => {
        this.$store.dispatch('auth/signup', res )
      })
    },
    async login () {
      this.$axios.$post('/api/v1/login', {session: this.form_login }).then((res) => {
        console.log(res)
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
