// Initial quotes array
const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Dream big and dare to fail.", category: "Inspiration" },
    { text: "It always seems impossible until it's done.", category: "Success" }
  ];
  
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  
  // Function to display a random quote
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    quoteDisplay.textContent = `"${quote.text}" — Category: ${quote.category}`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
  
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();
  
    if (newText === "" || newCategory === "") {
      alert("Please fill in both fields to add a quote.");
      return;
    }
  
    // Add new quote to array
    quotes.push({ text: newText, category: newCategory });
  
    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";
  
    alert("Quote added successfully!");
  }
  
  // Event Listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  
  // Show a quote on first load
  showRandomQuote();
  