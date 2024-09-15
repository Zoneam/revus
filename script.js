import './script.css';
const { log } = console;
let target = document.getElementById('imageBlock');

const updateSummaryButton = async () => {
  const summaryBtnContainer = document.getElementById('summaryBtnContainer');
  let summaryBtn = summaryBtnContainer ? document.querySelector('.summaryBtn') : null;

  if (!summaryBtn) {
    summaryBtn = document.createElement('button');
    summaryBtn.className = 'summaryBtn';
    summaryBtnContainer.appendChild(summaryBtn);
  }

  // Remove any existing click event listeners to avoid multiple bindings
  const oldButton = summaryBtn.cloneNode(true); // Create a clone of the button
  summaryBtn.replaceWith(oldButton); // Replace the button with the cloned one
  summaryBtn = oldButton;

  const isLoggedIn = await checkLoginStatus();  // Check login status

  if (isLoggedIn) {
    // User is logged in: enable the button for summarizing
    summaryBtn.innerText = 'Summarize Reviews';
    summaryBtn.disabled = false;

    // Add summarizing functionality when logged in
    summaryBtn.addEventListener('click', async function() {
      summaryBtn.innerText = `Summarizing......`;
      summaryBtn.disabled = true;
      let reviewDataSet = [];
      const imageDiv = document.getElementById("imageBlock");
      
      // Scrape all reviews from Amazon
      const reviewSpans = document.querySelectorAll(".review-text-content > span");
      reviewSpans.forEach((span, idx) => {
        const review = span.textContent.trim();
        reviewDataSet.push(review);
      });
      
      // Summarize the reviewDataSet with AI
      const { summary } = await summarizeReviews({ reviews: reviewDataSet });
      console.log(summary);
      
      // Add result to the DOM under image
      if (imageDiv) {
        const reviewDiv = document.createElement("div");
        reviewDiv.setAttribute("id", "review");
        reviewDiv.innerHTML += `<h3>Summary</h3>`;
        if (summary.length) {
          summary.split('\n').forEach((summary) => {
            reviewDiv.innerHTML += `<li class="list-problem">${summary}</li>`;
          });
        }
        imageDiv.appendChild(reviewDiv);
        summaryBtn.disabled = false;
        summaryBtn.innerText = 'Summarize Again';
      }
    });
  } else {
    // User is not logged in: show login prompt and open popup
    summaryBtn.innerText = 'Please Login to Summarize Reviews';
    summaryBtn.disabled = false;

    // Add functionality to open popup for login if not logged in
    summaryBtn.addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'openPopup' }, function(response) {
        if (chrome.runtime.lastError) {
          console.error(`Error opening popup: ${chrome.runtime.lastError.message}`);
        } else {
          console.log('Popup opened for login.');
        }
      });
    });
  }
};

// Function to check if the user is logged in
const checkLoginStatus = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['token'], function(result) {
      if (chrome.runtime.lastError) {
        reject(`Error retrieving token: ${chrome.runtime.lastError.message}`);
      } else {
        resolve(!!result.token); // return true if token exists, otherwise false
      }
    });
  });
};

// Initial call to set up the summarize button based on login status
if (target) {
  const summaryBtnContainer = document.createElement('div');
  summaryBtnContainer.setAttribute('id', 'summaryBtnContainer');
  target.appendChild(summaryBtnContainer);

  updateSummaryButton();

  // Listen for changes in Chrome storage (login/logout) and update the button accordingly
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes.token) {
      updateSummaryButton();
    }
  });
} else {
  log('No reviews found!');
}

// Summarize reviews using the Revus Lambda Proxy on AWS
const summarizeReviews = async (reviews, maxRetries = 3) => {
  const url = 'https://frmme9pn2h.execute-api.us-east-1.amazonaws.com/stage/revus';
  
  const getToken = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['token'], function(result) {
        if (chrome.runtime.lastError) {
          reject(`Error retrieving token: ${chrome.runtime.lastError.message}`);
        } else {
          resolve(result.token);
        }
      });
    });
  };

  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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