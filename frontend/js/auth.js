/* =============================================
   LEARNHUB — auth.js
   Mock authentication using localStorage
   ============================================= */

// ---- State helpers ----
function getUser() {
  return JSON.parse(localStorage.getItem("lh_user")) || null;
}

function saveUser(user) {
  localStorage.setItem("lh_user", JSON.stringify(user));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("lh_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("lh_users", JSON.stringify(users));
}

// ---- UI helpers ----
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function setAuthError(msg) {
  const el = document.getElementById("auth-error");
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle("hidden", !msg);
}

// ---- Modal controls ----
function openAuth(tab = "signin") {
  const overlay = document.getElementById("auth-overlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  switchTab(tab);
  setAuthError("");
}

function closeAuth() {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) overlay.classList.add("hidden");
  setAuthError("");
}

function switchTab(tab) {
  const signin = document.getElementById("signin-form");
  const signup = document.getElementById("signup-form");
  const tabs   = document.querySelectorAll(".auth-tab");

  if (!signin || !signup) return;

  if (tab === "signin") {
    signin.classList.remove("hidden");
    signup.classList.add("hidden");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    signup.classList.remove("hidden");
    signin.classList.add("hidden");
    tabs[1].classList.add("active");
    tabs[0].classList.remove("active");
  }
  setAuthError("");
}

// Close on overlay click
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAuth();
    });
  }

  // Render header state
  renderAuthState();
});

// ---- Sign Up ----
function handleSignUp() {
  const name     = document.getElementById("signup-name")?.value.trim();
  const email    = document.getElementById("signup-email")?.value.trim().toLowerCase();
  const password = document.getElementById("signup-password")?.value;

  if (!name || !email || !password) {
    return setAuthError("Please fill in all fields.");
  }
  if (password.length < 6) {
    return setAuthError("Password must be at least 6 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return setAuthError("Please enter a valid email address.");
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return setAuthError("An account with this email already exists.");
  }

  const user = { name, email, password, createdAt: Date.now() };
  users.push(user);
  saveUsers(users);
  saveUser({ name, email });

  closeAuth();
  renderAuthState();
  showToast(`Welcome, ${name}! 🎉`);
}

// ---- Sign In ----
function handleSignIn() {
  const email    = document.getElementById("signin-email")?.value.trim().toLowerCase();
  const password = document.getElementById("signin-password")?.value;

  if (!email || !password) {
    return setAuthError("Please enter your email and password.");
  }

  const users = getUsers();
  const match = users.find(u => u.email === email && u.password === password);

  if (!match) {
    return setAuthError("Incorrect email or password.");
  }

  saveUser({ name: match.name, email: match.email });
  closeAuth();
  renderAuthState();
  showToast(`Welcome back, ${match.name}!`);
}

// ---- Log Out ----
function handleLogout() {
  localStorage.removeItem("lh_user");
  renderAuthState();
  showToast("You've been logged out.");

  // Redirect dashboard to home if on dashboard
  if (window.location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
}

// ---- Render header auth area ----
function renderAuthState() {
  const user      = getUser();
  const authArea  = document.getElementById("auth-area");
  const userArea  = document.getElementById("user-area");
  const greeting  = document.getElementById("user-greeting");

  if (!authArea || !userArea) return;

  if (user) {
    authArea.classList.add("hidden");
    userArea.classList.remove("hidden");
    if (greeting) greeting.textContent = `Hi, ${user.name.split(" ")[0]} 👋`;
  } else {
    authArea.classList.remove("hidden");
    userArea.classList.add("hidden");
  }
}