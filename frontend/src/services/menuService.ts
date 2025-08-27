import axios from 'axios';
import API_CONFIG from '../config/api';

const API_URL = `${API_CONFIG.BASE_URL}/menumaster`;

export interface MenuItem {
  menu_id?: number;
  menu_name: string;
  description: string;
  food_type: string;
  categories_id: number;
  preparation_time: number;
  status: string;
  created_by_id?: number;
  created_date?: string;
  updated_by_id?: number;
  updated_date?: string;
  variants: Array<{
    menudetails_id?: number;
    variant_type: string;
    rate: number;
  }>;
  addons: Array<{
    menuaddon_id?: number;
    addon_id: number;
  }>;
}

export interface CreateMenuItemResponse {
  message: string;
  menu_id: number;
}

export interface UpdateMenuItemResponse {
  message: string;
}

export interface DeleteMenuItemResponse {
  message: string;
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
};

// Get single menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw new Error('Failed to fetch menu item');
  }
};

// Create new menu item
export const createMenuItem = async (itemData: MenuItem): Promise<CreateMenuItemResponse> => {
  try {
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw new Error('Failed to create menu item');
  }
};

// Update menu item
export const updateMenuItem = async (id: number, itemData: MenuItem): Promise<UpdateMenuItemResponse> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item');
  }
};

// Delete menu item
export const deleteMenuItem = async (id: number): Promise<DeleteMenuItemResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Failed to delete menu item');
  }
};

export default {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
