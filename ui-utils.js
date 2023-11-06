export function toggleForms(showLogin) {
    document.getElementById('loginForm').classList.toggle('hidden', !showLogin);
    document.getElementById('signupForm').classList.toggle('hidden', showLogin);
    document.getElementById('showLogin').classList.remove('hidden');
    document.getElementById('showRegister').classList.remove('hidden');
}

export function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    messageDiv.classList.remove('hidden');
}

export function showWelcomeMessage(username) {
    hideForms();
    displayMessage(`Welcome ${username}!`);
}

export function hideForms() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('showLogin').classList.add('hidden');
    document.getElementById('showRegister').classList.add('hidden');
}
