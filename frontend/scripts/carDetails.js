// Car Details JavaScript

let currentCarId = null;

// Load car details on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadCarDetails();
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

function loadCarDetails() {
    // Get car ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCarId = parseInt(urlParams.get('carId'));
    
    if (!currentCarId) {
        // Redirect back to dashboard if no car ID
        window.location.href = 'ownerDashboard.html';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const ownerCars = JSON.parse(localStorage.getItem('vehigo_owner_cars') || '[]');
    
    // Find the specific car
    const car = ownerCars.find(c => c.id === currentCarId && c.ownerId === currentUser.id);
    
    if (!car) {
        alert('Car not found or you do not have permission to view this car.');
        window.location.href = 'ownerDashboard.html';
        return;
    }
    
    displayCarDetails(car);
    loadRentalHistory(currentCarId);
    updateProfilePicture();
}

function displayCarDetails(car) {
    // Update car basic information
    document.getElementById('carImage').src = car.image;
    document.getElementById('carTitle').textContent = car.name;
    document.getElementById('carModel').textContent = car.year;
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    
    statusBadge.className = `status-badge ${car.status}`;
    statusText.textContent = car.status === 'rented' ? 'Currently Rented' : 
                           car.status === 'available' ? 'Available for Rent' : 
                           'Under Maintenance';
    
    // Update statistics
    document.getElementById('totalDistance').textContent = `${car.totalDistance || 0} km`;
    document.getElementById('totalHours').textContent = `${car.totalHours || 0} hrs`;
    document.getElementById('carEarnings').textContent = `₹${(car.totalEarnings || 0).toLocaleString()}`;
    document.getElementById('totalRentals').textContent = car.totalRentals || 0;
    
    // Update specifications
    document.getElementById('fuelType').textContent = car.fuel;
    document.getElementById('transmission').textContent = car.transmission;
    document.getElementById('seatingCapacity').textContent = `${car.seats} People`;
    document.getElementById('mileage').textContent = car.mileage;
    document.getElementById('hourlyRate').textContent = `₹${car.price}/hr`;
    document.getElementById('registration').textContent = car.registration || 'Not provided';
    
    // Show current rental info if car is rented
    if (car.status === 'rented') {
        showCurrentRentalInfo(car.id);
    }
    
    // Update action buttons based on car status
    updateActionButtons(car);
}

function showCurrentRentalInfo(carId) {
    const rentals = JSON.parse(localStorage.getItem('vehigo_rentals') || '[]');
    const currentRental = rentals.find(rental => rental.carId === carId && rental.status === 'active');
    
    if (currentRental) {
        document.getElementById('currentRentalInfo').style.display = 'block';
        document.getElementById('renterName').textContent = currentRental.renterName || 'N/A';
        document.getElementById('rentalStart').textContent = currentRental.startDate || 'N/A';
        document.getElementById('expectedReturn').textContent = calculateExpectedReturn(currentRental);
        document.getElementById('renterContact').textContent = currentRental.renterContact || 'N/A';
    }
}

function calculateExpectedReturn(rental) {
    if (rental.startDate && rental.duration) {
        const startDate = new Date(rental.startDate);
        const returnDate = new Date(startDate.getTime() + (rental.duration * 60 * 60 * 1000));
        return returnDate.toLocaleDateString() + ' ' + returnDate.toLocaleTimeString();
    }
    return 'N/A';
}

function updateActionButtons(car) {
    const statusBtn = document.getElementById('statusBtn');
    const statusBtnText = document.getElementById('statusBtnText');
    
    if (car.status === 'available') {
        statusBtnText.textContent = 'Disable Car';
        statusBtn.className = 'btn btn-danger';
    } else if (car.status === 'maintenance') {
        statusBtnText.textContent = 'Enable Car';
        statusBtn.className = 'btn btn-success';
    } else {
        statusBtnText.textContent = 'Car is Rented';
        statusBtn.disabled = true;
        statusBtn.className = 'btn btn-secondary';
    }
}

function loadRentalHistory(carId) {
    const rentals = JSON.parse(localStorage.getItem('vehigo_rentals') || '[]');
    const carRentals = rentals.filter(rental => rental.carId === carId);
    
    displayRentalHistory(carRentals);
}

function displayRentalHistory(rentals) {
    const historyList = document.getElementById('rentalHistoryList');
    
    if (rentals.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <ion-icon name="time-outline"></ion-icon>
                <h3>No rental history yet</h3>
                <p>This car hasn't been rented yet.</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = rentals.map(rental => `
        <div class="rental-history-item">
            <h3>Rental #${rental.id}</h3>
            <p><strong>Renter:</strong> ${rental.renterName || 'N/A'}</p>
            <p><strong>Date:</strong> ${rental.startDate}</p>
            <p class="rental-duration"><strong>Duration:</strong> ${rental.duration} hours</p>
            <p class="rental-earning"><strong>Earning:</strong> ₹${Math.round(rental.totalCost * 0.8)}</p>
            <p><strong>Status:</strong> <span class="status-${rental.status}">${rental.status.toUpperCase()}</span></p>
        </div>
    `).join('');
}

function trackCar() {
    // Redirect to track page with car ID
    window.location.href = `trackPage.html?carId=${currentCarId}`;
}

function editCar() {
    // In a real application, this would open an edit form
    alert('Edit car feature coming soon!');
}

function toggleCarStatus() {
    const ownerCars = JSON.parse(localStorage.getItem('vehigo_owner_cars') || '[]');
    const carIndex = ownerCars.findIndex(car => car.id === currentCarId);
    
    if (carIndex === -1) return;
    
    const car = ownerCars[carIndex];
    
    if (car.status === 'rented') {
        alert('Cannot change status while car is rented.');
        return;
    }
    
    // Toggle between available and maintenance
    if (car.status === 'available') {
        car.status = 'maintenance';
        alert('Car has been disabled and marked for maintenance.');
    } else if (car.status === 'maintenance') {
        car.status = 'available';
        alert('Car has been enabled and is now available for rent.');
    }
    
    // Update localStorage
    ownerCars[carIndex] = car;
    localStorage.setItem('vehigo_owner_cars', JSON.stringify(ownerCars));
    
    // Refresh the display
    displayCarDetails(car);
}

function goBack() {
    window.location.href = 'ownerDashboard.html';
}

function updateProfilePicture() {
    const currentUser = JSON.parse(localStorage.getItem('vehigo_current_user'));
    const headerProfilePic = document.getElementById('headerProfilePic');
    
    if (currentUser && currentUser.profilePicture && currentUser.profilePicture !== './assets/images/user.png') {
        headerProfilePic.src = currentUser.profilePicture;
    }
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('show');
}

function updateProfile() {
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

