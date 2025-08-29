-- SQL statements to create the menumaster, menu_addon, and menu_details tables

CREATE TABLE `menumaster` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `food_type` enum('veg','nonveg') NOT NULL DEFAULT 'veg',
  `categories_id` int(11) NOT NULL,
  `Sub_categoryid` int(11) DEFAULT NULL,
  `Cuisine_Type` varchar(400) DEFAULT NULL,
  `Quantity_size` decimal(19,2) NOT NULL,
  `preparation_time` time DEFAULT NULL,
  `Tags` varchar(200) DEFAULT NULL,
  `Dish_Image` blob DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_by_id` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by_id` int(11) DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `menu_addon` (
  `menu_addon` int(11) NOT NULL AUTO_INCREMENT,
  `addon_id` int(11) DEFAULT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `rate` decimal(19,2) DEFAULT NULL,
  PRIMARY KEY (`menu_addon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `menu_details` (
  `menudetails_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `variant_type` varchar(150) NOT NULL,
  `Price` decimal(19,2) NOT NULL,
  `Discount` decimal(19,0) DEFAULT NULL,
  PRIMARY KEY (`menudetails_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
