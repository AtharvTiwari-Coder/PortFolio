// AccountLogic.js
document.addEventListener("DOMContentLoaded", () => {
  // Developer credentials and protected account
  const DEV_NAME = "Atharv_Dev/Full";
  const DEV_PASSWORD = "Devloper_AtharvT-Full";
  const PROTECTED_NAME = "Atharv Tiwari";
  const PROTECTED_PASS = "Atharv_000";

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
      localStorage.setItem(PROTECTED_NAME, PROTECTED_PASS);
    }
    if (localStorage.getItem(DEV_NAME) === null) {
      localStorage.setItem(DEV_NAME, DEV_PASSWORD);
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

  // Navigation between forms
  const linkCreate = $("linkCreate");
  const linkSignin = $("linkSignin");
  if (linkCreate) {
    linkCreate.addEventListener("click", (e) => {
      e.preventDefault();
      hide($("signin"));
      show($("signup"));
      setMsg("signinMessage", "", "");
      setMsg("signupMessage", "", "");
    });
  }
  if (linkSignin) {
    linkSignin.addEventListener("click", (e) => {
      e.preventDefault();
      hide($("signup"));
      show($("signin"));
      setMsg("signinMessage", "", "");
      setMsg("signupMessage", "", "");
    });
  }

  // Create account
  const btnCreate = $("btnCreate");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      const name = $("signupName").value.trim();
      const password = $("signupPassword").value;
      const confirm = $("signupConfirm").value;

      if (!name || !password || !confirm) {
        setMsg("signupMessage", "Please fill all fields.", "error");
        return;
      }
      if (password !== confirm) {
        setMsg("signupMessage", "Passwords do not match.", "error");
        return;
      }
      // Prevent overwriting protected accounts or developer account unintentionally
      if (name === PROTECTED_NAME || name === DEV_NAME) {
        setMsg("signupMessage", "That account name is reserved.", "error");
        return;
      }
      localStorage.setItem(name, password);
      setMsg("signupMessage", "Account created successfully!", "success");
      // Auto-switch to sign-in after short delay
      setTimeout(() => {
        hide($("signup"));
        show($("signin"));
        $("signinName").value = name;
        setMsg("signinMessage", "Account created. Sign in now.", "success");
      }, 700);
    });
  }

  // Sign in
  const btnSignIn = $("btnSignIn");
  const developerOptions = $("developerOptions");
  if (btnSignIn) {
    btnSignIn.addEventListener("click", () => {
      const name = $("signinName").value.trim();
      const password = $("signinPassword").value;

      if (!name || !password) {
        setMsg("signinMessage", "Please enter name and password.", "error");
        return;
      }

      // Developer unlock
      if (name === DEV_NAME && password === DEV_PASSWORD) {
        setMsg("signinMessage", "Developer mode activated.", "success");
        show(developerOptions);
        developerOptions.setAttribute("aria-hidden", "false");
        return;
      }

      const stored = localStorage.getItem(name);
      if (stored && stored === password) {
        setMsg("signinMessage", "Signed in successfully!", "success");
      } else {
        setMsg("signinMessage", "Invalid credentials.", "error");
      }
    });
  }

  // Reset modal controls
  const resetBtn = $("resetBtn");
  const resetModal = $("resetModal");
  const cancelReset = $("cancelReset");
  const confirmReset = $("confirmReset");
  const resetPassword = $("resetPassword");
  const resetMessage = $("resetMessage");

  if (resetBtn && resetModal) {
    resetBtn.addEventListener("click", () => {
      // Open modal
      resetPassword.value = "";
      setMsg("resetMessage", "", "");
      show(resetModal);
    });
  }
  if (cancelReset && resetModal) {
    cancelReset.addEventListener("click", () => {
      hide(resetModal);
      resetPassword.value = "";
      setMsg("resetMessage", "", "");
    });
  }

  if (confirmReset) {
    confirmReset.addEventListener("click", () => {
      const pw = resetPassword.value;
      if (!pw) {
        setMsg("resetMessage", "Enter developer password to confirm.", "error");
        return;
      }
      if (pw !== DEV_PASSWORD) {
        setMsg("resetMessage", "Incorrect developer password. Reset cancelled.", "error");
        return;
      }

      // Build list of keys to delete (preserve protected accounts)
      const protected = new Set([PROTECTED_NAME, DEV_NAME]);
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!protected.has(key)) keysToDelete.push(key);
      }
      // Remove keys
      keysToDelete.forEach(k => localStorage.removeItem(k));
      // Re-set protected accounts to ensure integrity
      localStorage.setItem(PROTECTED_NAME, PROTECTED_PASS);
      localStorage.setItem(DEV_NAME, DEV_PASSWORD);

      setMsg("resetMessage", "Reset complete. Protected accounts preserved.", "success");
      // Close modal after short delay
      setTimeout(() => {
        hide(resetModal);
        resetPassword.value = "";
        setMsg("resetMessage", "", "");
      }, 900);
    });
  }

  // Sign out hides developer options
  const signOutBtn = $("signOutBtn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      hide(developerOptions);
      developerOptions.setAttribute("aria-hidden", "true");
      $("signinForm").reset();
      $("signupForm").reset();
      setMsg("signinMessage", "", "");
      setMsg("signupMessage", "", "");
      alert("Signed out. Developer options hidden.");
    });
  }

  // Accessibility: Enter key submits forms
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
});