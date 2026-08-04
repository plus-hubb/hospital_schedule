<script setup lang="ts">
import { ref, onMounted } from "vue"
import NavbarDoc from "../../components/NavbarDoc.vue"
import { getSchedule } from "../../services/api"

const notifications = ref<any[]>([])

// user login
const user = JSON.parse(sessionStorage.getItem("user") || "{}")

onMounted(async () => {
  try {
    const data = await getSchedule()

    // วันนี้
    const todayStr = new Date().toISOString().slice(0, 10)

    // วันพรุ่งนี้
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10)

    ;(data || []).forEach((e: any) => {
      if (!e.duty_date) return

      const eventDate = String(e.duty_date).slice(0, 10)

      if (user?.name_doctor && e.name_doctor === user.name_doctor) {
        if (eventDate === todayStr) {
          notifications.value.push({
            title: "Duty Today",
            message: `Today you have ${e.duty_type || ""}`,
            date: e.duty_date,
          })
        }

        if (eventDate === tomorrowStr) {
          notifications.value.push({
            title: "Duty Tomorrow",
            message: `Tomorrow you have ${e.duty_type || ""}`,
            date: e.duty_date,
          })
        }
      }
    })
  } catch (err) {
    console.error("Error loading notifications from Supabase:", err)
  }
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