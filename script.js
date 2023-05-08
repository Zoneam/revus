window.addEventListener("load", async function () {
  const reviewDataSet = [];

  const dpDiv = document.getElementById("dp");
  if (dpDiv) {
    const reviewDiv = document.createElement("div");
    reviewDiv.setAttribute("id", "review");
    reviewDiv.innerHTML =
      "⭐⭐⭐⭐⭐ This is the best product on the market! ⭐⭐⭐⭐⭐";
    dpDiv.parentNode.insertBefore(reviewDiv, dpDiv);
  }

  // Get all the reviews
  const reviewSpans = document.querySelectorAll(".review-text-content > span");

  reviewSpans.forEach((span,idx) => {
    const review = span.textContent.trim();
    reviewDataSet.push("Customer " + idx + ": " + review);
  });

  console.log(reviewDataSet);

  // Summarize the reviewDataSet with AI

  const summary = await summarizeReviews(reviewDataSet);

  // Display the results


});

async function summarizeReviews(reviews) {
  try {
    const allReviews = reviews.join("\n\n");
    const myApiKey = process.env.API_KEY;
    const url = "https://api.openai.com/v1/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${myApiKey}`,
    };
    const dataRec = {
      prompt: `give bullet point summary of recurring problems with this product:\n\n${allReviews}\n\n`,
      temperature: 0.7,
      model: "text-davinci-002",
      max_tokens: 250,
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
    console.log('Data====',data.choices[0].text);
    return data.choices[0].text;
  } catch (error) {
    console.error('ERROR====',error);
  }
}
