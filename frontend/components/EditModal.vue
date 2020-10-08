<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-icon 
        v-bind="attrs"
        v-on="on"
        @click="beforeUpdate()"
        small 
        class="article_footer_button"
      >
        mdi-circle-edit-outline
      </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <p class="headline">編集する</p>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-subheader>タイトル</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="form.title"
                outlined
                hide-details=false
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-subheader>メモ</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-textarea
                v-model="form.article_note"
                solo
                hide-details=false
              ></v-textarea>
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
        <v-btn color="blue darken-1" text @click="save_article()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: ['form'],
  data() {
    return {
      dialog: false,
      selected: 1,
      categories: [],
      errors: '',
    }
  },
  created() {
  },
  methods: {
    async beforeUpdate() {
      // 未読既読ステータスの変更
      if (this.form.is_read) {
        this.form.is_read = 1
      } else {
        this.form.is_read = 0
      }
      // カテゴリーの取得
      this.categories = await this.$axios.$get('/api/v1/categories')
      this.categories.unshift({ id: 1, category_name: "カテゴリーを追加しない" })
    },
    async save_article() {
      await this.$axios.$put(
        '/api/v1/articles/' + this.form.id , 
        { article: this.form } 
      )
      .then((response) => {
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
  width: 800px;
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