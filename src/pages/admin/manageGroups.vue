<script setup lang="ts">
import Navbar from "../../components/Navbar.vue"

const groups = [
  "Group A",
  "Group B",
  "Group C",
  "Group D"
]
</script>

<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Manage Doctor Groups</h1>

<div class="form">

<input placeholder="Group name"/>

<button>Add Group</button>

</div>

<ul class="group-list">

<li v-for="g in groups">

{{g}}

<div class="actions">

<button class="edit">Edit</button>
<button class="delete">Delete</button>

</div>

</li>

</ul>

</div>

</div>

</template>

<style scoped>

.layout{
display:flex;
font-family: Arial, Helvetica, sans-serif
}

.content{
flex:1;
padding:30px;
background:#fafafa;
}

.form{
display:flex;
gap:10px;
margin-bottom:20px;
}

input{
padding:8px;
border:1px solid #ddd;
border-radius:6px;
}

button{
padding:8px 14px;
border:none;
border-radius:6px;
background:#333;
color:white;
}

.edit{
background:#4caf50;
}

.delete{
background:#e53935;
}

.group-list{
background:white;
padding:20px;
list-style:none;
}

.group-list li{
display:flex;
justify-content:space-between;
padding:10px 0;
border-bottom:1px solid #eee;
}

.actions{
display:flex;
gap:8px;
}

</style>