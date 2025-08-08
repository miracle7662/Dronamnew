const { db } = require('../config/database');

// Sample states data for India (country_id: 12)
const sampleStates = [
  { name: 'Maharashtra', code: 'MH', capital: 'Mumbai', country_id: 12 },
  { name: 'Delhi', code: 'DL', capital: 'New Delhi', country_id: 12 },
  { name: 'Karnataka', code: 'KA', capital: 'Bangalore', country_id: 12 },
  { name: 'Tamil Nadu', code: 'TN', capital: 'Chennai', country_id: 12 },
  { name: 'Gujarat', code: 'GJ', capital: 'Gandhinagar', country_id: 12 },
  { name: 'Rajasthan', code: 'RJ', capital: 'Jaipur', country_id: 12 },
  { name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow', country_id: 12 },
  { name: 'West Bengal', code: 'WB', capital: 'Kolkata', country_id: 12 },
  { name: 'Telangana', code: 'TS', capital: 'Hyderabad', country_id: 12 },
  { name: 'Andhra Pradesh', code: 'AP', capital: 'Amaravati', country_id: 12 },
  { name: 'Kerala', code: 'KL', capital: 'Thiruvananthapuram', country_id: 12 },
  { name: 'Punjab', code: 'PB', capital: 'Chandigarh', country_id: 12 },
  { name: 'Haryana', code: 'HR', capital: 'Chandigarh', country_id: 12 },
  { name: 'Madhya Pradesh', code: 'MP', capital: 'Bhopal', country_id: 12 },
  { name: 'Bihar', code: 'BR', capital: 'Patna', country_id: 12 },
  { name: 'Odisha', code: 'OD', capital: 'Bhubaneswar', country_id: 12 },
  { name: 'Jharkhand', code: 'JH', capital: 'Ranchi', country_id: 12 }
];

// Function to seed states
const seedStates = () => {
  try {
    console.log('🌱 Seeding states...');
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM states').get();
    if (existingCount.count > 0) {
      console.log(`✅ States already exist (${existingCount.count} states found)`);
      return;
    }
    const stmt = db.prepare('INSERT INTO states (name, code, capital, country_id) VALUES (?, ?, ?, ?)');
    for (const state of sampleStates) {
      stmt.run(state.name, state.code, state.capital, state.country_id);
      console.log(`✅ Added: ${state.name} (${state.code})`);
    }
    console.log(`🎉 Successfully seeded ${sampleStates.length} states!`);
  } catch (error) {
    console.error('❌ Error seeding states:', error);
  }
};

seedStates(); 