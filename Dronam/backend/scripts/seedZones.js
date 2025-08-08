const { db } = require('../config/database');

// Sample zones data (using only available district IDs 1-10)
const sampleZones = [
  { name: 'South Mumbai', code: 'SM', district_id: 1, description: 'Premium residential and business area' },
  { name: 'North Mumbai', code: 'NM', district_id: 1, description: 'Suburban residential area' },
  { name: 'Pune City', code: 'PC', district_id: 2, description: 'Educational and IT hub' },
  { name: 'Pune Rural', code: 'PR', district_id: 2, description: 'Agricultural and industrial area' },
  { name: 'Nagpur Central', code: 'NC', district_id: 3, description: 'Administrative and business center' },
  { name: 'Nagpur Industrial', code: 'NI', district_id: 3, description: 'Industrial and manufacturing area' },
  { name: 'Central Delhi', code: 'CD', district_id: 4, description: 'Government and administrative center' },
  { name: 'New Delhi', code: 'ND', district_id: 4, description: 'Diplomatic and business district' },
  { name: 'Bangalore Central', code: 'BC', district_id: 5, description: 'IT corridor and business district' },
  { name: 'Bangalore North', code: 'BN', district_id: 5, description: 'Residential and educational area' },
  { name: 'Mysore Palace', code: 'MP', district_id: 6, description: 'Historic and tourist area' },
  { name: 'Mysore Industrial', code: 'MI', district_id: 6, description: 'Industrial and manufacturing area' },
  { name: 'Chennai Central', code: 'CC', district_id: 7, description: 'Business and cultural hub' },
  { name: 'Chennai South', code: 'CS', district_id: 7, description: 'Residential and beach area' },
  { name: 'Coimbatore Textile', code: 'CT', district_id: 8, description: 'Textile and manufacturing hub' },
  { name: 'Coimbatore IT', code: 'CI', district_id: 8, description: 'IT and educational area' },
  { name: 'Ahmedabad Old City', code: 'AO', district_id: 9, description: 'Historic and cultural area' },
  { name: 'Ahmedabad New City', code: 'AN', district_id: 9, description: 'Modern business and residential area' },
  { name: 'Surat Diamond', code: 'SD', district_id: 10, description: 'Diamond and jewelry trade center' },
  { name: 'Surat Textile', code: 'ST', district_id: 10, description: 'Textile manufacturing and trade area' }
];

// Function to seed zones
const seedZones = () => {
  try {
    console.log('🌱 Seeding zones...');
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM zones').get();
    if (existingCount.count > 0) {
      console.log(`✅ Zones already exist (${existingCount.count} zones found)`);
      return;
    }
    const stmt = db.prepare('INSERT INTO zones (name, code, district_id, description) VALUES (?, ?, ?, ?)');
    for (const zone of sampleZones) {
      stmt.run(zone.name, zone.code, zone.district_id, zone.description);
      console.log(`✅ Added: ${zone.name} (${zone.code})`);
    }
    console.log(`🎉 Successfully seeded ${sampleZones.length} zones!`);
  } catch (error) {
    console.error('❌ Error seeding zones:', error);
  }
};

seedZones(); 