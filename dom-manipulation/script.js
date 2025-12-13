// ===================== QUOTES =====================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Dream big.", category: "Inspiration" }
];

// ===================== SAVE =====================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===================== RANDOM QUOTE =====================
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) {
    display.innerHTML = "No quotes found.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  display.innerHTML = filteredQuotes[randomIndex].text;
}

// ===================== ADD QUOTE =====================
function createAddQuoteForm() {
  const div = document.createElement("div");
  div.innerHTML = `
    <input id="newQuoteText" placeholder="Quote text">
    <input id="newQuoteCategory" placeholder="Category">
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(div);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// ===================== TASK 2: FILTERING =====================
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  filter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) filter.value = selectedCategory;
}

function filterQuotes() {
  const selectedCategory =
    document.getElementById("categoryFilter").value;

  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

function getFilteredQuotes() {
  const selectedCategory =
    localStorage.getItem("selectedCategory") || "all";

  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// ===================== TASK 1: EXPORT =====================
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

// ===================== TASK 3: SERVER SYNC =====================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

/* ✅ REQUIRED FUNCTION NAME */
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  // SERVER WINS STRATEGY
  quotes = serverQuotes;
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("syncMessage").innerText =
    "Synced with server (server data applied)";
}

// Periodic sync
setInterval(syncWithServer, 30000);

// ===================== INIT =====================
document.getElementById("newQuote")
  .addEventListener("click", showRandomQuote);

createAddQuoteForm();
populateCategories();
showRandomQuote();
