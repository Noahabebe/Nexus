const { exec } = require('child_process');
const { scheduleJob } = require('node-schedule');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchNewsAndSaveToJson() {
    async function fetchNews() {
        const apiKey = '2d579c24b6984e26844108ae07f221ea';
        const apiUrl = 'https://newsapi.org/v2/sources?apiKey=' + apiKey;
      
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return null;
        }
      }
      
      async function saveNewsDataToFile() {
        try {
          const newsData = await fetchNews();
          if (newsData) {
            const jsonData = JSON.stringify(newsData, null, 2);
            fs.writeFile('newsData.json', jsonData, (err) => {
              if (err) {
                console.error('Error writing to file:', err);
                return;
              }
              console.log('News data saved to newsData.json');
            });
          } else {
            console.error('No data to save.');
          }
        } catch (error) {
          console.error('Error saving news data:', error);
        }
      }
      
      // Call the function to save news data to a file
      saveNewsDataToFile();
      
  console.log('Fetching news data and saving to JSON...');
}

// Function to commit changes to Git
function commitToGit() {
  exec('git add . && git commit -m "Automatic commit"', (error, stdout, stderr) => {
    if (error) {
      console.error('Error committing to Git:', error);
      return;
    }
    console.log('Changes committed to Git:', stdout);
    console.error('Git error:', stderr);
  });
}

// Schedule the execution of fetchNewsAndSaveToJson and Git commit every 24 hours
scheduleJob('0 0 */24 * * *', async () => {
  console.log('Running fetchNewsAndSaveToJson and committing to Git...');
  
  // Execute fetchNewsAndSaveToJson function
  try {
    await fetchNewsAndSaveToJson();
  } catch (error) {
    console.error('Error fetching news and saving to JSON:', error);
    return;
  }

  // Commit changes to Git
  commitToGit();
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




