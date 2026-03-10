<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const role = sessionStorage.getItem("role")

const logout = () => {
  sessionStorage.clear()
  router.push("/")
}
</script>

<template>
<div class="sidebar">

<h2 class="logo">Hospital</h2>

<div v-if="role === 'admin'">
<nav>
  <router-link to="/admin/dashboard">Dashboard</router-link>

  <p class="menu-title">Doctors</p>
  <router-link to="/admin/doctors">Doctor List</router-link>
  <router-link to="/admin/manage-doctors">Manage Doctors</router-link>

  <p class="menu-title">Groups</p>
  <router-link to="/admin/groups">Group List</router-link>
  

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
}

.logo{
font-size:20px;
font-weight:600;
margin-bottom:30px;
color:#1976d2;
}

nav{
display:flex;
flex-direction:column;
gap:8px;
}

.menu-title{
font-size:12px;
color:#888;
margin-top:20px;
margin-bottom:5px;
text-transform:uppercase;
letter-spacing:0.5px;
}

a{
text-decoration:none;
color:#333;
padding:10px 12px;
border-radius:6px;
transition:0.2s;
}

/* hover */

a:hover{
background:#e3f2fd;
color:#1976d2;
}

/* active route */

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