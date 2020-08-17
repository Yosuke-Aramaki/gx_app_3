<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <p>リマインドの時間を指定する</p>
          <div v-if="!!notificationAllowed">
            <p>ブラウザの通知が許可されていません。こちらから許可設定してください</p>
            <button @click="allowNotification()">通知を許可する</button>
          </div>
            <p>{{ this.notificationAllowed }}</p>
          <form @submit.prevent="set_remind">
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
  </transition>
</template>

<script>
export default {
  data() {
    return {
      form: {
        day_of_the_week: [],
        remind_time: ''
      },
      selected: 1,
      reminds: [],
      errors: '',
      notificationAllowance: true,
    }
  },
  created() {
    this.check_notification()
    // this.fetch_remindss()
  },
  computed: {
    notificationAllowed: function() {
      
    }
  },
  methods: {
    async check_notification() {
      // ブラウザが通知をサポートしているか確認
      if (!('Notification' in window)) {
        alert('未対応のブラウザです');
      } else {
        this.$OneSignal.push(() => {
          this.$OneSignal.isPushNotificationsEnabled(async (isEnabled) => {
            if (isEnabled) {
              console.log('Push notifications are enabled!')
              return 
            } else {
              console.log('Push notifications are not enabled yet.')
              return this.notificationAllowed = false;
            }
          })
        })
      }
    },
    async fetch_remindss() {
      let res = await this.$axios.$get('/api/v1/reminds')
      this.reminds = res
      for (let i = 0; i < this.reminds.length; i++) {
        this.form.day_of_the_week.push(this.reminds[i].day_of_the_week)
      }
      this.form.remind_time = this.reminds[0].remind_time
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
    async set_remind() {
      // 繰り返し処理で１つずつ曜日と時間を保存していく
      for (let i = 0; i < this.form.day_of_the_week.length; i++ ) {
        await this.$axios.$post(
          '/api/v1/reminds', 
          { remind: { day_of_the_week: this.form.day_of_the_week[i], remind_time: this.form.remind_time }} 
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