const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_PATH = path.join(__dirname, 'data', 'students.json');

function loadStudents() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load students.json:', err);
    return [];
  }
}

// GET /api/gpas
// Returns all students' GPAs grouped by department, plus per-department averages.
app.get('/api/gpas', (req, res) => {
  const students = loadStudents();
  const deptMap = {};

  students.forEach(s => {
    const dept = s.department || 'Unknown';
    if (!deptMap[dept]) deptMap[dept] = [];
    deptMap[dept].push({ id: s.id, name: s.name, gpa: s.gpa });
  });

  const averages = {};
  Object.keys(deptMap).forEach(dept => {
    const list = deptMap[dept];
    const sum = list.reduce((acc, cur) => acc + (Number(cur.gpa) || 0), 0);
    averages[dept] = list.length ? +(sum / list.length).toFixed(2) : 0;
  });

  res.json({ departments: deptMap, averages });
});

// GET /api/gpa/:id
// Returns a single student's record (including GPA) by student ID.
app.get('/api/gpa/:id', (req, res) => {
  const id = req.params.id;
  const students = loadStudents();
  const student = students.find(s => String(s.id) === String(id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

app.get('/', (req, res) => {
  res.send('Faculty of Engineering — GPA API. Use /api/gpas or /api/gpa/:id');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
