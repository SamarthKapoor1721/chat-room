// chat.js
document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const currentUserSpan = document.getElementById("current-user");
    const usersList = document.getElementById("users-list");

    // Get username from localStorage
    const username = localStorage.getItem("chatUsername");
    if (!username) {
        window.location.href = "index.html";
        return;
    }
    currentUserSpan.textContent = username;

    // Register new user with server
    socket.emit("new-user", username);

    // Listen for incoming messages
    socket.on("chat-message", (message) => {
        displayMessage(message);
        scrollToBottom();
    });

    // Listen for active users update
    socket.on("update-users", (users) => {
        displayActiveUsers(users);
    });

    // Send message when button is clicked
    sendBtn.addEventListener("click", sendMessage);

    // Send message when pressing Enter
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Function: send message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        socket.emit("chat-message", messageText);
        messageInput.value = "";
    }

    // Function: display a single message
    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        if (message.username === username) {
            messageElement.classList.add("sent");
        } else {
            messageElement.classList.add("received");
        }

        const timestamp = new Date(message.timestamp);
        const formattedTime = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        messageElement.innerHTML = `
            <div class="username">${message.username}</div>
            <div class="content">${escapeHtml(message.text)}</div>
            <div class="time">${formattedTime}</div>
        `;
        chatMessages.appendChild(messageElement);
    }

    // Function: display active users
    function displayActiveUsers(users) {
        usersList.innerHTML = "";
        users.forEach((user) => {
            const userItem = document.createElement("div");
            userItem.classList.add("user-item");

            const userStatus = document.createElement("div");
            userStatus.classList.add("user-status");

            const userName = document.createElement("div");
            userName.classList.add("user-name");
            userName.textContent = user;

            userItem.appendChild(userStatus);
            userItem.appendChild(userName);
            usersList.appendChild(userItem);
        });
    }

    // Function: scroll to latest message
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function: prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("chatUsername");
        window.location.href = "index.html";
    });
});
