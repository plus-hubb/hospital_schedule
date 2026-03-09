<script setup lang="ts">
import { reactive, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import NavbarDoc from "../../components/NavbarDoc.vue"
import { getHolidays } from "../../services/holidayservice"

const calendarOptions:any = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  height: "auto",

  headerToolbar:{
    left:"prev,next today",
    center:"title",
    right:"dayGridMonth,dayGridWeek"
  },

  events:[
    {title:'Dr.A1 OPD',date:'2026-03-01',color:"#43a047"},
    {title:'Dr.B1 Consult',date:'2026-03-02',color:"#1e88e5"},
    {title:'Dr.C1 OPD',date:'2026-03-03',color:"#43a047"}
  ],

  eventClick(info:any){
    alert(
      "Duty: " + info.event.title +
      "\nDate: " + info.event.start.toLocaleDateString()
    )
  }
})

const loadHoliday = async () => {

  const holidays = await getHolidays()

  const holidayEvents = holidays.map((h:any)=>({
    title: h.name,
    date: h.date.iso,
    color:"#ef5350"
  }))

  calendarOptions.events.push(...holidayEvents)

}

onMounted(()=>{
  loadHoliday()
})
</script>

<template>

<div class="layout">

  <NavbarDoc/>

  <div class="content">

    <h1>Doctor Duty Schedule</h1>

    <div class="legend">
      <span class="holiday"></span> Holiday
      <span class="opd"></span> OPD
      <span class="consult"></span> Consult
    </div>

    <div class="calendar-card">
      <FullCalendar :options="calendarOptions"/>
    </div>

  </div>

</div>

</template>

<style scoped>

.layout{
display:flex;
}

.content{
flex:1;
padding:30px;
background:#f4f6f8;
min-height:100vh;

display:flex;
flex-direction:column;
align-items:center;
}

/* ===== TITLE ===== */

h1{
margin-bottom:14px;
color:#1976d2;
font-weight:600;
letter-spacing:.3px;
}

/* ===== LEGEND ===== */

.legend{
margin-bottom:20px;
font-size:14px;
display:flex;
gap:20px;
align-items:center;
color:#555;
}

.legend span{
display:inline-block;
width:14px;
height:14px;
border-radius:4px;
margin-right:6px;
}

/* medical palette */

.holiday{background:#e53935;}
.opd{background:#43a047;}
.consult{background:#1e88e5;}

/* ===== CALENDAR CARD ===== */

.calendar-card{
width:100%;
max-width:950px;
background:white;
padding:22px;
border-radius:12px;
box-shadow:0 2px 10px rgba(0,0,0,0.06);
}

/* ===== FULLCALENDAR ===== */

:deep(.fc){
font-size:14px;
}

/* TITLE */

:deep(.fc-toolbar-title){
font-size:20px;
font-weight:600;
color:#1976d2;
}

/* ===== TOOLBAR CONTAINER ===== */

:deep(.fc-button-group){
background:#f5f7fa;
border-radius:8px;
padding:3px;
}

/* ===== BUTTON ===== */

:deep(.fc-button){
background:transparent !important;
border:none !important;
color:#555 !important;
border-radius:6px !important;
padding:6px 12px !important;
font-size:13px;
transition:all .15s ease;
}

/* hover */

:deep(.fc-button:hover){
background:#e3f2fd !important;
color:#1976d2 !important;
}

/* active view */

:deep(.fc-button-active){
background:#1976d2 !important;
color:white !important;
}

/* today button */

:deep(.fc-today-button){
background:#e3f2fd !important;
color:#1976d2 !important;
}

/* ===== DAY CELL ===== */

:deep(.fc-daygrid-day){
height:90px;
transition:background .15s ease;
}

/* TODAY */

:deep(.fc-day-today){
background:#e3f2fd !important;
}

/* WEEKEND SOFT */

:deep(.fc-day-sat),
:deep(.fc-day-sun){
background:#fafcff;
}

/* HOVER DAY */

:deep(.fc-daygrid-day:hover){
background:#f5f9ff;
cursor:pointer;
}

/* ===== EVENT ===== */

:deep(.fc-event){
border:none;
border-radius:6px;
padding:3px 6px;
font-size:12px;
font-weight:500;
box-shadow:0 1px 2px rgba(0,0,0,0.08);
transition:transform .12s ease;
}

:deep(.fc-event:hover){
transform:scale(1.02);
}

/* ===== GRID BORDER ===== */

:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th){
border-color:#eee;
}

/* ===== ROUND CALENDAR GRID ===== */

:deep(.fc-scrollgrid){
  border-radius:12px;
  overflow:hidden;
  border:1px solid #e3eaf2;
}

/* ===== DAY HEADER (Sun - Sat) ===== */

:deep(.fc-col-header){
  border-top-left-radius:12px;
  border-top-right-radius:12px;
  overflow:hidden;
}

:deep(.fc-col-header-cell){
  background:#e3f2fd;     /* ฟ้าอ่อนเหมือนหน้าอื่น */
  color:#1976d2;          /* ฟ้าหลัก */
  font-weight:600;
  padding:12px 0;
  border-color:#d6e4f0 !important;
}

/* ===== TABLE FIX (กันมุมแหลม) ===== */

:deep(.fc-theme-standard table){
  border-collapse:separate;
  border-spacing:0;
}
</style>