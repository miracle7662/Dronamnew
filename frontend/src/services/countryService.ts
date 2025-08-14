import axios from 'axios';

const API_BASE_URL = '/api/countries';

export const countryService = {
  getAll: async () => {
    console.log('countryService.getAll called');
    const response = await axios.get(API_BASE_URL);
    console.log('countryService.getAll response:', response);
    return response.data;
  },

  create: async (countryData: any) => {
    console.log('countryService.create called with:', countryData);
    const response = await axios.post(API_BASE_URL, countryData);
    console.log('countryService.create response:', response);
    return response.data;
  },

  update: async (id: number, countryData: any) => {
    console.log('countryService.update called with id:', id, 'data:', countryData);
    const response = await axios.put(API_BASE_URL + '/' + id, countryData);
    console.log('countryService.update response:', response);
    return response.data;
  },

  delete: async (id: number) => {
    console.log('countryService.delete called with id:', id);
    const response = await axios.delete(API_BASE_URL + '/' + id);
    console.log('countryService.delete response:', response);
    return response.data;
  }
};
