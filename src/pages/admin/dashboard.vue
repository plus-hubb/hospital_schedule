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
}

.content{
flex:1;
padding:30px;
background:#fafafa;
min-height:100vh;
}

h1{
margin-bottom:20px;
}

</style>