/**
 * scheduleGenerator.ts
 *
 * Pattern:
 *   จันทร์  → A[i] OPD  (บน)  +  B[i] Consult (ล่าง)
 *   อังคาร  → B[i] OPD         +  C[i] Consult
 *   พุธ     → C[i] OPD         +  D[i] Consult
 *   พฤหัส  → D[i] OPD         +  A[i] Consult
 *   ศุกร์   → 2 คน (pair วน A+B / B+C / C+D / D+A)
 *
 *   i = weekIndex
 *   rotation จะใช้ weekIndex % จำนวนคนใน group
 */

// ─── Thai Holidays Dynamic ─────────────────────────

function getThaiHolidays(year:number):Record<string,string>{

return{

[`${year}-01-01`]:"วันขึ้นปีใหม่",
[`${year}-01-02`]:"ชดเชยวันขึ้นปีใหม่",

[`${year}-02-13`]:"วันมาฆบูชา",
[`${year}-03-02`]:"ชดเชยวันมาฆบูชา",

[`${year}-04-06`]:"วันจักรี",

[`${year}-04-13`]:"วันสงกรานต์",
[`${year}-04-14`]:"วันสงกรานต์",
[`${year}-04-15`]:"วันสงกรานต์",

[`${year}-05-01`]:"วันแรงงานแห่งชาติ",
[`${year}-05-04`]:"วันฉัตรมงคล",
[`${year}-05-11`]:"วันวิสาขบูชา",
[`${year}-05-13`]:"วันพืชมงคล",

[`${year}-06-03`]:"วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี",

[`${year}-07-09`]:"วันอาสาฬหบูชา",
[`${year}-07-10`]:"วันเข้าพรรษา",

[`${year}-07-28`]:"วันเฉลิมพระชนมพรรษา ร.10",

[`${year}-08-12`]:"วันแม่แห่งชาติ",

[`${year}-10-13`]:"วันสวรรคต ร.9",
[`${year}-10-23`]:"วันปิยมหาราช",

[`${year}-12-05`]:"วันพ่อแห่งชาติ",
[`${year}-12-10`]:"วันรัฐธรรมนูญ",
[`${year}-12-31`]:"วันสิ้นปี",

}

}

// ─── Colors ─────────────────────────────────────────

const GROUP_COLOR:Record<string,string>={
A:"#43a047",
B:"#1e88e5",
C:"#fb8c00",
D:"#8e24aa",
}

const FRIDAY_COLOR="#1ec9f4"

// ─── Helpers ────────────────────────────────────────

function toIso(d:Date):string{

const y=d.getFullYear()
const m=String(d.getMonth()+1).padStart(2,"0")
const dd=String(d.getDate()).padStart(2,"0")

return `${y}-${m}-${dd}`

}

function getMondayOf(d:Date):Date{

const day=d.getDay()
const diff=day===0?-6:1-day

const mon=new Date(d)

mon.setDate(d.getDate()+diff)
mon.setHours(0,0,0,0)

return mon

}

function getWeekIndex(date:Date,anchorMonday:Date):number{

const mon=getMondayOf(date)

const diffMs=mon.getTime()-anchorMonday.getTime()

return Math.floor(diffMs/(7*24*60*60*1000))

}

function pick(group:string[],weekIndex:number):string{

if(!group||group.length===0) return "N/A"

return group[weekIndex%group.length]

}

// ─── Main ───────────────────────────────────────────

export function generateDutyEvents(
DOCTORS:any,
year:number
):Array<{title:string,date:string,color:string}>{

const events:Array<{title:string,date:string,color:string}>=[]

const THAI_HOLIDAYS=getThaiHolidays(year)

function isWorkday(d:Date):boolean{

const dow=d.getDay()

if(dow===0||dow===6) return false

if(toIso(d) in THAI_HOLIDAYS) return false

return true

}

const anchor=new Date(year,0,3)
const anchorMon=getMondayOf(anchor)

const endDate=new Date(year,11,31)

const cur=new Date(anchor)

while(cur<=endDate){

if(isWorkday(cur)){

const iso=toIso(cur)
const dow=cur.getDay()
const wi=getWeekIndex(cur,anchorMon)

if(dow===1){

events.push({
title:`${pick(DOCTORS.A,wi)} OPD`,
date:iso,
color:GROUP_COLOR.A
})

events.push({
title:`${pick(DOCTORS.B,wi)} Consult`,
date:iso,
color:GROUP_COLOR.B
})

}

else if(dow===2){

events.push({
title:`${pick(DOCTORS.B,wi)} OPD`,
date:iso,
color:GROUP_COLOR.B
})

events.push({
title:`${pick(DOCTORS.C,wi)} Consult`,
date:iso,
color:GROUP_COLOR.C
})

}

else if(dow===3){

events.push({
title:`${pick(DOCTORS.C,wi)} OPD`,
date:iso,
color:GROUP_COLOR.C
})

events.push({
title:`${pick(DOCTORS.D,wi)} Consult`,
date:iso,
color:GROUP_COLOR.D
})

}

else if(dow===4){

events.push({
title:`${pick(DOCTORS.D,wi)} OPD`,
date:iso,
color:GROUP_COLOR.D
})

events.push({
title:`${pick(DOCTORS.A,wi)} Consult`,
date:iso,
color:GROUP_COLOR.A
})

}

else if(dow===5){

const fridayPairs:[string,string][]=[
["A","B"],
["B","C"],
["C","D"],
["D","A"]
]

const pair=fridayPairs[wi%fridayPairs.length]!

const d1=pick(DOCTORS[pair[0]],wi)
const d2=pick(DOCTORS[pair[1]],wi)

events.push({
title:`${d1} OPD`,
date:iso,
color:FRIDAY_COLOR
})

events.push({
title:`${d2} Consult`,
date:iso,
color:FRIDAY_COLOR
})

}

}

cur.setDate(cur.getDate()+1)

}

return events

}

// ─── Holiday events ─────────────────────────────────

export function getThaiHolidayEvents(
year:number
):Array<{title:string,date:string,color:string}>{

const holidays=getThaiHolidays(year)

return Object.entries(holidays).map(([date,name])=>({

title:name,
date,
color:"#ef5350"

}))

}