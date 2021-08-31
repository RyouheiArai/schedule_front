<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import jaLocale from "@fullcalendar/core/locales/ja";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    // カレンダーデータ取得
    var events = this.doFetchAllschedules;

    return {
      calendarOptions: {
        dateClick: this.handleDateClick, //日付クリック
        eventClick: this.handleEventClick, //スケジュールクリック
        // カレンダーヘッダーのデザイン
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        },
        navLinks: true,
        businessHours: true,
        editable: true,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: "dayGridMonth",
        locale: jaLocale, // 日本語化
        events: events,
      },
    };
  },
  methods: {
    handleDateClick: function (arg) {
      this.$router.push({
        name: "Register",
        params: {
          date: arg.dateStr,
        },
      });
      console.log("カレンダー画面" + arg.dateStr);
    },
    handleEventClick: function (info) {
      this.$router.push({
        name: "Edit",
        params: {
          id: info.event.id,
          title: info.event.title,
          start: info.event.start,
          end: info.event.end,
        },
      });
    },
    // スケジュールを取得する
    doFetchAllschedules() {
      var events = [];

      this.axios
        .get(process.env.VUE_APP_API_ENDPOINT + "/fetchAllschedules")
        .then((response) => {
          if (response.status != 200) {
            throw new Error("レスポンスエラー");
          } else {
            var resultschedules = response.data;
            for (let i = 0; i < resultschedules.length; i++) {
              var e = resultschedules[i]; // some calendar event
              events.push({
                title: e.company,
                start: e.start_date,
                end: e.end_date,
              });

              return events;
            }
          }
        });
    },
  },
};
</script>