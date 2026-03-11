import express from "express"
import cors from "cors"
import mysql from "mysql2"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = mysql.createConnection({
  host: "centerbeam.proxy.rlwy.net",
  port: 20615,
  user: "root",
  password: "QYfXjUFTWJkUJhhROXGeAHNdHGijEmfG",
  database: "railway"
})

db.connect(err=>{
if(err) console.log(err)
else console.log("MySQL Connected")
})


// =====================
// GET DOCTORS
// =====================

app.get("/doctors",(req,res)=>{

const sql=`
SELECT 

d.id_doctor,
d.name_doctor,
d.email,
d.phone,
d.password,
d.id_group,
g.name_group
FROM doctors d
JOIN doctor_groups g
ON d.id_group = g.id_group
`

db.query(sql,(err,result)=>{
if(err) return res.status(500).json(err)
res.json(result)
})

})


// =====================
// GET GROUPS
// =====================

app.get("/groups",(req,res)=>{

db.query("SELECT * FROM doctor_groups",(err,result)=>{
if(err) return res.status(500).json(err)
res.json(result)
})

})


// =====================
// ADD DOCTOR
// =====================

app.post("/doctors",(req,res)=>{

const {name_doctor,email,phone,password,id_group}=req.body

const sql=`
INSERT INTO doctors (name_doctor,email,phone,password,id_group)
VALUES (?,?,?,?,?)
`

db.query(sql,
[name_doctor,email,phone,password,id_group],
(err,result)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor added"})

})

})



// =====================
// UPDATE DOCTOR
// =====================

app.put("/doctors/:id",(req,res)=>{

const {name_doctor,phone,password,id_group}=req.body

const sql=`
UPDATE doctors
SET name_doctor=?, phone=?, password=?, id_group=?
WHERE id_doctor=?
`

db.query(sql,
[name_doctor,phone,password,id_group,req.params.id],
(err)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor updated"})

})

})

// =====================
// DELETE DOCTOR
// =====================

app.delete("/doctors/:id",(req,res)=>{

const sql=`
DELETE FROM doctors
WHERE id_doctor=?
`

db.query(sql,[req.params.id],(err)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor deleted"})

})

})


// =====================
// SAVE SCHEDULE
// =====================

app.post("/schedule",(req,res)=>{

const schedules = req.body

const values = schedules.map(s=>[
s.id_doctor,
s.id_group,
s.date,
s.duty_type
])

const sql = `
INSERT INTO schedule
(id_doctor,id_group,duty_date,duty_type)
VALUES ?
`

db.query(sql,[values],(err)=>{

if(err) return res.status(500).json(err)

res.json({
message:"Schedule saved"
})

})

})


// =====================
// GET SCHEDULE
// =====================

app.get("/schedule",(req,res)=>{

const sql=`
SELECT
s.id_schedule,
s.duty_date,
s.duty_type,
d.name_doctor,
d.id_group
FROM schedule s
JOIN doctors d
ON s.id_doctor = d.id_doctor
ORDER BY s.duty_date
`

db.query(sql,(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result)

})

})


// =====================
// DELETE MONTH
// =====================

app.delete("/schedule/:year/:month",(req,res)=>{

const {year,month}=req.params

const sql=`
DELETE FROM schedule
WHERE YEAR(duty_date)=?
AND MONTH(duty_date)=?
`

db.query(sql,[year,month],(err)=>{

if(err) return res.status(500).json(err)

res.json({
message:"Schedule deleted"
})

})

})


// log in 

app.post("/login", (req,res)=>{

const {email,password} = req.body

// check admin
const adminSQL = "SELECT * FROM admins WHERE email=? AND password=?"

db.query(adminSQL,[email,password],(err,adminResult)=>{

if(adminResult.length > 0){

return res.json({
role:"admin",
user:adminResult[0]
})

}

// check doctor
const doctorSQL = "SELECT * FROM doctors WHERE email=? AND password=?"

db.query(doctorSQL,[email,password],(err,doctorResult)=>{

if(doctorResult.length > 0){

return res.json({
role:"doctor",
user:doctorResult[0]
})

}

res.status(401).json({
message:"Invalid email or password"
})

})

})

})

app.get("/", (req,res)=>{
  res.send("Hospital API running")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});