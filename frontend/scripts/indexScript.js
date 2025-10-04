// Index page functionality for VehiGo
document.addEventListener('DOMContentLoaded', function() {
    updateAuthButton();
    setupRentButtons();
});

function updateAuthButton() {
    const currentUser = localStorage.getItem('vehigo_current_user');
    const authToken = localStorage.getItem('vehigo_auth_token');
    const authBtn = document.getElementById('authBtn');
    
    if (currentUser && authToken && authBtn) {
        // User is logged in, show dashboard link
        authBtn.href = 'accountpage.html';
        authBtn.setAttribute('aria-label', 'Dashboard');
        authBtn.title = 'Go to Dashboard';
        
        // Change icon to indicate logged in state
        const icon = authBtn.querySelector('ion-icon');
        if (icon) {
            icon.setAttribute('name', 'person');
        }
        
        // Add user name tooltip if possible
        try {
            const user = JSON.parse(currentUser);
            authBtn.title = `Dashboard - ${user.username || user.name}`;
        } catch (e) {
            console.log('Error parsing user data:', e);
        }
    } else {
        // User is not logged in, show login link
        authBtn.href = 'login.html';
        authBtn.setAttribute('aria-label', 'Login');
        authBtn.title = 'Login / Sign Up';
        
        const icon = authBtn.querySelector('ion-icon');
        if (icon) {
            icon.setAttribute('name', 'person-outline');
        }
    }
}

function setupRentButtons() {
    const rentButtons = document.querySelectorAll('.btn:contains("Rent now")');
    
    // Since querySelectorAll doesn't support :contains, we'll find them manually
    const allButtons = document.querySelectorAll('.btn');
    
    allButtons.forEach(button => {
        if (button.textContent.trim() === 'Rent now') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const currentUser = localStorage.getItem('vehigo_current_user');
                const authToken = localStorage.getItem('vehigo_auth_token');
                
                if (!currentUser || !authToken) {
                    // User is not logged in, redirect to login
                    if (confirm('You need to login to rent a car. Would you like to login now?')) {
                        window.location.href = 'login.html';
                    }
                } else {
                    // User is logged in, proceed with rental process
                    alert('Rental process would start here. This would typically open a booking modal or redirect to a booking page.');
                    // In a real app, this would open a booking modal or redirect to booking page
                }
            });
        }
    });
}

// Add a welcome message for logged in users
function showWelcomeMessage() {
    const currentUser = localStorage.getItem('vehigo_current_user');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            const heroTitle = document.querySelector('.hero-title');
            
            if (heroTitle) {
                const welcomeText = document.createElement('p');
                welcomeText.textContent = `Welcome back, ${user.username || user.name}!`;
                welcomeText.style.cssText = `
                    color: var(--orange-soda);
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                    font-weight: 600;
                `;
                heroTitle.parentNode.insertBefore(welcomeText, heroTitle);
            }
        } catch (e) {
            console.log('Error showing welcome message:', e);
        }
    }
}

// Show welcome message
showWelcomeMessage();

