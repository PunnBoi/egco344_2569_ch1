//loololololo

const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock student data
const students = [
  { id: 'E001', name: 'Alice Johnson', department: 'Computer Engineering', gpa: 3.85 },
  { id: 'E002', name: 'Bob Smith', department: 'Computer Engineering', gpa: 3.72 },
  { id: 'E003', name: 'Carol Davis', department: 'Electrical Engineering', gpa: 3.91 },
  { id: 'E004', name: 'David Wilson', department: 'Electrical Engineering', gpa: 3.65 },
  { id: 'E005', name: 'Emma Brown', department: 'Civil Engineering', gpa: 3.78 },
  { id: 'E006', name: 'Frank Miller', department: 'Civil Engineering', gpa: 3.88 },
  { id: 'E007', name: 'Grace Lee', department: 'Mechanical Engineering', gpa: 3.92 },
  { id: 'E008', name: 'Henry Taylor', department: 'Mechanical Engineering', gpa: 3.70 },
];

// API: Get all students with GPA grouped by department
app.get('/api/students/gpa', (req, res) => {
  const grouped = students.reduce((acc, student) => {
    if (!acc[student.department]) {
      acc[student.department] = [];
    }
    acc[student.department].push({
      id: student.id,
      name: student.name,
      gpa: student.gpa,
    });
    return acc;
  }, {});

  res.json({
    success: true,
    data: grouped,
  });
});

// API: Get individual student GPA by student ID
app.get('/api/students/:id/gpa', (req, res) => {
  const student = students.find((s) => s.id === req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found`,
    });
  }

  res.json({
    success: true,
    data: {
      id: student.id,
      name: student.name,
      department: student.department,
      gpa: student.gpa,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});