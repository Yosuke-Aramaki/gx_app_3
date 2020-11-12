<template>
  <div class="term_setion">
    <div class="footer_style">
      <nuxt-link to="/terms" no-prefetch>利用規約</nuxt-link> / 
      <a href="https://www.gaiax.co.jp/policy/" target="_blank">プライバシーポリシー</a> / 
      <a href="https://www.gaiax.co.jp/individual/" target="_blank">個人情報保護方針</a>   
    </div>
    <div class="service-name">@2020 leo(beta). All right reserved</div>
  </div>
</template>

<style scoped>
.term_setion {
  margin-top: 20px;
  margin-bottom: 8px; 
  text-align: center;
}

a {
  color: #1E65DC;
}

.footer_style {
  font-size: 16px;
  font-weight: 600;
}

.service-name {
  font-weight: 500;
}

</style>