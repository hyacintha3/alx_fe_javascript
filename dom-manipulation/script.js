// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
  ];
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // REQUIRED — Show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    quoteDisplay.innerHTML = `"${randomQuote.text}" — <strong>${randomQuote.category}</strong>`;
  
    // Save last viewed quote in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
  
  // REQUIRED — dynamic form creation
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
  
  // REQUIRED — Add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!quoteText || !quoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    quotes.push({ text: quoteText, category: quoteCategory });
  
    saveQuotes(); // Save to localStorage
  
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    alert("Quote added successfully!");
  
    showRandomQuote();
  }
  
  // JSON EXPORT
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
  
  // JSON IMPORT
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
  
    fileReader.onload = function(e) {
      const importedQuotes = JSON.parse(e.target.result);
  
      quotes.push(...importedQuotes);   // merge
      saveQuotes();                    // save to storage
  
      alert("Quotes imported successfully!");
    };
  
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for show button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Create form dynamically
  createAddQuoteForm();
  
  // Load last session quote if available
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" — <strong>${q.category}</strong>`;
  } else {
    showRandomQuote();
  }
  