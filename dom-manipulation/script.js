// ===================== STORAGE & QUOTES =====================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
  ];
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // ===================== RANDOM QUOTE =====================
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    let filteredQuotes = getFilteredQuotes();
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available for this category.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
  
    quoteDisplay.innerHTML = `"${randomQuote.text}" — <strong>${randomQuote.category}</strong>`;
  
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
  
  // ===================== ADD QUOTE =====================
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.id = "dynamicAddQuoteForm";
  
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
  
    document.body.appendChild(formContainer);
  }
  
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!quoteText || !quoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    const newQuote = { text: quoteText, category: quoteCategory };
  
    quotes.push(newQuote);
    saveQuotes();
  
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    alert("Quote added successfully!");
    populateCategories();
    showRandomQuote();
  
    // Push to server
    pushNewQuoteToServer(newQuote);
  }
  
  // ===================== JSON IMPORT/EXPORT =====================
  function exportQuotesToJson() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
  
    fileReader.onload = function(e) {
      const importedQuotes = JSON.parse(e.target.result);
  
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    };
  
    fileReader.readAsText(event.target.files[0]);
  }
  
  // ===================== CATEGORY FILTER =====================
  // Get quotes filtered by selected category
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem("lastCategory") || "all";

  if (selectedCategory === "all") {
    return quotes;
  }

  return quotes.filter(quote => quote.category === selectedCategory);
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  localStorage.setItem("lastCategory", selectedCategory);

  showRandomQuote();
}
// Get quotes filtered by selected category
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem("lastCategory") || "all";

  if (selectedCategory === "all") {
    return quotes;
  }

  return quotes.filter(quote => quote.category === selectedCategory);
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  localStorage.setItem("lastCategory", selectedCategory);

  showRandomQuote();
}

  
  // ===================== SERVER SYNC & CONFLICT =====================
  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API
  let conflicts = [];
  
  async function fetchServerQuotes() {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      const serverQuotes = data.slice(0, 10).map(item => ({
        text: item.title,
        category: "Server"
      }));
      return serverQuotes;
    } catch (err) {
      showStatus("Error fetching from server", "red");
      return [];
    }
  }
  
  async function pushNewQuoteToServer(quote) {
    try {
      await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(quote),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
    } catch {
      showStatus("Failed to sync new quote to server", "red");
    }
  }
  
  async function syncWithServer() {
    const serverData = await fetchServerQuotes();
    conflicts = [];
  
    serverData.forEach(serverQuote => {
      const match = quotes.find(q => q.text === serverQuote.text);
      if (!match) {
        quotes.push(serverQuote);
      } else if (match.category !== serverQuote.category) {
        conflicts.push({ local: match, server: serverQuote });
        match.category = serverQuote.category; // server wins
      }
    });
  
    saveQuotes();
    populateCategories();
    filterQuotes();
  
    if (conflicts.length > 0) {
      showStatus("Conflicts detected & auto-resolved (Server Wins)", "#c0392b");
      document.getElementById("viewConflictsBtn").style.display = "inline-block";
    } else {
      showStatus("Synced successfully", "green");
      document.getElementById("viewConflictsBtn").style.display = "none";
    }
  }
  
  function showStatus(message, color) {
    const syncStatus = document.getElementById("syncStatus");
    syncStatus.textContent = message;
    syncStatus.style.background = color;
    syncStatus.style.display = "block";
    setTimeout(() => syncStatus.style.display = "none", 4000);
  }
  
  function showConflicts() {
    const conflictPanel = document.getElementById("conflictPanel");
    const conflictList = document.getElementById("conflictList");
    conflictPanel.style.display = "block";
  
    conflictList.innerHTML = conflicts.map(c => `
      <p><strong>Local:</strong> ${c.local.text} (${c.local.category})<br>
         <strong>Server:</strong> ${c.server.text} (${c.server.category})</p>
    `).join("");
  }
  
  function resolveConflicts() {
    conflicts.forEach(c => {
      const index = quotes.findIndex(q => q.text === c.local.text);
      if (index !== -1) quotes[index] = c.server;
    });
  
    saveQuotes();
    document.getElementById("conflictPanel").style.display = "none";
    showStatus("Conflicts manually resolved", "green");
  }
  
  document.getElementById("viewConflictsBtn").addEventListener("click", showConflicts);
  document.getElementById("manualSyncBtn").addEventListener("click", syncWithServer);
  setInterval(syncWithServer, 30000);
  
  // ===================== INITIALIZATION =====================
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  populateCategories();
  
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" — <strong>${q.category}</strong>`;
  } else {
    showRandomQuote();
  }
  