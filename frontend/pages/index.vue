<template>
  <div>
    <div v-if="!hasCookies" class="signup-form">
      <form @submit.prevent="signup">
        <p><input type="text" v-model="form.name" placeholder="name" name="name"/></p>
        <p><input type="text" v-model="form.email" placeholder="email" name="email"/></p>
        <p><input type="password" v-model="form.password" placeholder="password" name="password"/></p>
        <p><input type="password" v-model="form.password_confirmation" placeholder="password_confirmation" name="password_confirmation"/></p>
        <div class="signup-btn">
          <button type="submit">signup</button>
        </div>
      </form>
    </div>
    <div v-else>
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
  }),
  computed: {
    hasCookies: function() {
      return !!this.$cookies.get('user_id')
    }
  },
  methods: {
    signup () {
      this.$axios.$post('/api/v1/users', {user: this.form }).then((res) => {
        this.$store.dispatch('auth/sign_up', res )
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
