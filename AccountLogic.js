// AccountLogic.js
document.addEventListener("DOMContentLoaded", () => {
  // Developer information and protected account
  const DEV_NAME = "Atharv_Dev/Full";
  const DEV_INFO = "Devloper_AtharvT-Full";
  const PROTECTED_NAME = "Atharv Tiwari";
  const PROTECTED_INFO = "Atharv_000";

  // Helpers
  const $ = id => document.getElementById(id);
  const show = el => el && el.classList.remove("hidden");
  const hide = el => el && el.classList.add("hidden");
  const setMsg = (id, text, type) => {
    const el = $(id);
    if (!el) return;
    el.textContent = text || "";
    el.className = "message" + (type ? " " + type : "");
  };

  // Ensure protected accounts exist in localStorage
  function ensureProtectedAccounts() {
    if (localStorage.getItem(PROTECTED_NAME) === null) {
      localStorage.setItem(PROTECTED_NAME, PROTECTED_INFO);
    }
    if (localStorage.getItem(DEV_NAME) === null) {
      localStorage.setItem(DEV_NAME, DEV_INFO);
    }
  }
  ensureProtectedAccounts();

  // Toggle password visibility
  function togglePassword(inputId, btnId) {
    const input = $(inputId);
    const btn = $(btnId);
    if (!input || !btn) return;
    btn.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "Show" : "Hide";
    });
  }
  togglePassword("signinPassword", "toggleSigninPassword");
  togglePassword("signupPassword", "toggleSignupPassword");
  togglePassword("signupConfirm", "toggleSignupConfirm");

  // Dissolve animation switcher
  function switchForm(hideId, showId) {
    const hideEl = $(hideId);
    const showEl = $(showId);

    // Fade out
    hideEl.classList.remove("show");
    setTimeout(() => hideEl.classList.add("hidden"), 500); // wait for fade-out

    // Fade in
    showEl.classList.remove("hidden");
    setTimeout(() => showEl.classList.add("show"), 10); // trigger fade-in
  }

  // Navigation between forms
  $("linkCreate")?.addEventListener("click", e => {
    e.preventDefault();
    switchForm("signin", "signup");
    setMsg("signinMessage", "", "");
    setMsg("signupMessage", "", "");
  });
  $("linkSignin")?.addEventListener("click", e => {
    e.preventDefault();
    switchForm("signup", "signin");
    setMsg("signinMessage", "", "");
    setMsg("signupMessage", "", "");
  });

  // Create account
  $("btnCreate")?.addEventListener("click", () => {
    const name = $("signupName").value.trim();
    const info = $("signupPassword").value;
    const confirm = $("signupConfirm").value;

    if (!name || !info || !confirm) {
      setMsg("signupMessage", "Please fill all fields.", "error");
      return;
    }
    if (info !== confirm) {
      setMsg("signupMessage", "Information does not match.", "error");
      return;
    }
    if (name === PROTECTED_NAME || name === DEV_NAME) {
      setMsg("signupMessage", "That account name is reserved.", "error");
      return;
    }
    localStorage.setItem(name, info);
    setMsg("signupMessage", "Account created successfully!", "success");
    setTimeout(() => {
      switchForm("signup", "signin");
      $("signinName").value = name;
      setMsg("signinMessage", "Account created. Sign in now.", "success");
    }, 700);
  });

  // Sign in
  $("btnSignIn")?.addEventListener("click", () => {
    const name = $("signinName").value.trim();
    const info = $("signinPassword").value;

    if (!name || !info) {
      setMsg("signinMessage", "Please enter name and information.", "error");
      return;
    }

    // Developer unlock
    if (name === DEV_NAME && info === DEV_INFO) {
      setMsg("signinMessage", "Developer mode activated.", "success");
      show($("developerOptions"));
      $("developerOptions").setAttribute("aria-hidden", "false");
      return;
    }

    const stored = localStorage.getItem(name);
    if (stored && stored === info) {
      setMsg("signinMessage", "Signed in successfully!", "success");
      // Ask Stay Signed In
      show($("staySignedInModal"));
      $("staySignedInModal").setAttribute("aria-hidden", "false");

      $("stayYes").onclick = () => {
        localStorage.setItem("currentUser", name);
        hide($("staySignedInModal"));
        window.location.href = "PortFolioMain.html";
      };
      $("stayNo").onclick = () => {
        hide($("staySignedInModal"));
        window.location.href = "PortFolioMain.html";
      };
    } else {
      setMsg("signinMessage", "Account may be deleted or invalid information.", "error");
    }
  });

  // Reset modal controls
  $("resetBtn")?.addEventListener("click", () => {
    $("resetPassword").value = "";
    setMsg("resetMessage", "", "");
    show($("resetModal"));
  });
  $("cancelReset")?.addEventListener("click", () => {
    hide($("resetModal"));
    $("resetPassword").value = "";
    setMsg("resetMessage", "", "");
  });
  $("confirmReset")?.addEventListener("click", () => {
    const pw = $("resetPassword").value;
    if (!pw) {
      setMsg("resetMessage", "Enter developer information to confirm.", "error");
      return;
    }
    if (pw !== DEV_INFO) {
      setMsg("resetMessage", "Incorrect developer information. Reset cancelled.", "error");
      return;
    }
    const protectedSet = new Set([PROTECTED_NAME, DEV_NAME]);
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!protectedSet.has(key)) keysToDelete.push(key);
    }
    keysToDelete.forEach(k => localStorage.removeItem(k));
    localStorage.setItem(PROTECTED_NAME, PROTECTED_INFO);
    localStorage.setItem(DEV_NAME, DEV_INFO);
    setMsg("resetMessage", "Reset complete. Protected accounts preserved.", "success");
    setTimeout(() => {
      hide($("resetModal"));
      $("resetPassword").value = "";
      setMsg("resetMessage", "", "");
    }, 900);
  });

  // Sign out hides developer options
  $("signOutBtn")?.addEventListener("click", () => {
    hide($("developerOptions"));
    $("developerOptions").setAttribute("aria-hidden", "true");
    $("signinForm").reset();
    $("signupForm").reset();
    setMsg("signinMessage", "", "");
    setMsg("signupMessage", "", "");
    alert("Signed out. Developer options hidden.");
  });

  // Accessibility: Enter key submits forms
  $("signinForm")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      $("btnSignIn")?.click();
    }
  });
  $("signupForm")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      $("btnCreate")?.click();
    }
  });

  // ===========================
  // Loading Screen Fake Counter
  // ===========================
  const loadingScreen = $("loadingScreen");
  const progressEl = document.querySelector(".loading-progress");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    if (progress > 100) progress = 100;
    progressEl.textContent = progress + "%";
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 500);
    }
  }, 60); // ~3s total

  // ===========================
  // Theme Toggle
  // ===========================
  const themeToggle = $("themeToggle");
  function applyTheme(mode) {
    document.body.classList.remove("light", "dark");
    if (mode === "light") document.body.classList.add("light");
    else if (mode === "dark") document.body.classList.add("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(prefersDark ? "dark" : "light");
    }
  }
  themeToggle.addEventListener("change", () => applyTheme(themeToggle.value));
  applyTheme("system");

  // ===========================
  // Dissolve Animation Setup
  // ===========================
  document.querySelectorAll(".slide