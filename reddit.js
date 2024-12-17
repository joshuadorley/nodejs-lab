const path = require("path");
const fs = require("fs");
const fetch = require("isomorphic-fetch"); // Using isomorphic-fetch instead of request-promise

const dataPath = path.join(__dirname, "popular-articles.json");

async function fetchArticles() {
  try {
    // Fetch data from the Reddit API
    const response = await fetch("https://reddit.com/r/popular.json");
    const body = await response.json();

    // Extract the relevant article details
    const articles = body.data.children.map(item => ({
      title: item.data.title,
      url: item.data.url,
      author: item.data.author
    }));

    // Output the articles to the console
    console.log(articles);

    // Write the articles to a JSON file
    fs.writeFileSync(dataPath, JSON.stringify(articles, null, 2));
    console.log("Articles have been written to popular-articles.json");

  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Call the fetchArticles function to execute
fetchArticles();
