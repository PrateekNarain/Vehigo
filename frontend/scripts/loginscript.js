// const forms = document.querySelector(".forms");
// const pwShowHide = document.querySelectorAll(".eye-icon");
// const links = document.querySelectorAll(".link");

// pwShowHide.forEach(eyeIcon => {
//     eyeIcon.addEventListener("click", () => {
//         let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

//         pwFields.forEach(password => {
//             if (password.type === "password") {
//                 password.type = "text";
//                 eyeIcon.classList.replace("bx-hide", "bx-show");
//                 return;
//             }

//             password.type = "password";
//             eyeIcon.classList.replace("bx-show", "bx-hide");
//         });
//     });
// });

// links.forEach(link => {
//     link.addEventListener("click", e => {
//         e.preventDefault(); // Preventing form submit
//         forms.classList.toggle("show-signup");
//     });
// });

document.querySelector('.form.login form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission
    
    // Perform login authentication
    const loginIdentifier = document.getElementById('loginEmail').value || document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showMessage('Logging in...', 'info');
        
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: loginIdentifier,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess("Login successful! Redirecting...");
            
            setTimeout(() => {
                if (data.user.userType === 'client') {
                    window.location.href = 'clientDashboard.html';
                } else if (data.user.userType === 'owner') {
                    window.location.href = 'ownerDashboard.html';
                }
            }, 1500);
        } else {
            // Handle validation errors
            if (data.error) {
                showError(data.error);
            } else {
                showError('Login failed. Please try again.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError("Network error. Please check if the backend server is running.");
    }
});

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.color = 'green';
        successElement.style.display = 'block';
        
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    } else {
        // If no success element, use error element with green color
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = 'green';
            errorElement.style.display = 'block';
        }
    }
}