<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';

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
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        navLinks: true, //カレンダー内の日付クリックで日表示に遷移するかどう
        businessHours: true, //休日を表示するかどうか
        editable: true, //イベントを編集できるかどうか
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        locale: jaLocale, // 日本語化
        events: this.doFetchAllschedules,
      },
    };
  },
  methods: {
    handleDateClick: function (info) {
      this.$router.push({
        name: 'Register',
        params: {
          date: info.date,
        },
      });
    },
    handleEventClick: function (info) {
      this.$router.push({
        name: 'Edit',
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
      let fetchEvents = [];
   
      this.axios
        .get('/fetchAllschedules')
        .then((response) => {
          if (response.status != 200) {
            // todo エラーハンドリングする
            throw new Error('レスポンスエラー');
          } else {

            for (let i = 0; i < response.data.data.length; i++) {

              let e = response.data.data[i]; // some calendar event
              fetchEvents.push({
                id: e.id,
                title: e.task,
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