const { pool } = require('../config/database');

// Get all menu items with their details and addons
const getAllMenuItems = async (req, res) => {
    try {
        // Query to get all menu items with their details and addons
        const query = `
            SELECT 
                m.menu_id,
                m.menu_name,
                m.description,
                m.food_type,
                m.categories_id,
                m.preparation_time,
                m.status,
                m.created_by_id,
                m.created_date,
                m.updated_by_id,
                m.updated_date,
                md.menudetails_id,
                md.variant_type,
                md.rate,
                ma.menuaddon_id,
                ma.addon_id
            FROM menumaster m
            LEFT JOIN menu_details md ON m.menu_id = md.menu_id
            LEFT JOIN menuaddon ma ON m.menu_id = ma.menu_id
            ORDER BY m.menu_id, md.menudetails_id, ma.menuaddon_id
        `;
        
        const [rows] = await pool.query(query);
        
        // Group the results by menu item
        const menuItems = {};
        rows.forEach(row => {
            if (!menuItems[row.menu_id]) {
                menuItems[row.menu_id] = {
                    menu_id: row.menu_id,
                    menu_name: row.menu_name,
                    description: row.description,
                    food_type: row.food_type,
                    categories_id: row.categories_id,
                    preparation_time: row.preparation_time,
                    status: row.status,
                    created_by_id: row.created_by_id,
                    created_date: row.created_date,
                    updated_by_id: row.updated_by_id,
                    updated_date: row.updated_date,
                    variants: [],
                    addons: []
                };
            }
            
            // Add variant if it exists and not already added
            if (row.menudetails_id && !menuItems[row.menu_id].variants.find(v => v.menudetails_id === row.menudetails_id)) {
                menuItems[row.menu_id].variants.push({
                    menudetails_id: row.menudetails_id,
                    variant_type: row.variant_type,
                    rate: row.rate
                });
            }
            
            // Add addon if it exists and not already added
            if (row.menuaddon_id && !menuItems[row.menu_id].addons.find(a => a.menuaddon_id === row.menuaddon_id)) {
                menuItems[row.menu_id].addons.push({
                    menuaddon_id: row.menuaddon_id,
                    addon_id: row.addon_id
                });
            }
        });
        
        res.status(200).json(Object.values(menuItems));
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get single menu item by ID with details and addons
const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                m.menu_id,
                m.menu_name,
                m.description,
                m.food_type,
                m.categories_id,
                m.preparation_time,
                m.status,
                m.created_by_id,
                m.created_date,
                m.updated_by_id,
                m.updated_date,
                md.menudetails_id,
                md.variant_type,
                md.rate,
                ma.menuaddon_id,
                ma.addon_id
            FROM menumaster m
            LEFT JOIN menu_details md ON m.menu_id = md.menu_id
            LEFT JOIN menuaddon ma ON m.menu_id = ma.menu_id
            WHERE m.menu_id = ?
            ORDER BY md.menudetails_id, ma.menuaddon_id
        `;
        
        const [rows] = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        const menuItem = {
            menu_id: rows[0].menu_id,
            menu_name: rows[0].menu_name,
            description: rows[0].description,
            food_type: rows[0].food_type,
            categories_id: rows[0].categories_id,
            preparation_time: rows[0].preparation_time,
            status: rows[0].status,
            created_by_id: rows[0].created_by_id,
            created_date: rows[0].created_date,
            updated_by_id: rows[0].updated_by_id,
            updated_date: rows[0].updated_date,
            variants: [],
            addons: []
        };
        
        rows.forEach(row => {
            // Add variant if it exists and not already added
            if (row.menudetails_id && !menuItem.variants.find(v => v.menudetails_id === row.menudetails_id)) {
                menuItem.variants.push({
                    menudetails_id: row.menudetails_id,
                    variant_type: row.variant_type,
                    rate: row.rate
                });
            }
            
            // Add addon if it exists and not already added
            if (row.menuaddon_id && !menuItem.addons.find(a => a.menuaddon_id === row.menuaddon_id)) {
                menuItem.addons.push({
                    menuaddon_id: row.menuaddon_id,
                    addon_id: row.addon_id
                });
            }
        });
        
        res.status(200).json(menuItem);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new menu item with variants and addons
const createMenuItem = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            menu_name,
            description,
            food_type,
            categories_id,
            preparation_time,
            status,
            created_by_id,
            variants = [],
            addons = []
        } = req.body;
        
        // Insert into menumaster
        const [menuResult] = await connection.query(
            'INSERT INTO menumaster (menu_name, description, food_type, categories_id, preparation_time, status, created_by_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [menu_name, description, food_type, categories_id, preparation_time, status, created_by_id]
        );
        
        const menuId = menuResult.insertId;
        
        // Insert variants into menu_details
        for (const variant of variants) {
            await connection.query(
                'INSERT INTO menu_details (menu_id, variant_type, rate) VALUES (?, ?, ?)',
                [menuId, variant.variant_type, variant.rate]
            );
        }
        
        // Insert addons into menuaddon
        for (const addon of addons) {
            await connection.query(
                'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)',
                [menuId, addon.addon_id]
            );
        }
        
        await connection.commit();
        
        res.status(201).json({
            message: 'Menu item created successfully',
            menu_id: menuId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Update menu item with variants and addons
const updateMenuItem = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        const {
            menu_name,
            description,
            food_type,
            categories_id,
            preparation_time,
            status,
            updated_by_id,
            variants = [],
            addons = []
       } = req.body;
        
        // Update menumaster
        await connection.query(
            'UPDATE menumaster SET menu_name = ?, description = ?, food_type = ?, categories_id = ?, preparation_time = ?, status = ?, updated_by_id = ?, updated_date = CURRENT_TIMESTAMP WHERE menu_id = ?',
            [menu_name, description, food_type, categories_id, preparation_time, status, updated_by_id, id]
        );
        
        // Delete existing variants and addons
        await connection.query('DELETE FROM menu_details WHERE menu_id = ?', [id]);
        await connection.query('DELETE FROM menuaddon WHERE menu_id = ?', [id]);
        
        // Insert new variants
        for (const variant of variants) {
            await connection.query(
                'INSERT INTO menu_details (menu_id, variant_type, rate) VALUES (?, ?, ?)',
                [id, variant.variant_type, variant.rate]
            );
        }
        
        // Insert new addons
        for (const addon of addons) {
            await connection.query(
                'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)',
                [id, addon.addon_id]
            );
        }
        
        await connection.commit();
        
        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Delete menu item with all related data
const deleteMenuItem = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        
        // Delete related records first (due to foreign key constraints)
        await connection.query('DELETE FROM menu_details WHERE menu_id = ?', [id]);
        await connection.query('DELETE FROM menuaddon WHERE menu_id = ?', [id]);
        
        // Delete the menu item
        const [result] = await connection.query('DELETE FROM menumaster WHERE menu_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        await connection.commit();
        
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
};
