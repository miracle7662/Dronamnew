import { MenuItem } from '@/services/menuService';

// Sample menu data for development and testing
export const sampleMenuItems: MenuItem[] = [
  {
    menu_id: 1,
    menu_name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    food_type: 'Vegetarian',
    categories_id: 1,
    preparation_time: 20,
    status: 'active',
    variants: [
      { menudetails_id: 1, variant_type: 'Small', rate: 250 },
      { menudetails_id: 2, variant_type: 'Medium', rate: 350 },
      { menudetails_id: 3, variant_type: 'Large', rate: 450 }
    ],
    addons: [
      { menuaddon_id: 1, addon_id: 1 },
      { menuaddon_id: 2, addon_id: 2 }
    ]
  },
  {
    menu_id: 2,
    menu_name: 'Pepperoni Pizza',
    description: 'Pizza with pepperoni and mozzarella cheese',
    food_type: 'Non-Vegetarian',
    categories_id: 2,
    preparation_time: 25,
    status: 'active',
    variants: [
      { menudetails_id: 4, variant_type: 'Small', rate: 300 },
      { menudetails_id: 5, variant_type: 'Medium', rate: 400 },
      { menudetails_id: 6, variant_type: 'Large', rate: 500 }
    ],
    addons: [
      { menuaddon_id: 3, addon_id: 1 },
      { menuaddon_id: 4, addon_id: 3 }
    ]
  },
  {
    menu_id: 3,
    menu_name: 'Veggie Burger',
    description: 'Vegetarian burger with fresh vegetables',
    food_type: 'Vegetarian',
    categories_id: 3,
    preparation_time: 15,
    status: 'active',
    variants: [
      { menudetails_id: 7, variant_type: 'Regular', rate: 180 },
      { menudetails_id: 8, variant_type: 'Combo', rate: 250 }
    ],
    addons: [
      { menuaddon_id: 5, addon_id: 2 }
    ]
  }
];

// Sample addons data
export const sampleAddons = [
  { addon_id: 1, addon_name: 'Extra Cheese', rate: 50 },
  { addon_id: 2, addon_name: 'Spicy Sauce', rate: 30 },
  { addon_id: 3, addon_name: 'Extra Toppings', rate: 40 }
];

// Mock API functions for development
export const mockGetAllMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleMenuItems);
    }, 500);
  });
};

export const mockCreateMenuItem = (item: MenuItem): Promise<{ message: string; menu_id: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...sampleMenuItems.map(m => m.menu_id || 0)) + 1;
      const newItem = { ...item, menu_id: newId };
      sampleMenuItems.push(newItem);
      resolve({ message: 'Menu item created successfully', menu_id: newId });
    }, 500);
  });
};

export const mockUpdateMenuItem = (id: number, item: MenuItem): Promise<{ message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = sampleMenuItems.findIndex(m => m.menu_id === id);
      if (index !== -1) {
        sampleMenuItems[index] = { ...item, menu_id: id };
      }
      resolve({ message: 'Menu item updated successfully' });
    }, 500);
  });
};

export const mockDeleteMenuItem = (id: number): Promise<{ message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = sampleMenuItems.findIndex(m => m.menu_id === id);
      if (index !== -1) {
        sampleMenuItems.splice(index, 1);
      }
      resolve({ message: 'Menu item deleted successfully' });
    }, 500);
  });
};

export default {
  sampleMenuItems,
  sampleAddons,
  mockGetAllMenuItems,
  mockCreateMenuItem,
  mockUpdateMenuItem,
  mockDeleteMenuItem
};
