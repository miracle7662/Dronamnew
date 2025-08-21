// ✅ Use pool from mysql2/promise
const { pool } = require('../config/database');

const MenuaddonController = {
    // ✅ Get all menu addons
// ✅ Get all menu addons
getAllMenuAddons: async (req, res) => {
    try {
        const query = `
            SELECT 
                ma.menuaddon_id,
                ma.menu_id,
                mm.menu_name,
                ma.addon_id,
                am.addon_name
            FROM menuaddon ma
            INNER JOIN menumaster mm ON ma.menu_id = mm.menu_id
            INNER JOIN addonsMaster am ON ma.addon_id = am.addon_id
            ORDER BY ma.menuaddon_id DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching menu addons:", error.sqlMessage || error.message);
        res.status(500).json({
            error: "Failed to fetch menu addons",
            details: error.sqlMessage || error.message
        });
    }
},

   // ✅ Get menu addons by menu ID
getMenuAddonsByMenuId: async (req, res) => {
    try {
        const { menu_id } = req.params;
        const query = `
            SELECT 
                ma.menuaddon_id,
                ma.menu_id,
                mm.menu_name,
                ma.addon_id,
                am.addon_name
            FROM menuaddon ma
            INNER JOIN menumaster mm ON ma.menu_id = mm.menu_id
            INNER JOIN addonsmaster am ON ma.addon_id = am.addon_id
            WHERE ma.menu_id = ?
            ORDER BY am.addon_name ASC
        `;
        const [rows] = await pool.query(query, [menu_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching menu addons by menu ID:", error.sqlMessage || error.message);
        res.status(500).json({
            error: "Failed to fetch menu addons",
            details: error.sqlMessage || error.message
        });
    }
},


    // ✅ Create menu addons (replace all for a menu)
   // ✅ Create menu addons (replace all for a menu) with validation
createMenuAddon: async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { menu_id, addon_ids } = req.body;

        if (!menu_id || !Array.isArray(addon_ids) || addon_ids.length === 0) {
            return res.status(400).json({ error: "menu_id and addon_ids[] required" });
        }

        await conn.beginTransaction();

        // ✅ Check if menu_id exists
        const [menuRows] = await conn.query("SELECT menu_id FROM menumaster WHERE menu_id = ?", [menu_id]);
        if (menuRows.length === 0) {
            await conn.rollback();
            return res.status(400).json({ error: `menu_id ${menu_id} does not exist in menumaster` });
        }

        // ✅ Check if all addon_ids exist
        const [addonRows] = await conn.query(
            `SELECT addon_id FROM addonsmaster WHERE addon_id IN (?)`,
            [addon_ids]
        );
        if (addonRows.length !== addon_ids.length) {
            await conn.rollback();
            return res.status(400).json({
                error: "Some addon_ids do not exist in addonsmaster",
                provided: addon_ids,
                found: addonRows.map(r => r.addon_id)
            });
        }

        // ✅ Delete old records for this menu_id
        await conn.query("DELETE FROM menuaddon WHERE menu_id = ?", [menu_id]);

        // ✅ Insert new records
        const insertQuery = "INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)";
        for (const addon_id of addon_ids) {
            await conn.query(insertQuery, [menu_id, addon_id]);
        }

        await conn.commit();

        res.status(201).json({
            message: "Menu addons created successfully",
            menu_id,
            addon_count: addon_ids.length,
            addon_ids
        });
    } catch (error) {
        if (conn) await conn.rollback();
        console.error("Error creating menu addon:", error.sqlMessage || error.message);
        res.status(500).json({
            error: "Failed to create menu addon",
            details: error.sqlMessage || error.message
        });
    } finally {
        if (conn) conn.release();
    }
},

    // ✅ Update menu addons (replace all for a menu)
    updateMenuAddon: async (req, res) => {
        const conn = await pool.getConnection();
        try {
            const { menu_id, addon_ids } = req.body;

            if (!menu_id || !Array.isArray(addon_ids) || addon_ids.length === 0) {
                return res.status(400).json({ error: "menu_id and addon_ids[] required" });
            }

            await conn.beginTransaction();

            await conn.query("DELETE FROM menuaddon WHERE menu_id = ?", [menu_id]);

            const insertQuery = "INSERT INTO menuaddon (menu_id, addon_id) VALUES (?, ?)";
            for (const addon_id of addon_ids) {
                await conn.query(insertQuery, [menu_id, addon_id]);
            }

            await conn.commit();

            res.json({
                message: "Menu addons updated successfully",
                menu_id,
                addon_count: addon_ids.length,
            });
        } catch (error) {
            if (conn) await conn.rollback();
            console.error("Error updating menu addon:", error.sqlMessage || error.message);
            res.status(500).json({
                error: "Failed to update menu addon",
                details: error.sqlMessage || error.message
            });
        } finally {
            if (conn) conn.release();
        }
    },

    // ✅ Delete single menuaddon by ID
    deleteMenuAddon: async (req, res) => {
        try {
            const { menuaddon_id } = req.params;
            const [result] = await pool.query(
                "DELETE FROM menuaddon WHERE menuaddon_id = ?",
                [menuaddon_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Menu addon not found" });
            }

            res.json({ message: "Menu addon deleted successfully" });
        } catch (error) {
            console.error("Error deleting menu addon:", error.sqlMessage || error.message);
            res.status(500).json({
                error: "Failed to delete menu addon",
                details: error.sqlMessage || error.message
            });
        }
    },

    // ✅ Delete all addons for a menu
    deleteMenuAddonsByMenuId: async (req, res) => {
        try {
            const { menu_id } = req.params;
            const [result] = await pool.query(
                "DELETE FROM menuaddon WHERE menu_id = ?",
                [menu_id]
            );
            res.json({
                message: "All addons for this menu deleted successfully",
                deleted_count: result.affectedRows,
            });
        } catch (error) {
            console.error("Error deleting menu addons by menu ID:", error.sqlMessage || error.message);
            res.status(500).json({
                error: "Failed to delete menu addons",
                details: error.sqlMessage || error.message
            });
        }
    },
};

module.exports = MenuaddonController;
