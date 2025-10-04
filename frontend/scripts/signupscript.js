document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const userType = document.getElementById('user_type').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const password1 = document.getElementById('password').value;
    const password2 = document.getElementById('confirm-password').value;
    const picture = document.getElementById('picture').files[0];
    const drivingLicense = document.getElementById('driving_license').files[0];
    const aadhar = document.getElementById('aadhar').files[0];
    
    // Validate form
    if (!userType || !username || !email || !phone || !address || !password1 || !password2) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password1 !== password2) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password1.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('password1', password1);
    formData.append('password2', password2);
    formData.append('user_type', userType);  // Add user_type to FormData
    
    if (picture) formData.append('picture', picture);
    if (drivingLicense) formData.append('driving_license', drivingLicense);
    if (aadhar) formData.append('aadhar', aadhar);
    
    try {
        showMessage('Creating account...', 'info');
        
        const response = await fetch('http://127.0.0.1:8000/api/signup/', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('User created successfully! Please login to continue.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            // Handle validation errors
            if (data.errors) {
                let errorMessage = 'Registration failed: ';
                for (const [field, errors] of Object.entries(data.errors)) {
                    errorMessage += `${field}: ${errors.join(', ')}\n`;
                }
                showMessage(errorMessage, 'error');
            } else {
                showMessage(data.error || 'Registration failed. Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please check if the backend server is running.', 'error');
    }
});

function showMessage(message, type) {
    // Create or update message element
    let messageElement = document.getElementById('signup-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'signup-message';
        messageElement.style.cssText = `
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        `;
        
        // Insert after the form
        const form = document.getElementById('signupForm');
        form.parentNode.insertBefore(messageElement, form.nextSibling);
    }
    
    messageElement.textContent = message;
    
    if (type === 'error') {
        messageElement.style.backgroundColor = '#ffebee';
        messageElement.style.color = '#c62828';
        messageElement.style.border = '1px solid #ef5350';
    } else if (type === 'success') {
        messageElement.style.backgroundColor = '#e8f5e8';
        messageElement.style.color = '#2e7d32';
        messageElement.style.border = '1px solid #4caf50';
    } else if (type === 'info') {
        messageElement.style.backgroundColor = '#e3f2fd';
        messageElement.style.color = '#1565c0';
        messageElement.style.border = '1px solid #2196f3';
    }
    
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}