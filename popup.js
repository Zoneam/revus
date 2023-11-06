// main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '/popup.css';
import { toggleForms, displayMessage } from './ui-utils.js';
import { checkLoginStatus } from './storage-service.js';
import { loginUser, signupUser } from './api-service.js';

document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
    toggleForms(true);

    document.getElementById('showLogin').addEventListener('click', () => toggleForms(true));
    document.getElementById('showRegister').addEventListener('click', () => toggleForms(false));

    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        await loginUser(username, password);
    });

    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('signupPassword').value;
        await signupUser(email, password);
    });
});
