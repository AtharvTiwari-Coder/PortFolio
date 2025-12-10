const $ = id => document.getElementById(id);

function setMsg(id, text, type) {
  const el = $(id);
  el.textContent = text;
  el.className = "message " + (type === "error" ? "error" : "success");
}

/* Ensure protected accounts exist */
function ensureProtectedAccounts() {
  if (!localStorage.getItem("Atharv Tiwari")) {
    localStorage.setItem("Atharv Tiwari", JSON.stringify({
      password: "Atharv_000",
      balance: Infinity
    }));
  }
  if (!localStorage.getItem("Atharv_Dev/Full")) {
    localStorage.setItem("Atharv_Dev/Full", JSON.stringify({
      password: "Devloper_AtharvT-Full",
      balance: Infinity
    }));
  }
}
ensureProtectedAccounts();

/* Create account */
$("btnCreate").addEventListener("click", () => {
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

  // Prevent overwriting protected accounts
  if (name === "Atharv Tiwari" || name === "Atharv_Dev/Full") {
    setMsg("signupMessage", "That account name is reserved.", "error");
    return;
  }

  // Default balance ₹100
  const accountData = { password: password, balance: 100 };
  localStorage.setItem(name, JSON.stringify(accountData));
  setMsg("signupMessage", "Account created successfully!", "success");

  // Switch to sign-in
  setTimeout(() => {
    $("signup").classList.add("hidden");
    $("signin").classList.remove("hidden");
    $("signinName").value = name;
  }, 700);
});

/* Sign In */
$("btnSignIn").addEventListener("click", () => {
  const name = $("signinName").value.trim();
  const password = $("signinPassword").value;

  const stored = localStorage.getItem(name);
  if (!stored) {
    setMsg("signinMessage", "Account not found.", "error");
    return;
  }

  const accountData = JSON.parse(stored);
  if (accountData.password === password) {
    const balanceText = accountData.balance === Infinity ? "∞" : `₹${accountData.balance}`;
    setMsg("signinMessage", `Signed in! Balance: ${balanceText}`, "success");
    localStorage.setItem("currentUser", name);
    window.location.href = "PortFolioMain.html"; // redirect same tab
  } else {
    setMsg("signinMessage", "Invalid credentials.", "error");
  }
});