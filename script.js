window.addEventListener('load', function() {
  const allReviewTexts = [];
  const dpDiv = document.getElementById('dp');
  if (dpDiv) {
    const reviewDiv = document.createElement('div');
    reviewDiv.setAttribute('id', 'review');
    reviewDiv.innerHTML = '⭐⭐⭐⭐⭐ This is the best product on the market! ⭐⭐⭐⭐⭐';
    dpDiv.parentNode.insertBefore(reviewDiv, dpDiv);
  }

  const reviewSpans = document.querySelectorAll('.review-text-content > span');

  reviewSpans.forEach((span) => {
    const review = span.textContent.trim();
    reviewDataSet.push(review);
  });

  console.log(reviewDataSet);

  });
  

  