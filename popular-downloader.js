const path = require("path");
const fs = require("fs");
const fetch = require("isomorphic-fetch"); // Use isomorphic-fetch for HTTP requests
const https = require("https");
const http = require("http");

const downloadFolder = path.join(__dirname, "downloads");

// Ensure the download folder exists
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

// Function to download an image and save it to disk
function downloadImage(url, filePath) {
  const client = url.startsWith("https") ? https : http;
  client.get(url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    fileStream.on("finish", () => {
      console.log(`Downloaded: ${filePath}`);
    });
  });
}

async function fetchAndDownloadImages() {
  try {
    const response = await fetch("https://www.reddit.com/r/popular.json");
    const body = await response.json();

    // Iterate through articles and download images if the URL is a valid media type
    body.data.children.forEach(article => {
      const url = article.data.url;
      const fileExtension = path.extname(url).toLowerCase();

      if ([".png", ".jpg", ".gif"].includes(fileExtension)) {
        const fileName = `${article.data.id}${fileExtension}`;
        const filePath = path.join(downloadFolder, fileName);

        // Download the image and save it to the file
        downloadImage(url, filePath);
      }
    });
  } catch (err) {
    console.error("Error fetching Reddit data:", err);
  }
}

// Call the function to fetch and download images
fetchAndDownloadImages();
