[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/eIxzViyx)
# Course Enrollment System — Mid‑Semester Practical

**SCHOOL OF ENGINEERING — ELECTRICAL ENGINEERING DEPARTMENT**  
**BACHELOR OF ELECTRONICS AND COMPUTER ENGINEERING (BECE5)**  
**INTERNET AND WEB SERVICES (ELE‑IWS‑521)**

**Duration:** 2 Hours  
**Total Marks:** 60  
**Date:** ___/___/2025

---

## 🎯 Overview

You are building a small **Course Enrollment System** for *MegaUniversity*. Students submit a form to enroll; staff can view and remove enrollments. The app is deliberately simple:

- **Backend:** Node.js + Express (form posts via `req.body`)  
- **Frontend:** HTML5 + CSS (no framework required)  
- **Storage:** In‑memory arrays (no database)  
- **Rendering:** Simple **server‑rendered HTML** for pages like `/enrollments` and `/courses` (no templates).  
- **Version control:** Git with regular, meaningful commits.

> ✱ We use Express’s built‑in parser: **no `body-parser` package** needed.

---

## 🛠️ Setup

1) `npm install`  
2) `npm start` → http://localhost:3000  
3) Commit regularly (min **4 commits**); final commit message: **“FINAL SUBMISSION”**

**Allowed resources:** your course notes and any offline documentation provided by the instructor.  
**Internet:** not allowed apart from Git operations and any local assets bundled in the starter.  
**Academic integrity:** individual work; no external code or AI tools.

---

## 📁 File Structure (provided starter)

```
course-enrollment-system/
├── server.js          # Express app with TODOs for /enroll and /unenroll/:id
├── package.json       # "start": "node server.js"
├── README.md          # this file
└── public/
    ├── index.html     # enrollment form (posts to /enroll)
    └── css/
        └── style.css  # basic styling & layout
```

> We **do not** create separate `enrollments.html` or `courses.html`. Those pages are rendered by the server at `/enrollments` and `/courses`.

---

## ✅ What you must implement

### **Task 1 — Express Server (15 marks)**

- **Routes (8):**
  - `GET /` → serve `public/index.html`
  - `POST /enroll` → read form fields from `req.body`, validate, create enrollment, store, then **redirect** to `/enrollments`
  - `POST /unenroll/:id` → remove an enrollment by id, then redirect to `/enrollments`
  - `GET /enrollments` → render an HTML table of all enrollments (server‑side string HTML is fine)
  - `GET /courses` → render a simple list of available courses

- **Data (4):**
  - In‑memory arrays: `availableCourses` (given) and `enrollments` (you add to it)
  - Enrollment object: `{ id, studentName, studentId, courseCode, courseName, semester, reason, enrollmentDate }`
  - Use `YYYY-NNNN` format for `studentId` (e.g., `2025-0001`)

- **Errors (3):**
  - Validate required fields; show a clear error page with a “Back” link if invalid
  - App does not crash on bad input

### **Task 2 — HTML Form (12 marks)**

- `index.html` form with:
  - **Student Name** (required, text)
  - **Student ID** (required, text, pattern `YYYY-NNNN` in help text)
  - **Course** (required, `<select>` with codes CS401..CS405)
  - **Semester** (required, `<select>` e.g., Fall 2025, Spring 2026)
  - **Reason / Notes** (optional, `<textarea>`)
  - **Submit** and **Reset** buttons
- Use semantic structure (`header`, `nav`, `main`, `footer`) and associated `<label for>` ids.

### **Task 3 — CSS Styling & Responsive (12 marks)**

- Clean, readable design (header, nav, form “card”, table styles).  
- Focus styles on inputs; button hover states.  
- **Responsive:** at small screens stack columns; ensure form is usable on mobile.

### **Task 4 — Client‑Side UX (15 marks)**

- **Validation (7):** pre‑submission checks (empty fields, ID format, course chosen); clear messages; focus on first invalid control.  
- **Feedback (4):** highlight invalid inputs; success/notice styling; optional character counter for the notes field.  
- **Code quality (4):** clear functions, no console errors, tidy structure.

> jQuery is **not required**. If you use it, bundle a **local** copy; do not rely on CDNs.

### **Task 5 — One Advanced Feature (6 marks)**

Pick **one** and implement end‑to‑end (server + UI):

- **A. Analytics:** simple counts per course on `/enrollments` (e.g., “CS401: 3 enrollments”).  
- **B. Course management (lite):** simple admin form to **add a course** (validate and push to `availableCourses`; same page list).  
- **C. Search/Filter:** filter enrollments by course or text (name/ID) on the `/enrollments` page (client‑side or server‑side).

---

## 🧪 Testing Checklist

- [ ] `npm start` runs without errors on port 3000  
- [ ] `/` loads and posts to `/enroll`  
- [ ] Invalid submissions show a clear error and a way back  
- [ ] Successful enroll adds to the list and redirects to `/enrollments`  
- [ ] `/courses` shows all 5 course cards  
- [ ] `/unenroll/:id` removes an entry and returns to list  
- [ ] Layout is usable on mobile; no console errors  
- [ ] Advanced feature works and is documented briefly in comments

---

## 💡 Hints

- Use Express’s parser: `app.use(express.urlencoded({ extended: true }))`  
- Validate student ID with a regex: `/^\d{4}-\d{4}$/`  
- Always **escape** user input when rendering HTML (see `escape()` helper in `server.js`).  
- Prefer **redirect after POST** (PRG pattern) to avoid duplicate submissions.

---

## 🔧 Scripts

```bash
npm install   # install dependencies
npm start     # start server at http://localhost:3000
git add .
git commit -m "message"
git push
```

Good luck — build the core flow first, then polish UI and add your chosen advanced feature!
