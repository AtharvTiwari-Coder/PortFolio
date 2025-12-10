document.addEventListener("DOMContentLoaded", () => {
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

  // Apply toggles
  togglePassword("signinPassword", "toggleSigninPassword");
  togglePassword("signupPassword", "toggleSignupPassword");
  togglePassword("signupConfirm", "toggleSignupConfirm");

  // Create account
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

    localStorage.setItem(name, password);
    document.getElementById("signupMessage").textContent = "Account created successfully!";
  });

  // Sign in
  document.getElementById("btnSignIn").addEventListener("click", () => {
    const name = document.getElementById("signinName").value.trim();
    const password = document.getElementById("signinPassword").value;

    if (name === "Atharv_Dev/Full" && password === "Devloper_AtharvT-Full") {
      document.getElementById("developerConsole").style.display = "block";
      document.getElementById("signinMessage").textContent = "Developer mode activated!";
      return;
    }

    const storedPassword = localStorage.getItem(name);
    if (storedPassword && storedPassword === password) {
      document.getElementById("signinMessage").textContent = "Signed in successfully!";
    } else {
      document.getElementById("signinMessage").textContent = "Invalid credentials.";
    }
  });

  // Reset button with triple confirmation
  document.getElementById("resetBtn").addEventListener("click", () => {
    const confirm1 = confirm("Are you sure you want to reset all accounts?");
    if (!confirm1) return;

    const confirm2 = confirm("This will delete all data to all accounts.");
    if (!confirm2) return;

    const passwordPrompt = prompt("Enter your developer password to confirm:");
    if (passwordPrompt !== "Devloper_AtharvT-Full") {
      alert("Incorrect developer password. Reset cancelled.");
      return;
    }

    localStorage.clear();
    alert("All account data has been reset!");
  });

  // Sign Out button
  document.getElementById("signOutBtn").addEventListener("click", () => {
    document.getElementById("developerConsole").style.display = "none";
    document.getElementById("signinForm").reset();
    document.getElementById("signinMessage").textContent = "";
    alert("Signed out. Back to normal mode.");
  });
});