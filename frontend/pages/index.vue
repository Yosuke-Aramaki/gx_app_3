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
  methods: {
    signup () {
      const user = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        password_confirmation: this.form.password_confirmation
      }
      this.$axios.$post('/api/v1/users', {user: this.form }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>