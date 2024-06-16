// api.js
import API_BASE_URL from './config.js';

export const apiRequest = async (endpoint, method = 'GET', body = null, includeCredentials = true) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: includeCredentials ? 'include' : 'same-origin',
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error with API request:', error);
        throw error;
    }
};
