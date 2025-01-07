const apikey = "71373ebc93fd4192a0dbf0a5cba9b9b8";
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("Search-input");
const searchButton = document.getElementById("search-button");
const categoryButtons = document.querySelectorAll(".tag");

// Fetch and display random news on page load
(async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news:", error);
  }
})();

// Fetch random news articles
async function fetchRandomNews() {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=30&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news:", error);
    return [];
  }
}

// Fetch news articles by query
async function fetchNewsQuery(query) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching news by query:", error);
    return [];
  }
}

// Display blogs dynamically
function displayBlogs(articles) {
  blogContainer.innerHTML = "";

  if (articles.length === 0) {
    blogContainer.innerHTML = `<p>No articles found. Try searching for something else.</p>`;
    return;
  }

  articles.forEach((article) => {
    if (article.urlToImage && article.title && article.description) {
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      const img = document.createElement("img");
      img.src = article.urlToImage;
      img.alt = article.title;

      const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
      const title = document.createElement("h2");
      title.textContent = truncatedTitle;

      const truncatedDescription =
        article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description;
      const description = document.createElement("p");
      description.textContent = truncatedDescription;

      blogCard.appendChild(img);
      blogCard.appendChild(title);
      blogCard.appendChild(description);
      blogCard.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });

      blogContainer.appendChild(blogCard);
    }
  });
}

// Event listener for search button
searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayBlogs(articles);
    } catch (error) {
      console.error("Error fetching news by query:", error);
    }
  }
});

// Event listeners for category buttons
categoryButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.dataset.category; 
    try {
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=10&apikey=${apikey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      displayBlogs(data.articles);
    } catch (error) {
      console.error(`Error fetching news for category: ${category}`, error);
    }
  });
});
