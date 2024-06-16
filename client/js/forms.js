// forms.js
import { apiRequest } from './api.js';

$(document).ready(function() {
    // User registration form submission
    $('#userRegisterForm').on('submit', async function(e) {
        e.preventDefault();
        const data = $(this).serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});

        try {
            const response = await apiRequest('/auth/register', 'POST', data);
            alert('User registered successfully!');
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to register user.');
        }
    });

    // Doctor registration form submission
    $('#doctorRegisterForm').on('submit', async function(e) {
        e.preventDefault();
        const data = $(this).serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});

        try {
            const response = await apiRequest('/doctors', 'POST', data);
            alert('Doctor registered successfully!');
        } catch (error) {
            console.error('Error registering doctor:', error);
            alert('Failed to register doctor.');
        }
    });

    // Login form submission
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        const data = $(this).serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});

        try {
            const response = await apiRequest('/auth', 'POST', data);
            alert('Login successful!');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Failed to login.');
        }
    });

    // Appointment booking form submission
    $('#appointmentBookingForm').on('submit', async function(e) {
        e.preventDefault();
        const data = $(this).serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});

        try {
            const response = await apiRequest('/appointments', 'POST', data);
            alert('Appointment booked successfully!');
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment.');
        }
    });
});
