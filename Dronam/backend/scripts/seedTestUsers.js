const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

const seedTestUsers = async () => {
  try {
    console.log('🌱 Starting to seed test users...');

    // Check if test users already exist
    const existingSuperadmin = db.prepare('SELECT id FROM superadmins WHERE email = ?').get('email@admin.com');
    const existingAgent = db.prepare('SELECT id FROM agents WHERE email = ?').get('agent@test.com');
    const existingAdmin = db.prepare('SELECT id FROM agents WHERE email = ?').get('admin@test.com');
    const existingHotel = db.prepare('SELECT id FROM hotels WHERE email = ?').get('hotel@test.com');

    // Seed Superadmin (if not exists)
    if (!existingSuperadmin) {
      const hashedPassword = await bcrypt.hash('1', 10);
      db.prepare(`
        INSERT INTO superadmins (email, password, name, status)
        VALUES (?, ?, ?, ?)
      `).run('email@admin.com', hashedPassword, 'Super Admin', 1);
      console.log('✅ Superadmin seeded: email@admin.com / 1');
    } else {
      console.log('ℹ️ Superadmin already exists');
    }

    // Seed Agent (if not exists)
    if (!existingAgent) {
      const hashedPassword = await bcrypt.hash('agent123', 10);
      db.prepare(`
        INSERT INTO agents (email, password, name, role, phone, address, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run('agent@test.com', hashedPassword, 'Test Agent', 'agent', '+1234567890', 'Agent Address', 1, 1);
      console.log('✅ Agent seeded: agent@test.com / agent123');
    } else {
      console.log('ℹ️ Agent already exists');
    }

    // Seed Admin (if not exists)
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      db.prepare(`
        INSERT INTO agents (email, password, name, role, phone, address, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run('admin@test.com', hashedPassword, 'Test Admin', 'admin', '+1234567891', 'Admin Address', 1, 1);
      console.log('✅ Admin seeded: admin@test.com / admin123');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Seed Hotel (if not exists)
    if (!existingHotel) {
      const hashedPassword = await bcrypt.hash('hotel123', 10);
      db.prepare(`
        INSERT INTO hotels (email, password, name, hotel_name, phone, address, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run('hotel@test.com', hashedPassword, 'Hotel Manager', 'Test Hotel', '+1234567892', 'Hotel Address', 1, 1);
      console.log('✅ Hotel seeded: hotel@test.com / hotel123');
    } else {
      console.log('ℹ️ Hotel already exists');
    }

    console.log('🎉 Test users seeding completed!');
    console.log('\n📋 Test User Credentials:');
    console.log('┌─────────────────┬─────────────────┬─────────────┐');
    console.log('│ Role            │ Email           │ Password    │');
    console.log('├─────────────────┼─────────────────┼─────────────┤');
    console.log('│ Superadmin      │ email@admin.com │ 1           │');
    console.log('│ Agent           │ agent@test.com  │ agent123    │');
    console.log('│ Admin           │ admin@test.com  │ admin123    │');
    console.log('│ Hotel           │ hotel@test.com  │ hotel123    │');
    console.log('└─────────────────┴─────────────────┴─────────────┘');

  } catch (error) {
    console.error('❌ Error seeding test users:', error);
  }
};

// Run the seeding
seedTestUsers(); 