const { db } = require('../config/database');

// Fix districts by updating state_id to match actual state IDs
const fixDistricts = () => {
  try {
    console.log('🔧 Fixing districts state_id mapping...');
    
    // Update districts to use correct state IDs based on actual state names
    const updates = [
      // Maharashtra districts (state_id: 1)
      { districtName: 'Mumbai', newStateId: 1 },
      { districtName: 'Pune', newStateId: 1 },
      { districtName: 'Nagpur', newStateId: 1 },
      
      // Delhi districts (state_id: 2)
      { districtName: 'New Delhi', newStateId: 2 },
      
      // Karnataka districts (state_id: 3)
      { districtName: 'Bangalore', newStateId: 3 },
      { districtName: 'Mysore', newStateId: 3 },
      
      // Tamil Nadu districts (state_id: 4)
      { districtName: 'Chennai', newStateId: 4 },
      { districtName: 'Coimbatore', newStateId: 4 },
      
      // Gujarat districts (state_id: 5)
      { districtName: 'Ahmedabad', newStateId: 5 },
      { districtName: 'Surat', newStateId: 5 },
      
      // Rajasthan districts (state_id: 6)
      { districtName: 'Jaipur', newStateId: 6 },
      { districtName: 'Jodhpur', newStateId: 6 },
      
      // Uttar Pradesh districts (state_id: 7)
      { districtName: 'Lucknow', newStateId: 7 },
      { districtName: 'Kanpur', newStateId: 7 },
      
      // West Bengal districts (state_id: 8)
      { districtName: 'Kolkata', newStateId: 8 },
      { districtName: 'Howrah', newStateId: 8 },
      
      // Telangana districts (state_id: 9)
      { districtName: 'Hyderabad', newStateId: 9 },
      { districtName: 'Warangal', newStateId: 9 },
      
      // Andhra Pradesh districts (state_id: 10)
      { districtName: 'Vijayawada', newStateId: 10 },
      { districtName: 'Visakhapatnam', newStateId: 10 },
      
      // Kerala districts (state_id: 11)
      { districtName: 'Thiruvananthapuram', newStateId: 11 },
      { districtName: 'Kochi', newStateId: 11 },
      
      // Punjab districts (state_id: 12)
      { districtName: 'Chandigarh', newStateId: 12 },
      { districtName: 'Amritsar', newStateId: 12 },
      
      // Haryana districts (state_id: 13)
      { districtName: 'Gurgaon', newStateId: 13 },
      { districtName: 'Faridabad', newStateId: 13 },
      
      // Madhya Pradesh districts (state_id: 14)
      { districtName: 'Bhopal', newStateId: 14 },
      { districtName: 'Indore', newStateId: 14 },
      
      // Bihar districts (state_id: 15)
      { districtName: 'Patna', newStateId: 15 },
      { districtName: 'Gaya', newStateId: 15 },
      
      // Odisha districts (state_id: 16)
      { districtName: 'Bhubaneswar', newStateId: 16 },
      { districtName: 'Cuttack', newStateId: 16 },
      
      // Jharkhand districts (state_id: 17)
      { districtName: 'Ranchi', newStateId: 17 },
      { districtName: 'Jamshedpur', newStateId: 17 }
    ];
    
    let updatedCount = 0;
    for (const update of updates) {
      const result = db.prepare('UPDATE districts SET state_id = ? WHERE name = ?').run(update.newStateId, update.districtName);
      if (result.changes > 0) {
        console.log(`✅ Updated ${update.districtName} to state_id: ${update.newStateId}`);
        updatedCount++;
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} districts!`);
    
    // Verify the fix
    const maharashtraDistricts = db.prepare('SELECT * FROM districts WHERE state_id = 1').all();
    console.log(`📊 Maharashtra now has ${maharashtraDistricts.length} districts:`, maharashtraDistricts.map(d => d.name));
    
  } catch (error) {
    console.error('❌ Error fixing districts:', error);
  }
};

fixDistricts(); 