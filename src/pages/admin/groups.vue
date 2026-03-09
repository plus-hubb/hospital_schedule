<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Doctor Groups</h1>

<div v-for="group in groups" :key="group.id_group" class="group">

<h2>{{ group.name_group }}</h2>

<ul>
<li
v-for="doctor in doctorsByGroup(group.id_group)"
:key="doctor.id_doctor"
>
{{ doctor.name_doctor }}
</li>
</ul>

</div>

</div>

</div>

</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"

interface Doctor{
id_doctor:number
name_doctor:string
id_group:number
}

interface Group{
id_group:number
name_group:string
}

const doctors = ref<Doctor[]>([])
const groups = ref<Group[]>([])


// FETCH DOCTORS
const fetchDoctors = async ()=>{

const res = await fetch("https://balanced-upliftment-production-c650.up.railway.app/doctors")
doctors.value = await res.json()

}


// FETCH GROUPS
const fetchGroups = async ()=>{

const res = await fetch("https://balanced-upliftment-production-c650.up.railway.app/groups")
groups.value = await res.json()

}

onMounted(()=>{
fetchDoctors()
fetchGroups()
})


// FILTER DOCTOR BY GROUP
const doctorsByGroup = (id:number)=>{
return doctors.value.filter(d => d.id_group === id)
}

</script>

<style scoped>

.layout{
display:flex;
}

/* ===== CONTENT ===== */

.content{
flex:1;
padding:30px;
background:#f4f6f8;
min-height:100vh;
}

/* ===== PAGE TITLE ===== */

h1{
color:#1976d2;
margin-bottom:25px;
font-weight:600;
}

/* ===== GROUP CARD ===== */

.group{
background:white;
padding:20px;
border-radius:10px;
margin-bottom:20px;
box-shadow:0 2px 8px rgba(0,0,0,0.05);
transition:0.2s;
}

.group:hover{
transform:translateY(-2px);
box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

/* ===== GROUP TITLE ===== */

h2{
color:#1976d2;
margin-bottom:12px;
font-size:18px;
font-weight:600;
border-left:4px solid #1976d2;
padding-left:10px;
}

/* ===== DOCTOR LIST ===== */

ul{
list-style:none;
padding:0;
margin:0;
}

li{
padding:8px 12px;
margin-bottom:6px;
background:#f8fbff;
border-radius:6px;
transition:0.15s;
font-size:14px;
}

li:hover{
background:#e3f2fd;
cursor:default;
}

</style>