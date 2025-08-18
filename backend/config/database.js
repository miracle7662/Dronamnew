require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dronam',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  multipleStatements: true,  // Add this line to allow multiple statements in one query
  connectionLimit: 10
});

console.log('MySQL pool created:', pool);


// Test connection
const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS test');
    console.log('✅ MySQL connection successful!');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS countries (
        country_id INT AUTO_INCREMENT PRIMARY KEY,
        country_name VARCHAR(255) NOT NULL,
        country_code VARCHAR(50) NOT NULL UNIQUE,
        capital VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_date TIMESTAMP NULL
      );

      CREATE TABLE IF NOT EXISTS states (
        state_id INT AUTO_INCREMENT PRIMARY KEY,
        state_name VARCHAR(255) NOT NULL,
        state_code VARCHAR(50) NOT NULL,
        capital VARCHAR(255),
        country_id INT,
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_date TIMESTAMP NULL,
        FOREIGN KEY (country_id) REFERENCES countries(country_id)
      );

      CREATE TABLE IF NOT EXISTS districts (
        district_id INT AUTO_INCREMENT PRIMARY KEY,
        district_name VARCHAR(255) NOT NULL,
        district_code VARCHAR(50) NOT NULL,
        state_id INT,
        description TEXT,
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_date TIMESTAMP NULL,
        FOREIGN KEY (state_id) REFERENCES states(state_id)
      );

      CREATE TABLE IF NOT EXISTS zones (
        zone_id INT AUTO_INCREMENT PRIMARY KEY,
        zone_name VARCHAR(255) NOT NULL,
        zone_code VARCHAR(50) NOT NULL,
        district_id INT,
        description TEXT,
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_date TIMESTAMP NULL,
        FOREIGN KEY (district_id) REFERENCES districts(district_id)
      );

      CREATE TABLE IF NOT EXISTS superadmins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL
      );

      CREATE TABLE IF NOT EXISTS agents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'agent',
        phone VARCHAR(50),
        address TEXT,
        country_id INT,
        state_id INT,
        district_id INT,
        zone_id INT,
        pan_number VARCHAR(50),
        aadhar_number VARCHAR(50),
        gst_number VARCHAR(50),
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_by_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_by_date TIMESTAMP NULL,
        FOREIGN KEY (country_id) REFERENCES countries(country_id),
        FOREIGN KEY (state_id) REFERENCES states(state_id),
        FOREIGN KEY (district_id) REFERENCES districts(district_id),
        FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
      );

      CREATE TABLE IF NOT EXISTS hotels (
        hotelid INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        hotel_name VARCHAR(255),
        hotel_type VARCHAR(255),
        address TEXT,
        phone VARCHAR(50),
        country_id INT,
        state_id INT,
        district_id INT,
        zone_id INT,
        gst_no VARCHAR(50),
        pan_no VARCHAR(50),
        aadhar_no VARCHAR(50),
        owner_name VARCHAR(255),
        owner_mobile VARCHAR(50),
        hotel_timeMorning VARCHAR(255),
        hotel_timeEvening VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_by_id INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by_id INT,
        updated_date TIMESTAMP NULL,
        masteruserid INT,
        FOREIGN KEY (created_by_id) REFERENCES agents(id),
        FOREIGN KEY (country_id) REFERENCES countries(country_id),
        FOREIGN KEY (state_id) REFERENCES states(state_id),
        FOREIGN KEY (district_id) REFERENCES districts(district_id),
        FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
      );
      
    CREATE TABLE IF NOT EXISTS categories (
      categories_id INT AUTO_INCREMENT PRIMARY KEY,
      categories_name VARCHAR(150) NOT NULL,
      description VARCHAR(200) NOT NULL,
      status INTEGER DEFAULT 1,
      created_by_id INT NOT NULL,
      created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by_id INT DEFAULT NULL,
      updated_by_date DATETIME
    );

    CREATE TABLE IF NOT EXISTS units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL UNIQUE,   -- e.g. "kg", "litre", "piece"
    status INTEGER DEFAULT 1,
    created_by_id INT NOT NULL,
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by_id INT DEFAULT NULL,
    updated_by_date DATETIME
);


CREATE TABLE IF NOT EXISTS addonsMaster (
    addon_id INT AUTO_INCREMENT PRIMARY KEY,
    addon_name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NOT NULL,
    rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit_id INT,
    unit_conversion VARCHAR(150) NOT NULL,
    status INTEGER DEFAULT 1,
    created_by_id INT NOT NULL,
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by_id INT DEFAULT NULL,
    updated_by_date DATETIME,
    FOREIGN KEY (unit_id) REFERENCES units(unit_id)
);

CREATE TABLE IF NOT EXISTS menumaster (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_name VARCHAR(150) NOT NULL,
    description TEXT,
    food_type ENUM('veg', 'nonveg') NOT NULL DEFAULT 'veg',
    category_id INT NOT NULL,
    preparation_time TIME,
    status INTEGER DEFAULT 1,
    created_by_id INT NOT NULL,
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by_id INT DEFAULT NULL,
    updated_by_date DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(categories_id)
);

CREATE TABLE IF NOT EXISTS menu_details (
    menudetails_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    variant_type VARCHAR(150) NOT NULL,   -- e.g. half, full, quarter
    rate DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (menu_id) REFERENCES menumaster(menu_id)
);


CREATE TABLE IF NOT EXISTS menuaddon (
    menuaddon_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    addon_id INT NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menumaster(menu_id),
    FOREIGN KEY (addon_id) REFERENCES addonsMaster(addon_id)
);



    

    `;

    console.log('Executing MySQL schema...');
    await pool.query(sql);
    console.log('✅ Master tables created successfully in MySQL!');
  } catch (error) {
    console.error('❌ Error creating MySQL tables:', error);
    throw error;
  }
};

module.exports = { pool, testConnection, initDatabase };
