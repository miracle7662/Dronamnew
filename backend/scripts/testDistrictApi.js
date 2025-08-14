const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api/districts';

// Test data
const testDistrict = {
  district_name: 'Test District',
  district_code: 'TD001',
  state_id: 1,
  description: 'Test district for API testing',
  created_by_id: 1
};

// Test functions
const testGetAllDistricts = async () => {
  try {
    console.log('🧪 Testing GET /api/districts...');
    const response = await axios.get(API_BASE_URL);
    console.log('✅ Get all districts successful:', response.data.length, 'districts found');
    return response.data;
  } catch (error) {
    console.error('❌ Error getting districts:', error.response?.data || error.message);
    throw error;
  }
};

const testCreateDistrict = async () => {
  try {
    console.log('🧪 Testing POST /api/districts...');
    const response = await axios.post(API_BASE_URL, testDistrict);
    console.log('✅ District created successfully:', response.data);
    return response.data.district;
  } catch (error) {
    console.error('❌ Error creating district:', error.response?.data || error.message);
    throw error;
  }
};

const testGetDistrictById = async (id) => {
  try {
    console.log(`🧪 Testing GET /api/districts/${id}...`);
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    console.log('✅ Get district by ID successful:', response.data.district_name);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting district by ID:', error.response?.data || error.message);
    throw error;
  }
};

const testUpdateDistrict = async (id) => {
  try {
    console.log(`🧪 Testing PUT /api/districts/${id}...`);
    const updateData = {
      ...testDistrict,
      district_name: 'Updated Test District',
      updated_by_id: 1
    };
    const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
    console.log('✅ District updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating district:', error.response?.data || error.message);
    throw error;
  }
};

const testDeleteDistrict = async (id) => {
  try {
    console.log(`🧪 Testing DELETE /api/districts/${id}...`);
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    console.log('✅ District deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting district:', error.response?.data || error.message);
    throw error;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting District API Tests...\n');
  
  try {
    // Test 1: Get all districts
    await testGetAllDistricts();
    
    // Test 2: Create a new district
    const createdDistrict = await testCreateDistrict();
    const districtId = createdDistrict.district_id;
    
    // Test 3: Get district by ID
    await testGetDistrictById(districtId);
    
    // Test 4: Update district
    await testUpdateDistrict(districtId);
    
    // Test 5: Delete district
    await testDeleteDistrict(districtId);
    
    console.log('\n✅ All district API tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ District API tests failed:', error.message);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testGetAllDistricts,
  testCreateDistrict,
  testGetDistrictById,
  testUpdateDistrict,
  testDeleteDistrict,
  runAllTests
};
