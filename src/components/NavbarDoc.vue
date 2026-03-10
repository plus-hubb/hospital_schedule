<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"

const router = useRouter()

const role = sessionStorage.getItem("role")

// user
const user = JSON.parse(sessionStorage.getItem("user") || "{}")

// notification count
const notificationCount = ref(0)

onMounted(async () => {

  try{

    const res = await fetch(
      "https://balanced-upliftment-production-c650.up.railway.app/notifications"
    )

    const data = await res.json()

    notificationCount.value = data.length

  }catch(err){

    console.log("notification error",err)
    notificationCount.value = 0

  }

})

const logout = () => {
  sessionStorage.clear()
  router.push("/")
}
</script>

<template>

<div class="sidebar">

<h2 class="logo">Hospital</h2>

<div v-if="role === 'doctor'" class="menu">

<!-- user -->

<div class="user">
👨‍⚕️ {{ user.name_doctor }}
</div>

<nav>

<router-link to="/doctor/homepage">
Homepage
</router-link>

<router-link to="/doctor/mySchedule">
My Schedule
</router-link>

<router-link to="/doctor/notification" class="notify">

Notifications 🔔

<span v-if="notificationCount>0" class="badge">
{{ notificationCount }}
</span>

</router-link>

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
font-family:'Outfit', sans-serif;
display:flex;
flex-direction:column;
}

.logo{
font-size:20px;
font-weight:600;
margin-bottom:20px;
color:#1976d2;
}

.menu{
display:flex;
flex-direction:column;
height:100%;
}

.user{
background:#f4f6f8;
padding:10px;
border-radius:6px;
margin-bottom:20px;
font-size:14px;
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
position:relative;
display:flex;
justify-content:space-between;
align-items:center;
}

a:hover{
background:#e3f2fd;
color:#1976d2;
}

.router-link-active{
background:#1976d2;
color:white;
}

/* notification badge */

.badge{
background:#e53935;
color:white;
font-size:11px;
padding:2px 7px;
border-radius:12px;
font-weight:600;
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
font-family:'Outfit', sans-serif;
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