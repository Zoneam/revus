import { showWelcomeMessage, displayMessage } from './ui-utils.js';
import { API_LOGIN_URL, API_SIGNUP_URL } from './api-urls.js';

export async function loginUser(username, password) {
    try {
        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        const result = await response.json();
        if (response.ok && result.token) {
            chrome.storage.local.set({ token: result.token, username: username });
            showWelcomeMessage(username);
        } else {
            throw new Error(result.error || 'Error logging in!');
        }
    } catch (error) {
        console.error(error);
        displayMessage(error.message);
    }
}

export async function signupUser(email, password) {
    try {
        const response = await fetch(API_SIGNUP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();
        if (response.ok) {
            await loginUser(email, password); // login after signup
        } else {
            throw new Error(result.error || 'Error during registration.');
        }
    } catch (error) {
        console.error(error);
        displayMessage(error.message);
    }
}
