// Owner Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadOwnerData();
    loadOwnerCars();
    initializeSampleData();
});

function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user') || 'null');
    const authToken = localStorage.getItem('vehigo_auth_token');
    
    if (!currentUser || !authToken || currentUser.userType !== 'owner') {
        // Redirect to login if not authenticated or not an owner
        window.location.href = 'login.html';
        return;
    }
}

function loadOwnerData() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    
    if (currentUser) {
        document.getElementById('ownerName').textContent = currentUser.name || currentUser.username;
        document.getElementById('ownerEmail').textContent = currentUser.email;
        document.getElementById('ownerPhone').textContent = currentUser.phone || '+91 9876543210';
        document.getElementById('memberSince').textContent = `Member Since: ${currentUser.joinDate}`;
        
        // Update profile pictures
        const headerProfilePic = document.getElementById('headerProfilePic');
        const ownerProfilePic = document.getElementById('ownerProfilePic');
        
        if (currentUser.profilePicture && currentUser.profilePicture !== './assets/images/user.png') {
            headerProfilePic.src = currentUser.profilePicture;
            ownerProfilePic.src = currentUser.profilePicture;
        }
        
        // Load earnings and car statistics
        loadOwnerStatistics();
    }
}

function loadOwnerStatistics() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const ownerCars = JSON.parse(localStorage.getItem('vehigo_owner_cars') || '[]');
    const rentals = JSON.parse(localStorage.getItem('vehigo_rentals') || '[]');
    
    // Filter cars for current owner
    const userCars = ownerCars.filter(car => car.ownerId === currentUser.id);
    
    // Calculate statistics
    const totalCars = userCars.length;
    const activeCars = userCars.filter(car => car.status === 'available' || car.status === 'rented').length;
    
    // Calculate total earnings from rentals
    const ownerRentals = rentals.filter(rental => {
        return userCars.some(car => car.id === rental.carId);
    });
    
    const totalEarnings = ownerRentals.reduce((sum, rental) => {
        if (rental.status === 'completed') {
            return sum + (rental.totalCost * 0.8); // 80% goes to owner, 20% platform fee
        }
        return sum;
    }, 0);
    
    // Update UI
    document.getElementById('totalEarnings').textContent = `₹${totalEarnings.toLocaleString()}`;
    document.getElementById('activeCars').textContent = activeCars;
    document.getElementById('totalCars').textContent = totalCars;
}

function loadOwnerCars() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const ownerCars = JSON.parse(localStorage.getItem('vehigo_owner_cars') || '[]');
    
    // Filter cars for current owner
    const userCars = ownerCars.filter(car => car.ownerId === currentUser.id);
    
    displayOwnerCars(userCars);
}

function displayOwnerCars(cars) {
    const carsList = document.getElementById('ownerCarsList');
    
    if (cars.length === 0) {
        carsList.innerHTML = `
            <li class="no-cars">
                <div class="no-cars-message">
                    <ion-icon name="car-outline"></ion-icon>
                    <h3>No cars registered yet</h3>
                    <p>Add your first car to start earning!</p>
                    <button class="btn" onclick="addNewCar()">Add Your First Car</button>
                </div>
            </li>
        `;
        return;
    }
    
    carsList.innerHTML = cars.map(car => `
        <li>
            <div class="featured-car-card">
                <figure class="card-banner">
                    <img src="${car.image}" alt="${car.name}" loading="lazy" width="440" height="300" class="w-100">
                    <div class="car-status-badge ${car.status}">
                        ${car.status === 'rented' ? 'RENTED' : car.status === 'available' ? 'AVAILABLE' : 'MAINTENANCE'}
                    </div>
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
                        <div class="car-earnings">
                            <small>Total Earned: ₹${car.totalEarnings || 0}</small>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-small btn-track" onclick="trackCar(${car.id})">
                            <ion-icon name="location-outline"></ion-icon> Track
                        </button>
                        <button class="btn-small btn-details" onclick="viewCarDetails(${car.id})">
                            <ion-icon name="information-circle-outline"></ion-icon> Details
                        </button>
                    </div>
                </div>
            </div>
        </li>
    `).join('');
}

function addNewCar() {
    // Redirect to host page for adding new car
    window.location.href = 'hostPage.html';
}

function trackCar(carId) {
    // Redirect to track page with car ID
    window.location.href = `trackPage.html?carId=${carId}`;
}

function viewCarDetails(carId) {
    // Redirect to car details page with car ID
    window.location.href = `carDetails.html?carId=${carId}`;
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
    
    if (profileDropdown && !profileDropdown.contains(event.target)) {
        profileMenu.classList.remove('show');
    }
});

// Initialize sample data for owner cars
function initializeSampleData() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const existingCars = localStorage.getItem('vehigo_owner_cars');
    
    if (!existingCars && currentUser) {
        const sampleCars = [
            {
                id: 1,
                ownerId: currentUser.id,
                name: 'Tata Nexon',
                year: 2019,
                image: './assets/images/nexon.jpg',
                price: 210,
                fuel: 'Petrol',
                transmission: 'Manual',
                seats: 5,
                mileage: '17.4km / 1-litre',
                status: 'available',
                totalEarnings: 15680,
                totalDistance: 2450,
                totalHours: 156,
                totalRentals: 23,
                registration: 'MP 09 AB 1234'
            },
            {
                id: 2,
                ownerId: currentUser.id,
                name: 'Toyota Fortuner',
                year: 2020,
                image: './assets/images/fortuner.jpg',
                price: 490,
                fuel: 'Diesel',
                transmission: 'Automatic',
                seats: 7,
                mileage: '12.9km / 1-litre',
                status: 'rented',
                totalEarnings: 28340,
                totalDistance: 3200,
                totalHours: 89,
                totalRentals: 15,
                registration: 'MP 09 CD 5678'
            },
            {
                id: 3,
                ownerId: currentUser.id,
                name: 'Toyota Innova Crysta',
                year: 2021,
                image: './assets/images/innova.jpeg',
                price: 355,
                fuel: 'Diesel',
                transmission: 'Automatic',
                seats: 7,
                mileage: '14.3km / 1-litre',
                status: 'available',
                totalEarnings: 21250,
                totalDistance: 1890,
                totalHours: 112,
                totalRentals: 18,
                registration: 'MP 09 EF 9012'
            }
        ];
        localStorage.setItem('vehigo_owner_cars', JSON.stringify(sampleCars));
    }
    
    // Initialize sample rentals for owner's cars
    const existingRentals = localStorage.getItem('vehigo_rentals');
    if (!existingRentals && currentUser) {
        const sampleRentals = [
            {
                id: 1,
                userId: 999, // Different user ID
                carId: 1,
                carName: 'Tata Nexon',
                carImage: './assets/images/nexon.jpg',
                startDate: '2023-10-01',
                duration: 8,
                totalCost: 1680,
                status: 'completed',
                renterName: 'John Doe',
                renterContact: '+91 9876543210'
            },
            {
                id: 2,
                userId: 998, // Different user ID
                carId: 2,
                carName: 'Toyota Fortuner',
                carImage: './assets/images/fortuner.jpg',
                startDate: '2023-10-15',
                duration: 12,
                totalCost: 5880,
                status: 'active',
                renterName: 'Jane Smith',
                renterContact: '+91 9876543211'
            }
        ];
        localStorage.setItem('vehigo_rentals', JSON.stringify(sampleRentals));
    }
}

