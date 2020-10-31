<template>
  <div class="error_setion">
    <p class="error_style">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: ['message']
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