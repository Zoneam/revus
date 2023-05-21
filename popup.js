
console.log('popup.js loaded');

import './popup.css';
let getSummaryBtn = document.getElementById('getSummaryBtn');
// When the popup is opened, check the stored state
chrome.storage.local.get('targetVisible', (result) => {
  if (result.targetVisible) {
      // The target is visible, activate the button
      getSummaryBtn.innerText = 'Summarize Reviews';
  } else {
      getSummaryBtn.innerText = 'No Reviews Found'; 
  }
});


if (!getSummaryBtn.hasListener) {
  getSummaryBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "summarize"});
    });
  });
  getSummaryBtn.hasListener = true;
}
