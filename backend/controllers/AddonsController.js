const db = require('../config/database');

// Create a new addon
exports.createAddon = async (req, res) => {
  const { addon_name, description } = req.body;

  try {
    const query = `
      INSERT INTO addonsMaster (addon_name, description)
      VALUES (?, ?)
    `;
    
    const values = [addon_name, description];
    const [result] = await db.promise().query(query, values);
    
    res.status(201).json({
      message: 'Addon created successfully',
      addon_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating addon:', error);
    res.status(500).json({ error: 'Failed to create addon' });
  }
};

// Get all addons
exports.getAllAddons = async (req, res) => {
  try {
    const query = 'SELECT * FROM addonsMaster';
    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching addons:', error);
    res.status(500).json({ error: 'Failed to fetch addons' });
  }
};

// Get an addon by ID
exports.getAddonById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'SELECT * FROM addonsMaster WHERE addon_id = ?';
    const [rows] = await db.promise().query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching addon:', error);
    res.status(500).json({ error: 'Failed to fetch addon' });
  }
};

// Update an addon
exports.updateAddon = async (req, res) => {
  const { id } = req.params;
  const { addon_name, description } = req.body;

  try {
    const query = `
      UPDATE addonsMaster SET addon_name = ?, description = ?
      WHERE addon_id = ?
    `;
    
    const values = [addon_name, description, id];
    const [result] = await db.promise().query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    
    res.status(200).json({ message: 'Addon updated successfully' });
  } catch (error) {
    console.error('Error updating addon:', error);
    res.status(500).json({ error: 'Failed to update addon' });
  }
};

// Delete an addon
exports.deleteAddon = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'DELETE FROM addonsMaster WHERE addon_id = ?';
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    
    res.status(200).json({ message: 'Addon deleted successfully' });
  } catch (error) {
    console.error('Error deleting addon:', error);
    res.status(500).json({ error: 'Failed to delete addon' });
  }
};
