<template>
  <div>
    <button
      @click="getMsg"
    >
      Hello
    </button>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data: () => ({
    msg: ''
  }),
  methods: {
    getMsg () {
      this.$axios.$get('/api/users').then(res => (this.msg = res.msg))
    }
  }
}
</script>