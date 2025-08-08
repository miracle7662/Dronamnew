const { db } = require('../config/database');

// Sample countries data
const sampleCountries = [
  { name: 'India', code: 'IN', capital: 'New Delhi' },
  { name: 'United States', code: 'US', capital: 'Washington D.C.' },
  { name: 'United Kingdom', code: 'UK', capital: 'London' },
  { name: 'Canada', code: 'CA', capital: 'Ottawa' },
  { name: 'Australia', code: 'AU', capital: 'Canberra' },
  { name: 'Germany', code: 'DE', capital: 'Berlin' },
  { name: 'France', code: 'FR', capital: 'Paris' },
  { name: 'Japan', code: 'JP', capital: 'Tokyo' },
  { name: 'Brazil', code: 'BR', capital: 'Brasília' },
  { name: 'South Africa', code: 'ZA', capital: 'Pretoria' }
];

// Function to seed countries
const seedCountries = () => {
  try {
    console.log('🌱 Seeding countries...');
    
    // Check if countries already exist
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM countries').get();
    
    if (existingCount.count > 0) {
      console.log(`✅ Countries already exist (${existingCount.count} countries found)`);
      return;
    }
    
    // Insert sample countries
    const stmt = db.prepare('INSERT INTO countries (name, code, capital) VALUES (?, ?, ?)');
    
    for (const country of sampleCountries) {
      stmt.run(country.name, country.code, country.capital);
      console.log(`✅ Added: ${country.name} (${country.code})`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleCountries.length} countries!`);
  } catch (error) {
    console.error('❌ Error seeding countries:', error);
  }
};

// Run the seeding
seedCountries(); 