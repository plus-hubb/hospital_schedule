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
background:#f4f6f8;
}

h1{
color:#1976d2;
margin-bottom:20px;
}

/* FORM */

.form{
display:flex;
gap:10px;
margin-bottom:20px;
background:#e3f2fd;
padding:15px;
border-radius:10px;
}

input{
padding:8px;
border:1px solid #90caf9;
border-radius:6px;
outline:none;
}

input:focus{
border-color:#1976d2;
}

/* BUTTON */

button{
padding:8px 14px;
border:none;
border-radius:6px;
background:#1976d2;
color:white;
cursor:pointer;
transition:0.2s;
}

button:hover{
background:#1565c0;
}

.edit{
background:#fb8c00;
margin-right:5px;
}

.edit:hover{
background:#ef6c00;
}

.delete{
background:#e53935;
}

.delete:hover{
background:#c62828;
}

/* GROUP LIST */

.group-list{
width:100%;
background:white;
border-radius:10px;
overflow:hidden;
box-shadow:0 2px 8px rgba(0,0,0,0.05);
list-style:none;
padding:0;
}

.group-list li{
display:flex;
justify-content:space-between;
align-items:center;
padding:12px 15px;
border-bottom:1px solid #eee;
}

.group-list li:hover{
background:#f5f5f5;
}

.group-list li:last-child{
border-bottom:none;
}

.actions{
display:flex;
gap:8px;
}

</style>