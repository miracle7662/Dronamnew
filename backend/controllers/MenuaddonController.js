const { pool } = require('../config/database');

// Get all menu addons
const getAllMenuAddons = async (req, res) => {
    try {
        const query = `
            SELECT 
                ma.menuaddon_id,
                ma.menu_id,
                ma.addon_id,
                m.menu_name,
                a.addon_name,
                a.addon_price
            FROM menuaddon ma
            LEFT JOIN menumaster m ON ma.menu_id = m.menu_id
            LEFT JOIN addons a ON ma.addon_id = a.addon_id
            ORDER BY ma.menuaddon_id
        `;
        
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching menu addons:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get menu addons by menu ID
const getMenuAddonsByMenuId = async (req, res) => {
    try {
        const { menu_id } = req.params;
        
        const query = `
            SELECT 
                ma.menuaddon_id,
                ma.menu_id,
                ma.addon_id,
                m.menu_name,
                a.addon_name,
                a.addon_price
            FROM menuaddon ma
            LEFT JOIN menumaster m ON ma.menu_id = m.menu_id
            LEFT JOIN addons a ON ma.addon_id = a.addon_id
            WHERE ma.menu_id = ?
            ORDER BY ma.menuaddon_id
        `;
        
        const [rows] = await pool.query(query, [menu_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menu addons not found for this menu ID' });
        }
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching menu addons by menu ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new menu addon
const createMenuAddon = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { menu_id, addons } = req.body;
        
        // Delete existing addons for this menu
        await connection.query('DELETE FROM menuaddon WHERE menu_id = ?', [menu_id]);
        
        // Insert new addons
        for (const addon of addons) {
            await connection.query(
                'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)',
                [menu_id, addon.addon_id]
            );
        }
        
        await connection.commit();
        
        res.status(201).json({ message: 'Menu addons created successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating menu addons:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Update menu addons (replace all addons for a given menu_id)
const updateMenuAddon = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { menu_id } = req.params;
        const { addons } = req.body;
        
        // Delete existing addons for this menu
        await connection.query('DELETE FROM menuaddon WHERE menu_id = ?', [menu_id]);
        
        // Insert new addons
        for (const addon of addons) {
            await connection.query(
                'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)',
                [menu_id, addon.addon_id]
            );
        }
        
        await connection.commit();
        
        res.status(200).json({ message: 'Menu addons updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating menu addons:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Delete single menuaddon by ID
const deleteMenuAddon = async (req, res) => {
    try {
        const { menuaddon_id } = req.params;
        
        const query = 'DELETE FROM menuaddon WHERE menuaddon_id = ?';
        
        const [result] = await pool.query(query, [menuaddon_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu addon not found' });
        }
        
        res.status(200).json({ message: 'Menu addon deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu addon:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete all addons for a specific menu
const deleteMenuAddonsByMenuId = async (req, res) => {
    try {
        const { menu_id } = req.params;
        
        const query = 'DELETE FROM menuaddon WHERE menu_id = ?';
        
        const [result] = await pool.query(query, [menu_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No menu addons found for this menu ID' });
        }
        
        res.status(200).json({ message: 'Menu addons deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu addons by menu ID:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMenuAddons,
    getMenuAddonsByMenuId,
    createMenuAddon,
    updateMenuAddon,
    deleteMenuAddon,
    deleteMenuAddonsByMenuId
};
