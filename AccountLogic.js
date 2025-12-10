const $ = id => document.getElementById(id);

function setMsg(id, text, type) {
  const el = $(id);
  el.textContent = text;
  el.className = "message " + type;
}

/* Ensure Protected Accounts */
function ensureProtectedAccounts() {
  localStorage.setItem("Atharv Tiwari", JSON.stringify({
    password: "Atharv_000",
    balance: Infinity
  }));

  localStorage.setItem("Atharv_Dev/Full", JSON.stringify({
    password: "Devloper_AtharvT-Full",
    balance: Infinity
  }));
}
ensureProtectedAccounts();

/* Create Account */
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

  // Default balance ₹100
  let accountData = {
    password: password,
    balance: 100
  };

  // Special accounts
  if (name === "Atharv Tiwari") {
    accountData = { password: "Atharv_000", balance: Infinity };
  }
  if (name === "Atharv_Dev/Full") {
    accountData = { password: "Devloper_AtharvT-Full", balance: Infinity };
  }

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
    window.location.href = "PortFolioMain.html"; // redirect same tab
  } else {
    setMsg("signinMessage", "Invalid credentials.", "error");
  }
});