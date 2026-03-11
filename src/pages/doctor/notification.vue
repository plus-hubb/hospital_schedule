<script setup lang="ts">
import { ref, onMounted } from "vue"
import NavbarDoc from "../../components/NavbarDoc.vue"

const notifications = ref<any[]>([])

// user login
const user = JSON.parse(sessionStorage.getItem("user") || "{}")

onMounted(async()=>{

  const res = await fetch(
  "https://balanced-upliftment-production-c650.up.railway.app/schedule"
  )

  const data = await res.json()

  const today = new Date()
  const tomorrow = new Date()

  tomorrow.setDate(today.getDate()+1)

  const todayStr = today.toLocaleDateString("sv-SE")
  const tomorrowStr = tomorrow.toLocaleDateString("sv-SE")

  data.forEach((e:any)=>{

    const eventDate = e.duty_date.slice(0,10)

    if(e.name_doctor === user.name_doctor){

      if(eventDate === todayStr){

        notifications.value.push({
          title:"Duty Today",
          message:`Today you have ${e.duty_type}`,
          date:e.duty_date
        })

      }

      if(eventDate === tomorrowStr){

        notifications.value.push({
          title:"Duty Tomorrow",
          message:`Tomorrow you have ${e.duty_type}`,
          date:e.duty_date
        })

      }

    }

  })

})
</script>

<template>

<div class="layout">

<NavbarDoc/>

<div class="content">

<h1>Notifications 🔔</h1>

<div v-if="notifications.length === 0" class="empty">
No notifications
</div>

<div
v-for="(n,i) in notifications"
:key="i"
class="card"
>

<h3>{{ n.title }}</h3>
<p>{{ n.message }}</p>

<span class="date">
{{ new Date(n.date).toLocaleDateString("th-TH") }}
</span>

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
}

h1{
margin-bottom:20px;
color:#1976d2;
}

.card{
background:white;
padding:18px;
border-radius:10px;
margin-bottom:12px;
box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

.card h3{
margin-bottom:6px;
font-size:16px;
}

.card p{
font-size:14px;
color:#555;
}

.date{
font-size:12px;
color:#999;
}

.empty{
color:#777;
}

</style>