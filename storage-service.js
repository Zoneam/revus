import { hideForms, displayMessage, toggleForms } from './ui-utils.js';

export function checkLoginStatus() {
    chrome.storage.local.get(['token', 'username'], function (result) {
        if (result.token && result.username) {
            hideForms();
            displayMessage(`Welcome back, ${result.username}!`);
        } else {
            toggleForms(true);
        }
    });
}