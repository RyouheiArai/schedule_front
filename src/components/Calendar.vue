<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from "@fullcalendar/timegrid"
import jaLocale from "@fullcalendar/core/locales/ja"

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
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
					right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
				},
				navLinks: true,
        businessHours: true,
        editable: true,
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
				locale: jaLocale, // 日本語化
				events: [
                    {
                        id: '1',
                        title: 'A社　会議',
                        start: '2021-08-31 19:00',
												end:'2021-08-31 19:30',
                        url: '#'
                    }
                ],
				
      }
    }
  },
	methods: {
    handleDateClick: function(arg) {
			this.$router.push({
      name: 'Register',
      params: {
        date: arg.dateStr,
      },
    });
		console.log("カレンダー画面"+arg.dateStr)
    },
		handleEventClick: function(info) {
		
			this.$router.push({
      name: 'Edit',
      params: {
				id:info.event.id,
				title: info.event.title,
        start: info.event.start,
				end: info.event.end,
      },
    });
    }
	}
};
</script>