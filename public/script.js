document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const signupMessage = document.getElementById('signupMessage');
    const loginMessage = document.getElementById('loginMessage');

    // Signup Form Event Listener
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.success) {
                        signupMessage.textContent = 'Signup successful!';
                        window.location.href = 'login.html';
                        signupForm.reset();
                    } else {
                        signupMessage.textContent = `Error: ${data.message}`;
                    }
                } else {
                    throw new Error(data.message || 'Signup request failed');
                }
            } catch (error) {
                console.error('Error:', error);
                signupMessage.textContent = error.message;
            }
        });
    }

    // Login Form Event Listener
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.success) {
                        loginMessage.textContent = 'Login successful!';
                        window.location.href = 'menu.html';
                        loginForm.reset();
                    } else {
                        loginMessage.textContent = data.message;
                    }
                } else {
                    throw new Error(data.message || 'Login request failed');
                }
            } catch (error) {
                console.error('Error:', error);
                loginMessage.textContent = 'An error occurred. Please try again later.';
            }
        });
    }
});