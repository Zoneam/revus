window.addEventListener("load", async function () {
  let reviewDataSet = '';

  const dpDiv = document.getElementById("dp");
  const imageDiv = document.getElementById("imageBlock");

  // Get all the reviews
  const reviewSpans = document.querySelectorAll(".review-text-content > span");

  reviewSpans.forEach((span, idx) => {
    const review = span.textContent.trim();
    reviewDataSet += `Review ${idx + 1}: ${review}\n`;
  });

  // Summarize the reviewDataSet with AI

  const summary = await summarizeReviews({ reviews: reviewDataSet });
  
  // Display the results

  if (imageDiv) {
    const reviewDiv = document.createElement("div");
    reviewDiv.setAttribute("id", "review");

    if (summary.length){
      reviewDiv.innerHTML += `<li class="list-problem">⭐ ${summary}</li>`;
    }

    imageDiv.appendChild(reviewDiv);
  }
});

async function summarizeReviews(reviews) {
  console.log(JSON.stringify(reviews));
  const url = 'https://z6xdsaipm1.execute-api.us-east-1.amazonaws.com/dev/revus';
  const headers = {
    'Content-Type': 'application/json',
  };

  if (reviews.length !== 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(reviews)
      });
      if (response.ok) {
        return response.json();
      } else if (response.status >= 500 && response.status < 600) {
        console.error('Server error. Status code:', response.status);
      } else {
        console.error('Error. Status code:', response.status);
      }
    } catch (error) {
      console.error('ERROR====', error);
    }
  }
}
