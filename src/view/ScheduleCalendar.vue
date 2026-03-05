<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

const events = ref([
  { title: 'Dr.A - ER', date: '2026-03-01' },
  { title: 'Dr.B - ICU', date: '2026-03-01' }
]);

const calendarOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  events: events.value
};
</script>

<template>
  <div class="schedule-container">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style scoped>
.schedule-container {
  padding: 20px;
  width: 100%;
  height: 100vh;
}
</style>
