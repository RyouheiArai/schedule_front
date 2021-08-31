<template>
  <div id="app">
    <p>
      予定：
      <input
        type="text"
        name="scheduleName"
        v-model="scheduleName"
        v-bind:class="{'alert-color': !validate }"
        value
        size="40"
        placeholder="予定を入力してください※必須"
      />
    </p>
    <p>
      日付：
      <input type="date" name="scheduleDate" v-model="scheduleDay" value size="40" />
    </p>
    <p>
      開始時間：
      <input type="time" name="scheduleStartTime" v-model="scheduleStartTime" value size="40" />
    </p>
    <p>
      終了時間：
      <input type="time" name="scheduleEndTime" v-model="scheduleEndTime" value size="40" />
    </p>

    <!-- 追加ボタン -->
    <button v-on:click="doAddschedule" v-bind:disabled="!isEntered">登録</button>
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
      var isEnteredscheduleName = 0 < this.scheduleName.length;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isEntered = isEnteredscheduleName;
      return isEnteredscheduleName;
    },
  },
	created() {
		// 日付をカレンダーのクリックした日付から受け取る
		if(this.$route.params.date != null){
			this.scheduleDate = this.$route.params.date.toString();
		} else{
			var now = new Date();
			var year = now.getFullYear();
			var month = ("0"+(now.getMonth() + 1)).slice(-2);
			var day =  ("0"+now.getDate()).slice(-2);
			this.scheduleDay = year + '-' + month + '-' + day;
		} 
  },
  methods: {
    handleDateClick: function (arg) {
      alert("date click! " + arg.dateStr);
    },
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

      this.axios.post("/addschedule", params).then((response) => {
        if (response.status != 200) {
          throw new Error("レスポンスエラー");
        } else {
          // 入力値を初期化する
          this.initInputValue();
        }
      });
    },
    // 入力値を初期化する
    initInputValue() {
      this.current = -1;
      this.scheduleName = "";
      this.scheduleMemo = "";
    },
  },
};
</script>
