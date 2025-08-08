const { db } = require('../config/database');

// Sample districts data for Indian states (using actual state IDs)
const sampleDistricts = [
  { name: 'Mumbai', code: 'MB', state_id: 13, description: 'Financial capital of India' },
  { name: 'Pune', code: 'PN', state_id: 13, description: 'Oxford of the East' },
  { name: 'Nagpur', code: 'NG', state_id: 13, description: 'Orange City' },
  { name: 'New Delhi', code: 'ND', state_id: 14, description: 'Capital of India' },
  { name: 'Bangalore', code: 'BG', state_id: 15, description: 'Silicon Valley of India' },
  { name: 'Mysore', code: 'MY', state_id: 15, description: 'City of Palaces' },
  { name: 'Chennai', code: 'CN', state_id: 16, description: 'Gateway to South India' },
  { name: 'Coimbatore', code: 'CB', state_id: 16, description: 'Manchester of South India' },
  { name: 'Ahmedabad', code: 'AH', state_id: 17, description: 'Manchester of India' },
  { name: 'Surat', code: 'SR', state_id: 17, description: 'Diamond City' },
  { name: 'Jaipur', code: 'JP', state_id: 18, description: 'Pink City' },
  { name: 'Jodhpur', code: 'JD', state_id: 18, description: 'Blue City' },
  { name: 'Lucknow', code: 'LK', state_id: 19, description: 'City of Nawabs' },
  { name: 'Kanpur', code: 'KP', state_id: 19, description: 'Leather City' },
  { name: 'Kolkata', code: 'KL', state_id: 20, description: 'City of Joy' },
  { name: 'Howrah', code: 'HW', state_id: 20, description: 'Gateway of Bengal' },
  { name: 'Hyderabad', code: 'HD', state_id: 21, description: 'City of Pearls' },
  { name: 'Warangal', code: 'WG', state_id: 21, description: 'City of Lakes' },
  { name: 'Vijayawada', code: 'VJ', state_id: 22, description: 'Place of Victory' },
  { name: 'Visakhapatnam', code: 'VZ', state_id: 22, description: 'Jewel of the East Coast' },
  { name: 'Thiruvananthapuram', code: 'TV', state_id: 23, description: 'Evergreen City' },
  { name: 'Kochi', code: 'KC', state_id: 23, description: 'Queen of Arabian Sea' },
  { name: 'Chandigarh', code: 'CH', state_id: 24, description: 'City Beautiful' },
  { name: 'Amritsar', code: 'AM', state_id: 24, description: 'Golden City' },
  { name: 'Gurgaon', code: 'GG', state_id: 25, description: 'Millennium City' },
  { name: 'Faridabad', code: 'FD', state_id: 25, description: 'Industrial Hub' },
  { name: 'Bhopal', code: 'BH', state_id: 26, description: 'City of Lakes' },
  { name: 'Indore', code: 'IN', state_id: 26, description: 'Cleanest City' },
  { name: 'Patna', code: 'PT', state_id: 27, description: 'Ancient City' },
  { name: 'Gaya', code: 'GY', state_id: 27, description: 'Holy City' },
  { name: 'Bhubaneswar', code: 'BB', state_id: 28, description: 'Temple City' },
  { name: 'Cuttack', code: 'CT', state_id: 28, description: 'Silver City' },
  { name: 'Ranchi', code: 'RC', state_id: 29, description: 'City of Waterfalls' },
  { name: 'Jamshedpur', code: 'JS', state_id: 29, description: 'Steel City' }
];

// Function to seed districts
const seedDistricts = () => {
  try {
    console.log('🌱 Seeding districts...');
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM districts').get();
    if (existingCount.count > 0) {
      console.log(`✅ Districts already exist (${existingCount.count} districts found)`);
      return;
    }
    const stmt = db.prepare('INSERT INTO districts (name, code, state_id, description) VALUES (?, ?, ?, ?)');
    for (const district of sampleDistricts) {
      stmt.run(district.name, district.code, district.state_id, district.description);
      console.log(`✅ Added: ${district.name} (${district.code})`);
    }
    console.log(`🎉 Successfully seeded ${sampleDistricts.length} districts!`);
  } catch (error) {
    console.error('❌ Error seeding districts:', error);
  }
};

seedDistricts(); 