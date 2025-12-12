// Array of quotes
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    quoteDisplay.innerHTML = `"${randomQuote.text}" — <strong>${randomQuote.category}</strong>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!quoteText || !quoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });
  
    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    alert("Quote added successfully!");
  
    // Optionally refresh displayed quote
    showRandomQuote();
  }
  
  // Event listener for the button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Show a quote on page load
  showRandomQuote();
  