document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const errorMessage = document.getElementById('error-message');

    // Check if user is already logged in
    const currentUser = localStorage.getItem('chatUsername');
    if (currentUser) {
        // Redirect to chat page if already logged in
        window.location.href = 'chat.html';
    }

    // Login button click event
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        
        // Validate username
        if (username === '') {
            errorMessage.textContent = 'Please enter a username';
            return;
        }
        
        if (username.length < 3) {
            errorMessage.textContent = 'Username must be at least 3 characters';
            return;
        }
        
        // Store username in localStorage
        localStorage.setItem('chatUsername', username);
        
        // Redirect to chat page
        window.location.href = 'chat.html';
    });

    // Allow Enter key to submit
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});