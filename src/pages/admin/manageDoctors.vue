<script setup lang="ts">

import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"

interface Doctor{
name_doctor:string
email:string
phone:string
password:string
id_group:number
name_group:string
}

interface Group{
id_group:number
name_group:string
}

const doctors = ref<Doctor[]>([])
const groups = ref<Group[]>([])

const newDoctor = ref({
name_doctor:"",
email:"",
phone:"",
password:"",
id_group:1
})

const editingDoctor = ref<any>(null)


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


// ADD
const addDoctor = async ()=>{

await fetch("https://balanced-upliftment-production-c650.up.railway.app/doctors",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(newDoctor.value)
})

fetchDoctors()

newDoctor.value={
name_doctor:"",
email:"",
phone:"",
password:"",
id_group:1
}

}


// DELETE
const deleteDoctor = async(email:string)=>{

await fetch(`https://balanced-upliftment-production-c650.up.railway.app/doctors/${email}`,{
method:"DELETE"
})

fetchDoctors()

}


// EDIT
const startEdit=(doctor:Doctor)=>{
editingDoctor.value={...doctor}
}

const updateDoctor = async()=>{

await fetch(`https://balanced-upliftment-production-c650.up.railway.app/doctors/${editingDoctor.value.email}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(editingDoctor.value)
})

editingDoctor.value=null

fetchDoctors()

}

</script>

<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Manage Doctors</h1>

<div class="form">

<input v-model="newDoctor.name_doctor" placeholder="Name">
<input v-model="newDoctor.email" placeholder="Email">
<input v-model="newDoctor.phone" placeholder="Phone">
<input v-model="newDoctor.password" placeholder="Password">

<select v-model.number="newDoctor.id_group">

<option
v-for="group in groups"
:key="group.id_group"
:value="group.id_group">

{{ group.name_group }}

</option>

</select>

<button @click="addDoctor">
Add Doctor
</button>


</div>


<table>

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Password</th>
<th>Group</th>
<th>Action</th>
</tr>
</thead>

<tbody>

<tr v-for="doctor in doctors" :key="doctor.email">

<td>
<span v-if="editingDoctor?.email !== doctor.email">
{{ doctor.name_doctor }}
</span>
<input v-else v-model="editingDoctor.name_doctor">
</td>

<td>{{ doctor.email }}</td>

<td>
<span v-if="editingDoctor?.email !== doctor.email">
{{ doctor.phone }}
</span>
<input v-else v-model="editingDoctor.phone">
</td>

<td>
<span v-if="editingDoctor?.email !== doctor.email">
{{ doctor.password }}
</span>
<input v-else v-model="editingDoctor.password">
</td>

<td>{{ doctor.name_group }}</td>

<td>

<button
class="edit"
v-if="editingDoctor?.email !== doctor.email"
@click="startEdit(doctor)">
Edit
</button>

<button
class="save"
v-else
@click="updateDoctor">
Save
</button>

<button
class="delete"
@click="deleteDoctor(doctor.email)">
Delete
</button>

</td>

</tr>

</tbody>

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
cursor:pointer;
}

.delete{
background:#e53935;
margin-left:5px;
}

.edit{
background:#1976d2;
margin-right:5px;
}

.save{
background:#43a047;
margin-right:5px;
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