<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Doctor List</h1>

<table>

<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Group</th>
</tr>

<tr v-for="doctor in doctors" :key="doctor.email">
<td>{{ doctor.name_doctor }}</td>
<td>{{ doctor.email }}</td>
<td>{{ doctor.phone }}</td>
<td>{{ doctor.name_group }}</td>
</tr>

</table>

</div>

</div>

</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"

interface Doctor {
  name_doctor: string
  email: string
  name_group: string
  phone: string
}

const doctors = ref<Doctor[]>([])

onMounted(async () => {

try{

const res = await fetch("http://localhost:3000/doctors")
const data = await res.json()

doctors.value = data

}catch(err){
console.error(err)
}

})

</script>

<style scoped>

.layout{
display:flex;
font-family: Arial, Helvetica, sans-serif
}

.content{
padding:30px;
flex:1;
background:#fafafa;
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