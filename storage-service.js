import { hideForms, displayMessage, toggleForms } from './ui-utils.js';
import { isTokenExpired } from './check-token.js'; // Import the isTokenExpired function

export function checkLoginStatus() {
    chrome.storage.local.get(['token', 'username'], function (result) {
        if (chrome.runtime.lastError) {
            console.error(`Error retrieving data: ${chrome.runtime.lastError.message}`);
            return;
        }

        if (result.token && !isTokenExpired(result.token)) {
            // Token is present and not expired
            console.log('Token is present and not expired');
            hideForms();
            displayMessage(`Welcome back, ${result.username}!`);
        } else {
            // Token is not present or is expired
            console.log('Token is not present or is expired');
            toggleForms(true);
        }
    });
}