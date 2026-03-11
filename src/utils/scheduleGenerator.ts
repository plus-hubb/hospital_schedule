/**
 * scheduleGenerator.ts
 */

const GROUP_COLOR:Record<string,string>={
A:"#43a047",
B:"#1e88e5",
C:"#fb8c00",
D:"#8e24aa",
}

const FRIDAY_COLOR="#1ec9f4"

function toIso(d:Date){
const y=d.getFullYear()
const m=String(d.getMonth()+1).padStart(2,"0")
const dd=String(d.getDate()).padStart(2,"0")
return `${y}-${m}-${dd}`
}

function getMondayOf(d:Date){
const day=d.getDay()
const diff=day===0?-6:1-day
const mon=new Date(d)
mon.setDate(d.getDate()+diff)
mon.setHours(0,0,0,0)
return mon
}

function getWeekIndex(date:Date,anchorMonday:Date){
const mon=getMondayOf(date)
const diffMs=mon.getTime()-anchorMonday.getTime()
return Math.floor(diffMs/(7*24*60*60*1000))
}

function pick(group:any[],weekIndex:number){
if(!group||group.length===0) return null
return group[weekIndex%group.length]
}

export function generateDutyEvents(
DOCTORS:any,
year:number,
month:number
){

const events:any[]=[]

function isWorkday(d:Date){

const dow=d.getDay()

if(dow===0||dow===6) return false

return true
}

const anchor=new Date(year,0,3)
const anchorMon=getMondayOf(anchor)

const start=new Date(year,month,1)
const end=new Date(year,month+1,0)

const cur=new Date(start)

while(cur<=end){

if(isWorkday(cur)){

const iso=toIso(cur)
const dow=cur.getDay()
const wi=getWeekIndex(cur,anchorMon)

if(dow===1){

const d1=pick(DOCTORS.A,wi)
const d2=pick(DOCTORS.B,wi)

events.push({
title:`${d1.name_doctor} OPD`,
date:iso,
color:GROUP_COLOR.A,
id_doctor:d1.id_doctor,
id_group:1,
duty_type:"OPD"
})

events.push({
title:`${d2.name_doctor} Consult`,
date:iso,
color:GROUP_COLOR.B,
id_doctor:d2.id_doctor,
id_group:2,
duty_type:"Consult"
})

}

else if(dow===2){

const d1=pick(DOCTORS.B,wi)
const d2=pick(DOCTORS.C,wi)

events.push({
title:`${d1.name_doctor} OPD`,
date:iso,
color:GROUP_COLOR.B,
id_doctor:d1.id_doctor,
id_group:2,
duty_type:"OPD"
})

events.push({
title:`${d2.name_doctor} Consult`,
date:iso,
color:GROUP_COLOR.C,
id_doctor:d2.id_doctor,
id_group:3,
duty_type:"Consult"
})

}

else if(dow===3){

const d1=pick(DOCTORS.C,wi)
const d2=pick(DOCTORS.D,wi)

events.push({
title:`${d1.name_doctor} OPD`,
date:iso,
color:GROUP_COLOR.C,
id_doctor:d1.id_doctor,
id_group:3,
duty_type:"OPD"
})

events.push({
title:`${d2.name_doctor} Consult`,
date:iso,
color:GROUP_COLOR.D,
id_doctor:d2.id_doctor,
id_group:4,
duty_type:"Consult"
})

}

else if(dow===4){

const d1=pick(DOCTORS.D,wi)
const d2=pick(DOCTORS.A,wi)

events.push({
title:`${d1.name_doctor} OPD`,
date:iso,
color:GROUP_COLOR.D,
id_doctor:d1.id_doctor,
id_group:4,
duty_type:"OPD"
})

events.push({
title:`${d2.name_doctor} Consult`,
date:iso,
color:GROUP_COLOR.A,
id_doctor:d2.id_doctor,
id_group:1,
duty_type:"Consult"
})

}

else if(dow===5){

const fridayPairs:[string,string][] = [
["A","B"],
["B","C"],
["C","D"],
["D","A"]
]
const pair = fridayPairs[wi % fridayPairs.length]!

const d1=pick(DOCTORS[pair[0]],wi)
const d2=pick(DOCTORS[pair[1]],wi)

events.push({
title:`${d1.name_doctor} OPD`,
date:iso,
color:FRIDAY_COLOR,
id_doctor:d1.id_doctor,
id_group:d1.id_group,
duty_type:"OPD"
})

events.push({
title:`${d2.name_doctor} Consult`,
date:iso,
color:FRIDAY_COLOR,
id_doctor:d2.id_doctor,
id_group:d2.id_group,
duty_type:"Consult"
})

}

}

cur.setDate(cur.getDate()+1)

}

return events

}

export function getThaiHolidayEvents(year:number){

return [

{
title:"New Year",
date:`${year}-01-01`,
color:"#e53935"
},

{
title:"Labour Day",
date:`${year}-05-01`,
color:"#e53935"
},

{
title:"King Birthday",
date:`${year}-07-28`,
color:"#e53935"
},

{
title:"Mother Day",
date:`${year}-08-12`,
color:"#e53935"
},

{
title:"Father Day",
date:`${year}-12-05`,
color:"#e53935"
},

{
title:"New Year's Eve",
date:`${year}-12-31`,
color:"#e53935"
}

]

}