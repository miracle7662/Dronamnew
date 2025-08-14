import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface State {
  id: number;
  name: string;
  code: string;
  capital?: string;
  country_id: number;
  country_name?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStateData {
  name: string;
  code: string;
  capital?: string;
  country_id: number;
}

export interface UpdateStateData {
  name: string;
  code: string;
  capital?: string;
  country_id: number;
}

export const stateService = {
  // Get all states
  getAll: async (): Promise<State[]> => {
    return apiService.get<State[]>(API_ENDPOINTS.STATES.GET_ALL);
  },

  // Get states by country
  getByCountry: async (countryId: string): Promise<State[]> => {
    return apiService.get<State[]>(API_ENDPOINTS.STATES.GET_BY_COUNTRY(countryId));
  },

  // Get state by ID
  getById: async (id: string): Promise<State> => {
    return apiService.get<State>(API_ENDPOINTS.STATES.GET_BY_ID(id));
  },

  // Create new state
  create: async (data: CreateStateData): Promise<State> => {
    return apiService.post<State>(API_ENDPOINTS.STATES.CREATE, data);
  },

  // Update state
  update: async (id: string, data: UpdateStateData): Promise<{ message: string }> => {
    return apiService.put<{ message: string }>(API_ENDPOINTS.STATES.UPDATE(id), data);
  },

  // Delete state
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.STATES.DELETE(id));
  },
};