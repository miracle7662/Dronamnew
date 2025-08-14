// const { pool } = require('../config/database');

// // Get all zones
// const getAllZones = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT * FROM zones 
//       ORDER BY zone_name ASC
//     `);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching zones:', err);
//     res.status(500).json({ error: 'Failed to fetch zones', details: err.message });
//   }
// };

// // Get single zone by ID
// const getZoneById = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT * FROM zones 
//       WHERE zone_id = ? AND status = 1
//     `, [req.params.id]);

//     rows.length > 0
//       ? res.json(rows[0])
//       : res.status(404).json({ error: 'Zone not found' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch zone', details: err.message });
//   }
// };

// // Create new zone
// const createZone = async (req, res) => {
//   const { zone_name, zone_code, district_id, description, status = 1, created_by_id } = req.body;
//   if (!zone_name || !zone_code || !district_id) {
//     return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
//   }

//   try {
//     const [result] = await pool.query(`
//       INSERT INTO zones (zone_name, zone_code, district_id, description, status, created_by_id) 
//       VALUES (?, ?, ?, ?, ?, ?)
//     `, [zone_name, zone_code, district_id, description, status, created_by_id]);
    
//     const [newZone] = await pool.query(`
//       SELECT * FROM zones WHERE zone_id = ?
//     `, [result.insertId]);

//     if (newZone.length === 0) {
//       return res.status(404).json({ error: 'Zone not found after creation' });
//     }

//     res.status(201).json({ 
//       message: 'Zone created successfully!', 
//       zone: newZone[0] 
//     });
//   } catch (err) {
//     const isUniqueError = err.code === 'ER_DUP_ENTRY';
//     res.status(isUniqueError ? 400 : 500).json({ 
//       error: isUniqueError ? 'Zone code must be unique' : 'Failed to create zone', 
//       details: err.message 
//     });
//   }
// };

// // Update zone
// const updateZone = async (req, res) => {
//   const { zone_name, zone_code, district_id, description, status = 1, updated_by_id } = req.body;
//   const { id } = req.params;
//   if (!zone_name || !zone_code || !district_id) {
//     return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
//   }

//   try {
//     const [result] = await pool.query(`
//       UPDATE zones 
//       SET zone_name = ?, zone_code = ?, district_id = ?, description = ?, status = ?, 
//           updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
//       WHERE zone_id = ?
//     `, [zone_name, zone_code, district_id, description, status, updated_by_id, id]);

//     result.affectedRows > 0
//       ? res.json({ message: 'Zone updated successfully!' })
//       : res.status(404).json({ error: 'Zone not found' });
//   } catch (err) {
//     const isUniqueError = err.code === 'ER_DUP_ENTRY';
//     res.status(isUniqueError ? 400 : 500).json({ 
//       error: isUniqueError ? 'Zone code must be unique' : 'Failed to update zone', 
//       details: err.message 
//     });
//   }
// };

// // Delete zone
// const deleteZone = async (req, res) => {
//   try {
//     const [result] = await pool.query(`
//       DELETE FROM zones 
//       WHERE zone_id = ?
//     `, [req.params.id]);

//     result.affectedRows > 0
//       ? res.json({ message: 'Zone deleted successfully!' })
//       : res.status(404).json({ error: 'Zone not found' });
//   } catch (err) {
//     const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
//     res.status(isForeignKeyError ? 400 : 500).json({ 
//       error: isForeignKeyError ? 'Cannot delete zone: it has associated records' : 'Failed to delete zone', 
//       details: err.message 
//     });
//   }
// };

// module.exports = {
//   getAllZones,
//   getZoneById,
//   createZone,
//   updateZone,
//   deleteZone
// };

const { pool } = require('../config/database');

// Get all zones with district and state information
const getAllZones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT z.*, d.district_name as district_name, d.district_code as district_code,
             s.state_name as state_name, s.state_code as state_code
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      ORDER BY z.zone_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error in getAllZones:', err);
    res.status(500).json({ error: 'Failed to fetch zones', details: err.message });
  }
};

// Get zones by district
const getZonesByDistrict = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT z.*, d.district_name as district_name
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      WHERE z.district_id = ?
      ORDER BY z.zone_name ASC
    `, [req.params.districtId]);
    res.json(rows);
  } catch (err) {
    console.error('Error in getZonesByDistrict:', err);
    res.status(500).json({ error: 'Failed to fetch zones', details: err.message });
  }
};

// Get single zone by ID
const getZoneById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT z.*, d.district_name as district_name, d.district_code as district_code,
             s.state_name as state_name, s.state_code as state_code
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE z.zone_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getZoneById:', err);
    res.status(500).json({ error: 'Failed to fetch zone', details: err.message });
  }
};

// Create new zone
const createZone = async (req, res) => {
  const { zone_name, zone_code, district_id, description, status = 1, created_by_id } = req.body;
  
  if (!zone_name || !zone_code || !district_id) {
    return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO zones 
      (zone_name, zone_code, district_id, description, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [zone_name, zone_code, district_id, description || '', status, created_by_id]);

    const [newZone] = await pool.query(`
      SELECT z.*, d.district_name as district_name, d.district_code as district_code,
             s.state_name as state_name, s.state_code as state_code
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE z.zone_id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Zone created successfully!',
      zone: newZone[0]
    });
  } catch (err) {
    console.error('Error in createZone:', err);
    res.status(500).json({ error: 'Failed to create zone', details: err.message });
  }
};

// Update zone
const updateZone = async (req, res) => {
  const { zone_name, zone_code, district_id, description, status = 1, updated_by_id } = req.body;
  const { id } = req.params;

  if (!zone_name || !zone_code || !district_id) {
    return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE zones 
      SET zone_name = ?, zone_code = ?, district_id = ?, description = ?, status = ?,
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE zone_id = ?
    `, [zone_name, zone_code, district_id, description || '', status, updated_by_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    const [updatedZone] = await pool.query(`
      SELECT z.*, d.district_name as district_name, d.district_code as district_code,
             s.state_name as state_name, s.state_code as state_code
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE z.zone_id = ?
    `, [id]);

    res.json({
      message: 'Zone updated successfully!',
      zone: updatedZone[0]
    });
  } catch (err) {
    console.error('Error in updateZone:', err);
    res.status(500).json({ error: 'Failed to update zone', details: err.message });
  }
};

// Delete zone (hard delete)
const deleteZone = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM zones 
      WHERE zone_id = ?
    `, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json({ message: 'Zone deleted successfully!' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete zone: it has associated records' : 'Failed to delete zone', 
      details: err.message 
    });
  }
};

// Get zones count
const getZonesCount = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM zones WHERE status = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getZonesCount:', err);
    res.status(500).json({ error: 'Failed to fetch zones count', details: err.message });
  }
};

module.exports = {
  getAllZones,
  getZonesByDistrict,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
  getZonesCount
};
