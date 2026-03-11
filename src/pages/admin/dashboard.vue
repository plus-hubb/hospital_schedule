<script setup lang="ts">
import { reactive, onMounted, ref } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import NavbarDoc from "../../components/Navbar.vue"
import { generateDutyEvents } from "../../utils/scheduleGenerator"

const year = new Date().getFullYear()
const currentMonth = ref(0)

const doctorsGroup:any = {
A:[],
B:[],
C:[],
D:[]
}

const calendarOptions:any = reactive({
plugins:[dayGridPlugin,interactionPlugin],
initialView:"dayGridMonth",
height:"auto",
events:[]
})

async function saveEvents(events:any[]){

await fetch("https://balanced-upliftment-production-c650.up.railway.app/schedule",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(events)
})

}

async function loadEvents(){

const res = await fetch("https://balanced-upliftment-production-c650.up.railway.app/schedule")
const data = await res.json()

calendarOptions.events = data.map((e:any)=>({
title: e.duty_type + " - " + e.name_doctor,
date: e.duty_date
}))

}

function generateMonth(){

// ป้องกันกรณียังโหลด doctor ไม่เสร็จ
if(
doctorsGroup.A.length===0 &&
doctorsGroup.B.length===0 &&
doctorsGroup.C.length===0 &&
doctorsGroup.D.length===0
){
alert("Doctors not loaded yet")
return
}

// ป้องกันเกิน 12 เดือน
if(currentMonth.value > 11){
alert("Generated all months already")
return
}

const events = generateDutyEvents(
doctorsGroup,
year,
currentMonth.value
)

calendarOptions.events = [
...calendarOptions.events,
...events
]

saveEvents(events)

currentMonth.value++

}

async function undoMonth(){

currentMonth.value--

if(currentMonth.value < 0){
currentMonth.value = 0
return
}

await fetch(
`https://balanced-upliftment-production-c650.up.railway.app/schedule/${year}/${currentMonth.value+1}`,
{ method:"DELETE" }
)

loadEvents()

}

onMounted(async()=>{

const res = await fetch("https://balanced-upliftment-production-c650.up.railway.app/doctors")
const doctors = await res.json()

doctors.forEach((d:any)=>{

if(d.id_group===1) doctorsGroup.A.push(d)
if(d.id_group===2) doctorsGroup.B.push(d)
if(d.id_group===3) doctorsGroup.C.push(d)
if(d.id_group===4) doctorsGroup.D.push(d)

})

await loadEvents()

})
</script>
<template>

<div class="layout">

  <NavbarDoc/>

  <div class="content">

    <h1>Doctor Duty Schedule</h1>

    <div class="controls">

<button @click="generateMonth">
Generate Month
</button>

<button @click="undoMonth">
Undo Month
</button>

</div>

    <div class="legend">
      <span class="holiday"></span> Holiday
      <span class="groupA"></span> Group A
      <span class="groupB"></span> Group B
      <span class="groupC"></span> Group C
      <span class="groupD"></span> Group D
      <span class="friday"></span> Friday Rotation
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
flex-wrap:wrap;
}

.legend span{
display:inline-block;
width:14px;
height:14px;
border-radius:4px;
margin-right:6px;
}

.holiday{ background:#e53935; }
.groupA { background:#43a047; }
.groupB { background:#1e88e5; }
.groupC { background:#fb8c00; }
.groupD { background:#8e24aa; }
.friday { background:#1ec9f4; }

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

:deep(.fc-toolbar-title){
font-size:20px;
font-weight:600;
color:#1976d2;
}

:deep(.fc-button-group){
background:#f5f7fa;
border-radius:8px;
padding:3px;
}

:deep(.fc-button){
background:transparent !important;
border:none !important;
color:#555 !important;
border-radius:6px !important;
padding:6px 12px !important;
font-size:13px;
transition:all .15s ease;
}

:deep(.fc-button:hover){
background:#e3f2fd !important;
color:#1976d2 !important;
}

:deep(.fc-button-active){
background:#1976d2 !important;
color:white !important;
}

:deep(.fc-today-button){
background:#e3f2fd !important;
color:#1976d2 !important;
}

:deep(.fc-daygrid-day){
height:90px;
transition:background .15s ease;
}

:deep(.fc-day-today){
background:#e3f2fd !important;
}

:deep(.fc-day-sat),
:deep(.fc-day-sun){
background:#fafcff;
}

:deep(.fc-daygrid-day:hover){
background:#f5f9ff;
cursor:pointer;
}

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

:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th){
border-color:#eee;
}

:deep(.fc-scrollgrid){
  border-radius:12px;
  overflow:hidden;
  border:1px solid #e3eaf2;
}

:deep(.fc-col-header){
  border-top-left-radius:12px;
  border-top-right-radius:12px;
  overflow:hidden;
}

:deep(.fc-col-header-cell){
  background:#e3f2fd;
  color:#1976d2;
  font-weight:600;
  padding:12px 0;
  border-color:#d6e4f0 !important;
}

:deep(.fc-theme-standard table){
  border-collapse:separate;
  border-spacing:0;
}
</style>