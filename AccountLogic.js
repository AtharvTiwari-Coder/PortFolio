// Toggle password visibility helper
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  btn.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "Hide";
    } else {
      input.type = "password";
      btn.textContent = "Show";
    }
  });
}

// Apply toggles for all password fields
togglePassword("signinPassword", "toggleSigninPassword");
togglePassword("signupPassword", "toggleSignupPassword");
togglePassword("signupConfirm", "toggleSignupConfirm");

// Create account logic
document.getElementById("btnCreate").addEventListener("click", () => {
  const name = document.getElementById("signupName").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!name || !password || !confirm) {
    document.getElementById("signupMessage").textContent = "Please fill all fields.";
    return;
  }

  if (password !== confirm) {
    document.getElementById("signupMessage").textContent = "Passwords do not match.";
    return;
  }

  // Save account in localStorage
  localStorage.setItem(name, password);
  document.getElementById("signupMessage").textContent = "Account created successfully!";
});

// Sign in logic
document.getElementById("btnSignIn").addEventListener("click", () => {
  const name = document.getElementById("signinName").value.trim();
  const password = document.getElementById("signinPassword").value;

  // Developer credentials check
  if (name === "Atharv_Dev/Full" && password === "Devloper_AtharvT-Full") {
    document.getElementById("developerConsole").style.display = "block";
    document.getElementById("signinMessage").textContent = "Developer mode activated!";
    return;
  }

  // Normal user check
  const storedPassword = localStorage.getItem(name);
  if (storedPassword && storedPassword === password) {
    document.getElementById("signinMessage").textContent = "Signed in successfully!";
  } else {
    document.getElementById("signinMessage").textContent = "Invalid credentials.";
  }
});

// Reset button clears all accounts
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.clear();
  alert("All account data has been reset!");
});

// Sign Out button hides developer console and resets form
document.getElementById("signOutBtn").addEventListener("click", () => {
  document.getElementById("developerConsole").style.display = "none";
  document.getElementById("signinForm").reset();
  document.getElementById("signinMessage").textContent = "";
  alert("Signed out. Back to normal mode.");
});