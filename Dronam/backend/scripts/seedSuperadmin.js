const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

// Function to seed superadmin
const seedSuperadmin = async () => {
  try {
    console.log('🌱 Seeding superadmin...');
    
    // Check if superadmin already exists
    const existingSuperadmin = db.prepare('SELECT COUNT(*) as count FROM superadmins WHERE email = ?').get('email@admin.com');
    
    if (existingSuperadmin.count > 0) {
      console.log('✅ Superadmin already exists');
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('1', saltRounds);

    // Insert superadmin
    const stmt = db.prepare('INSERT INTO superadmins (email, password, name) VALUES (?, ?, ?)');
    stmt.run('email@admin.com', hashedPassword, 'Super Admin');
    
    console.log('✅ Superadmin created successfully!');
    console.log('📧 Email: email@admin.com');
    console.log('🔑 Password: 1');
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error);
  }
};

seedSuperadmin(); 