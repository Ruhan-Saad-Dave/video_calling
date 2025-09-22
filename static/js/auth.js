import { startWebsocket, startLocalVideo } from './webrtc.js';

const authContainer = document.getElementById('auth-container');
const callContainer = document.getElementById('call-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

let username;

export function initAuth() {
    showRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginBtn.addEventListener('click', () => {
        username = loginUsernameInput.value;
        const password = loginPasswordInput.value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                authContainer.style.display = 'none';
                callContainer.style.display = 'block';
                startWebsocket(username);
                startLocalVideo();
            } else {
                alert('Invalid credentials');
            }
        });
    });

    registerBtn.addEventListener('click', () => {
        const username = registerUsernameInput.value;
        const password = registerPasswordInput.value;
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                alert('Registration successful! Please login.');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert('Username already exists');
            }
        });
    });
}

export function getUsername() {
    return username;
}
