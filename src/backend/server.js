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




app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});