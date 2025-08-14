require('dotenv').config();
const { testConnection } = require('./config/database');

async function diagnose() {
  console.log('🔍 Diagnosing server start issues...\n');
  
  // Test database connection
  console.log('1. Testing database connection...');
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('✅ Database connection successful');
  } else {
    console.log('❌ Database connection failed');
    console.log('   Check: MySQL service, credentials in .env, database existence');
  }
  
  // Check environment variables
  console.log('\n2. Checking environment variables...');
  const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
    }
  });
  
  console.log('\n3. Next steps:');
  console.log('   - Run: npm install');
  console.log('   - Ensure MySQL is running');
  console.log('   - Create database if needed');
  console.log('   - Run: npm start');
}

diagnose();
