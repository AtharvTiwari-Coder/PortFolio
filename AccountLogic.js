document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const setMsg = (id, text, type) => {
    const el = $(id);
    if (!el) return;
    el.textContent = text || "";
    el.className = "message" + (type ? " " + type : "");
  };

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

    hideEl.classList.remove("show");
    setTimeout(() => hideEl.classList.add("hidden"), 500);

    showEl.classList.remove("hidden");
    setTimeout(() => showEl.classList.add("show"), 10);
  }

  // Navigation
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

    const stored = localStorage.getItem(name);
    if (stored && stored === info) {
      setMsg("signinMessage", "Signed in successfully!", "success");
      setTimeout(() => {
        window.location.href = "PortFolioMain.html";
      }, 800);
    } else {
      setMsg("signinMessage", "Account may be deleted or invalid information.", "error");
    }
  });

  // Enter key submits forms
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

  // Loading Screen Fake Counter
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
  }, 60);

  // Theme Toggle
  const themeToggle = $("themeToggle");
  function applyTheme(mode) {
    document.body.classList.remove("light", "dark");
    if (mode === "light") document.body.classList.add("light");
    else if (mode === "dark") document.body.classList.add("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark