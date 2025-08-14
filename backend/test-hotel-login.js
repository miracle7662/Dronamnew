// Test script to verify hotel login functionality
const axios = require('axios');

const testHotelLogin = async () => {
  try {
    console.log('🧪 Testing Hotel Login Functionality...\n');
    
    // Test hotel login endpoint
    const loginData = {
      email: 'sudarshan@gmail.com',
      password: 'admin123'
    };
    
    console.log('📡 Making POST request to: http://localhost:3001/api/hotels/login');
    console.log('📋 Request body:', loginData);
    
    const response = await axios.post('http://localhost:3001/api/hotels/login', loginData);
    
    console.log('✅ Login successful!');
    console.log('🔑 Token received:', response.data.token);
    console.log('👤 User data:', response.data.user);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
};

// Run the test
testHotelLogin();
