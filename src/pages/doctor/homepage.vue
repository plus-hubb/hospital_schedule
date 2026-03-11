<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import NavbarDoc from "../../components/NavbarDoc.vue"
import { getThaiHolidayEvents } from "../../utils/scheduleGenerator"

const user = JSON.parse(sessionStorage.getItem("user") || "{}")

// ======================
// TOAST
// ======================

const toast = ref({
  show:false,
  title:"",
  message:""
})

function showToast(title:string,message:string){

  toast.value={
    show:true,
    title,
    message
  }

  setTimeout(()=>{
    toast.value.show=false
  },4000)
}

const events = ref<any[]>([])

const calendarOptions:any = reactive({

  plugins:[dayGridPlugin,interactionPlugin],

  initialView:"dayGridMonth",

  height:"auto",

  timeZone:"Asia/Bangkok",

  headerToolbar:{
    left:"prev,next today",
    center:"title",
    right:"dayGridMonth,dayGridWeek"
  },

  events:[],

  eventClick(info:any){

    showToast(
      "Duty Detail",
      `${info.event.title} - `+
      info.event.start.toLocaleDateString("th-TH",{
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
      })
    )

  }

})


// ======================
// LOAD EVENTS
// ======================

async function loadEvents(){

  const res = await fetch(
  "https://balanced-upliftment-production-c650.up.railway.app/schedule"
  )

  const data = await res.json()

  const scheduleEvents = data.map((e:any)=>({

    title:`${e.name_doctor} ${e.duty_type}`,

    start:e.duty_date.substring(0,10),

    backgroundColor:
    e.id_group===1 ? "#43a047" :
    e.id_group===2 ? "#1e88e5" :
    e.id_group===3 ? "#fb8c00" :
    "#8e24aa",

    borderColor:"transparent",

    extendedProps:{
      doctor:e.name_doctor
    }

  }))

  const year = new Date().getFullYear()

  const holidayEvents = getThaiHolidayEvents(year).map((h:any)=>({

    title:h.title,

    start:h.date,

    backgroundColor:"#e53935",

    borderColor:"transparent"

  }))

  events.value = [
  ...scheduleEvents,
  ...holidayEvents
  ]

  calendarOptions.events = events.value


  // ======================
  // NOTIFICATION
  // ======================

  const today = new Date().toLocaleDateString("sv-SE")
  const tomorrow = new Date(Date.now()+86400000)
  .toLocaleDateString("sv-SE")

  scheduleEvents.forEach((e:any)=>{

    if(e.title.includes(user.name_doctor)){

      if(e.start === today){
        setTimeout(()=>{
          showToast("🔔 Duty Today",e.title)
        },500)
      }

      if(e.start === tomorrow){
        setTimeout(()=>{
          showToast("⚠️ Duty Tomorrow",e.title)
        },900)
      }

    }

  })

}

onMounted(loadEvents)

</script>



<template>

<div class="layout">

<NavbarDoc/>

<div class="content">

<h1>Doctor Duty Schedule</h1>

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


<!-- TOAST -->

<div v-if="toast.show" class="toast">

<div class="toast-icon">
🔔
</div>

<div class="toast-text">
<b>{{ toast.title }}</b>
<p>{{ toast.message }}</p>
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


/* ======================
   TOAST NOTIFICATION
====================== */

.toast{
position:fixed;
top:24px;
right:24px;

display:flex;
align-items:center;
gap:14px;

background:rgba(255,255,255,0.95);
backdrop-filter:blur(8px);

padding:14px 18px;

border-radius:12px;

box-shadow:
0 6px 18px rgba(0,0,0,0.12),
0 2px 6px rgba(0,0,0,0.06);

border-left:5px solid #1976d2;

min-width:260px;
max-width:340px;

animation:toastSlide .35s ease;
z-index:9999;
}

.toast-icon{
width:38px;
height:38px;

display:flex;
align-items:center;
justify-content:center;

border-radius:50%;

background:#e3f2fd;
color:#1976d2;

font-size:18px;
flex-shrink:0;
}

.toast-text b{
display:block;
font-size:14px;
color:#1976d2;
margin-bottom:2px;
}

.toast-text p{
margin:0;
font-size:13px;
color:#444;
line-height:1.4;
}

@keyframes toastSlide{

from{
transform:translateX(40px);
opacity:0;
}

to{
transform:translateX(0);
opacity:1;
}

}

</style>