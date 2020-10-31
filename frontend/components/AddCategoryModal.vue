<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="add_category_button"
          color="#1E65DC"
          dark
          v-bind="attrs"
          v-on="on"
        >
          追加
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">新規カテゴリーを追加する</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <Error :message="this.errors" />
            <v-row>
              <v-col cols="3">
                <v-subheader>カテゴリー名</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  v-model="category_form.category_name"
                  label="追加したいカテゴリー名"
                  name="category_name"
                  required
                  prepend-inner-icon="mdi-folder-multiple"
                  outlined
                  hide-details=false
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="add_category()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex';
import Error from '@/components/error'

export default {
  components: {
    Error
  },
  data() {
    return {
      errors: '',
      dialog: false,
      category_form: {
        category_name: ''
      },
    }
  },

  methods: {
    async add_category() {
      this.$axios.$post(
        '/api/v1/categories', 
        { category: this.category_form } 
      )
      .then((response) => {
        this.$emit('send_category', response);
        this.dialog = false
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log(error.response.data.messages)
          this.errors = []
          this.errors = error.response.data.messages
        }
      })
    },
  }
}
</script>

<style scoped>
.v-card {
  padding: 16px 32px;
}

.headline {
  margin: 18px auto;
  font-weight: 700;
}

.add_category_button {
  margin-right: 16px;
  width: 100%;
}
</style>