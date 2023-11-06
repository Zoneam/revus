import './script.css';
const { log } = console;
let target = document.getElementById('imageBlock');

if (target) { 
  const summaryBtnContainer = document.createElement('div');
  const summaryBtn = document.createElement('button');
  summaryBtnContainer.setAttribute('id', 'summaryBtnContainer');
  summaryBtn.className = 'summaryBtn';
  summaryBtn.innerText = 'Summarize Reviews';
  summaryBtnContainer.appendChild(summaryBtn);
  target.appendChild(summaryBtnContainer);
  summaryBtn.addEventListener('click', async function() {
  summaryBtn.innerText = `Summarizing...`;
  summaryBtn.disabled = true;
          let reviewDataSet = '';
          const imageDiv = document.getElementById("imageBlock");
        
          // Scrape all reviews from Amazon
          const reviewSpans = document.querySelectorAll(".review-text-content > span");
        
          reviewSpans.forEach((span, idx) => {
            const review = span.textContent.trim();
            reviewDataSet += `${review}\n\n`;
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
            summaryBtn.disabled = false;
            summaryBtn.innerText = 'Summarize Again';
          }
  });
} else {
  log('No reviews found!');
}


// Summarize reviews using the Revus Lambda Proxy on AWS
const summarizeReviews = async (reviews, maxRetries = 3) => {
  const url = 'https://frmme9pn2h.execute-api.us-east-1.amazonaws.com/stage/revus';
  const headers = {
    'Content-Type': 'application/json',
  };

  if (reviews.length === 0) {
    console.error('No reviews provided');
    return;
  }

  let reviewsString;
  try {
    reviewsString = JSON.stringify(reviews);
  } catch (error) {
    console.error('Failed to stringify reviews', error);
    return {
      error: true,
      message: `Failed to stringify reviews. Error: ${error.message}`
    };
  }

  const handleServerError = (error, attempt) => {
    console.error(`Attempt ${attempt} ERROR:`, error.message);
    if (attempt >= maxRetries || !error.message.startsWith('Response error') || parseInt(error.message.split(': ')[1]) < 500) {
      throw error;
    }
  };

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: reviewsString
      });

      if (!response.ok) {
        throw new Error(`Response error with status code: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      handleServerError(error, i + 1);
    }
  }

  return {
    error: true,
    message: `Failed to summarize reviews after ${maxRetries + 1} attempts.`
  };
};
