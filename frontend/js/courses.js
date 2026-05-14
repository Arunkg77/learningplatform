/* =============================================
   LEARNHUB — courses.js
   Course listing with enroll & detail link
   ============================================= */

const COURSE_EMOJIS = { 1: "☕", 2: "🌐", 3: "🍃" };

const container = document.getElementById("courses-container");

fetch("http://localhost:8080/courses")
  .then(r => r.json())
  .then(renderCourses)
  .catch(() => {
    // Fallback mock data when backend isn't running
    renderCourses([
      { id: 1, title: "Java Basics",       description: "Learn Java fundamentals from scratch — variables, OOP, collections, and more.", duration: "6 Weeks" },
      { id: 2, title: "Web Development",   description: "Master HTML, CSS, and JavaScript to build beautiful, interactive web pages.",   duration: "8 Weeks" },
      { id: 3, title: "Spring Boot",       description: "Build production-grade REST APIs and backend services with Spring Boot.",        duration: "5 Weeks" },
    ]);
  });

function renderCourses(data) {
  if (!container) return;
  container.innerHTML = "";

  const enrolled = JSON.parse(localStorage.getItem("myCourses")) || [];

  data.forEach((course, i) => {
    const isEnrolled = enrolled.includes(course.id);
    const emoji = COURSE_EMOJIS[course.id] || "📚";

    const div = document.createElement("div");
    div.classList.add("course-card");
    div.style.animationDelay = `${i * 0.08}s`;

    div.innerHTML = `
      <div class="course-card-emoji">${emoji}</div>
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <div class="course-meta">
        <span class="tag accent">⏱ ${course.duration}</span>
      </div>
      <div class="course-card-actions">
        ${isEnrolled
          ? `<span class="enrolled-badge">✓ Enrolled</span>`
          : `<button class="btn-primary small" onclick="enrollCourse(${course.id}, this)">Enroll Now</button>`
        }
        <a href="course-detail.html?id=${course.id}" class="btn-ghost small">View Course →</a>
      </div>
    `;

    container.appendChild(div);
  });
}

function enrollCourse(id, btn) {
  const user = JSON.parse(localStorage.getItem("lh_user"));
  if (!user) {
    if (typeof openAuth === "function") openAuth("signin");
    return;
  }

  let courses = JSON.parse(localStorage.getItem("myCourses")) || [];

  if (!courses.includes(id)) {
    courses.push(id);
    localStorage.setItem("myCourses", JSON.stringify(courses));
  }

  // Update button to enrolled badge
  if (btn) {
    const actions = btn.closest(".course-card-actions");
    btn.replaceWith(Object.assign(document.createElement("span"), {
      className: "enrolled-badge",
      textContent: "✓ Enrolled"
    }));
  }

  if (typeof showToast === "function") {
    showToast("You're enrolled! Head to My Courses to start learning.");
  }
}