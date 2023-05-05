

window.addEventListener('load', function() {
    const dpDiv = document.getElementById('dp');
        console.log('Content script running',dpDiv)
    if (dpDiv) {
      const reviewDiv = document.createElement('div');
      reviewDiv.setAttribute('id', 'review');
      reviewDiv.innerHTML = '⭐⭐⭐⭐⭐ This is the best product in the market! ⭐⭐⭐⭐⭐';
      dpDiv.parentNode.insertBefore(reviewDiv, dpDiv);
    }
  });
  