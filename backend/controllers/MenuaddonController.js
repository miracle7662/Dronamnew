const db = require('../config/database');

const MenuaddonController = {
    // Get all menu addons
    getAllMenuAddons: async (req, res) => {
        try {
            const query = `
                SELECT 
                    ma.menuaddon_id,
                    ma.menu_id,
                    mm.menu_name,
                    ma.addon_id,
                    am.addon_name,
                    am.addon_price
                FROM menuaddon ma
                JOIN menumaster mm ON ma.menu_id = mm.menu_id
                JOIN addonsMaster am ON ma.addon_id = am.addon_id
                ORDER BY ma.menuaddon_id DESC
            `;
            
            const [rows] = await db.query(query);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching menu addons:', error);
            res.status(500).json({ error: 'Failed to fetch menu addons' });
        }
    },

    // Get menu addons by menu ID
    getMenuAddonsByMenuId: async (req, res) => {
        try {
            const { menuId } = req.params;
            
            const query = `
                SELECT 
                    ma.menuaddon_id,
                    ma.menu_id,
                    mm.menu_name,
                    ma.addon_id,
                    am.addon_name,
                    am.addon_price
                FROM menuaddon ma
                JOIN menumaster mm ON ma.menu_id = mm.menu_id
                JOIN addonsMaster am ON ma.addon_id = am.addon_id
                WHERE ma.menu_id = ?
                ORDER BY am.addon_name
            `;
            
            const [rows] = await db.query(query, [menuId]);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching menu addons by menu ID:', error);
            res.status(500).json({ error: 'Failed to fetch menu addons' });
        }
    },

    // Create new menu addon with multiple addons
    createMenuAddon: async (req, res) => {
        try {
            const { menu_id, addon_ids } = req.body;
            
            if (!menu_id || !Array.isArray(addon_ids) || addon_ids.length === 0) {
                return res.status(400).json({ 
                    error: 'menu_id and addon_ids (array) are required' 
                });
            }

            // Start transaction
            await db.query('START TRANSACTION');

            // First, delete existing addons for this menu
            await db.query('DELETE FROM menuaddon WHERE menu_id = ?', [menu_id]);

            // Insert new addons
            const insertQuery = 'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)';
            const insertPromises = addon_ids.map(addon_id => 
                db.query(insertQuery, [menu_id, addon_id])
            );

            await Promise.all(insertPromises);

            // Commit transaction
            await db.query('COMMIT');

            res.status(201).json({ 
                message: 'Menu addons created successfully',
                menu_id: menu_id,
                addon_count: addon_ids.length
            });
        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Error creating menu addon:', error);
            res.status(500).json({ error: 'Failed to create menu addon' });
        }
    },

    // Update menu addon with multiple addons
    updateMenuAddon: async (req, res) => {
        try {
            const { menuaddon_id } = req.params;
            const { menu_id, addon_ids } = req.body;
            
            if (!menu_id || !Array.isArray(addon_ids) || addon_ids.length === 0) {
                return res.status(400).json({ 
                    error: 'menu_id and addon_ids (array) are required' 
                });
            }

            // Start transaction
            await db.query('START TRANSACTION');

            // Delete existing addons for this menu
            await db.query('DELETE FROM menuaddon WHERE menu_id = ?', [menu_id]);

            // Insert new addons
            const insertQuery = 'INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)';
            const insertPromises = addon_ids.map(addon_id => 
                db.query(insertQuery, [menu_id, addon_id])
            );

            await Promise.all(insertPromises);

            // Commit transaction
            await db.query('COMMIT');

            res.json({ 
                message: 'Menu addons updated successfully',
                menu_id: menu_id,
                addon_count: addon_ids.length
            });
        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Error updating menu addon:', error);
            res.status(500).json({ error: 'Failed to update menu addon' });
        }
    },

    // Delete menu addon
    deleteMenuAddon: async (req, res) => {
        try {
            const { menuaddon_id } = req.params;
            
            const [result] = await db.query(
                'DELETE FROM menuaddon WHERE menuaddon_id = ?', 
                [menuaddon_id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Menu addon not found' });
            }
            
            res.json({ message: 'Menu addon deleted successfully' });
        } catch (error) {
            console.error('Error deleting menu addon:', error);
            res.status(500).json({ error: 'Failed to delete menu addon' });
        }
    },

    // Delete all addons for a specific menu
    deleteMenuAddonsByMenuId: async (req, res) => {
        try {
            const { menu_id } = req.params;
            
            const [result] = await db.query(
                'DELETE FROM menuaddon WHERE menu_id = ?', 
                [menu_id]
            );
            
            res.json({ 
                message: 'All addons for menu deleted successfully',
                deleted_count: result.affectedRows
            });
        } catch (error) {
            console.error('Error deleting menu addons by menu ID:', error);
            res.status(500).json({ error: 'Failed to delete menu addons' });
        }
    }
};

module.exports = MenuaddonController;
