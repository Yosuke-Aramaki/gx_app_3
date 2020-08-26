<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="#1E65DC"
        dark
        v-bind="attrs"
        v-on="on"
      >
        リマインドを追加
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <p class="headline">リマインドの時間を設定する</p>
      </v-card-title>
      <v-card-text>
        <div v-if="!notificationAllowance">
          <p>
            ブラウザの通知が許可されていません。
            <span @click="allowNotification()">こちら</span>
            から許可設定してください
          </p>
        </div>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-subheader>時間</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-select
                v-model="form.remind_time"
                :items="items"
                label=""
                prepend-inner-icon="mdi-alarm"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-item-group v-model="form.day_of_the_week" multiple>
            <v-row>
              <v-col cols="3">
                <v-subheader>曜日</v-subheader>
              </v-col>
              <v-col cols="9" :class="`d-flex justify-space-around`">
                <v-item
                  v-for="n in 6"
                  :key="n"
                  v-slot:default="{ active, toggle }"
                >
                  <v-btn
                    active-class="purple--text"
                    :input-value="active"
                    @click="toggle"
                    fab
                    small
                  >
                    {{ dayOfTheWeek[n] }}
                  </v-btn>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-container>
      </v-card-text>
              
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="setRemind()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- vuetify使わないモーダル -->
  <!-- <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <p>リマインドの時間を指定する</p>
          <div v-if="!!notificationAllowance">
            <p>ブラウザの通知が許可されていません。こちらから許可設定してください</p>
            <button @click="allowNotification()">通知を許可する</button>
          </div>
            <p>{{ this.notificationAllowance }}</p>
          <form @submit.prevent="setRemind">
            <input type="time" v-model="form.remind_time" placeholder="remind time" name="remind_time" />
            <br />
            <input type="checkbox" id="0" value="0" v-model="form.day_of_the_week">
            <label for="0">日</label>
            <input type="checkbox" id="1" value="1" v-model="form.day_of_the_week">
            <label for="1">月</label>
            <input type="checkbox" id="2" value="2" v-model="form.day_of_the_week">
            <label for="2">火</label>
            <input type="checkbox" id="3" value="3" v-model="form.day_of_the_week">
            <label for="3">水</label>
            <input type="checkbox" id="4" value="4" v-model="form.day_of_the_week">
            <label for="4">木</label>
            <input type="checkbox" id="5" value="5" v-model="form.day_of_the_week">
            <label for="5">金</label>
            <input type="checkbox" id="6" value="6" v-model="form.day_of_the_week">
            <label for="6">土</label>
            <br />
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
        day_of_the_week: [],
        remind_time: ''
      },
      checkDayOfTheWeek: [],
      dayOfTheWeek: ["日", "月", "火", "水", "木", "金", "土"],
      items: [
        "00:00", "00:10", "00:20", "00:30", "00:40", "00:50", 
        "01:00", "01:10", "01:20", "01:30", "01:40", "01:50", 
        "02:00", "02:10", "02:20", "02:30", "02:40", "02:50", 
        "04:00", "04:10", "04:20", "04:30", "04:40", "04:50", 
        "05:00", "05:10", "05:20", "05:30", "05:40", "05:50", 
        "06:00", "06:10", "06:20", "06:30", "06:40", "06:50",
        "07:00", "07:10", "07:20", "07:30", "07:40", "07:50",
        "08:00", "08:10", "08:20", "08:30", "08:40", "08:50",
        "09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
        "10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
        "11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
        "12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
        "13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
        "14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
        "15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
        "16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
        "17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
        "18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
        "19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
        "20:00", "20:10", "20:20", "20:30", "20:40", "20:50",
        "21:00", "21:10", "21:20", "21:30", "21:40", "21:50",
        "22:00", "22:10", "22:20", "22:30", "22:40", "22:50",
        "23:00", "23:10", "23:20", "23:30", "23:40", "23:50",
      ],
      dialog: false,
      errors: '',
      notificationAllowance: true,
    }
  },
  created() {
    this.checkNotification()
    this.fetchReminds()
  },
  computed: {
  },
  methods: {
    async checkNotification() {
      // ブラウザが通知をサポートしているか確認
      if (!('Notification' in window)) {
        alert('通知設定が未対応のブラウザです');
      } else {
        // ブラウザが通知を許可しているか確認
        this.$OneSignal.push(() => {
          this.$OneSignal.isPushNotificationsEnabled(async (isEnabled) => {
            if (isEnabled) {
              console.log('Push notifications are enabled!')
              return 
            } else {
              console.log('Push notifications are not enabled yet.')
              return this.notificationAllowance = false;
            }
          })
        })
      }
    },
    async fetchReminds() {
      this.reminds = await this.$axios.$get('/api/v1/reminds')
      for (let i = 0; i < this.reminds.length; i++) {
        this.form.day_of_the_week.push(this.reminds[i].day_of_the_week)
      }
      this.checkDayOfTheWeek = this.form.day_of_the_week
      this.form.remind_time  = await this.$axios.$get('/api/v1/get_remind_time')
    },
    async allowNotification() {
      // 通知を許可するポップアップを生成
      Notification.requestPermission().then((permission) => {
        if (permission == 'granted') { // 通知が許可された場合
          
        } else if (permission == 'denied') {
          
        } else if (permission == 'default') {
          
        }
      });
    },
    async setRemind() {
      // OneSignalのタグを設定する
      this.$OneSignal.push(['sendTag', 'customId', this.$cookies.get('user_id'), function(tagsSent) {
      }]); 
      // 繰り返し処理で１つずつ曜日と時間を保存していく
      for (let i = 0; i < this.form.day_of_the_week.length; i++ ) {
        await this.$axios.$post(
          '/api/v1/check_reminds', 
          { remind: { day_of_the_week: this.form.day_of_the_week[i], remind_time: this.form.remind_time }} 
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

.v-select__selections {
  margin: auto;
}

.sample {
  background: #000000;
}

/* vuetify使わないモーダル 参考　https://cr-vue.mio3io.com/examples/modal.html */
/* .modal-overlay {
  display: flex;
  transform: scale(1);
  transition: opacity 0.5s;
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
} */

</style>
