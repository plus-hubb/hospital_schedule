<script setup lang="ts">
import { ref, onMounted } from "vue"
import Navbar from "../../components/Navbar.vue"
// 🟢 Import ฟังก์ชัน CRUD จาก api.ts
import { 
  getDoctors, 
  getGroups, 
  addDoctor as addDoctorApi, 
  updateDoctor as updateDoctorApi, 
  deleteDoctor as deleteDoctorApi 
} from "../../services/api"

interface Doctor {
  id_doctor: number
  name_doctor: string
  email: string
  phone: string
  password?: string
  id_group: number
  name_group?: string
}

interface Group {
  id_group: number
  name_group: string
}

const doctors = ref<Doctor[]>([])
const groups = ref<Group[]>([])
const loading = ref(false)
const error = ref("")

const newDoctor = ref({
  name_doctor: "",
  email: "",
  phone: "",
  password: "",
  id_group: 1
})

const editingDoctor = ref<Doctor | null>(null)

// 🟢 FETCH DOCTORS & GROUPS (ผ่าน Supabase)
const loadData = async () => {
  error.value = ""
  loading.value = true
  try {
    const [doctorsData, groupsData] = await Promise.all([
      getDoctors(),
      getGroups()
    ])
    doctors.value = doctorsData || []
    groups.value = groupsData || []
  } catch (err: any) {
    console.error("Error loading data:", err)
    error.value = err.message || "Failed to load data"
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 🟢 ADD DOCTOR
const addDoctor = async () => {
  try {
    await addDoctorApi(newDoctor.value)
    await loadData()

    // Reset Form
    newDoctor.value = {
      name_doctor: "",
      email: "",
      phone: "",
      password: "",
      id_group: 1
    }
  } catch (err: any) {
    alert("เพิ่มข้อมูลไม่สำเร็จ: " + (err.message || err))
  }
}

// 🟢 DELETE DOCTOR
const deleteDoctor = async (id: number) => {
  if (!confirm("คุณต้องการลบข้อมูลแพทย์คนนี้ใช่หรือไม่?")) return

  try {
    await deleteDoctorApi(id)
    await loadData()
  } catch (err: any) {
    alert("ลบข้อมูลไม่สำเร็จ: " + (err.message || err))
  }
}

// 🟢 EDIT DOCTOR
const startEdit = (doctor: Doctor) => {
  editingDoctor.value = { ...doctor }
}

const updateDoctor = async () => {
  if (!editingDoctor.value) return

  try {
    await updateDoctorApi(editingDoctor.value.id_doctor, editingDoctor.value)
    editingDoctor.value = null
    await loadData()
  } catch (err: any) {
    alert("แก้ไขข้อมูลไม่สำเร็จ: " + (err.message || err))
  }
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