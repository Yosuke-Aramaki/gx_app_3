<template>
  <div class="error_setion">
    <div v-for="(message, index) in messages" :key="index">
      <p class="error_style">{{ message[0] }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['messages']
}
</script>
<style scoped>
.error_setion {
  text-align: center;
}

.error_style {
  font-size: 18px;
  font-weight: 500;
  color: #FF954A;
}
</style>