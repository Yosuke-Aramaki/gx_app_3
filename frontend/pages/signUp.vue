<template>
  <div>
    <div class="section-logo">

    </div>
    <div class="box-frame">
      <p class="error">{{ this.errors }}</p>
      <div class="box-frame-title">
        <h2>アカウントを作成</h2>
      </div>
      <form @submit.prevent="signup">
        <input class="form-field" type="text" v-model="form.name" placeholder="name" name="name"/>
        <input class="form-field" type="text" v-model="form.email" placeholder="email" name="email"/>
        <input class="form-field" type="password" v-model="form.password" placeholder="password" name="password"/>
        <input class="form-field" type="password" v-model="form.password_confirmation" placeholder="password_confirmation" name="password_confirmation"/>
        <button class="form-button" type="submit">アカウントの作成</button>
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
    errors: '',
  }),
  computed: {
  },
  methods: {
    async signup () {
      this.$axios.$post(
        '/api/v1/users', 
        {user: this.form }
      )
      .then(async (response) => {
        this.$store.dispatch('auth/set_user_token', response )
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

<style scoped>
.section-logo {
  margin: 20px 0px;
  text-align: center;
}

.box-frame {
  width: 400px;
  margin: 0 auto;
  padding: 25px 40px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
}

.box-frame-title h2 {
  margin-top: 4px;
  margin-bottom: 35px;
}

.form-field {
  width: 100%;
  font-size: 13px;
  height: 40px;
  padding-left: 8px;
  margin-bottom: 20px;
  background-color: #FAFBFC;
  border: 2px solid #DFE1E6;
  box-sizing: border-box;
  border-radius: 4px;
}

.form-button {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  box-sizing: border-box;
  display: inline-block;
  border-radius: 8px;
  border: 0;      
  cursor: pointer;
  padding: auto 18px;
  background: #1E65DC;
  color: #ffffff;
  transition: .2s;
  /* box-shadow: 6px 6px 3px #666666;   */
  /* border: 2px solid #ffffff;  */
}

.form-button:hover {
  background: #7aa3eb;
}

.error {
  font-size: 12px;
  color: #FF954A;
}
</style>