// === MegaUniversity — Course Enrollment (Starter with TODOs) ===
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== Middleware (order matters) ===== */

// Use built-in body parser for HTML forms
app.use(express.urlencoded({ extended: true }));

/* ===== In-memory data ===== */
const availableCourses = [
  { code: "CS401", name: "Advanced Web Development", instructor: "Dr. Smith", credits: 3, capacity: 30 },
  { code: "CS402", name: "Database Systems",          instructor: "Dr. Patel", credits: 3, capacity: 35 },
  { code: "CS403", name: "Software Engineering",      instructor: "Dr. Lee",   credits: 3, capacity: 40 },
  { code: "CS404", name: "Computer Networks",         instructor: "Dr. Zhao",  credits: 3, capacity: 30 },
  { code: "CS405", name: "Artificial Intelligence",   instructor: "Dr. Gomez", credits: 3, capacity: 25 }
];
const enrollments = []; // { id, studentName, studentId, courseCode, courseName, semester, reason, enrollmentDate }
let enrollmentIdCounter = 1;

/* ===== Helpers ===== */
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

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const studentIdOk = id => /^\d{4}-\d{4}$/.test(String(id || ''));
const courseByCode = code => availableCourses.find(c => c.code === code);

/* ===== Routes ===== */
// Home -> static form (index.html)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Server-rendered enrollments list (no JSON)
app.get('/enrollments', (req, res) => {
  const rows = enrollments.map((e, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${escape(e.studentName)}</td>
      <td>${escape(e.studentId)}</td>
      <td>${escape(e.courseCode)} — ${escape(e.courseName || '')}</td>
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

// Server-rendered courses list
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

// Handle enrollment via standard form POST (uses req.body only)
app.post('/enroll', (req, res) => {
  const {studentName,studentId,courseCode,semester,reason}=req.body;
  if(!studentName||!studentId|| !courseCode || !semester || !studentIdOk(studentId)){
    const errorMsg = <h2>Invalid submission</h2>
    <p>Please ensure that all the required fields are filled correctly</p>
    <p><a href = "/">Back</a></p>
    return res.status(400).send(Page("Error", errorMsg));
  }
  // TODO:
  // 1) Read fields from req.body: studentName, studentId, courseCode, semester, reason(optional)
  // 2) Validate: required fields; studentId matches YYYY-NNNN; course exists
  // 3) Create enrollment object; push; increment id
  // 4) Redirect to /enrollments on success; otherwise show error page with Back link
  const course = courseByCode(courseCode);
  const newEnroll = {
    id: enrollmentIdCounter++,
    studentName: escape(studentName), 
    studentId: escape(studentId), 
    courseCode: escape(courseCode),
    courseName: escape(course.name)
    semester: escape(reason||),
    enrollmentDate: Date.now()
  };

  /* Example shape to build (DO NOT UNCOMMENT — for reference only)
  const course = courseByCode(courseCode);
  const newEnroll = {
    id: enrollmentIdCounter++,
    studentName, studentId, courseCode, courseName: course.name,
    semester, reason, enrollmentDate: Date.now()
  };*/
  enrollments.push(newEnroll);
  res.redirect('/enrollments');

  /*enrollments.push(newEnroll);
  res.redirect('/enrollments');
  */
  return res.status(501).send(page('Not Implemented', '<p class="muted">TODO: implement /enroll using req.body</p><p><a href="/">Back</a></p>'));
});

// Unenroll (form POST)
app.post('/unenroll/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = enrollments.findIndex(e => e.id ===);

  if (index !== -1){
    enrollments.splice(index, 1);
    return res.redirect('/enrollments')
  }
  // TODO:
  // 1) Parse id from req.params
  // 2) Remove matching enrollment from array if found
  // 3) Redirect back to /enrollments (or show error)
const errorMsg = <h2> Enrollment not found</h2>
   <p>No enrollment matches the provided ID.</p>
   <p><a href="/enrollments">Back</a></p>
   res.status(404).send(page("Error",errorMsg));

  // return res.status(501).send(page('Not Implemented', '<p class="muted">TODO: implement /unenroll/:id</p><p><a href="/enrollments">Back</a></p>'));
});

// Static last so dynamic routes above take priority
app.use(express.static(path.join(__dirname, 'public')));

// 404
app.use((req, res) => res.status(404).send(page('Not Found', '<p>Page not found.</p>')));

app.listen(PORT, () => console.log(`Starter running on http://localhost:${PORT}`));
