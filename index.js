document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Simple validation logic
    if (username === "sthita23cs" && password === "23ug") {
        alert("Login successful!");
        window.location.href = "mediciene.html";
        // You can redirect to another page here
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
});
