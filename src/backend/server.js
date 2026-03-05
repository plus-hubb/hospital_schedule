import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "3306",
  user: "plus",
  password: "root",
  database: "hospital_schedule"
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

app.listen(3000);