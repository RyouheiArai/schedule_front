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
    return {
      calendarOptions: {
        dateClick: this.handleDateClick, //日付クリック
        eventClick: this.handleEventClick, //スケジュールクリック
        // カレンダーヘッダーのデザイン
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        navLinks: true,
        businessHours: true,
        editable: true,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: "dayGridMonth",
        locale: jaLocale, // 日本語化
        events: this.doFetchAllschedules(),
      },
    };
  },
  methods: {
    handleDateClick: function (info) {
      this.$router.push({
        name: "Register",
        params: {
          date: info.date,
        },
      });
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
      var fetchEvents = [];

      this.axios
        .get(process.env.VUE_APP_API_ENDPOINT + "/fetchAllschedules")
        .then((response) => {
          if (response.status != 200) {
            throw new Error("レスポンスエラー");
          } else {
            for (let i = 0; i < response.data.length; i++) {
              var e = response.data[i]; // some calendar event
              fetchEvents.push({
								id: e.id,
                title: e.company,
                start: e.start_date,
                end: e.end_date,
              });
            }
            this.calendarOptions.events = fetchEvents;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>