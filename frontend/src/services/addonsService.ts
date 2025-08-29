import axios from 'axios';
import API_CONFIG from '../config/api';

const API_URL = `${API_CONFIG.BASE_URL}/addons`;

export interface AddonItem {
  addon_id?: number;
  addon_name: string;
  description: string;
}

export interface CreateAddonResponse {
  message: string;
  addon_id: number;
}

export interface UpdateAddonResponse {
  message: string;
}

export interface DeleteAddonResponse {
  message: string;
}

// Get all addons
export const getAllAddons = async (): Promise<AddonItem[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching addons:', error);
    throw new Error('Failed to fetch addons');
  }
};

// Get single addon by ID
export const getAddonById = async (id: number): Promise<AddonItem> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching addon:', error);
    throw new Error('Failed to fetch addon');
  }
};

// Create new addon
export const createAddon = async (itemData: AddonItem): Promise<CreateAddonResponse> => {
  try {
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating addon:', error);
    throw new Error('Failed to create addon');
  }
};

// Update addon
export const updateAddon = async (id: number, itemData: AddonItem): Promise<UpdateAddonResponse> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating addon:', error);
    throw new Error('Failed to update addon');
  }
};

// Delete addon
export const deleteAddon = async (id: number): Promise<DeleteAddonResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting addon:', error);
    throw new Error('Failed to delete addon');
  }
};

export default {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon
};
