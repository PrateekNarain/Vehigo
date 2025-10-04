// Demo data setup for VehiGo
document.addEventListener('DOMContentLoaded', function() {
    setupDemoData();
});

function setupDemoData() {
    // Check if demo data already exists
    const existingUsers = localStorage.getItem('vehigo_users');
    
    if (!existingUsers) {
        // Create demo users
        const demoUsers = [
            {
                id: 1,
                username: 'John Doe',
                name: 'John Doe',
                email: 'john@demo.com',
                password: 'demo123',
                phone: '+91 9876543210',
                address: 'Bhopal, Madhya Pradesh',
                joinDate: '15/01/2024',
                totalCars: 2,
                totalEarnings: 15420,
                profilePicture: './assets/images/guy1.jpg'
            },
            {
                id: 2,
                username: 'Jane Smith',
                name: 'Jane Smith',
                email: 'jane@demo.com',
                password: 'demo123',
                phone: '+91 9876543211',
                address: 'Indore, Madhya Pradesh',
                joinDate: '20/02/2024',
                totalCars: 1,
                totalEarnings: 8750,
                profilePicture: './assets/images/girl1.jpg'
            }
        ];
        
        localStorage.setItem('vehigo_users', JSON.stringify(demoUsers));
        
        console.log('Demo data created. You can login with:');
        console.log('Email: john@demo.com, Password: demo123');
        console.log('Email: jane@demo.com, Password: demo123');
    }
}

