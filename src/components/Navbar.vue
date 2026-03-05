<script setup lang="ts">
</script>

<template>
<div class="sidebar">

<h2 class="logo">Hospital</h2>

<nav>
  <router-link to="/admin/dashboard">Dashboard</router-link>

  <p class="menu-title">Doctors</p>
  <router-link to="/admin/doctors">Doctor List</router-link>
  <router-link to="/admin/manage-doctors">Manage Doctors</router-link>

  <p class="menu-title">Groups</p>
  <router-link to="/admin/groups">Group List</router-link>
  <router-link to="/admin/manage-groups">Manage Groups</router-link>

</nav>

</div>
</template>

<style scoped>

.sidebar{
width:230px;
height:100vh;
background:#ffffff;
border-right:1px solid #eee;
padding:20px;
}

.logo{
font-size:20px;
margin-bottom:30px;
}

nav{
display:flex;
flex-direction:column;
gap:10px;
}

.menu-title{
font-size:12px;
color:#888;
margin-top:20px;
}

a{
text-decoration:none;
color:#333;
padding:8px;
border-radius:6px;
}

a:hover{
background:#f4f4f4;
}

</style>