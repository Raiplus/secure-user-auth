// Assuming these functions are in your APIcall.js and they return Promises
import { generateOTP, resendOtp, registerUser, verifyOtp } from './src/APIcall.js';

document.addEventListener('DOMContentLoaded', function () {
    // Form steps navigation
    const steps = [1, 2, 3];
    let currentStep = 1;

    // --- DOM elements ---
    const progressBar = document.getElementById('progressBar');
    const nextBtn1 = document.getElementById('nextBtn1');
    const nextBtn2 = document.getElementById('nextBtn2');
    const prevBtn2 = document.getElementById('prevBtn2');
    const prevBtn3 = document.getElementById('prevBtn3');
    const submitBtn = document.getElementById('submitBtn');
    const submitLoading = document.getElementById('submitLoading');
    const signupForm = document.getElementById('signupForm');
    const successMessage = document.getElementById('successMessage');
    const resendOtpBtn = document.getElementById('resendOtpBtn');

    // **FIX 1: `currentOtp` is now in the correct scope, accessible by all functions.**
    let currentOtp = null;

    function updateProgress() {
        const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', currentStep);

        steps.forEach(step => {
            const stepElement = document.getElementById(`step${step}`);
            if (step < currentStep) {
                stepElement.classList.add('completed');
                stepElement.classList.remove('active');
            } else if (step === currentStep) {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });

        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step${currentStep}-form`).classList.add('active');
    }

    // --- Step 1: Personal Info ---
    nextBtn1.addEventListener('click', function () {
        document.getElementById('social-login').classList.add('social-login-Hide');
        document.getElementById('divider').classList.add('social-login-Hide');


        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');
        let isValid = true;

        if (!fullName || fullName.length < 3) {
            nameError.textContent = 'Please enter a valid name (at least 3 characters)';
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }
        if (phone && !/^[0-9]{10,15}$/.test(phone)) {
            phoneError.textContent = 'Please enter a valid phone number (10-15 digits)';
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            phoneError.style.display = 'none';
        }

        if (isValid) {
            currentStep = 2;
            updateProgress();
        }
    });

    // --- Step 2: Account Security & OTP Generation ---
    // **FIX 2: Made the function `async` to handle the `await` keyword for the API call.**
    nextBtn2.addEventListener('click', async function () {
        // (Validation logic is unchanged)
        nextBtn2.disabled = true

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),

        };

        try {

            let responce = await generateOTP(formData);
            console.log(responce, ": responce is ")
            if (responce.message !== "ok") {
                console.log("Error")
                throw new Error("somting went rong")

            }
            else {
                console.log("OTP Received:"); // For debugging 
                currentStep = 3;


                updateProgress();
            }

        } catch (error) {
            console.error("Failed to generate OTP:", error);

        } finally {
            nextBtn2.disabled = false; // Re-enable the button
        }
    }
    );

    // --- Step 3: OTP Verification & Final Submission ---
    // **FIX 4: This listener is now outside the nextBtn2 click handler.**
    resendOtpBtn.addEventListener('click', async () => {
        resendOtpBtn.disabled = true;
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
        };
        try {
            // Your resendOtp function might need specific data, like email
            let responce = await resendOtp(formData);
            alert('A new OTP has been sent to your email.');
            if (responce.message !== "ok") {
                throw new Error("somting went rong")
            }

        } catch (error) {
            console.error("Failed to resend OTP:", error);
            alert('There was an error resending the OTP.');
        } finally {
            resendOtpBtn.disabled = false;
        }
    });
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("hello rishabh bhai")// remove it //username

        const terms = document.querySelector('input[name="terms"]');
        const otpError = document.getElementById('otp-error');
        const termsError = document.getElementById('terms-error');
        let isValid = true;
        if (!terms.checked) {
            termsError.textContent = 'You must accept the terms and conditions';
            termsError.style.display = 'block';
            isValid = false;
        } else {
            termsError.style.display = 'none';
        }

        if (isValid) {
            submitBtn.disabled = true;
            submitLoading.style.display = 'inline-block';
            const formData = {
                username: document.getElementById('username').value.trim(),
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                password: document.getElementById('password').value.trim(),
                otpInput: document.getElementById('otpInput').value.trim()

            };
            try {
                let responce = await verifyOtp(formData)
                if (!["User updated", "User created"].includes(responce.message)) {
                    otpError.textContent = 'Invalid OTP. Please try again.';
                    otpError.style.display = 'block';
                    isValid = false;
                    throw new Error('Unable to verify OTP');

                } else {
                    otpError.style.display = 'none';
                    successMessage.style.display = "blcok"
                    successMessage.innerText = "Account created"


                    console.log("OTP verified, proceed with registration");
                    window.location.replace("http://127.0.0.1:3000/profile.html")
                }
            }
            catch (err) {
                console.error("Error verifying OTP:", err.message);
            }
        }
    });

    // --- Other Listeners (Unchanged) ---
    prevBtn2.addEventListener('click', () => { currentStep = 1; updateProgress(); });
    prevBtn3.addEventListener('click', () => { currentStep = 2; updateProgress(); });

    // (Password strength checker and other utility functions are unchanged)
    const passwordInput = document.getElementById('password');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const lengthReq = document.getElementById('lengthReq');
    const numberReq = document.getElementById('numberReq');
    const specialReq = document.getElementById('specialReq');
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        let strength = 0;
        if (password.length >= 8) {
            strength++;
            lengthReq.querySelector('i').className = 'fas fa-check-circle';
            lengthReq.classList.add('valid');
        } else {
            lengthReq.querySelector('i').className = 'far fa-circle';
            lengthReq.classList.remove('valid');
        }
        if (/\d/.test(password)) {
            strength++;
            numberReq.querySelector('i').className = 'fas fa-check-circle';
            numberReq.classList.add('valid');
        } else {
            numberReq.querySelector('i').className = 'far fa-circle';
            numberReq.classList.remove('valid');
        }
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength++;
            specialReq.querySelector('i').className = 'fas fa-check-circle';
            specialReq.classList.add('valid');
        } else {
            specialReq.querySelector('i').className = 'far fa-circle';
            specialReq.classList.remove('valid');
        }
        const strengthPercentage = (strength / 3) * 100;
        passwordStrengthBar.style.width = `${strengthPercentage}%`;
        if (strengthPercentage < 50) {
            passwordStrengthBar.style.backgroundColor = 'var(--error-color)';
        } else if (strengthPercentage < 80) {
            passwordStrengthBar.style.backgroundColor = 'var(--warning-color)';
        } else {
            passwordStrengthBar.style.backgroundColor = 'var(--success-color)';
        }
    });
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
        this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
    });
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Social login functionality would be implemented here');
        });
    });
});