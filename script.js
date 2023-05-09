window.addEventListener("load", async function () {
  const reviewDataSet = [];

  const dpDiv = document.getElementById("dp");
  const imageDiv = document.getElementById("imageBlock");


  // Get all the reviews
  const reviewSpans = document.querySelectorAll(".review-text-content > span");


  reviewSpans.forEach((span,idx) => {
    const review = span.textContent.trim();
    reviewDataSet.push(review + "\n\n");
  });

  console.log(reviewDataSet.join("\n\n"));

  // Summarize the reviewDataSet with AI

  const summary = await summarizeReviews(reviewDataSet);
  
  const summaryArray = await summary.split("*");
  // Display the results

  console.log(summary);

  if (imageDiv) {
    const reviewDiv = document.createElement("div");
    reviewDiv.setAttribute("id", "review");
    summaryArray.forEach((item) => {
      if (item.length){
      reviewDiv.innerHTML += `<li class="list-problem">⭐ ${item}</li>`;
      }
    })
    // dpDiv.parentNode.insertBefore(reviewDiv, imageDiv);
    imageDiv.appendChild(reviewDiv);
  }
});

async function summarizeReviews(reviews) {
  if (reviews.length !== 0) {
    try {
      const allReviews = reviews.join("\n\n");
      const myApiKey = process.env.API_KEY;
      const url = "https://api.openai.com/v1/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myApiKey}`,
      };
      const dataRec = {
        // prompt: `Given the following customer reviews for a product, summarize the reviews and identify recurring problems that are mentioned in 2 or more reviews. After each response add * symbol:\n\n${allReviews}\n\n`,
        prompt: `Combine and summarize all of given customer reviews in one to four sentences depending on size of reviews.instead of outputting customer 1 or first customer, second customer, just add them up and output how many customers are mentioning same problem or positive feedback :\n\n${allReviews}\n\n`,
        temperature: 0.7,
        model: "text-davinci-002",
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataRec)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data.choices[0].text',data.choices[0].text)
      return data.choices[0].text;
    } 
    catch (error) {
      console.error('ERROR====',error);
    }
  }
}
