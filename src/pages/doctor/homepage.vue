<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import NavbarDoc from "../../components/NavbarDoc.vue"
import { getThaiHolidayEvents } from "../../utils/scheduleGenerator"

const user = JSON.parse(sessionStorage.getItem("user") || "{}")

// toast
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

h1{
margin-bottom:14px;
color:#1976d2;
font-weight:600;
}

/* legend */

.legend{
margin-bottom:20px;
font-size:14px;
display:flex;
gap:18px;
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
.groupA{ background:#43a047; }
.groupB{ background:#1e88e5; }
.groupC{ background:#fb8c00; }
.groupD{ background:#8e24aa; }
.friday{ background:#1ec9f4; }

/* calendar */

.calendar-card{
width:100%;
max-width:950px;
background:white;
padding:20px;
border-radius:12px;
box-shadow:0 2px 10px rgba(0,0,0,0.06);
}

:deep(.fc-daygrid-day){
height:90px;
}

:deep(.fc-day-today){
background:#e3f2fd !important;
}

:deep(.fc-event){
border:none;
border-radius:6px;
padding:3px 6px;
font-size:12px;
}

/* toast */

.toast{
position:fixed;
top:20px;
right:20px;

background:white;
padding:16px 18px;
border-radius:12px;

box-shadow:0 8px 24px rgba(0,0,0,0.18);

display:flex;
align-items:center;
gap:12px;

z-index:999;
}

.toast-icon{
font-size:22px;
}

.toast-text b{
font-size:14px;
color:#1976d2;
}

.toast-text p{
margin:0;
font-size:13px;
color:#555;
}

</style>