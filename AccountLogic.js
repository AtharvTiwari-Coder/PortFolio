// AccountLogic.js - handles signup, signin, protected accounts, redirect
const $ = id => document.getElementById(id);

function setMsg(id, text, type = "success") {
  const el = $(id);
  if (!el) return;
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
document.addEventListener("DOMContentLoaded", () => {
  const btnCreate = $("btnCreate");
  const btnSignIn = $("btnSignIn");

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

      // Prevent overwriting protected accounts
      if (name === "Atharv Tiwari" || name === "Atharv_Dev/Full") {
        setMsg("signupMessage", "That account name is reserved.", "error");
        return;
      }

      // Default balance ₹100
      const accountData = { password: password, balance: 100 };
      localStorage.setItem(name, JSON.stringify(accountData));
      setMsg("signupMessage", "Account created. You can sign in now.", "success");

      setTimeout(() => {
        $("signup").classList.add("hidden");
        $("signin").classList.remove("hidden");
        $("signinName").value = name;
      }, 700);
    });
  }

  if (btnSignIn) {
    btnSignIn.addEventListener("click", () => {
      const name = $("signinName").value.trim();
      const password = $("signinPassword").value;

      if (!name || !password) {
        setMsg("signinMessage", "Enter name and password.", "error");
        return;
      }

      const stored = localStorage.getItem(name);
      if (!stored) {
        setMsg("signinMessage", "Account not found.", "error");
        return;
      }

      const accountData = JSON.parse(stored);
      if (accountData.password !== password) {
        setMsg("signinMessage", "Invalid credentials.", "error");
        return;
      }

      const balanceText = accountData.balance === Infinity ? "∞" : `₹${accountData.balance}`;
      setMsg("signinMessage", `Signed in. Balance: ${balanceText}`, "success");

      // Save current user for portfolio page
      localStorage.setItem("currentUser", name);

      // Redirect same tab to portfolio page
      setTimeout(() => {
        window.location.href = "PortFolioMain.html";
      }, 400);
    });
  }
});