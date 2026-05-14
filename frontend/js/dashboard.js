/* =============================================
   LEARNHUB — dashboard.js
   My Courses dashboard with progress tracking
   ============================================= */

const COURSE_EMOJIS = { 1: "☕", 2: "🌐", 3: "🍃" };

const MOCK_COURSES = [
  { id: 1, title: "Java Basics",       description: "Learn Java fundamentals.", duration: "6 Weeks" },
  { id: 2, title: "Web Development",   description: "HTML, CSS & JavaScript.",  duration: "8 Weeks" },
  { id: 3, title: "Spring Boot",       description: "Backend REST APIs.",        duration: "5 Weeks" },
];

const dashboard = document.getElementById("dashboard");

fetch("http://localhost:8080/courses")
  .then(r => r.json())
  .then(renderDashboard)
  .catch(() => renderDashboard(MOCK_COURSES));

function renderDashboard(data) {
  if (!dashboard) return;

  const user     = JSON.parse(localStorage.getItem("lh_user"));
  const enrolled = JSON.parse(localStorage.getItem("myCourses")) || [];

  // Update subtitle
  const sub = document.getElementById("dash-sub");
  if (sub && user) sub.textContent = `Welcome back, ${user.name.split(" ")[0]}! Here are your courses.`;

  const myCourses = data.filter(c => enrolled.includes(c.id));
  dashboard.innerHTML = "";

  if (myCourses.length === 0) {
    dashboard.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No courses yet</h3>
        <p>You haven't enrolled in any courses. Browse our catalogue to get started!</p>
        <a href="courses.html" class="btn-primary">Browse Courses</a>
      </div>
    `;
    return;
  }

  myCourses.forEach((course, i) => {
    const progress = getProgress(course.id);
    const emoji    = COURSE_EMOJIS[course.id] || "📚";

    const div = document.createElement("div");
    div.classList.add("course-card");
    div.style.animationDelay = `${i * 0.08}s`;

    div.innerHTML = `
      <div class="course-card-emoji">${emoji}</div>
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <div class="course-meta">
        <span class="tag accent">⏱ ${course.duration}</span>
        ${progress === 100 ? `<span class="tag" style="background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.3);color:#34d399;">🏆 Completed</span>` : ""}
      </div>
      <div class="progress-wrap">
        <div class="progress-label">
          <span>Progress</span>
          <span id="pct-${course.id}">${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="fill-${course.id}" style="width:${progress}%"></div>
        </div>
      </div>
      <label class="lesson-item ${progress === 100 ? "done" : ""}" id="lesson-${course.id}">
        <input type="checkbox" ${progress === 100 ? "checked" : ""}
               onchange="updateProgress(${course.id}, this)">
        Mark as Completed
      </label>
      <div class="course-card-actions">
        <a href="course-detail.html?id=${course.id}" class="btn-ghost small">Continue Learning →</a>
        <button class="btn-ghost small" onclick="unenroll(${course.id})" style="color:#f87171;border-color:rgba(239,68,68,.25)">Remove</button>
      </div>
    `;

    dashboard.appendChild(div);
  });
}

function getProgress(id) {
  return localStorage.getItem("completed_" + id) === "true" ? 100 : 0;
}

function updateProgress(id, checkbox) {
  const done = checkbox.checked;
  localStorage.setItem("completed_" + id, done ? "true" : "false");

  const pct  = document.getElementById(`pct-${id}`);
  const fill = document.getElementById(`fill-${id}`);
  const label = document.getElementById(`lesson-${id}`);

  if (pct)  pct.textContent  = done ? "100%" : "0%";
  if (fill) fill.style.width = done ? "100%" : "0%";
  if (label) label.classList.toggle("done", done);

  if (typeof showToast === "function") {
    showToast(done ? "🏆 Course marked as completed!" : "Progress reset.");
  }
}

function unenroll(id) {
  let courses = JSON.parse(localStorage.getItem("myCourses")) || [];
  courses = courses.filter(c => c !== id);
  localStorage.setItem("myCourses", JSON.stringify(courses));
  localStorage.removeItem("completed_" + id);

  if (typeof showToast === "function") showToast("Course removed from your dashboard.");

  // Re-fetch and re-render
  fetch("http://localhost:8080/courses")
    .then(r => r.json())
    .then(renderDashboard)
    .catch(() => renderDashboard(MOCK_COURSES));
}