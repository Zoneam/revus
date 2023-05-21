
console.log('popup.js loaded');

import './popup.css';

let getSummaryBtn = document.getElementById('getSummaryBtn');

if (!getSummaryBtn.hasListener) {
  getSummaryBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "summarize"});
    });
  });
  getSummaryBtn.hasListener = true;
}
