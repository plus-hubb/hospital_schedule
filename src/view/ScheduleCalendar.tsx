import { defineComponent, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/core/index.global.css";
import "@fullcalendar/daygrid/index.global.css";

export default defineComponent({
  setup() {

    const events = ref([
      { title: "Dr.A - ER", date: "2026-03-01" },
      { title: "Dr.B - ICU", date: "2026-03-01" }
    ]);

    const options = {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      events: events.value
    };

    return () => <FullCalendar {...options} />;
  }
});