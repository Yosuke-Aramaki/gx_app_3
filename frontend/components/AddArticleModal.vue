<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <p>記事を追加する</p>
          <form @submit.prevent="add_article">
            <input type="text" v-model="form.article_url" placeholder="article url" name="article_url" />
            <br />
            <label><input type="radio" v-model="form.is_read" value="0">あとで読む</label>
            <label><input type="radio" v-model="form.is_read" value="1">読んだ</label>
            <br />
            <textarea type="text" v-model="form.article_note" placeholder="article note" name="article_note"></textarea>
            <br />
            <select v-model="selected">
              <option v-for="category in categories" v-bind:value="category.id" :key="category.id">
                {{ category.category_name }}
              </option>
            </select>
            <button type="submit">追加</button>
          </form>
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="$emit('close')">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      form: {
        article_url: '',
        article_note: '',
        is_read: '',
        category_id: ''
      },
      selected: 1,
      categories: [],
      errors: '',
    }
  },
  created() {
    this.fetch_categories()
  },
  methods: {
    async fetch_categories() {
      let res = await this.$axios.$get('/api/v1/categories')
      this.categories = res
      this.categories.unshift({ id: 1, category_name: "カテゴリーを追加しない" })
    },
    async add_article() {
      // カテゴリー指定がない場合はcategory_idを1に指定する カテゴリーの扱いは要検討
      this.form.category_id = this.selected
      
      await this.$axios.$post(
        '/api/v1/save_article_from_url', 
        { article: this.form } 
      )
      .then((response) => {
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
/* 参考　https://cr-vue.mio3io.com/examples/modal.html */
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.modal-content {
  padding: 10px 20px;
}

.modal-footer {
  background: #ccc;
  padding: 10px;
  text-align: right;
}

</style>