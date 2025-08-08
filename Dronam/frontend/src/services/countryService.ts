import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface Country {
  id: number;
  name: string;
  code: string;
  capital?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCountryData {
  name: string;
  code: string;
  capital?: string;
}

export interface UpdateCountryData {
  name: string;
  code: string;
  capital?: string;
}

export const countryService = {
  // Get all countries
  getAll: async (): Promise<Country[]> => {
    return apiService.get<Country[]>(API_ENDPOINTS.COUNTRIES.GET_ALL);
  },

  // Get country by ID
  getById: async (id: string): Promise<Country> => {
    return apiService.get<Country>(API_ENDPOINTS.COUNTRIES.GET_BY_ID(id));
  },

  // Create new country
  create: async (data: CreateCountryData): Promise<Country> => {
    return apiService.post<Country>(API_ENDPOINTS.COUNTRIES.CREATE, data);
  },

  // Update country
  update: async (id: string, data: UpdateCountryData): Promise<{ message: string }> => {
    return apiService.put<{ message: string }>(API_ENDPOINTS.COUNTRIES.UPDATE(id), data);
  },

  // Delete country
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.COUNTRIES.DELETE(id));
  },
};