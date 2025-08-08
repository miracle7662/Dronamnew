// API Configuration
const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    TIMEOUT: 10000, // 10 seconds
    HEADERS: {
      'Content-Type': 'application/json',
    },
  };
  
  // API Endpoints
  export const API_ENDPOINTS = {
    // Countries
    COUNTRIES: {
      GET_ALL: '/countries',
      GET_BY_ID: (id: string) => `/countries/${id}`,
      CREATE: '/countries',
      UPDATE: (id: string) => `/countries/${id}`,
      DELETE: (id: string) => `/countries/${id}`,
    },
    
    // States
    STATES: {
      GET_ALL: '/states',
      GET_BY_ID: (id: string) => `/states/${id}`,
      GET_BY_COUNTRY: (countryId: string) => `/states/country/${countryId}`,
      CREATE: '/states',
      UPDATE: (id: string) => `/states/${id}`,
      DELETE: (id: string) => `/states/${id}`,
    },
    
    // Districts
    DISTRICTS: {
      GET_ALL: '/districts',
      GET_BY_ID: (id: string) => `/districts/${id}`,
      GET_BY_STATE: (stateId: string) => `/districts/state/${stateId}`,
      CREATE: '/districts',
      UPDATE: (id: string) => `/districts/${id}`,
      DELETE: (id: string) => `/districts/${id}`,
    },
    
    // Zones
    ZONES: {
      GET_ALL: '/zones',
      GET_BY_ID: (id: string) => `/zones/${id}`,
      GET_BY_DISTRICT: (districtId: string) => `/zones/district/${districtId}`,
      CREATE: '/zones',
      UPDATE: (id: string) => `/zones/${id}`,
      DELETE: (id: string) => `/zones/${id}`,
    },
  };
  
  export default API_CONFIG;