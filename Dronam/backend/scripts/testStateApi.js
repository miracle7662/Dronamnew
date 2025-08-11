const axios = require('axios');

const baseUrl = 'http://localhost:3001/api/states';

async function testGetStates() {
  console.log('Testing GET /api/states');

  try {
    const response = await axios.get(baseUrl);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (Array.isArray(response.data)) {
      console.log('Test passed: Received array of states');
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

async function testCreateState() {
  console.log('\nTesting POST /api/states');

  const newState = {
    state_name: 'TestState',
    state_code: 'TS',
    capital: 'TestCity',
    country_id: 1,
    status: 1,
    created_by_id: 1
  };

  try {
    const response = await axios.post(baseUrl, newState);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 201 && response.data.state && response.data.state.state_name === newState.state_name) {
      console.log('Test passed: State created successfully');
      return response.data.state.state_id;
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

async function testUpdateState(stateId) {
  console.log('\nTesting PUT /api/states/:id');

  const updatedState = {
    state_name: 'TestStateUpdated',
    state_code: 'TSU',
    capital: 'TestCityUpdated',
    country_id: 1,
    status: 1,
    updated_by_id: 1
  };

  try {
    const response = await axios.put(`${baseUrl}/${stateId}`, updatedState);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 200 && response.data.message === 'State updated successfully!') {
      console.log('Test passed: State updated successfully');
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

async function testDeleteState(stateId) {
  console.log('\nTesting DELETE /api/states/:id');

  try {
    const response = await axios.delete(`${baseUrl}/${stateId}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    if (response.status === 200 && response.data.message === 'State deleted successfully!') {
      console.log('Test passed: State deleted successfully');
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
  // This test assumes you manually clear the states table before running
  // or you can add code here to clear the table if you want automated test
  await testGetStates();
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
  await testGetStates();
  const stateId = await testCreateState();
  if (stateId) {
    await testUpdateState(stateId);
    await testDeleteState(stateId);
  }
  await testEmptyDatabase();
  await testInvalidRequest();
}

runTests();
