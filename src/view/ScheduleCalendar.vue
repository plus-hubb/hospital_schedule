<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const pattern = [
  ["A1","B1"],
  ["B1","C1"],
  ["C1","D1"],
  ["D1","A1"]
]

function generateSchedule(year:number,month:number){

  const events:any[]=[]
  const date=new Date(year,month,1)

  let weekIndex=0

  while(date.getMonth()===month){

    const day=date.getDay()

    if(day>=1 && day<=4){
      const pair=pattern[(weekIndex+day-1)%4]!

      events.push({
        title:pair[0],
        date:date.toISOString().split("T")[0]
      })

      events.push({
        title:pair[1],
        date:date.toISOString().split("T")[0]
      })
    }

    if(day===5){
      events.push({
        title:"Random",
        date:date.toISOString().split("T")[0]
      })
    }

    if(day===6){
      weekIndex++
    }

    date.setDate(date.getDate()+1)
  }

  return events
}

const events = ref(generateSchedule(2026,2))

const calendarOptions = {
  plugins:[dayGridPlugin],
  initialView:'dayGridMonth',
  events:events.value
}
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
