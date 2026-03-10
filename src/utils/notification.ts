export function checkTomorrowDuty(events:any[], doctorName:string){

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate()+1)

const iso = tomorrow.toISOString().split("T")[0]

const myDuty = events.filter(
(e)=> e.date===iso && e.title.includes(doctorName)
)

return myDuty

}