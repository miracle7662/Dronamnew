-- SQL Script to demonstrate multiple addon selection for menu items
-- This shows how the menuaddon table can handle multiple addons per menu

-- Sample data for testing multiple addon functionality

-- First, ensure the required tables exist
-- (menumaster and addonsMaster should already exist)

-- Insert sample menu items if not exists
INSERT INTO menumaster (menu_name, menu_price, menu_description, category_id) VALUES
('Chicken Burger', 250.00, 'Delicious chicken burger with lettuce and tomato', 1),
('Veg Pizza', 300.00, 'Fresh vegetable pizza with cheese', 2),
('Pasta Alfredo', 200.00, 'Creamy alfredo pasta', 3);

-- Insert sample addons if not exists
INSERT INTO addonsMaster (addon_name, addon_price, addon_description) VALUES
('Extra Cheese', 30.00, 'Additional cheese topping'),
('Extra Veggies', 25.00, 'Extra vegetables'),
('Garlic Bread', 50.00, 'Side of garlic bread'),
('Cold Drink', 40.00, 'Cold beverage'),
('French Fries', 60.00, 'Crispy french fries');

-- Link multiple addons to menu items
-- For Chicken Burger: Extra Cheese + French Fries
INSERT INTO menuaddon (menu_id, addon_id) VALUES
(1, 1),  -- Chicken Burger with Extra Cheese
(1, 5);  -- Chicken Burger with French Fries

-- For Veg Pizza: Extra Cheese + Extra Veggies + Garlic Bread
INSERT INTO menuaddon (menu_id, addon_id) VALUES
(2, 1),  -- Veg Pizza with Extra Cheese
(2, 2),  -- Veg Pizza with Extra Veggies
(2, 3);  -- Veg Pizza with Garlic Bread

-- For Pasta Alfredo: Extra Cheese + Cold Drink
INSERT INTO menuaddon (menu_id, addon_id) VALUES
(3, 1),  -- Pasta Alfredo with Extra Cheese
(3, 4);  -- Pasta Alfredo with Cold Drink

-- Query to get all menu items with their addons
SELECT 
    mm.menu_id,
    mm.menu_name,
    mm.menu_price,
    GROUP_CONCAT(am.addon_name) as addon_names,
    GROUP_CONCAT(am.addon_price) as addon_prices,
    SUM(am.addon_price) as total_addon_price,
    (mm.menu_price + SUM(am.addon_price)) as total_price
FROM menumaster mm
LEFT JOIN menuaddon ma ON mm.menu_id = ma.menu_id
LEFT JOIN addonsMaster am ON ma.addon_id = am.addon_id
GROUP BY mm.menu_id, mm.menu_name, mm.menu_price;

-- Query to get addons for a specific menu item
SELECT 
    ma.menuaddon_id,
    mm.menu_name,
    am.addon_id,
    am.addon_name,
    am.addon_price
FROM menuaddon ma
JOIN menumaster mm ON ma.menu_id = mm.menu_id
JOIN addonsMaster am ON ma.addon_id = am.addon_id
WHERE ma.menu_id = 1  -- For Chicken Burger
ORDER BY am.addon_name;
