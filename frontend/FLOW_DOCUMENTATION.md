# VehiGo - User Flow Documentation

## Overview
VehiGo is a car rental platform with a complete user authentication and dashboard system. This document outlines the user flow and how all pages are connected.

## User Flow

### 1. Landing Page (index.html)
- **Entry Point**: Main landing page showcasing available cars
- **Features**:
  - Hero section with search functionality
  - Featured cars display
  - User reviews and testimonials
  - Company blog section
- **Navigation**:
  - If user is NOT logged in: "Profile" button → `login.html`
  - If user IS logged in: "Profile" button → `accountpage.html` (Dashboard)
  - "Rent now" buttons require authentication

### 2. Authentication Pages

#### Login Page (login.html)
- **Purpose**: User authentication (login/signup)
- **Features**:
  - Toggle between Login and Signup forms
  - Password visibility toggle
  - Form validation
  - Demo credentials provided
- **Flow**:
  - Successful login → `accountpage.html` (Dashboard)
  - New user → Click "Signup" link → Registration form on same page
  - "Don't have account" → `registrationPage.html`

#### Registration Page (registrationPage.html)
- **Purpose**: Detailed user registration with file uploads
- **Features**:
  - Complete user information form
  - File upload for documents (Picture, Driving License, Aadhar)
  - Form validation
- **Flow**:
  - Successful registration → `login.html`
  - "Already have account" → `login.html`

### 3. User Dashboard (accountpage.html)
- **Purpose**: User profile and account management
- **Features**:
  - Dynamic user profile display
  - User statistics (total cars, earnings, member since)
  - Edit profile functionality
  - User's car listings
  - Logout functionality
- **Authentication**: Protected route - redirects to login if not authenticated
- **Navigation**: All header links point back to main site sections

## Authentication System

### Demo Credentials
For testing purposes, the system includes demo users:
- **Email**: john@demo.com, **Password**: demo123
- **Email**: jane@demo.com, **Password**: demo123

### Data Storage
- Uses localStorage for demo purposes
- In production, this would connect to a backend API
- User data structure includes: id, username, email, phone, address, joinDate, totalCars, totalEarnings

### Session Management
- Authentication token stored in localStorage
- Current user data cached for quick access
- Automatic logout on token expiry
- Protected routes check authentication status

## File Structure

### HTML Pages
- `index.html` - Landing page
- `login.html` - Authentication page
- `registrationPage.html` - Detailed registration
- `accountpage.html` - User dashboard

### JavaScript Files
- `scripts/indexScript.js` - Landing page functionality
- `scripts/loginscript.js` - Authentication logic
- `scripts/signupscript.js` - Registration form handling
- `scripts/accountScript.js` - Dashboard functionality
- `scripts/demoData.js` - Demo user setup

### CSS Files
- `assets/css/style.css` - Main styling
- `assets/css/loginstyle.css` - Login page styling
- `styles/registrationStyle.css` - Registration page styling
- `assets/css/profilepage.css` - Dashboard styling

## Key Features

### 1. Responsive Navigation
- Dynamic navigation based on authentication status
- Consistent header across all pages
- Proper linking between sections

### 2. Form Validation
- Client-side validation for all forms
- Error and success message display
- Password confirmation matching

### 3. User Experience
- Welcome messages for logged-in users
- Smooth transitions between pages
- Intuitive navigation flow
- Protected content access

### 4. Security Features
- Authentication checks on protected routes
- Session management
- Form validation and sanitization

## Testing the Flow

1. **Start at Landing Page** (`index.html`)
2. **Click Profile Button** → Goes to login page
3. **Use Demo Credentials** or create new account
4. **Successful Login** → Redirects to dashboard
5. **Dashboard Shows** user details dynamically
6. **Navigation Links** work properly
7. **Logout** returns to landing page

## Future Enhancements

1. **Backend Integration**: Replace localStorage with proper API calls
2. **Email Verification**: Add email confirmation for new users
3. **Password Reset**: Implement forgot password functionality
4. **Profile Pictures**: Add image upload and display
5. **Car Management**: Full CRUD operations for user cars
6. **Booking System**: Complete car rental booking flow
7. **Payment Integration**: Add payment processing
8. **Admin Panel**: Administrative interface for managing users and cars

## Technical Notes

- All authentication is currently demo-based using localStorage
- Form submissions are handled with JavaScript preventDefault
- Icons use Ionicons library
- Responsive design works across devices
- Cross-browser compatible JavaScript

This flow provides a complete user journey from discovery to account management, with proper authentication and navigation throughout the application.

