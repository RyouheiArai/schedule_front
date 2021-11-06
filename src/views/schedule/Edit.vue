<template>
  <v-main>
    <v-container>
      <v-row
        class="text-center"
        align="center"
        justify="center">
        <v-col
          class="mb-4"
          cols="12"
          sm="8"
          md="4">
          <v-toolbar
            color="primary"
            dark>
            <v-toolbar-title>予定編集</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-form>
              <v-col>
                <v-text-field
                  v-model="scheduleName"
                  label="予定"
                  type="text"
                  name="scheduleName"
                  :class="{ 'alert-color': !validate }"
                  value
                  placeholder="予定を入力してください※必須" />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="scheduleDay"
                  label="日付"
                  type="date"
                  name="scheduleDate"
                  value />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="scheduleStartTime"
                  label="開始時間"
                  type="time"
                  name="scheduleStartTime"
                  value />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="scheduleEndTime"
                  label="終了時間"
                  type="time"
                  name="scheduleEndTime"
                  :error-messages="endTimeErrors"
                  value />
              </v-col>
              <v-col>
                <v-btn
                  :disabled="!isEntered || !isEndtimeBefore"
                  @click="doChangeschedule">
                  変更
                </v-btn>
                <v-btn
                  @click="doDeleteschedule">
                  削除
                </v-btn>
              </v-col>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { SPACE, SECONDS} from '@/util';

export default {
  // 「el」プロパティーで、Vueの表示を反映する場所＝HTML要素のセレクター（id）を定義
  //el: "#app",
  // data オブジェクトのプロパティの値を変更すると、ビューが反応し、新しい値に一致するように更新
  data() {
    return {
      // スケジュールID
      schedulesId: 0,
      // スケジュール名
      scheduleName: '',
      // 日付
      scheduleDay: '',
      // スケジュール開始時間
      scheduleStartTime: '',
      // スケジュール終了時間
      scheduleEndTime: '',
      // true：入力済・false：未入力
      isEntered: false,
      // true：開始時間より後・false：開始時間より前
      isEndtimeBefore: false,
    }
  },
  // 算出プロパティ
  computed: {
    // 入力チェック
    endTimeErrors() {
      const errors = [];
      // parse()でDateオブジェクトに変換
      let StartDateTime = Date.parse(this.scheduleDay + SPACE + this.scheduleStartTime + SECONDS);
      let EndDateTime = Date.parse(this.scheduleDay + SPACE + this.scheduleEndTime + SECONDS);

      if (EndDateTime < StartDateTime) {
        errors.push('開始日時より前です');
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isEndtimeBefore = false;
        
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isEndtimeBefore = true;
      }
      
      return errors;
    },
    // 入力チェック
    validate() {
      let isEnteredscheduleName = 0 < this.scheduleName.length;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isEntered = isEnteredscheduleName;
      return isEnteredscheduleName;
    },
  },
  created() {
    // 日付をカレンダーのクリックした日付から受け取る
    if (this.$route.params.id != null) {
      let startDate = this.$route.params.start
      let endDate = this.$route.params.end

      // 開始日付取得
      let startYear = startDate.getFullYear()
      let startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2)
      let startDay = ('0' + startDate.getDate()).slice(-2)
      // 開始時間取得
      let startHour = ('0' + startDate.getHours()).slice(-2)
      let startMinute = ('0' + startDate.getMinutes()).slice(-2)
      // 終了時間取得
      let endHour = ('0' + endDate.getHours()).slice(-2)
      let endMinute = ('0' + endDate.getMinutes()).slice(-2)

      this.schedulesId = parseInt(this.$route.params.id, 10)
      this.scheduleName = this.$route.params.title
      this.scheduleDay = startYear + '-' + startMonth + '-' + startDay
      this.scheduleStartTime = startHour + ':' + startMinute
      this.scheduleEndTime = endHour + ':' + endMinute
    }
  },
  methods: {
    // スケジュールを変更する
    doChangeschedule() {
			
      this.axios
        .post('/changeschedule', {
          id: this.schedulesId,
          tsak: this.scheduleName,
          start_date: this.scheduleDay + SPACE + this.scheduleStartTime + SECONDS,
          end_date: this.scheduleDay + SPACE + this.scheduleEndTime + SECONDS,
        })
        .then((response) => {
          if (response.status != 200) {
            // todo エラーハンドリングする
            throw new Error('レスポンスエラー')
          } else {
            this.$router.push({
              name: 'Home',
            })
          }
        })
    },
    // スケジュールを削除する
    doDeleteschedule() {
      this.axios
        .post('/deleteschedule', {
          id: this.schedulesId
        })
        .then((response) => {
          if (response.status != 200) {
            // todo エラーハンドリングする
            throw new Error('レスポンスエラー')
          } else {
            this.$router.push({
              name: 'Home',
            })
          }
        })
    },
  },
}
</script>
