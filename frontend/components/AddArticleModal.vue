<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="#1E65DC"
        dark
        v-bind="attrs"
        v-on="on"
        @click="fetchCategories()"
      >
        記事を追加
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <p class="headline">記事を追加する</p>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-subheader>URL</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="form.article_url"
                label="追加したい記事にURL"
                prepend-inner-icon="mdi-link-variant"
                outlined
                hide-details=false
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-subheader>ステータス</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-chip-group
                column
                v-model="form.is_read"
                active-class="primary--text"
              >
                <v-chip>
                  あとで読む
                </v-chip>
                <v-chip>
                  読んだ
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-subheader>カテゴリー</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-select
                :items="categories"
                v-model="form.category_id"
                :item-text="'category_name'"
                :item-value="'id'"
                label="カテゴリーを追加"
                prepend-inner-icon="mdi-folder-multiple"
                hide-details=false
                outlined
              ></v-select>
            </v-col>
          </v-row>
          
        </v-container>
      </v-card-text>
              
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="add_article()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- <transition name="modal" appear>
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
  </transition> -->
</template>

<script>
export default {
  data() {
    return {
      form: {
        article_url: '',
        article_note: '',
        is_read: 0,
        category_id: ''
      },
      dialog: false,
      selected: 1,
      categories: [],
      errors: '',
    }
  },
  created() {
  },
  methods: {
    async fetchCategories() {
      this.categories = await this.$axios.$get('/api/v1/categories')
      console.log(this.categories)
      this.categories.unshift({ id: 1, category_name: "カテゴリーを追加しない" })
    },
    async add_article() {
      // カテゴリー指定がない場合はcategory_idを1に指定する カテゴリーの扱いは要検討
      if (this.form.category_id == "") {
        this.form.category_id = 1
      }
      await this.$axios.$post(
        '/api/v1/save_article_from_url', 
        { article: this.form } 
      )
      .then((response) => {
        this.$emit('add_article', response)
        this.dialog = false
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
.v-card {
  width: 700px;
  padding: 16px 32px;
}

.headline {
  margin: 18px auto;
  font-weight: 700;
}

.v-subheader {
  padding-right: 0px;
}
</style>