// AccountLogic.js
document.addEventListener("DOMContentLoaded", () => {
  // Developer credentials
  const DEV_NAME = "Atharv_Dev/Full";
  const DEV_PASSWORD = "Devloper_AtharvT-Full";

  // Helpers
  const $ = id => document.getElementById(id);
  const show = el => el.classList.remove("hidden");
  const hide = el => el.classList.add("hidden");
  const setMessage = (id, text) => { const el = $(id); if (el) el.textContent = text; };

  // Toggle password visibility
  function togglePassword(inputId, btnId) {
    const input = $(inputId);
    const btn = $(btnId);
    if (!input || !btn) return;
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

  togglePassword("signinPassword", "toggleSigninPassword");
  togglePassword("signupPassword", "toggleSignupPassword");
  togglePassword("signupConfirm", "toggleSignupConfirm");

  // Navigation: show signup, show signin
  const linkCreate = $("linkCreate");
  const linkBackSignin = $("linkBackSignin");
  const linkSignin = $("linkSignin");
  const createHint = $("createHint");

  function showSignup() {
    hide($("signin"));
    show($("signup"));
    setMessage("signinMessage", "");
    setMessage("signupMessage", "");
  }

  function showSignin() {
    hide($("signup"));
    show($("signin"));
    setMessage("signinMessage", "");
    setMessage("signupMessage", "");
  }

  if (linkCreate) linkCreate.addEventListener("click", (e) => { e.preventDefault(); showSignup(); });
  if (createHint) createHint.addEventListener("click", showSignup);
  if (linkBackSignin) linkBackSignin.addEventListener("click", (e) => { e.preventDefault(); showSignin(); });
  if (linkSignin) linkSignin.addEventListener("click", (e) => { e.preventDefault(); showSignin(); });

  // Account creation
  const btnCreate = $("btnCreate");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      const name = $("signupName").value.trim();
      const password = $("signupPassword").value;
      const confirm = $("signupConfirm").value;

      if (!name || !password || !confirm) {
        setMessage("signupMessage", "Please fill all fields.");
        return;
      }

      if (password !== confirm) {
        setMessage("signupMessage", "Passwords do not match.");
        return;
      }

      // Prevent overwriting existing account without warning
      if (localStorage.getItem(name) !== null) {
        setMessage("signupMessage", "An account with this name already exists.");
        return;
      }

      localStorage.setItem(name, password);
      setMessage("signupMessage", "Account created successfully!");
      // Optionally switch back to sign-in after creation
      setTimeout(() => {
        showSignin();
        $("signinName").value = name;
        setMessage("signinMessage", "Account created. You can sign in now.");
      }, 700);
    });
  }

  // Sign in
  const btnSignIn = $("btnSignIn");
  if (btnSignIn) {
    btnSignIn.addEventListener("click", () => {
      const name = $("signinName").value.trim();
      const password = $("signinPassword").value;

      if (!name || !password) {
        setMessage("signinMessage", "Please enter name and password.");
        return;
      }

      // Developer unlock
      if (name === DEV_NAME && password === DEV_PASSWORD) {
        showDeveloperConsole();
        setMessage("signinMessage", "Developer mode activated!");
        return;
      }

      const stored = localStorage.getItem(name);
      if (stored && stored === password) {
        setMessage("signinMessage", "Signed in successfully!");
      } else {
        setMessage("signinMessage", "Invalid credentials.");
      }
    });
  }

  // Developer console controls
  const developerConsole = $("developerConsole");
  const resetBtn = $("resetBtn");
  const signOutBtn = $("signOutBtn");

  function showDeveloperConsole() {
    if (!developerConsole) return;
    developerConsole.classList.remove("hidden");
    developerConsole.setAttribute("aria-hidden", "false");
    // Optionally scroll into view
    developerConsole.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function hideDeveloperConsole() {
    if (!developerConsole) return;
    developerConsole.classList.add("hidden");
    developerConsole.setAttribute("aria-hidden", "true");
  }

  // Reset with triple confirmation
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // First confirmation
      const confirm1 = confirm("Are you sure you want to reset all accounts?");
      if (!confirm1) return;

      // Second confirmation
      const confirm2 = confirm("This will delete all data to all accounts.");
      if (!confirm2) return;

      // Third: password prompt
      const pw = prompt("Enter your developer password to confirm:");
      if (pw === null) return; // user cancelled
      if (pw !== DEV_PASSWORD) {
        alert("Incorrect developer password. Reset cancelled.");
        return;
      }

      // Perform reset
      localStorage.clear();
      alert("All account data has been reset!");
      // Clear messages and forms
      if ($("signupForm")) $("signupForm").reset();
      if ($("signinForm")) $("signinForm").reset();
      setMessage("signupMessage", "");
      setMessage("signinMessage", "");
    });
  }

  // Sign out: hide console and reset state so it looks like nothing happened
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      hideDeveloperConsole();
      if ($("signinForm")) $("signinForm").reset();
      if ($("signupForm")) $("signupForm").reset();
      setMessage("signinMessage", "");
      setMessage("signupMessage", "");
      // Optionally blur active element
      if (document.activeElement) document.activeElement.blur();
      // No persistent flags set, so page appears unchanged
    });
  }

  // Accessibility: allow Enter key to submit sign-in and create actions
  const signinForm = $("signinForm");
  if (signinForm) {
    signinForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnSignIn && btnSignIn.click();
      }
    });
  }

  const signupForm = $("signupForm");
  if (signupForm) {
    signupForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnCreate && btnCreate.click();
      }
    });
  }

  // Optional: expose a debug function on window for quick testing (non-persistent)
  window.__devTools = {
    showConsole: showDeveloperConsole,
    hideConsole: hideDeveloperConsole,
    clearStorage: () => { localStorage.clear(); }
  };
});