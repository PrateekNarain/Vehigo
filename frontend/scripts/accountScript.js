// Account page functionality for VehiGo
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserProfile();
});

function checkAuthentication() {
    const currentUser = localStorage.getItem('vehigo_current_user');
    const authToken = localStorage.getItem('vehigo_auth_token');
    
    if (!currentUser || !authToken) {
        // User is not authenticated, redirect to login
        alert('Please login to access your dashboard');
        window.location.href = 'login.html';
        return;
    }
}

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    
    if (!currentUser) {
        return;
    }
    
    // Update profile information
    document.getElementById('userName').textContent = currentUser.username || currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userPhone').textContent = currentUser.phone;
    document.getElementById('userAddress').textContent = currentUser.address;
    document.getElementById('totalCars').textContent = `Total cars : ${currentUser.totalCars || 0}`;
    document.getElementById('totalEarnings').textContent = `Total earnings : ₹${currentUser.totalEarnings || 0}`;
    document.getElementById('memberSince').textContent = `Member Since : ${currentUser.joinDate}`;
    
    // Update profile picture if available
    if (currentUser.profilePicture) {
        document.getElementById('profilePicture').src = currentUser.profilePicture;
    }
    
    // Update alt text
    document.getElementById('profilePicture').alt = currentUser.username || currentUser.name;
}

function editProfile() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    
    // Create a simple edit form (in a real app, this would be a proper modal or separate page)
    const newName = prompt('Enter new name:', currentUser.username || currentUser.name);
    const newPhone = prompt('Enter new phone:', currentUser.phone);
    const newAddress = prompt('Enter new address:', currentUser.address);
    
    if (newName !== null && newPhone !== null && newAddress !== null) {
        // Update user data
        currentUser.username = newName;
        currentUser.name = newName;
        currentUser.phone = newPhone;
        currentUser.address = newAddress;
        
        // Update in localStorage
        localStorage.setItem('vehigo_current_user', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('vehigo_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('vehigo_users', JSON.stringify(users));
        }
        
        // Reload profile display
        loadUserProfile();
        
        alert('Profile updated successfully!');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear user session
        localStorage.removeItem('vehigo_current_user');
        localStorage.removeItem('vehigo_auth_token');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Update navigation based on authentication status
function updateNavigation() {
    const currentUser = localStorage.getItem('vehigo_current_user');
    const userProfileBtn = document.getElementById('userProfileBtn');
    
    if (currentUser && userProfileBtn) {
        userProfileBtn.innerHTML = '<ion-icon name="person"></ion-icon>';
        userProfileBtn.title = 'Dashboard';
    }
}

// Call navigation update
updateNavigation();

