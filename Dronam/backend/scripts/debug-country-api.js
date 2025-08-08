#!/usr/bin/env node

const { db, testConnection } = require('../config/database');

// Test database connection
console.log('🔍 Testing database connection...');
const isConnected = testConnection();
if (!isConnected) {
    console.error('❌ Database connection failed');
    process.exit(1);
}

// Check if countries table exists and has data
console.log('🔍 Checking countries table...');
try {
    const countries = db.prepare('SELECT * FROM countries WHERE status = 1 ORDER BY country_name').all();
    console.log(`✅ Found ${countries.length} active countries`);
    
    if (countries.length === 0) {
        console.log('⚠️ No countries found with status = 1');
        console.log('📝 Inserting sample countries...');
        
        const sampleCountries = [
            { country_name: 'India', country_code: 'IN', capital: 'New Delhi', status: 1 },
            { country_name: 'United States', country_code: 'US', capital: 'Washington DC', status: 1 },
            { country_name: 'United Kingdom', country_code: 'UK', capital: 'London', status: 1 }
        ];
        
        const insertStmt = db.prepare(`
            INSERT INTO countries (country_name, country_code, capital, status, created_by_id) 
            VALUES (?, ?, ?, ?, 1)
        `);
        
        for (const country of sampleCountries) {
            insertStmt.run(country.country_name, country.country_code, country.capital, country.status);
        }
        
        console.log('✅ Sample countries inserted successfully');
    } else {
        console.log('📋 Active countries:');
        countries.forEach((country, index) => {
            console.log(`${index + 1}. ${country.country_name} (${country.country_code}) - Capital: ${country.capital}`);
        });
    }
    
} catch (error) {
    console.error('❌ Error checking countries:', error.message);
}

// Test the API response format
console.log('\n🔍 Testing API response format...');
try {
    const countries = db.prepare(`
        SELECT 
            country_id as id,
            country_name as name,
            country_code as code,
            capital,
            status,
            created_at as created_at
        FROM countries 
        WHERE status = 1 
        ORDER BY country_name
    `).all();
    
    console.log('✅ API response format test:');
    console.log(JSON.stringify(countries.slice(0, 2), null, 2));
    
} catch (error) {
    console.error('❌ Error testing API format:', error.message);
}

console.log('\n✅ Debugging complete! Check the output above for any issues.');
