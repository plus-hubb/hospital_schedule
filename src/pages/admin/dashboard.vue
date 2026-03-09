<script setup lang="ts">

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const calendarOptions = {
  plugins:[dayGridPlugin],
  initialView:'dayGridMonth',
  events:[
    {title:'Dr.A1 OPD',date:'2026-03-01'},
    {title:'Dr.B1 Consult',date:'2026-03-02'},
    {title:'Dr.C1 OPD',date:'2026-03-03'}
  ]
}

</script>

<template>

<div class="layout">

  <Navbar/>

  <div class="content">

  <h1>Duty Schedule</h1>

  <FullCalendar :options="calendarOptions"/>

  </div>

</div>

</template>

<script lang="ts">
import Navbar from "../../components/Navbar.vue"
export default {components:{Navbar}}
</script>

<style scoped>

.layout{
display:flex;
font-family: Arial, Helvetica, sans-serif
}

.content{
flex:1;
padding:30px;
background:#f4f6f8;
min-height:100vh;
}

h1{
color:#1976d2;
margin-bottom:20px;
}

/* CALENDAR CARD */

:deep(.fc){
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

/* HEADER BUTTON */

:deep(.fc-button){
background:#1976d2 !important;
border:none !important;
border-radius:6px !important;
padding:6px 12px !important;
}

:deep(.fc-button:hover){
background:#1565c0 !important;
}

/* DAY HEADER */

:deep(.fc-col-header-cell){
background:#e3f2fd;
color:#1976d2;
font-weight:600;
padding:8px 0;
}

/* GRID BORDER */

:deep(.fc-scrollgrid){
border:1px solid #eee;
}

/* TODAY */

:deep(.fc-day-today){
background:#e3f2fd !important;
}

/* EVENT */

:deep(.fc-event){
background:#1976d2 !important;
border:none !important;
border-radius:6px;
padding:3px 6px;
font-size:13px;
}

/* HOVER DAY */

:deep(.fc-daygrid-day:hover){
background:#f5f5f5;
cursor:pointer;
}

/* REMOVE STRONG BORDER */

:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th){
border-color:#eee;
}

</style>