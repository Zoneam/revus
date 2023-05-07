  window.addEventListener('load', async function() {
    const reviewDataSet = [];

    const dpDiv = document.getElementById('dp');
    if (dpDiv) {
      const reviewDiv = document.createElement('div');
      reviewDiv.setAttribute('id', 'review');
      reviewDiv.innerHTML = '⭐⭐⭐⭐⭐ This is the best product on the market! ⭐⭐⭐⭐⭐';
      dpDiv.parentNode.insertBefore(reviewDiv, dpDiv);
    }

    // Get all the reviews
    const reviewSpans = document.querySelectorAll('.review-text-content > span');

    reviewSpans.forEach((span) => {
      const review = span.textContent.trim();
      reviewDataSet.push(review);
    });

    console.log(reviewDataSet);

    // Analize the reviewDataSet with AI
    
    const summary = await summarizeReviews(reviewDataSet)

    // Display the results

    console.log(summary);

  });
  

  async function summarizeReviews(reviews) {
    const url = 'https://api.openai.com/v1/models/text-davinci-002/generate';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };
    const data = {
      prompt: `Summarize:\n\n${reviews}\n\nSummary:`,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data
    } catch (error) {
      console.error(error);
    }
  }