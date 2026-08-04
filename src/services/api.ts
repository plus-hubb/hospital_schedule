import { createClient } from "@supabase/supabase-js"

// ตั้งค่า Supabase Client
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "https://bowdwbvrhpzqogqjwlfu.supabase.co"
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "sb_publishable_4f5nNiQy9WWhcu1gx27uoQ_DjueQCTA"

export const supabase = createClient(supabaseUrl, supabaseKey)

const STORAGE_KEY = "hospital-schedule-local"

// =====================
// INTERFACES & TYPES
// =====================
export interface DoctorData {
  name_doctor: string
  email?: string
  phone?: string
  password?: string
  id_group?: number | string | null
}

export interface ScheduleItem {
  id_doctor?: number | string
  id_group?: number | string | null
  date?: string
  duty_date?: string
  dutyDate?: string
  duty_type?: string
  type?: string
}

const normalizeScheduleRow = (row: any) => {
  const dutyDate =
    row?.duty_date ??
    row?.date ??
    row?.dutyDate ??
    row?.schedule_date ??
    row?.scheduled_date ??
    null

  const dutyType =
    row?.duty_type ??
    row?.type ??
    row?.dutyType ??
    null

  const nameDoctor =
    row?.name_doctor ??
    row?.doctor_name ??
    row?.doctors?.name_doctor ??
    row?.doctor?.name_doctor ??
    null

  const groupId =
    row?.id_group ??
    row?.group_id ??
    row?.doctors?.id_group ??
    row?.doctor?.id_group ??
    null

  return {
    id_schedule: row?.id_schedule ?? row?.id ?? row?.schedule_id ?? null,
    duty_date: dutyDate,
    duty_type: dutyType,
    name_doctor: nameDoctor,
    id_group: groupId,
  }
}

const readStoredSchedules = (): any[] => {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeStoredSchedules = (rows: any[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

// =====================
// GET DOCTORS
// =====================
export const getDoctors = async () => {
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

  return (data || []).map((d: any) => ({
    id_doctor: d.id_doctor,
    name_doctor: d.name_doctor,
    email: d.email,
    phone: d.phone,
    password: d.password,
    id_group: d.id_group,
    name_group: d.doctor_groups?.name_group || null
  }))
}

// =====================
// GET GROUPS
// =====================
export const getGroups = async () => {
  const { data, error } = await supabase
    .from("doctor_groups")
    .select("*")

  if (error) throw error
  return data
}

// =====================
// ADD DOCTOR
// =====================
export const addDoctor = async (doctorData: DoctorData) => {
  const { name_doctor, email, phone, password, id_group } = doctorData

  const { error } = await supabase
    .from("doctors")
    .insert([
      { name_doctor, email, phone, password, id_group }
    ])

  if (error) throw error
  return { message: "Doctor added" }
}

// =====================
// UPDATE DOCTOR
// =====================
export const updateDoctor = async (id: string | number, doctorData: Partial<DoctorData>) => {
  const { name_doctor, phone, password, id_group } = doctorData

  const { error } = await supabase
    .from("doctors")
    .update({ name_doctor, phone, password, id_group })
    .eq("id_doctor", id)

  if (error) throw error
  return { message: "Doctor updated" }
}

// =====================
// DELETE DOCTOR
// =====================
export const deleteDoctor = async (id: string | number) => {
  const { error } = await supabase
    .from("doctors")
    .delete()
    .eq("id_doctor", id)

  if (error) throw error
  return { message: "Doctor deleted" }
}

// =====================
// SAVE SCHEDULE
// =====================
export const saveSchedule = async (schedules: ScheduleItem[]) => {
  const formattedSchedules = (schedules || []).map(s => ({
    id_doctor: s.id_doctor,
    id_group: s.id_group,
    duty_date: s.date || s.duty_date || s.dutyDate,
    duty_type: s.duty_type || s.type,
  }))

  try {
    const { error } = await supabase
      .from("schedules")
      .insert(formattedSchedules)

    if (error) throw error
  } catch {
    // Fallback to local browser storage when the remote schema does not match
    writeStoredSchedules([...readStoredSchedules(), ...formattedSchedules])
  }

  return { message: "Schedule saved" }
}

// =====================
// GET SCHEDULE
// =====================
export const getSchedule = async () => {
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

    if (Array.isArray(data) && data.length > 0) {
      const normalized = data.map(normalizeScheduleRow)
      writeStoredSchedules(normalized)
      return normalized
    }
  } catch {
    // Ignore and fall back to locally stored schedules
  }

  return readStoredSchedules().map(normalizeScheduleRow)
}

// =====================
// DELETE MONTH SCHEDULE
// =====================
export const deleteScheduleByMonth = async (year: number | string, month: number | string) => {
  const formattedMonth = String(month).padStart(2, "0")
  const startDate = `${year}-${formattedMonth}-01`

  const lastDay = new Date(Number(year), Number(month), 0).getDate()
  const endDate = `${year}-${formattedMonth}-${String(lastDay).padStart(2, "0")}`

  const currentStored = readStoredSchedules().filter((row: any) => {
    const value = row?.duty_date || row?.date || row?.dutyDate || ""
    if (typeof value !== "string") return true
    const datePart = value.slice(0, 10)
    return datePart < startDate || datePart > endDate
  })

  writeStoredSchedules(currentStored)

  try {
    const { error } = await supabase
      .from("schedules")
      .delete()
      .gte("duty_date", startDate)
      .lte("duty_date", endDate)

    if (error) throw error
  } catch {
    // Ignore remote delete errors and keep the local fallback in sync
  }

  return { message: "Schedule deleted" }
}

// =====================
// LOGIN
// =====================
export const login = async (email: string, password: string) => {
  // 1. Check Admin
  const { data: adminResult, error: adminErr } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .eq("password", password)

  if (adminErr) throw adminErr

  if (adminResult && adminResult.length > 0) {
    return {
      role: "admin",
      user: adminResult[0]
    }
  }

  // 2. Check Doctor
  const { data: doctorResult, error: doctorErr } = await supabase
    .from("doctors")
    .select("*")
    .eq("email", email)
    .eq("password", password)

  if (doctorErr) throw doctorErr

  if (doctorResult && doctorResult.length > 0) {
    return {
      role: "doctor",
      user: doctorResult[0]
    }
  }

  throw new Error("Invalid email or password")
}