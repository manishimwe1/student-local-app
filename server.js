const express = require("express");
const Sqlite = require("sqlite3");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Serve static frontend files from the root directory
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

// Connect to SQLite database
const db = new Sqlite.Database("./database/attendanceList.db", (err) => {
  if (err) {
    console.log("Failed to connect to DB:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS attendanceList (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    location TEXT NOT NULL,
    age INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS studentGrade (
    id INTEGER,
    subjectSelected TEXT NOT NULL,
    TypeSelected TEXT NOT NULL,
    point INTEGER NOT NULL,
    maxPoint INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API Routes
app.get("/api/attendance", (req, res) => {
  db.all(`SELECT * FROM attendanceList ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(rows);
  });
});

app.get("/grade/:id", (req, res) => {
  const id = req.params.id;
  db.all(`SELECT * FROM studentGrade WHERE id = ? ORDER BY created_at DESC`, [id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch grades" });
    }
    res.json(rows);
  });
});

app.get("/student/:id", (req, res) => {
  const studentId = req.params.id;
  db.all(`SELECT * FROM attendanceList WHERE id = ?`, [studentId], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch student" });
    }
    res.json(rows);
  });
});

app.post("/api/save", (req, res) => {
  const { userName, userLocation, userAge } = req.body;
  if (!userName || !userLocation || !userAge) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO attendanceList (userName, location, age) VALUES (?, ?, ?)`;
  db.run(query, [userName, userLocation, userAge], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.json({ success: true });
  });
});

app.post("/api/save-grade", (req, res) => {
  const { id, subjectSelected, TypeSelected, point, maxPoint } = req.body;
  if (!id || !subjectSelected || !TypeSelected || !point || !maxPoint) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO studentGrade (id, subjectSelected, TypeSelected, point, maxPoint) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [id, subjectSelected, TypeSelected, point, maxPoint], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save grade" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const studentId = req.params.id;
  if (!studentId) return res.status(400).json({ error: "Missing ID" });

  db.run(`DELETE FROM attendanceList WHERE id = ?`, [studentId], (err) => {
    if (err) console.log("Error deleting student:", err);
  });

  db.run(`DELETE FROM studentGrade WHERE id = ?`, [studentId], (err) => {
    if (err) console.log("Error deleting grades:", err);
  });

  res.json({ success: true });
});

app.put("/api/update/:id", (req, res) => {
  const studentId = req.params.id;
  const { userName, userLocation, userAge } = req.body;

  if (!studentId || !userName || !userLocation || !userAge) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
    `UPDATE attendanceList SET userName = ?, location = ?, age = ? WHERE id = ?`,
    [userName, userLocation, userAge, studentId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update student" });
      }
      res.json({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
