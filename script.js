

window.addEventListener('load', function() {
    const dpDiv = document.getElementById('dp');
    if (dpDiv) {
      const reviewDiv = document.createElement('div');
      reviewDiv.setAttribute('id', 'review');
      reviewDiv.innerHTML = '⭐⭐⭐⭐⭐ This is the best product on the market! ⭐⭐⭐⭐⭐';
      dpDiv.parentNode.insertBefore(reviewDiv, dpDiv);
    }
  });
  