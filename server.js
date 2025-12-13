const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    city TEXT,
    specialization TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER,
    doctorId INTEGER,
    date TEXT,
    time TEXT
  )`);
});

app.post("/signup", (req, res) => {
  const { name, email, password, role, city, specialization } = req.body;

  db.run(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, password, role],
    function () {
      if (role === "doctor") {
        db.run(
          "INSERT INTO doctors (userId,city,specialization) VALUES (?,?,?)",
          [this.lastID, city, specialization]
        );
      }
      res.json({ success: true });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, user) => {
      if (!user) return res.json({ success: false });
      res.json({ success: true, user });
    }
  );
});

app.get("/doctors/:city", (req, res) => {
  db.all(
    `SELECT doctors.id, users.name, specialization 
     FROM doctors JOIN users ON doctors.userId = users.id
     WHERE city=?`,
    [req.params.city],
    (err, rows) => res.json(rows)
  );
});

app.post("/book", (req, res) => {
  const { patientId, doctorId, date, time } = req.body;
  db.run(
    "INSERT INTO appointments (patientId,doctorId,date,time) VALUES (?,?,?,?)",
    [patientId, doctorId, date, time],
    () => res.json({ success: true })
  );
});

app.get("/doctorAppointments/:userId", (req, res) => {
  db.all(
    `SELECT users.name, date, time FROM appointments
     JOIN doctors ON appointments.doctorId = doctors.id
     JOIN users ON appointments.patientId = users.id
     WHERE doctors.userId=?`,
    [req.params.userId],
    (err, rows) => res.json(rows)
  );
});

app.listen(3000, () =>
  console.log("CityCare running → http://localhost:3000")
);
