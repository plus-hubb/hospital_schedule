<script setup lang="ts">
import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"

interface Doctor{
  id_doctor:number
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
const deleteDoctor = async(id:number)=>{
  await fetch(`https://balanced-upliftment-production-c650.up.railway.app/doctors/${id}`,{
    method:"DELETE"
  })

  fetchDoctors()
}

// EDIT
const startEdit=(doctor:Doctor)=>{
  editingDoctor.value={...doctor}
}

const updateDoctor = async()=>{
  await fetch(`https://balanced-upliftment-production-c650.up.railway.app/doctors/${editingDoctor.value.id_doctor}`,{
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
          :value="group.id_group"
        >
          {{ group.name_group }}
        </option>
      </select>

      <button @click="addDoctor">Add Doctor</button>
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
        <tr v-for="doctor in doctors" :key="doctor.id_doctor">

          <td>
            <span v-if="editingDoctor?.id_doctor !== doctor.id_doctor">
              {{ doctor.name_doctor }}
            </span>
            <input v-else v-model="editingDoctor.name_doctor">
          </td>

          <td>{{ doctor.email }}</td>

          <td>
            <span v-if="editingDoctor?.id_doctor !== doctor.id_doctor">
              {{ doctor.phone }}
            </span>
            <input v-else v-model="editingDoctor.phone">
          </td>

          <td>
            <span v-if="editingDoctor?.id_doctor !== doctor.id_doctor">
              {{ doctor.password }}
            </span>
            <input v-else v-model="editingDoctor.password">
          </td>

          <td>{{ doctor.name_group }}</td>

          <td>
            <button
              class="edit"
              v-if="editingDoctor?.id_doctor !== doctor.id_doctor"
              @click="startEdit(doctor)"
            >
              Edit
            </button>

            <button
              class="save"
              v-else
              @click="updateDoctor"
            >
              Save
            </button>

            <button
              class="delete"
              @click="deleteDoctor(doctor.id_doctor)"
            >
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

input,select{
  padding:8px;
  border:1px solid #90caf9;
  border-radius:6px;
  outline:none;
}

input:focus,select:focus{
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

.delete{
  background:#e53935;
  margin-left:5px;
}

.delete:hover{
  background:#c62828;
}

.edit{
  background:#fb8c00;
  margin-right:5px;
}

.edit:hover{
  background:#ef6c00;
}

.save{
  background:#43a047;
  margin-right:5px;
}

.save:hover{
  background:#2e7d32;
}

/* TABLE */

table{
  width:100%;
  background:white;
  border-collapse:collapse;
  border-radius:10px;
  overflow:hidden;
  box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

th{
  background:#1976d2;
  color:white;
  padding:12px;
  text-align:left;
}

td{
  padding:10px;
  border-bottom:1px solid #eee;
}

tr:hover{
  background:#f5f5f5;
}
</style>