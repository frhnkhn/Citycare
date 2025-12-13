/* THEME */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* PASSWORD TOGGLE */
function togglePassword() {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}

/* FORGOT PASSWORD */
function openForgot() {
  document.getElementById("forgotModal").classList.remove("hidden");
}

function closeForgot() {
  document.getElementById("forgotModal").classList.add("hidden");
}


/* LOGIN WITH VALIDATION */
async function loginUser() {
  let valid = true;
  emailError.textContent = "";
  passwordError.textContent = "";

  if (!email.value.includes("@")) {
    emailError.textContent = "Invalid email";
    valid = false;
  }
  if (password.value.length < 6) {
    passwordError.textContent = "Min 6 characters";
    valid = false;
  }
  if (!valid) return;

  loginBtn.disabled = true;
  loginBtn.querySelector(".spinner").classList.remove("hidden");

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value })
  });

  const data = await res.json();
  if (!data.success) {
    alert("Invalid credentials");
    loginBtn.disabled = false;
    return;
  }

  const store = remember.checked ? localStorage : sessionStorage;
  store.setItem("citycare_user", JSON.stringify(data.user));
  location.href = "dashboard.html";
}

/* SIGNUP */
async function signupUser() {
  if (password.value.length < 6) {
    passwordError.textContent = "Min 6 characters";
    return;
  }

  signupBtn.disabled = true;
  signupBtn.querySelector(".spinner").classList.remove("hidden");

  await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
      city: city?.value || "",
      specialization: spec?.value || ""
    })
  });

  location.href = "login.html";
}
/* =========================
   FORGOT PASSWORD IMPROVEMENTS
   ========================= */

function backdropClose(e) {
  if (e.target.id === "forgotModal") {
    closeForgot();
  }
}

function sendResetLink() {
  const email = document.getElementById("resetEmail").value;
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  // UI success (mock)
  document.getElementById("modalTitle").textContent = "Check Your Email";
  document.getElementById("modalText").textContent =
    "If an account exists, a password reset link has been sent.";

  document.getElementById("resetEmail").style.display = "none";
}
function togglePassword() {
  const pwd = document.getElementById("password");
  const eye = document.getElementById("eyeIcon");

  if (!pwd || !eye) return;

  if (pwd.type === "password") {
    pwd.type = "text";
    eye.innerHTML = `
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19
      C5 19 1 12 1 12a21.8 21.8 0 0 1 5.06-6.94"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke-width="2"/>
    `;
  } else {
    pwd.type = "password";
    eye.innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

