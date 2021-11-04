<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div id="app">
          <div class="table-container">
            <table
              class="table"
              border="1">
              <thead>
                <tr>
                  <td
                    v-for="item in items"
                    :key="item.no">
                    {{ item.start }}
                  </td>
                </tr>
              </thead>

              <tbody> 
                <tr>
                  <td
                    v-for="item in items"
                    :key="item.no">
                    {{ item.title }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 「el」プロパティーで、Vueの表示を反映する場所＝HTML要素のセレクター（id）を定義
  //el: "#app",
  // data オブジェクトのプロパティの値を変更すると、ビューが反応し、新しい値に一致するように更新
  data() {
    return {
      items: this.doFetchAllschedules(),
    }
  },
  methods: {
    // スケジュールを取得する
    doFetchAllschedules() {
      let fetchEvents = []
      this.axios
        .get('/fetchAllschedules')
        .then((response) => {
          if (response.status != 200) {
            throw new Error('レスポンスエラー')
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let e = response.data[i] // some calendar event
              // task 後で直そうコード
              let start_date = e.start_date.substring(0, 10)
 
              fetchEvents.push({
                id: e.id,
                title: e.company,
                start: start_date,
                end: e.end_date,
              })
            }
            this.items = fetchEvents
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

@media (max-width: 500px) {
  td {
    display: block;
  }
}
</style>>