import './script.css';

let target = document.getElementById('imageBlock');
console.log('script.js loaded', target);


if (target) { // This means the target is visible
    // Send a message to the service worker
    chrome.runtime.sendMessage({targetVisible: true});
} else {
    // Send a message to the service worker
    chrome.runtime.sendMessage({targetVisible: false});
}


chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if (request.greeting === "summarize") {
        let reviewDataSet = '';
        const imageDiv = document.getElementById("imageBlock");
      
        // Scrape all the reviews
        const reviewSpans = document.querySelectorAll(".review-text-content > span");
      
        reviewSpans.forEach((span, idx) => {
          const review = span.textContent.trim();
          reviewDataSet += `Review ${idx + 1}: ${review}\n`;
        });
      
        // Summarize the reviewDataSet with AI
        const summary = await summarizeReviews({ reviews: reviewDataSet });
        
        // Add result to the DOM under image
        if (imageDiv) {
          const reviewDiv = document.createElement("div");
          reviewDiv.setAttribute("id", "review");
      
          if (summary.length){
            reviewDiv.innerHTML += `<li class="list-problem">⭐ ${summary}</li>`;
          }
          imageDiv.appendChild(reviewDiv);
        }
    }
});

// Summarize reviews using the Revus Lambda Proxy on AWS
async function summarizeReviews(reviews, maxRetries = 3) {
  let reviewsString;
  const url = 'https://z6xdsaipm1.execute-api.us-east-1.amazonaws.com/dev/revus';
  const headers = {
    'Content-Type': 'application/json',
  };

  if (reviews.length === 0) {
    console.error('No reviews provided');
    return;
  }

  try {
    reviewsString = JSON.stringify(reviews);
  } catch (error) {
    console.error('Failed to stringify reviews', error);
    return {
      error: true,
      message: `Failed to stringify reviews. Error: ${error.message}`
    };
  }

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: reviewsString
      });

      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Response error with status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Attempt', i + 1, 'ERROR====', error);

      // Only retry for 5xx server errors
      if (i < maxRetries && error.message.startsWith('Response error') && parseInt(error.message.split(': ')[1]) >= 500) {
        continue;
      } else {
        // Return or throw the error if the maximum number of retries has been reached, or for non-5xx errors
        return {
          error: true,
          message: `Failed to summarize reviews after ${i + 1} attempts. Error: ${error.message}`
        };
      }
    }
  }
}
