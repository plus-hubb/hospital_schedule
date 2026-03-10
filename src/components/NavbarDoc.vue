<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const role = sessionStorage.getItem("role")

// ดึงข้อมูล user
const user = JSON.parse(sessionStorage.getItem("user") || "{}")

const logout = () => {
  sessionStorage.clear()
  router.push("/")
}
</script>

<template>
<div class="sidebar">

<h2 class="logo">Hospital</h2>

<div v-if="role === 'doctor'" class="menu">

<!-- แสดงชื่อหมอ -->
<div class="user">
👨‍⚕️ {{ user.name_doctor }}
</div>

<nav>
  <router-link to="/doctor/homepage">Homepage</router-link>
  <router-link to="/doctor/mySchedule">My Schedule</router-link>
  <router-link to="/doctor/notification">Notifications 🔔</router-link>
</nav>

<button class="logout" @click="logout">
Logout
</button>

</div>

</div>
</template>

<style scoped>

.sidebar{
width:230px;
height:100vh;
background:#ffffff;
border-right:1px solid #eee;
padding:20px;
font-family: Arial, Helvetica, sans-serif;
display:flex;
flex-direction:column;
}

.logo{
font-size:20px;
font-weight:600;
margin-bottom:20px;
color:#1976d2;
}

/* user name */

.user{
background:#f4f6f8;
padding:10px;
border-radius:6px;
margin-bottom:20px;
font-size:14px;
color:#333;
}

/* menu */

.menu{
display:flex;
flex-direction:column;
height:100%;
}

nav{
display:flex;
flex-direction:column;
gap:8px;
}

a{
text-decoration:none;
color:#333;
padding:10px 12px;
border-radius:6px;
transition:0.2s;
}

a:hover{
background:#e3f2fd;
color:#1976d2;
}

.router-link-active{
background:#1976d2;
color:white;
}

/* logout button */

.logout{
margin-top:20px;
padding:10px 12px;
border:none;
border-radius:8px;
background:#f5f7fa;
color:#555;
cursor:pointer;
font-size:14px;
transition:all .2s ease;
width:100%;
}

/* hover */

.logout:hover{
background:#449bc4;
color:white;
transform:translateX(4px);
box-shadow:0 3px 8px rgba(229,57,53,0.25);
}

/* click */

.logout:active{
transform:scale(0.96);
}

</style>