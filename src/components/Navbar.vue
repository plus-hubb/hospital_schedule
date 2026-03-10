<script setup lang="ts">
const role = localStorage.getItem("role")
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
font-family: Arial, Helvetica, sans-serif
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

</style>