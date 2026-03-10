/**
 * scheduleGenerator.ts
 *
 * Pattern:
 *   จันทร์  → A[i] OPD  (บน)  +  B[i] Consult (ล่าง)
 *   อังคาร  → B[i] OPD         +  C[i] Consult
 *   พุธ     → C[i] OPD         +  D[i] Consult
 *   พฤหัส  → D[i] OPD         +  A[i] Consult
 *   ศุกร์   → 2 คน (pair วน A+B / C+D สลับสัปดาห์)
 *
 *   i = weekIndex  0→1→2→0→1→2 ...
 *   weekIndex เริ่มนับจากสัปดาห์ที่มี "3 มีนา" เป็น index 0
 *   → ผลลัพธ์: ทุกวันในสัปดาห์แรก (รวมอังคารที่ 3 มีนา) ใช้คนที่ 1 (A1,B1,C1,D1)
 *
 *   OPD   → extendedProps.order = 0  (render ก่อน = บน)
 *   Consult → extendedProps.order = 1  (render หลัง = ล่าง)
 *   FullCalendar เรียง event ตาม array order ดังนั้นเราใส่ OPD ก่อน Consult เสมอ
 */

// ─── วันหยุดราชการไทย 2026 ────────────────────────────────────────────────────

const THAI_HOLIDAYS: Record<string, string> = {
  "2026-01-01": "วันขึ้นปีใหม่",
  "2026-01-02": "ชดเชยวันขึ้นปีใหม่",
  "2026-02-13": "วันมาฆบูชา",
  "2026-03-02": "ชดเชยวันมาฆบูชา",
  "2026-04-06": "วันจักรี",
  "2026-04-13": "วันสงกรานต์",
  "2026-04-14": "วันสงกรานต์",
  "2026-04-15": "วันสงกรานต์",
  "2026-05-01": "วันแรงงานแห่งชาติ",
  "2026-05-04": "วันฉัตรมงคล",
  "2026-05-11": "วันวิสาขบูชา",
  "2026-05-13": "วันพืชมงคล",
  "2026-06-03": "วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี",
  "2026-07-09": "วันอาสาฬหบูชา",
  "2026-07-10": "วันเข้าพรรษา",
  "2026-07-28": "วันเฉลิมพระชนมพรรษา ร.10",
  "2026-08-12": "วันแม่แห่งชาติ",
  "2026-10-13": "วันสวรรคต ร.9",
  "2026-10-23": "วันปิยมหาราช",
  "2026-12-05": "วันพ่อแห่งชาติ",
  "2026-12-10": "วันรัฐธรรมนูญ",
  "2026-12-31": "วันสิ้นปี",
}


// ─── สี ──────────────────────────────────────────────────────────────────────

const GROUP_COLOR: Record<string, string> = {
  A: "#43a047",
  B: "#1e88e5",
  C: "#fb8c00",
  D: "#8e24aa",
}

const FRIDAY_COLOR = "#1ec9f4"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toIso(d: Date): string {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

function isWorkday(d: Date): boolean {
  const dow = d.getDay()
  if (dow === 0 || dow === 6) return false
  if (toIso(d) in THAI_HOLIDAYS) return false
  return true
}

/**
 * หา Monday ของสัปดาห์ที่ d อยู่ (normalize เป็น midnight)
 */
function getMondayOf(d: Date): Date {
  const day = d.getDay()                        // 0=Sun
  const diff = day === 0 ? -6 : 1 - day         // ถ้า Sun ถอยไป 6 วัน
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon
}

/**
 * weekIndex เทียบกับสัปดาห์ของ anchor (3 มีนา)
 * anchor week = index 0  →  1→2→0→1→2 ...
 */
function getWeekIndex(date: Date, anchorMonday: Date): number {
  const mon      = getMondayOf(date)
  const diffMs   = mon.getTime() - anchorMonday.getTime()
  const weeks    = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))
  return ((weeks % 3) + 3) % 3   // กัน negative, วน 0-1-2
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateDutyEvents(DOCTORS:any): Array<{
  title: string
  date: string
  color: string
}> {
  const events: Array<{ title: string; date: string; color: string }> = []

  const year      = new Date().getFullYear()
  const anchor    = new Date(year, 2, 3)        // 3 มีนา = anchor
  const anchorMon = getMondayOf(anchor)          // Monday ของสัปดาห์นั้น
  const endDate   = new Date(year, 11, 31)

  // เริ่มจาก anchor (3 มีนา) ไม่ใช่ 1 มีนา
  const cur = new Date(anchor)

  while (cur <= endDate) {
    if (isWorkday(cur)) {
      const iso = toIso(cur)
      const dow = cur.getDay()
      const wi  = getWeekIndex(cur, anchorMon)  // 0=A1B1, 1=A2B2, 2=A3B3

      if (dow === 1) {
        // จันทร์: A OPD (บน) → B Consult (ล่าง)
        events.push({ title: `${DOCTORS.A[wi]} OPD`,     date: iso, color: GROUP_COLOR.A })
        events.push({ title: `${DOCTORS.B[wi]} Consult`, date: iso, color: GROUP_COLOR.B })

      } else if (dow === 2) {
        // อังคาร: B OPD → C Consult
        events.push({ title: `${DOCTORS.B[wi]} OPD`,     date: iso, color: GROUP_COLOR.B })
        events.push({ title: `${DOCTORS.C[wi]} Consult`, date: iso, color: GROUP_COLOR.C })

      } else if (dow === 3) {
        // พุธ: C OPD → D Consult
        events.push({ title: `${DOCTORS.C[wi]} OPD`,     date: iso, color: GROUP_COLOR.C })
        events.push({ title: `${DOCTORS.D[wi]} Consult`, date: iso, color: GROUP_COLOR.D })

      } else if (dow === 4) {
        // พฤหัส: D OPD → A Consult
        events.push({ title: `${DOCTORS.D[wi]} OPD`,     date: iso, color: GROUP_COLOR.D })
        events.push({ title: `${DOCTORS.A[wi]} Consult`, date: iso, color: GROUP_COLOR.A })

      } else if (dow === 5) {
        // ศุกร์: 2 คน — pair วน A+B (wi คู่) / C+D (wi คี่)
        const pair = wi % 2 === 0
          ? (["A", "B"] as const)
          : (["C", "D"] as const)

        // OPD ก่อน (บน) Consult หลัง (ล่าง)
        events.push({ title: `${DOCTORS[pair[0]][wi % 3]} OPD`,     date: iso, color: FRIDAY_COLOR })
        events.push({ title: `${DOCTORS[pair[1]][wi % 3]} Consult`, date: iso, color: FRIDAY_COLOR })
      }
    }

    cur.setDate(cur.getDate() + 1)
  }

  return events
}

// ─── Holiday events ───────────────────────────────────────────────────────────

export function getThaiHolidayEvents(): Array<{
  title: string
  date: string
  color: string
}> {
  return Object.entries(THAI_HOLIDAYS).map(([date, name]) => ({
    title: name,
    date,
    color: "#ef5350",
  }))
}