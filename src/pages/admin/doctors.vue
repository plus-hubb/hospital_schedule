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
<th>Password</th>
<th>Group</th>
</tr>

<tr v-for="doctor in doctors" :key="doctor.email">
<td>{{ doctor.name_doctor }}</td>
<td>{{ doctor.email }}</td>
<td>{{ doctor.phone }}</td>
<td>{{ doctor.password }}</td>
<td>{{ doctor.name_group }}</td>
</tr>

</table>

</div>

</div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"
// 🟢 1. Import ฟังก์ชัน getDoctors จากไฟล์ api.js / api.ts (ปรับ path ให้ตรงกับที่วางไฟล์ไว้)
import { getDoctors } from "../../services/api"

interface Doctor {
  id_doctor?: number
  name_doctor: string
  email: string
  phone: string
  password?: string
  id_group?: number
  name_group?: string
}

const doctors = ref<Doctor[]>([])
const loading = ref(false)
const error = ref("")

// 🟢 2. เรียกใช้ฟังก์ชันดึงข้อมูลจาก api.ts
const fetchDoctors = async () => {
  error.value = ""
  loading.value = true

  try {
    const data = await getDoctors()
    doctors.value = data
  } catch (err: any) {
    // 🟢 3. จัดการ Error message จาก Supabase
    error.value = err.message || "Failed to fetch doctors"
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>

.layout{
display:flex;
}

.content{
padding:30px;
flex:1;
background:#f4f6f8;
}

h1{
color:#1976d2;
margin-bottom:20px;
}

/* TABLE CARD */

table{
width:100%;
background:white;
border-collapse:collapse;
border-radius:10px;
overflow:hidden;
box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

/* HEADER */

th{
background:#1976d2;
color:white;
padding:12px;
text-align:left;
}

/* BODY */

td{
padding:10px;
border-bottom:1px solid #eee;
}

/* ROW HOVER */

tr:hover{
background:#f5f5f5;
}

</style>