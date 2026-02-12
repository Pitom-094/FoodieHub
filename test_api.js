
const axios = require('axios');

const testImageGen = async () => {
    try {
        console.log('Testing image generation...');
        // We need a token. Let's assume there's an admin user.
        // For a quick test, we'll just check if the route is registered and accessible (even if it returns 401).
        const res = await axios.post('http://localhost:5000/api/food/generate-image', {
            foodName: 'Test Pizza',
            category: 'Main'
        }).catch(err => err.response);

        console.log('Status:', res.status);
        console.log('Data:', res.data);
    } catch (err) {
        console.error('Test failed:', err.message);
    }
};

testImageGen();
