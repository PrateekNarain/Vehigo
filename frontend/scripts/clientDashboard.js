// Client Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadClientData();
    loadRentalHistory();
    loadAvailableCars();
});

function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user') || 'null');
    const authToken = localStorage.getItem('vehigo_auth_token');
    
    if (!currentUser || !authToken || currentUser.userType !== 'client') {
        // Redirect to login if not authenticated or not a client
        window.location.href = 'login.html';
        return;
    }
}

function loadClientData() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    
    if (currentUser) {
        document.getElementById('clientName').textContent = currentUser.name || currentUser.username;
        
        // Update header profile picture
        const headerProfilePic = document.getElementById('headerProfilePic');
        if (currentUser.profilePicture && currentUser.profilePicture !== './assets/images/user.png') {
            headerProfilePic.src = currentUser.profilePicture;
        }
    }
}

function loadRentalHistory() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const rentals = JSON.parse(localStorage.getItem('vehigo_rentals') || '[]');
    
    // Filter rentals for current user
    const userRentals = rentals.filter(rental => rental.userId === currentUser.id);
    
    displayRentals(userRentals, 'past');
}

function loadAvailableCars() {
    // Sample car data - in a real app, this would come from an API
    const availableCars = [
        {
            id: 1,
            name: 'Tata Nexon',
            year: 2019,
            image: './assets/images/nexon.jpg',
            price: 210,
            fuel: 'Petrol',
            transmission: 'Manual',
            seats: 5,
            mileage: '17.4km / 1-litre'
        },
        {
            id: 2,
            name: 'Toyota Fortuner',
            year: 2020,
            image: './assets/images/fortuner.jpg',
            price: 490,
            fuel: 'Diesel',
            transmission: 'Automatic',
            seats: 7,
            mileage: '12.9km / 1-litre'
        },
        {
            id: 3,
            name: 'Toyota Innova Crysta',
            year: 2021,
            image: './assets/images/innova.jpeg',
            price: 355,
            fuel: 'Diesel',
            transmission: 'Automatic',
            seats: 7,
            mileage: '14.3km / 1-litre'
        },
        {
            id: 4,
            name: 'Maruti Swift Dzire',
            year: 2020,
            image: './assets/images/swift desire.jpg',
            price: 180,
            fuel: 'Petrol',
            transmission: 'Manual',
            seats: 5,
            mileage: '22.5km / 1-litre'
        }
    ];
    
    displayAvailableCars(availableCars);
}

function showRentals(type) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const rentals = JSON.parse(localStorage.getItem('vehigo_rentals') || '[]');
    
    // Filter rentals for current user
    const userRentals = rentals.filter(rental => rental.userId === currentUser.id);
    
    displayRentals(userRentals, type);
}

function displayRentals(rentals, type) {
    const rentalList = document.getElementById('rentalList');
    
    // Filter rentals based on type
    const filteredRentals = rentals.filter(rental => {
        if (type === 'past') {
            return rental.status === 'completed';
        } else if (type === 'current') {
            return rental.status === 'active';
        }
        return true;
    });
    
    if (filteredRentals.length === 0) {
        rentalList.innerHTML = `
            <li class="no-rentals">
                <div class="no-rentals-message">
                    <ion-icon name="car-outline"></ion-icon>
                    <h3>No ${type} rentals found</h3>
                    <p>Start exploring our available cars to make your first rental!</p>
                </div>
            </li>
        `;
        return;
    }
    
    rentalList.innerHTML = filteredRentals.map(rental => `
        <li>
            <div class="rental-card">
                <div class="rental-car-info">
                    <img src="${rental.carImage}" alt="${rental.carName}" class="rental-car-image">
                    <div class="rental-car-details">
                        <h3>${rental.carName}</h3>
                        <p>Rental Date: ${rental.startDate}</p>
                        <p>Duration: ${rental.duration} hours</p>
                        <p>Total Cost: ₹${rental.totalCost}</p>
                    </div>
                </div>
                <div class="rental-status ${rental.status}">${rental.status.toUpperCase()}</div>
                <div class="rental-actions">
                    ${rental.status === 'completed' ? 
                        `<button class="btn-small btn-feedback" onclick="giveFeedback(${rental.id})">
                            <ion-icon name="star-outline"></ion-icon> Feedback
                        </button>` : ''
                    }
                    <button class="btn-small btn-rent" onclick="rentAgain(${rental.carId})">
                        <ion-icon name="refresh-outline"></ion-icon> Rent Again
                    </button>
                </div>
            </div>
        </li>
    `).join('');
}

function displayAvailableCars(cars) {
    const carsList = document.getElementById('availableCarsList');
    
    carsList.innerHTML = cars.map(car => `
        <li>
            <div class="featured-car-card">
                <figure class="card-banner">
                    <img src="${car.image}" alt="${car.name}" loading="lazy" width="440" height="300" class="w-100">
                </figure>
                <div class="card-content">
                    <div class="card-title-wrapper">
                        <h3 class="h3 card-title">
                            <a href="#">${car.name}</a>
                        </h3>
                        <data class="year" value="${car.year}">${car.year}</data>
                    </div>
                    <ul class="card-list">
                        <li class="card-list-item">
                            <ion-icon name="people-outline"></ion-icon>
                            <span class="card-item-text">${car.seats} People</span>
                        </li>
                        <li class="card-list-item">
                            <ion-icon name="flash-outline"></ion-icon>
                            <span class="card-item-text">${car.fuel}</span>
                        </li>
                        <li class="card-list-item">
                            <ion-icon name="speedometer-outline"></ion-icon>
                            <span class="card-item-text">${car.mileage}</span>
                        </li>
                        <li class="card-list-item">
                            <ion-icon name="hardware-chip-outline"></ion-icon>
                            <span class="card-item-text">${car.transmission}</span>
                        </li>
                    </ul>
                    <div class="card-price-wrapper">
                        <p class="card-price">
                            <strong>₹${car.price}</strong> / hour
                        </p>
                        <button class="btn" onclick="rentCar(${car.id})">Rent Now</button>
                    </div>
                </div>
            </div>
        </li>
    `).join('');
}

function rentCar(carId) {
    // Redirect to car page with car ID
    window.location.href = `carPage.html?carId=${carId}`;
}

function rentAgain(carId) {
    rentCar(carId);
}

function giveFeedback(rentalId) {
    // Redirect to feedback form with rental ID
    window.location.href = `feedbackForm.html?rentalId=${rentalId}`;
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('show');
}

function updateProfile() {
    // Redirect to profile update page or show modal
    alert('Profile update feature coming soon!');
    toggleProfileMenu();
}

function logout() {
    // Clear user session
    localStorage.removeItem('vehigo_current_user');
    localStorage.removeItem('vehigo_auth_token');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (!profileDropdown.contains(event.target)) {
        profileMenu.classList.remove('show');
    }
});

// Initialize sample rental data if none exists
function initializeSampleData() {
    const existingRentals = localStorage.getItem('vehigo_rentals');
    if (!existingRentals) {
        const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
        if (currentUser) {
            const sampleRentals = [
                {
                    id: 1,
                    userId: currentUser.id,
                    carId: 1,
                    carName: 'Tata Nexon',
                    carImage: './assets/images/nexon.jpg',
                    startDate: '2023-10-01',
                    duration: 8,
                    totalCost: 1680,
                    status: 'completed'
                },
                {
                    id: 2,
                    userId: currentUser.id,
                    carId: 2,
                    carName: 'Toyota Fortuner',
                    carImage: './assets/images/fortuner.jpg',
                    startDate: '2023-10-15',
                    duration: 12,
                    totalCost: 5880,
                    status: 'completed'
                }
            ];
            localStorage.setItem('vehigo_rentals', JSON.stringify(sampleRentals));
        }
    }
}

// Initialize sample data on load
initializeSampleData();

