const axios = require('axios');

const baseUrl = 'http://localhost:3001/api/countries';

async function testGetCountries() {
  console.log('Testing GET /api/countries');

  try {
    const response = await axios.get(baseUrl);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (Array.isArray(response.data)) {
      console.log('Test passed: Received array of countries');
    } else {
      console.error('Test failed: Response data is not an array');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testCreateCountry() {
  console.log('\nTesting POST /api/countries');

  const newCountry = {
    country_name: 'Testland',
    country_code: 'TL',
    capital: 'Testville',
    status: 1,
    created_by_id: 1
  };

  try {
    const response = await axios.post(baseUrl, newCountry);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 201 && response.data.country && response.data.country.country_name === newCountry.country_name) {
      console.log('Test passed: Country created successfully');
      return response.data.country.country_id;
    } else {
      console.error('Test failed: Unexpected response data');
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testUpdateCountry(countryId) {
  console.log('\nTesting PUT /api/countries/:id');

  const updatedCountry = {
    country_name: 'Testlandia',
    country_code: 'TL',
    capital: 'Testopolis',
    status: 1,
    updated_by_id: 1
  };

  try {
    const response = await axios.put(`${baseUrl}/${countryId}`, updatedCountry);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 200 && response.data.message === 'Country updated successfully!') {
      console.log('Test passed: Country updated successfully');
    } else {
      console.error('Test failed: Unexpected response data');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testDeleteCountry(countryId) {
  console.log('\nTesting DELETE /api/countries/:id');

  try {
    const response = await axios.delete(`${baseUrl}/${countryId}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 200 && response.data.message === 'Country deleted successfully!') {
      console.log('Test passed: Country deleted successfully');
    } else {
      console.error('Test failed: Unexpected response data');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testEmptyDatabase() {
  console.log('\nTesting empty database scenario');
  // This test assumes you manually clear the countries table before running
  // or you can add code here to clear the table if you want automated test
  await testGetCountries();
}

async function testInvalidRequest() {
  console.log('\nTesting invalid request scenario');
  try {
    // Sending a POST request to GET endpoint to simulate invalid method
    await axios.post(baseUrl, {});
    console.error('Test failed: POST request should not succeed');
  } catch (error) {
    if (error.response && error.response.status === 405) {
      console.log('Test passed: POST method not allowed');
    } else {
      console.error('Test failed: Unexpected error or status code');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }
}

async function runTests() {
  await testGetCountries();
  const countryId = await testCreateCountry();
  if (countryId) {
    await testUpdateCountry(countryId);
    await testDeleteCountry(countryId);
  }
  await testEmptyDatabase();
  await testInvalidRequest();
}

runTests();
