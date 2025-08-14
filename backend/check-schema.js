const { pool } = require('./config/database');

async function checkSchema() {
  try {
    // Check hotels table structure
    const [hotelColumns] = await pool.query('DESCRIBE hotels');
    console.log('Hotels table structure:');
    hotelColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type}`);
    });

    // Check agents table structure for comparison
    const [agentColumns] = await pool.query('DESCRIBE agents');
    console.log('\nAgents table structure:');
    agentColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type}`);
    });

    // Check if there are any hotels
    const [hotels] = await pool.query('SELECT COUNT(*) as count FROM hotels');
    console.log(`\nTotal hotels: ${hotels[0].count}`);

    // Check if there are any active hotels
    const [activeHotels] = await pool.query('SELECT COUNT(*) as count FROM hotels WHERE status = 1');
    console.log(`Active hotels: ${activeHotels[0].count}`);

    // Show sample hotel data
    if (hotels[0].count > 0) {
      const [sampleHotel] = await pool.query('SELECT * FROM hotels LIMIT 1');
      console.log('\nSample hotel data:', sampleHotel[0]);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSchema();
