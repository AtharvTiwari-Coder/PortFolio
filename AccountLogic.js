// AccountLogic.js
(function () {
  const STORAGE_KEY = "hp_accounts";
  const SESSION_KEY = "hp_signed_in";

  // Abusive words list (expand as needed)
  const bannedWords = ["sex","sexual","kill","bitch","cursed","fuck","chod","madar"];

  // Load accounts
  function loadAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  // Save accounts
  function saveAccounts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // Find account by name
  function findAccount(name) {
    return loadAccounts().find(acc => acc.name === name) || null;
  }

  // Validation helpers
  function isValidName(name) {
    if (!name) return { ok: false, reason: "Name cannot be empty." };
    if (name.length > 20) return { ok: false, reason: "Name cannot be longer than 20 characters." };
    const lower = name.toLowerCase();
    for (const word of bannedWords) {
      if (lower.includes(word)) {
        return { ok: false, reason: "Name contains abusive or forbidden words." };
      }
    }
    return { ok: true };
  }

  function isValidPassword(password) {
    if (!password) return { ok: false, reason: "Password cannot be empty." };
    if (password.length > 48) return { ok: false, reason: "Password cannot be longer than 48 characters." };
    return { ok: true };
  }

  // Create account
  function createAccount(name, password) {
    const accounts = loadAccounts();
    const nameCheck = isValidName(name);
    if (!nameCheck.ok) return { created: false, message: nameCheck.reason };
    const passCheck = isValidPassword(password);
    if (!passCheck.ok) return { created: false, message: passCheck.reason };
    if (accounts.some(acc => acc.name === name)) {
      return { created: false, message: "Name already taken. Choose a different name." };
    }
    accounts.push({ name, password });
    saveAccounts(accounts);
    return { created: true, message: "✅ Account created successfully. Please sign in." };
  }

  // Sign In logic
  function handleSignIn() {
    const name = document.getElementById("signinName").value.trim();
    const password = document.getElementById("signinPassword").value.trim();
    const msgEl = document.getElementById("signinMessage");

    if (!name || !password) {
      msgEl.textContent = "Please enter both name and password.";
      msgEl.className = "message error";
      return;
    }

    const account = findAccount(name);
    if (account && account.password === password) {
      msgEl.textContent = "Signed in successfully.";
      msgEl.className = "message success";
      sessionStorage.setItem(SESSION_KEY, name);
    } else {
      msgEl.textContent = "Incorrect username or password.";
      msgEl.className = "message error";
    }
  }

  // Create Account form logic
  function handleCreateAccount() {
    const name = document.getElementById("signupName").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirm = document.getElementById("signupConfirm").value.trim();
    const msgEl = document.getElementById("signupMessage");

    if (!name || !password || !confirm) {
      msgEl.textContent = "Please fill all fields.";
      msgEl.className = "message error";
      return;
    }
    if (password !== confirm) {
      msgEl.textContent = "Passwords do not match.";
      msgEl.className = "message error";
      return;
    }

    const result = createAccount(name, password);
    msgEl.textContent = result.message;
    msgEl.className = result.created ? "message info" : "message error";
    if (result.created) document.getElementById("signupForm").reset();
  }

  // Toggle password visibility
  function togglePassword(id, btnId) {
    const input = document.getElementById(id);
    const btn = document.getElementById(btnId);
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "Hide";
    } else {
      input.type = "password";
      btn.textContent = "Show";
    }
  }

  // Wire up events
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnSignIn").addEventListener("click", handleSignIn);
    document.getElementById("btnCreate").addEventListener("click", handleCreateAccount);

    // Password toggle buttons
    document.getElementById("toggleSigninPassword").addEventListener("click", () => togglePassword("signinPassword","toggleSigninPassword"));
    document.getElementById("toggleSignupPassword").addEventListener("click", () => togglePassword("signupPassword","toggleSignupPassword"));
    document.getElementById("toggleSignupConfirm").addEventListener("click", () => togglePassword("signupConfirm","toggleSignupConfirm"));

    // Link to show Create Account form
    const linkCreate = document.getElementById("linkCreate");
    if (linkCreate) {
      linkCreate.addEventListener("click", (e) => {
        e.preventDefault();
        const signupSection = document.getElementById("signup");
        signupSection.classList.remove("hidden");
        signupSection.classList.add("visible");
        signupSection.scrollIntoView({ behavior: "smooth" });
      });
    }

    const signedIn = sessionStorage.getItem(SESSION_KEY);
    if (signedIn) {
      const el = document.getElementById("signinMessage");
      if (el) {
        el.textContent = `Signed in as ${signedIn}.`;
        el.className = "message success";
      }
    }
  });
})();