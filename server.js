const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* ===== In-memory data ===== */
const availableCourses = [
  { code: "CS401", name: "Advanced Web Development", instructor: "Dr. Smith", credits: 3, capacity: 30 },
  { code: "CS402", name: "Database Systems", instructor: "Dr. Patel", credits: 3, capacity: 35 },
  { code: "CS403", name: "Software Engineering", instructor: "Dr. Lee", credits: 3, capacity: 40 },
  { code: "CS404", name: "Computer Networks", instructor: "Dr. Zhao", credits: 3, capacity: 30 },
  { code: "CS405", name: "Artificial Intelligence", instructor: "Dr. Gomez", credits: 3, capacity: 25 }
];
const enrollments = [];
let enrollmentIdCounter = 1;

const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const studentIdOk = id => /^\d{4}-\d{4}$/.test(String(id || ''));
const courseByCode = code => availableCourses.find(c => c.code === code);

const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title><link rel="stylesheet" href="/css/style.css"/></head>
<body>
  <header class="site-header">
    <h1>MegaUniversity — Course Enrollment</h1>
    <nav class="nav">
      <a href="/">Enroll</a>
      <a href="/enrollments">Enrollments</a>
      <a href="/courses">Courses</a>
    </nav>
  </header>
  <main class="container">${body}</main>
  <footer class="footer"><small>Complete the TODOs in server.js, index.html, and style.css.</small></footer>
</body></html>`;

/* ===== Routes ===== */

// Home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Handle enrollment
app.post('/enroll', (req, res) => {
  const { studentName, studentId, courseCode, semester, reason } = req.body;

  if (!studentName || !studentId || !courseCode || !semester || !studentIdOk(studentId)) {
    return res.status(400).send(page('Error', `<h2>Invalid input</h2><p><a href="/">Back</a></p>`));
  }

  const course = courseByCode(courseCode);
  if (!course) {
    return res.status(400).send(page('Error', `<h2>Course not found</h2><p><a href="/">Back</a></p>`));
  }

  const newEnroll = {
    id: enrollmentIdCounter++,
    studentName: escape(studentName),
    studentId: escape(studentId),
    courseCode: escape(courseCode),
    courseName: escape(course.name),
    semester: escape(semester),
    reason: escape(reason || ''),
    enrollmentDate: Date.now()
  };

  enrollments.push(newEnroll);
  res.redirect('/enrollments');
});

// Enrollments list
app.get('/enrollments', (req, res) => {
  const rows = enrollments.map((e, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escape(e.studentName)}</td>
      <td>${escape(e.studentId)}</td>
      <td>${escape(e.courseCode)} — ${escape(e.courseName)}</td>
      <td>${escape(e.semester)}</td>
      <td>${new Date(e.enrollmentDate).toLocaleString()}</td>
      <td>
        <form action="/unenroll/${e.id}" method="POST" onsubmit="return confirm('Remove this enrollment?')">
          <button class="danger small" type="submit">Unenroll</button>
        </form>
      </td>
    </tr>
  `).join('');

  const body = `
    <section class="card">
      <h2>Current Enrollments</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Student ID</th><th>Course</th><th>Semester</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="7" class="muted">No enrollments yet</td></tr>'}</tbody>
        </table>
      </div>
    </section>`;

  res.send(page('Enrollments', body));
});

// Courses list
app.get('/courses', (req, res) => {
  const cards = availableCourses.map(c => `
    <article class="card">
      <h3>${escape(c.code)}: ${escape(c.name)}</h3>
      <p><strong>Instructor:</strong> ${escape(c.instructor)}</p>
      <p><strong>Credits:</strong> ${escape(c.credits)}</p>
      <p><strong>Capacity:</strong> ${escape(c.capacity)}</p>
    </article>
  `).join('');

  const body = `<section class="grid">${cards}</section>`;
  res.send(page('Courses', body));
});

// Unenroll
app.post('/unenroll/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = enrollments.findIndex(e => e.id === id);

  if (index !== -1) {
    enrollments.splice(index, 1);
  }

  res.redirect('/enrollments');
});

// 404 handler
app.use((req, res) => res.status(404).send(page('Not Found', '<p>Page not found.</p>')));

app.listen(PORT, () => console.log(`Starter running on http://localhost:${PORT}`));
