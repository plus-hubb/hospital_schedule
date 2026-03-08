import express from "express"
import cors from "cors"
import mysql from "mysql2"

const app = express()

app.use(cors())
app.use(express.json())

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
INSERT INTO doctors
(name_doctor,email,phone,password,id_group,role)
VALUES(?,?,?,?,?,?)
`

db.query(sql,
[
name_doctor,
email,
phone,
password,
id_group,
"doctor"
],
(err)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor added"})

})

})


// =====================
// UPDATE DOCTOR
// =====================

app.put("/doctors/:email",(req,res)=>{

const {name_doctor,phone,password,id_group}=req.body

const sql=`
UPDATE doctors
SET name_doctor=?, phone=?, password=?, id_group=?
WHERE email=?
`

db.query(sql,
[name_doctor,phone,password,id_group,req.params.email],
(err)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor updated"})

})

})


// =====================
// DELETE
// =====================

app.delete("/doctors/:email",(req,res)=>{

const sql="DELETE FROM doctors WHERE email=?"

db.query(sql,[req.params.email],(err)=>{

if(err) return res.status(500).json(err)

res.json({message:"Doctor deleted"})

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

app.listen(3000,()=>{
console.log("Server running http://localhost:3000")
})