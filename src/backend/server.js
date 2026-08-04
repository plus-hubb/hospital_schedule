import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const app = express()

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ==========================================
// SUPABASE CONFIGURATION
// ตั้งค่า SUPABASE_URL และ SUPABASE_KEY ใน Environment Variable หรือใส่ค่าลงไปโดยตรง
// ==========================================
const supabaseUrl = process.env.SUPABASE_URL || "https://bowdwbvrhpzqogqjwlfu.supabase.co"
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_4f5nNiQy9WWhcu1gx27uoQ_DjueQCTA"
const supabase = createClient(supabaseUrl, supabaseKey)

// =====================
// GET DOCTORS
// =====================
app.get("/doctors", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select(`
        id_doctor,
        name_doctor,
        email,
        phone,
        password,
        id_group,
        doctor_groups ( name_group )
      `)

    if (error) throw error

    // Transform structure ให้เหมือน SQL JOIN เดิม (ส่ง name_group ออกไปโดยตรง)
    const formattedData = data.map(d => ({
      id_doctor: d.id_doctor,
      name_doctor: d.name_doctor,
      email: d.email,
      phone: d.phone,
      password: d.password,
      id_group: d.id_group,
      name_group: d.doctor_groups?.name_group || null
    }))

    res.json(formattedData)
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// GET GROUPS
// =====================
app.get("/groups", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("doctor_groups")
      .select("*")

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// ADD DOCTOR
// =====================
app.post("/doctors", async (req, res) => {
  const { name_doctor, email, phone, password, id_group } = req.body

  try {
    const { error } = await supabase
      .from("doctors")
      .insert([
        { name_doctor, email, phone, password, id_group }
      ])

    if (error) throw error
    res.json({ message: "Doctor added" })
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// UPDATE DOCTOR
// =====================
app.put("/doctors/:id", async (req, res) => {
  const { name_doctor, phone, password, id_group } = req.body

  try {
    const { error } = await supabase
      .from("doctors")
      .update({ name_doctor, phone, password, id_group })
      .eq("id_doctor", req.params.id)

    if (error) throw error
    res.json({ message: "Doctor updated" })
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// DELETE DOCTOR
// =====================
app.delete("/doctors/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("doctors")
      .delete()
      .eq("id_doctor", req.params.id)

    if (error) throw error
    res.json({ message: "Doctor deleted" })
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// SAVE SCHEDULE
// =====================
app.post("/schedule", async (req, res) => {
  const schedules = req.body

  // แปลง Array จาก Request Body ให้ตรงกับ Column ของ Supabase Table
  const formattedSchedules = schedules.map(s => ({
    id_doctor: s.id_doctor,
    id_group: s.id_group,
    duty_date: s.date,
    duty_type: s.duty_type
  }))

  try {
    const { error } = await supabase
      .from("schedules") // *หมายเหตุ: หากชื่อตารางใน Supabase คือ schedules ให้เปลี่ยนตาม
      .insert(formattedSchedules)

    if (error) throw error
    res.json({ message: "Schedule saved" })
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// GET SCHEDULE
// =====================
app.get("/schedule", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("schedules")
      .select(`
        id_schedule,
        duty_date,
        duty_type,
        doctors (
          name_doctor,
          id_group
        )
      `)
      .order("duty_date", { ascending: true })

    if (error) throw error

    // Transform Structure ให้ตรงกับผลลัพธ์ SQL JOIN เดิม
    const formattedData = data.map(s => ({
      id_schedule: s.id_schedule,
      duty_date: s.duty_date,
      duty_type: s.duty_type,
      name_doctor: s.doctors?.name_doctor || null,
      id_group: s.doctors?.id_group || null
    }))

    res.json(formattedData)
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// DELETE MONTH
// =====================
app.delete("/schedule/:year/:month", async (req, res) => {
  const { year, month } = req.params

  // คำนวณวันเริ่มต้นและวันสิ้นสุดของเดือนนั้นๆ
  const formattedMonth = month.padStart(2, "0")
  const startDate = `${year}-${formattedMonth}-01`
  
  // หาวันสุดท้ายของเดือน
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${formattedMonth}-${lastDay}`

  try {
    const { error } = await supabase
      .from("schedules")
      .delete()
      .gte("duty_date", startDate)
      .lte("duty_date", endDate)

    if (error) throw error
    res.json({ message: "Schedule deleted" })
  } catch (err) {
    res.status(500).json(err)
  }
})

// =====================
// LOGIN
// =====================
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    // 1. Check Admin
    const { data: adminResult, error: adminErr } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)

    if (adminErr) throw adminErr

    if (adminResult && adminResult.length > 0) {
      return res.json({
        role: "admin",
        user: adminResult[0]
      })
    }

    // 2. Check Doctor
    const { data: doctorResult, error: doctorErr } = await supabase
      .from("doctors")
      .select("*")
      .eq("email", email)
      .eq("password", password)

    if (doctorErr) throw doctorErr

    if (doctorResult && doctorResult.length > 0) {
      return res.json({
        role: "doctor",
        user: doctorResult[0]
      })
    }

    // Fail
    res.status(401).json({
      message: "Invalid email or password"
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/", (req, res) => {
  res.send("Hospital API running")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})