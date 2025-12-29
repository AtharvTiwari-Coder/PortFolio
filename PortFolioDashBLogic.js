// Simple portfolio logic: dynamic balance, holdings, and hide-on-scroll header
// Filename: PortFolioDashBLogic.js

// Initial account state
const account = {
  name: "ATHARV",
  balance: 10000,
  holdings: {} // symbol -> quantity
};

// Example shares (symbol, display name, price)
const shares = [
  { symbol: "INF", name: "InfoTech Ltd", price: 1200 },
  { symbol: "ZEN", name: "Zen Energy", price: 540 },
  { symbol: "AQUA", name: "Aqua Labs", price: 220 },
  { symbol: "NXT", name: "NextGen Motors", price: 980 }
];

// DOM refs
const accountNameEl = document.getElementById("accountName");
const accountBalanceEl = document.getElementById("accountBalance");
const sharesListEl = document.getElementById("sharesList");
const developerContactEl = document.getElementById("developerContact");

// Render account info
function renderAccount() {
  accountNameEl.textContent = account.name;
  accountBalanceEl.textContent = account.balance.toFixed(2);
}

// Create share cards
function renderShares() {
  sharesListEl.innerHTML = "";
  shares.forEach(share => {
    const card = document.createElement("div");
    card.className = "share-card";

    const top = document.createElement("div");
    top.className = "share-top";

    const nameWrap = document.createElement("div");
    nameWrap.className = "share-name";

    const symbolBox = document.createElement("div");
    symbolBox.className = "symbol";
    symbolBox.textContent = share.symbol;

    const title = document.createElement("div");
    const titleText = document.createElement("div");
    titleText.textContent = share.name;
    titleText.style.fontWeight = "700";
    const meta = document.createElement("div");
    meta.className = "share-meta";
    meta.textContent = `Price: ₹${share.price.toFixed(2)}`;

    title.appendChild(titleText);
    title.appendChild(meta);

    nameWrap.appendChild(symbolBox);
    nameWrap.appendChild(title);

    top.appendChild(nameWrap);

    // holdings display
    const holdingInfo = document.createElement("div");
    holdingInfo.className = "small";
    const qty = account.holdings[share.symbol] || 0;
    holdingInfo.textContent = `Holding: ${qty}`;

    top.appendChild(holdingInfo);
    card.appendChild(top);

    // Buttons: BUY HOLD SELL
    const actions = document.createElement("div");
    actions.className = "share-actions";

    const buyBtn = document.createElement("button");
    buyBtn.className = "btn btn-buy";
    buyBtn.textContent = "BUY";
    buyBtn.onclick = () => handleBuy(share);

    const holdBtn = document.createElement("button");
    holdBtn.className = "btn btn-hold";
    holdBtn.textContent = "HOLD";
    holdBtn.onclick = () => handleHold(share);

    const sellBtn = document.createElement("button");
    sellBtn.className = "btn btn-sell";
    sellBtn.textContent = "SELL";
    sellBtn.onclick = () => handleSell(share);

    actions.appendChild(buyBtn);
    actions.appendChild(holdBtn);
    actions.appendChild(sellBtn);

    card.appendChild(actions);

    // small note
    const note = document.createElement("div");
    note.className = "small";
    note.textContent = "Tip: BUY reduces balance, SELL increases balance, HOLD does nothing.";
    card.appendChild(note);

    sharesListEl.appendChild(card);
  });
}

// Handlers
function handleBuy(share) {
  const cost = share.price;
  if (account.balance >= cost) {
    account.balance -= cost;
    account.holdings[share.symbol] = (account.holdings[share.symbol] || 0) + 1;
    renderAccount();
    renderShares();
  } else {
    alert("Insufficient balance to buy one unit.");
  }
}

function handleSell(share) {
  const qty = account.holdings[share.symbol] || 0;
  if (qty > 0) {
    account.holdings[share.symbol] = qty - 1;
    account.balance += share.price;
    renderAccount();
    renderShares();
  } else {
    alert("You don't hold any units to sell.");
  }
}

function handleHold(share) {
  // No state change; could be used to mark favorites later
  alert(`Holding ${share.name}. No action taken.`);
}

// Initialize UI
renderAccount();
renderShares();

// Developer contact placeholder: you will tell me what to say; for now it's empty
developerContactEl.textContent = "[Developer contact text goes here — tell me what to say and I'll insert it]";

/* Header hide-on-scroll: hide when scrolling down, show when scrolling up */
(function headerScrollBehavior() {
  const header = document.getElementById("topHeader");
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScroll && currentScroll > 60) {
          // scrolling down
          header.classList.add("hidden");
        } else {
          // scrolling up
          header.classList.remove("hidden");
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();