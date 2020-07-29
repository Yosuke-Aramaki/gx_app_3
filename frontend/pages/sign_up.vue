<template>
  <div>
    <p>{{ this.errors }}</p>
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
    errors: '',
  }),
  computed: {
  },
  methods: {
    async signup () {
      await this.$axios.$post(
        '/api/v1/users', 
        {user: this.form }
      )
      .then(async (response) => {
        await this.$store.dispatch('auth/set_user_token', response.data )
        location.replace('/')
        // await this.$router.push('/')
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