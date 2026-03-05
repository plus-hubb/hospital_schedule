<script setup lang="ts">
import Navbar from "../../components/Navbar.vue"

const doctors = [
  {name:"Dr.A1",email:"a1@mail.com",group:"Group A"},
  {name:"Dr.B1",email:"b1@mail.com",group:"Group B"}
]
</script>

<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Manage Doctors</h1>

<div class="form">

<input placeholder="Doctor name"/>
<input placeholder="Email"/>
<select>
<option>Group A</option>
<option>Group B</option>
<option>Group C</option>
<option>Group D</option>
</select>

<button>Add Doctor</button>

</div>

<table>

<tr>
<th>Name</th>
<th>Email</th>
<th>Group</th>
<th>Action</th>
</tr>

<tr v-for="doc in doctors">

<td>{{doc.name}}</td>
<td>{{doc.email}}</td>
<td>{{doc.group}}</td>

<td>

<button class="edit">Edit</button>
<button class="delete">Delete</button>

</td>

</tr>

</table>

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

input,select{
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

table{
width:100%;
background:white;
border-collapse:collapse;
}

th,td{
padding:10px;
border-bottom:1px solid #eee;
text-align:left;
}

</style>