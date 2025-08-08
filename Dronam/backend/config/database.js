const Database = require('better-sqlite3');
const path = require('path');

// Database file path - Store in D:\miresto folder
const dbPath = path.join('D:', 'miresto', 'lodging.db');

// Create database connection
const db = new Database(dbPath);

// Test database connection
const testConnection = () => {
  try {
    const result = db.prepare('SELECT 1 as test').get();
    console.log('✅ Database connection successful!');
    console.log(`�� Database location: ${dbPath}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Initialize database (create tables when needed)
const initDatabase = () => {
  try {
    // Create countries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        capital TEXT,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create states table
    db.exec(`
      CREATE TABLE IF NOT EXISTS states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        capital TEXT,
        country_id INTEGER,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries (id)
      )
    `);

    // Create districts table (replacing cities)
    db.exec(`
      CREATE TABLE IF NOT EXISTS districts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        state_id INTEGER,
        description TEXT,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states (id)
      )
    `);

    // Create zones table
    db.exec(`
      CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        district_id INTEGER,
        description TEXT,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (district_id) REFERENCES districts (id)
      )
    `);

    // Create superadmins table
    db.exec(`
      CREATE TABLE IF NOT EXISTS superadmins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

           // Create agents/admins table
       db.exec(`
         CREATE TABLE IF NOT EXISTS agents (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           email TEXT NOT NULL UNIQUE,
           password TEXT NOT NULL,
           name TEXT NOT NULL,
           role TEXT NOT NULL DEFAULT 'agent',
           phone TEXT,
           address TEXT,
           country_id INTEGER,
           state_id INTEGER,
           district_id INTEGER,
           zone_id INTEGER,
           pan_number TEXT,
           aadhar_number TEXT,
           gst_number TEXT,
           status INTEGER DEFAULT 1,
           created_by INTEGER,
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY (created_by) REFERENCES superadmins (id),
           FOREIGN KEY (country_id) REFERENCES countries (id),
           FOREIGN KEY (state_id) REFERENCES states (id),
           FOREIGN KEY (district_id) REFERENCES districts (id),
           FOREIGN KEY (zone_id) REFERENCES zones (id)
         )
       `);

    // Create hotels/users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        hotel_name TEXT,
        phone TEXT,
        address TEXT,
        country_id INTEGER,
        state_id INTEGER,
        district_id INTEGER,
        zone_id INTEGER,
        status INTEGER DEFAULT 1,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES agents (id),
        FOREIGN KEY (country_id) REFERENCES countries (id),
        FOREIGN KEY (state_id) REFERENCES states (id),
        FOREIGN KEY (district_id) REFERENCES districts (id),
        FOREIGN KEY (zone_id) REFERENCES zones (id)
      )
    `);
    
    console.log('✅ Master tables and user tables created successfully!');
    console.log(`📁 Database file: ${dbPath}`);
  } catch (error) {
    console.error('❌ Error creating master tables:', error);
  }
};

module.exports = { db, testConnection, initDatabase };