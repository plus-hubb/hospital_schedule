import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "centerbeam.proxy.rlwy.net",   // ปกติเป็น localhost
  port: 20615,
  user: "root",
  password: "QYfXjUFTWJkUJhhROXGeAHNdHGijEmfG",
  database: "railway"
});


//test connection database
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connect error:", err);
    return;
  }
  console.log("✅ MySQL Connected!");
});
app.get("/db-test", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) res.send("DB ERROR");
    else res.send("DB OK");
  });
});

// API ดึงรายชื่อแพทย์
app.get("/doctors", (req, res) => {

const sql = `
SELECT 
d.name_doctor,
d.email,
d.phone,
g.name_group
FROM doctors d
JOIN doctor_groups g
ON d.id_group = g.id_group
`;

db.query(sql,(err,result)=>{
if(err){
console.log(err)
return res.status(500).json(err)
}

res.json(result)

})

});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});