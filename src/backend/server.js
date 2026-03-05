import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",   // ปกติเป็น localhost
  port: 3306,
  user: "root",
  password: "root",
  database: "hospital_schedule"
});

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
app.get("/schedule", (req, res) => {

  const sql = `
  SELECT 
  schedules.date,
  doctors.name_doctor,
  departments.name_department
  FROM schedules
  JOIN doctors ON schedules.id_doctor = doctors.id_doctor
  JOIN departments ON schedules.id_department = departments.id_department
  `;

  db.query(sql, (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});