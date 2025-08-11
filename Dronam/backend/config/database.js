const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join('D:', 'lodgingdb', 'dronam.db'); //sudarshan
//const dbPath = path.join('E:', 'ReactHotelData', 'dronam.db');
// Create database connection
const db = new Database(dbPath);

// Test database connection
const testConnection = () => {
  try {
    const result = db.prepare('SELECT 1 as test').get();
    console.log('✅ Database connection successful!');
    console.log(`Database location: ${dbPath}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Initialize database (create tables when needed)
const initDatabase = () => {
  try {
    const sql = `
      /* Create countries table */
      CREATE TABLE IF NOT EXISTS countries (
        country_id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_name TEXT NOT NULL,
        country_code TEXT NOT NULL UNIQUE,
        capital TEXT,
        status INTEGER DEFAULT 1,
        created_by_id INTEGER,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_date DATETIME 
      );

      /* Create states table */
      CREATE TABLE IF NOT EXISTS states (
        state_id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_name TEXT NOT NULL,
        state_code TEXT NOT NULL,
        capital TEXT,
        country_id INTEGER,
        status INTEGER DEFAULT 1,
        created_by_id INTEGER,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_date DATETIME ,
        FOREIGN KEY (country_id) REFERENCES countries (country_id)
      );

      /* Create districts table */
      CREATE TABLE IF NOT EXISTS districts (
        district_id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_name TEXT NOT NULL,
        district_code TEXT NOT NULL,
        state_id INTEGER,
        description TEXT,
        status INTEGER DEFAULT 1,
        created_by_id INTEGER,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_date DATETIME ,
        FOREIGN KEY (state_id) REFERENCES states (state_id)
      );

      /* Create zones table */
      CREATE TABLE IF NOT EXISTS zones (
        zone_id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_name TEXT NOT NULL,
        zone_code TEXT NOT NULL,
        district_id INTEGER,
        description TEXT,
        status INTEGER DEFAULT 1,
        created_by_id INTEGER,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_date DATETIME,
        FOREIGN KEY (district_id) REFERENCES districts (district_id)
      );

      /* Create superadmins table */
      CREATE TABLE IF NOT EXISTS superadmins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      );

      /* Create agents table */
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
        created_by_id INTEGER,
        created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_by_date DATETIME,
        FOREIGN KEY (created_by) REFERENCES superadmins (id),
        FOREIGN KEY (country_id) REFERENCES countries (country_id),
        FOREIGN KEY (state_id) REFERENCES states (state_id),
        FOREIGN KEY (district_id) REFERENCES districts (district_id),
        FOREIGN KEY (zone_id) REFERENCES zones (zone_id)
      );

      /* Create hotels table */
      CREATE TABLE IF NOT EXISTS hotels (
        hotelid INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT,
        hotel_name TEXT,
        hotel_type TEXT,
        address TEXT,
        phone TEXT,
        country_id INTEGER,
        state_id INTEGER,
        district_id INTEGER,
        zone_id INTEGER,
        gst_no TEXT,
        pan_no TEXT,
        aadhar_no TEXT,
        owner_name TEXT,
        owner_mobile TEXT,
        hotel_timeMorning TEXT,
        hotel_timeEvening TEXT,
        status INTEGER,
        created_by_id INTEGER,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INTEGER,
        updated_date DATETIME,
        masteruserid INTEGER,
        FOREIGN KEY (created_by_id) REFERENCES agents(id),
        FOREIGN KEY (country_id) REFERENCES countries(country_id),
        FOREIGN KEY (state_id) REFERENCES states(state_id),
        FOREIGN KEY (district_id) REFERENCES districts(district_id),
        FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
      );
    `;
    console.log('Executing SQL...'); // Debug: Log the SQL
    db.exec(sql);

    console.log('✅ Master tables and user tables created successfully!');
    console.log(`Database file: ${dbPath}`);
  } catch (error) {
    console.error('❌ Error creating master tables:', error);
    throw error; // Re-throw to see full error details
  }
};

module.exports = { db, testConnection, initDatabase };
