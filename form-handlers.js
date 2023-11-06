import { displayMessage, showWelcomeMessage } from './ui-utils.js';
import { loginUser, registerUser } from './api-service.js';
import { saveToken } from './storage-service.js';

// login form submission
export async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const result = await loginUser(username, password);
        if (result.token) {
            saveToken(result.token);
            showWelcomeMessage(username);
        } else {
            throw new Error(result.error || 'Error logging in!');
        }
    } catch (error) {
        console.error(error);
        displayMessage(error.message);
    }
}

// signup form submission
export async function handleSignupFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const result = await registerUser(email, password);
        if (result) {
            // After registration, automatically log in the user
            await handleLoginFormSubmit(new Event('submit', { target: { username: email, password: password } }));
        } else {
            throw new Error(result.error || 'Error during registration.');
        }
    } catch (error) {
        console.error(error);
        displayMessage(error.message);
    }
}
