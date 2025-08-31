//"User fouund"
import { login } from './src/APIcall.js'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    console.log("hello i am online")
    // Get all relevant elements from the DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginButton = document.getElementById('loginButton');
    const loginLoading = document.getElementById('loginLoading');
    const loginArrow = document.getElementById('loginArrow');
    const togglePassword = document.getElementById('togglePassword');

    const API_ENDPOINT = '/login'; // Adjust this to your actual API endpoint for login

    // --- Utility Functions ---

    /**
     * Toggles the visibility of the password input.
     */
    const togglePasswordVisibility = () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
        togglePassword.classList.toggle('fa-eye');
    };

    /**
     * Displays an error message for a specific input field.
     * @param {HTMLElement} element - The DOM element to show the error message in.
     * @param {string} message - The error message to display.
     */
    const showErrorMessage = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
    };

    /**
     * Clears the error message for a specific input field.
     * @param {HTMLElement} element - The DOM element whose error message should be cleared.
     */
    const clearErrorMessage = (element) => {
        element.textContent = '';
        element.style.display = 'none';
    };

    /**
     * Shows a loading state on the login button.
     */
    const showLoadingState = () => {
        loginLoading.style.display = 'block';
        loginArrow.style.display = 'none';
        loginButton.disabled = true;
    };

    /**
     * Hides the loading state and restores the login button.
     */
    const hideLoadingState = () => {
        loginLoading.style.display = 'none';
        loginArrow.style.display = 'block';
        loginButton.disabled = false;
    };

    // --- Event Listeners ---
    // Password visibility toggle
    togglePassword.addEventListener('click', togglePasswordVisibility);
    // Form submission handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission
        // Clear previous errors
        clearErrorMessage(emailError);
        clearErrorMessage(passwordError);
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;
        // Basic client-side validation
        if (!email) {
            showErrorMessage(emailError, 'Email is required.');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            showErrorMessage(emailError, 'Please enter a valid email address.');
            isValid = false;
        }
        if (!password) {
            showErrorMessage(passwordError, 'Password is required.');
            isValid = false;
        }
        if (!isValid) {
            return; // Stop if validation fails
        }
        showLoadingState();
        const data = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim()
        }
        try {
            const responce = await login(data)

            if (responce.message == "User fouund") {

                window.location.replace("http://127.0.0.1:3000/profile.html")
                alert("login")

            }
            else {
                throw new Error("unable to login")
            }

        }
        catch (err) {
            console.log("unabel to login")

        }

        finally {
            {
                hideLoadingState();
            }
        }
    });
});