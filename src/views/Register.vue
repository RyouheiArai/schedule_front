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

    <!-- 追加ボタン -->
    <button v-on:click="doAddschedule" v-bind:disabled="!isEntered">
      登録
    </button>
    <!-- 水平線 -->
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
      if (
        0 < this.scheduleName.length &&
        0 < this.scheduleStartTime.length &&
        0 < this.scheduleEndTime.length
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isEntered = true;
      }
      return this.isEntered;
    },
  },
  created() {
    // 日付をカレンダーのクリックした日付から受け取る

    if (this.$route.params.date != null) {
      var startDate = this.$route.params.date;
      // 開始日付取得
      var startYear = startDate.getFullYear();
      var startMonth = ("0" + (startDate.getMonth() + 1)).slice(-2);
      var startDay = ("0" + startDate.getDate()).slice(-2);
      // 開始時間取得
      var startHour = ("0" + startDate.getHours()).slice(-2);
      var startMinute = ("0" + startDate.getMinutes()).slice(-2);

      this.scheduleDay = startYear + "-" + startMonth + "-" + startDay;
      this.scheduleStartTime = startHour + ":" + startMinute;
    } else {
      var now = new Date();
      var year = now.getFullYear();
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var day = ("0" + now.getDate()).slice(-2);
      this.scheduleDay = year + "-" + month + "-" + day;
    }
  },
  methods: {
    // スケジュールを登録する
    doAddschedule() {
      var scheduleSeconds = ":00";
      var space = " ";

      // サーバへ送信するパラメータ
      const params = new URLSearchParams();
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
        .post(process.env.VUE_APP_API_ENDPOINT + "/addschedule", params)
        .then((response) => {
          if (response.status != 200) {
            throw new Error("レスポンスエラー");
          } else {
            this.$router.push({
              name: "Home",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
