const db = require('../config/database');

// Create a new menu item
exports.createMenu = async (req, res) => {
  const {
    menu_name,
    description,
    food_type,
    categories_id,
    Sub_categoryid,
    Cuisine_Type,
    Quantity_size,
    preparation_time,
    Tags,
    Dish_Image,
    status,
    created_by_id,
    updated_by_id
  } = req.body;

  try {
    const query = `
      INSERT INTO menumaster (
        menu_name, description, food_type, categories_id, Sub_categoryid,
        Cuisine_Type, Quantity_size, preparation_time, Tags, Dish_Image,
        status, created_by_id, updated_by_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      menu_name, description, food_type, categories_id, Sub_categoryid,
      Cuisine_Type, Quantity_size, preparation_time, Tags, Dish_Image,
      status, created_by_id, updated_by_id
    ];

    const [result] = await db.promise().query(query, values);
    
    // Also create menu details if provided
    if (req.body.menuDetails && req.body.menuDetails.length > 0) {
      for (const detail of req.body.menuDetails) {
        const detailQuery = `
          INSERT INTO menu_details (menu_id, variant_type, Price, Discount)
          VALUES (?, ?, ?, ?)
        `;
        const detailValues = [
          result.insertId,
          detail.variant_type,
          detail.Price,
          detail.Discount
        ];
        await db.promise().query(detailQuery, detailValues);
      }
    }

    // Also create menu addons if provided
    if (req.body.menuAddons && req.body.menuAddons.length > 0) {
      for (const addon of req.body.menuAddons) {
        const addonQuery = `
          INSERT INTO menu_addon (addon_id, menu_id, rate)
          VALUES (?, ?, ?)
        `;
        const addonValues = [
          addon.addon_id,
          result.insertId,
          addon.rate
        ];
        await db.promise().query(addonQuery, addonValues);
      }
    }

    res.status(201).json({
      message: 'Menu created successfully',
      menu_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({ error: 'Failed to create menu' });
  }
};

// Get all menu items
exports.getAllMenus = async (req, res) => {
  try {
    const query = 'SELECT * FROM menumaster';
    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
};

// Get a menu item by ID
exports.getMenuById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get menu master
    const menuQuery = 'SELECT * FROM menumaster WHERE menu_id = ?';
    const [menuRows] = await db.promise().query(menuQuery, [id]);
    
    if (menuRows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    const menu = menuRows[0];
    
    // Get menu details
    const detailsQuery = 'SELECT * FROM menu_details WHERE menu_id = ?';
    const [detailsRows] = await db.promise().query(detailsQuery, [id]);
    menu.menuDetails = detailsRows;
    
    // Get menu addons
    const addonsQuery = 'SELECT * FROM menu_addon WHERE menu_id = ?';
    const [addonsRows] = await db.promise().query(addonsQuery, [id]);
    menu.menuAddons = addonsRows;
    
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

// Update a menu item
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const {
    menu_name,
    description,
    food_type,
    categories_id,
    Sub_categoryid,
    Cuisine_Type,
    Quantity_size,
    preparation_time,
    Tags,
    Dish_Image,
    status,
    updated_by_id
  } = req.body;

  try {
    const query = `
      UPDATE menumaster SET
        menu_name = ?, description = ?, food_type = ?, categories_id = ?,
        Sub_categoryid = ?, Cuisine_Type = ?, Quantity_size = ?,
        preparation_time = ?, Tags = ?, Dish_Image = ?, status = ?,
        updated_by_id = ?, updated_date = CURRENT_TIMESTAMP
      WHERE menu_id = ?
    `;
    
    const values = [
      menu_name, description, food_type, categories_id, Sub_categoryid,
      Cuisine_Type, Quantity_size, preparation_time, Tags, Dish_Image,
      status, updated_by_id, id
    ];

    const [result] = await db.promise().query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    // Update menu details if provided
    if (req.body.menuDetails && req.body.menuDetails.length > 0) {
      // First delete existing details
      await db.promise().query('DELETE FROM menu_details WHERE menu_id = ?', [id]);
      
      // Then insert new details
      for (const detail of req.body.menuDetails) {
        const detailQuery = `
          INSERT INTO menu_details (menu_id, variant_type, Price, Discount)
          VALUES (?, ?, ?, ?)
        `;
        const detailValues = [
          id,
          detail.variant_type,
          detail.Price,
          detail.Discount
        ];
        await db.promise().query(detailQuery, detailValues);
      }
    }

    // Update menu addons if provided
    if (req.body.menuAddons && req.body.menuAddons.length > 0) {
      // First delete existing addons
      await db.promise().query('DELETE FROM menu_addon WHERE menu_id = ?', [id]);
      
      // Then insert new addons
      for (const addon of req.body.menuAddons) {
        const addonQuery = `
          INSERT INTO menu_addon (addon_id, menu_id, rate)
          VALUES (?, ?, ?)
        `;
        const addonValues = [
          addon.addon_id,
          id,
          addon.rate
        ];
        await db.promise().query(addonQuery, addonValues);
      }
    }

    res.status(200).json({ message: 'Menu updated successfully' });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
};

// Delete a menu item
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Delete related menu details
    await db.promise().query('DELETE FROM menu_details WHERE menu_id = ?', [id]);
    
    // Delete related menu addons
    await db.promise().query('DELETE FROM menu_addon WHERE menu_id = ?', [id]);
    
    // Delete the menu
    const query = 'DELETE FROM menumaster WHERE menu_id = ?';
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
};

// Create a menu detail
exports.createMenuDetail = async (req, res) => {
  const { menu_id, variant_type, Price, Discount } = req.body;
  
  try {
    const query = `
      INSERT INTO menu_details (menu_id, variant_type, Price, Discount)
      VALUES (?, ?, ?, ?)
    `;
    
    const values = [menu_id, variant_type, Price, Discount];
    const [result] = await db.promise().query(query, values);
    
    res.status(201).json({
      message: 'Menu detail created successfully',
      menudetails_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating menu detail:', error);
    res.status(500).json({ error: 'Failed to create menu detail' });
  }
};

// Get all menu details for a menu
exports.getMenuDetails = async (req, res) => {
  const { menuId } = req.params;
  
  try {
    const query = 'SELECT * FROM menu_details WHERE menu_id = ?';
    const [rows] = await db.promise().query(query, [menuId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching menu details:', error);
    res.status(500).json({ error: 'Failed to fetch menu details' });
  }
};

// Update a menu detail
exports.updateMenuDetail = async (req, res) => {
  const { id } = req.params;
  const { variant_type, Price, Discount } = req.body;
  
  try {
    const query = `
      UPDATE menu_details SET variant_type = ?, Price = ?, Discount = ?
      WHERE menudetails_id = ?
    `;
    
    const values = [variant_type, Price, Discount, id];
    const [result] = await db.promise().query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu detail not found' });
    }
    
    res.status(200).json({ message: 'Menu detail updated successfully' });
  } catch (error) {
    console.error('Error updating menu detail:', error);
    res.status(500).json({ error: 'Failed to update menu detail' });
  }
};

// Delete a menu detail
exports.deleteMenuDetail = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'DELETE FROM menu_details WHERE menudetails_id = ?';
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu detail not found' });
    }
    
    res.status(200).json({ message: 'Menu detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu detail:', error);
    res.status(500).json({ error: 'Failed to delete menu detail' });
  }
};

// Create a menu addon
exports.createMenuAddon = async (req, res) => {
  const { addon_id, menu_id, rate } = req.body;
  
  try {
    const query = `
      INSERT INTO menu_addon (addon_id, menu_id, rate)
      VALUES (?, ?, ?)
    `;
    
    const values = [addon_id, menu_id, rate];
    const [result] = await db.promise().query(query, values);
    
    res.status(201).json({
      message: 'Menu addon created successfully',
      menu_addon: result.insertId
    });
  } catch (error) {
    console.error('Error creating menu addon:', error);
    res.status(500).json({ error: 'Failed to create menu addon' });
  }
};

// Get all menu addons for a menu
exports.getMenuAddons = async (req, res) => {
  const { menuId } = req.params;
  
  try {
    const query = 'SELECT * FROM menu_addon WHERE menu_id = ?';
    const [rows] = await db.promise().query(query, [menuId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching menu addons:', error);
    res.status(500).json({ error: 'Failed to fetch menu addons' });
  }
};

// Update a menu addon
exports.updateMenuAddon = async (req, res) => {
  const { id } = req.params;
  const { addon_id, menu_id, rate } = req.body;
  
  try {
    const query = `
      UPDATE menu_addon SET addon_id = ?, menu_id = ?, rate = ?
      WHERE menu_addon = ?
    `;
    
    const values = [addon_id, menu_id, rate, id];
    const [result] = await db.promise().query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu addon not found' });
    }
    
    res.status(200).json({ message: 'Menu addon updated successfully' });
  } catch (error) {
    console.error('Error updating menu addon:', error);
    res.status(500).json({ error: 'Failed to update menu addon' });
  }
};

// Delete a menu addon
exports.deleteMenuAddon = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'DELETE FROM menu_addon WHERE menu_addon = ?';
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu addon not found' });
    }
    
    res.status(200).json({ message: 'Menu addon deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu addon:', error);
    res.status(500).json({ error: 'Failed to delete menu addon' });
  }
};
