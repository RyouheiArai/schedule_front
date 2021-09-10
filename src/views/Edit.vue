<template>
  <div id="app">
    <p>
      予定：
      <input
        type="text"
        name="scheduleName"
        v-model="scheduleName"
        v-bind:class="{ 'alert-color': !validate }"
        value
        size="40"
        placeholder="予定を入力してください※必須"
      />
    </p>
    <p>
      日付：
      <input
        type="date"
        name="scheduleDate"
        v-model="scheduleDay"
        value
        size="40"
      />
    </p>
    <p>
      開始時間：
      <input
        type="time"
        name="scheduleStartTime"
        v-model="scheduleStartTime"
        value
        size="40"
      />
    </p>
    <p>
      終了時間：
      <input
        type="time"
        name="scheduleEndTime"
        v-model="scheduleEndTime"
        value
        size="40"
      />
    </p>

    <!-- 変更ボタン -->
    <button v-on:click="doChangeschedule" v-bind:disabled="!isEntered">
      変更
    </button>
    <!-- 削除ボタン -->
    <button v-on:click="doDeleteschedule">削除</button>

    <hr />
  </div>
</template>

<script>
export default {
  // 「el」プロパティーで、Vueの表示を反映する場所＝HTML要素のセレクター（id）を定義
  //el: "#app",
  // data オブジェクトのプロパティの値を変更すると、ビューが反応し、新しい値に一致するように更新
  data() {
    return {
      // スケジュールID
      schedulesId: "",
      // スケジュール名
      scheduleName: "",
      // 日付
      scheduleDay: "",
      // スケジュール開始時間
      scheduleStartTime: "",
      // スケジュール終了時間
      scheduleEndTime: "",
      // スケジュールの状態
      current: -1,
      // true：入力済・false：未入力
      isEntered: false,
    };
  },
  // 算出プロパティ
  computed: {
    // 入力チェック
    validate() {
      var isEnteredscheduleName = 0 < this.scheduleName.length;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isEntered = isEnteredscheduleName;
      return isEnteredscheduleName;
    },
  },
  created() {
    // 日付をカレンダーのクリックした日付から受け取る
    if (this.$route.params.id != null) {
      var startDate = this.$route.params.start;
      var endDate = this.$route.params.end;

      // 開始日付取得
      var startYear = startDate.getFullYear();
      var startMonth = ("0" + (startDate.getMonth() + 1)).slice(-2);
      var startDay = ("0" + startDate.getDate()).slice(-2);
      // 開始時間取得
      var startHour = ("0" + startDate.getHours()).slice(-2);
      var startMinute = ("0" + startDate.getMinutes()).slice(-2);
      // 終了時間取得
      var endHour = ("0" + endDate.getHours()).slice(-2);
      var endMinute = ("0" + endDate.getMinutes()).slice(-2);

      this.schedulesId = this.$route.params.id;
      this.scheduleName = this.$route.params.title;
      this.scheduleDay = startYear + "-" + startMonth + "-" + startDay;
      this.scheduleStartTime = startHour + ":" + startMinute;
      this.scheduleEndTime = endHour + ":" + endMinute;
    }
  },
  methods: {
    // スケジュールを変更する
    doChangeschedule() {
      var scheduleSeconds = ":00";
      var space = " ";

      // サーバへ送信するパラメータ
      const params = new URLSearchParams();
      params.append("scheduleId", this.schedulesId);
      params.append("scheduleName", this.scheduleName);
      params.append("scheduleMemo", this.scheduleMemo);
      params.append(
        "scheduleStartDate",
        this.scheduleDay + space + this.scheduleStartTime + scheduleSeconds
      );
      params.append(
        "scheduleEndDate",
        this.scheduleDay + space + this.scheduleEndTime + scheduleSeconds
      );

      this.axios
        .post(process.env.VUE_APP_API_ENDPOINT + "/changeschedule", params)
        .then((response) => {
          if (response.status != 200) {
            throw new Error("レスポンスエラー");
          } else {
            this.$router.push({
              name: "Home",
            });
          }
        });
    },
    // スケジュールを削除する
    doDeleteschedule() {
      // サーバへ送信するパラメータ
      const params = new URLSearchParams();
      params.append("scheduleId", this.schedulesId);

      this.axios
        .post(process.env.VUE_APP_API_ENDPOINT + "/deleteschedule", params)
        .then((response) => {
          if (response.status != 200) {
            throw new Error("レスポンスエラー");
          } else {
            this.$router.push({
              name: "Home",
            });
          }
        });
    },
  },
};
</script>
