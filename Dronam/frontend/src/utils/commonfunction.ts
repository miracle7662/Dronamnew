// src/utils/masterFetchers.ts

import { toast } from 'react-toastify';


export interface CountryItem {
  countryid: number;
  country_name: string;
  country_code: string;
  status: number | string;

  
}
export interface StateItem {
  
  stateid: number;
  state_name: string;
  status: number | string;

  
} 
export interface CityItem {
  cityid: number;
  city_name: string;
  stateid: number;
    status: number | string;
}

export interface BlockItem{
  blockid: number;
  block_name: string;
  status: number | string;

}

export interface FloorItem{
  floorid: number;
  floor_name: string;
   status: number | string
}


export interface NationalityItem {
  nationalityid: number;
  nationality:string;
  status: number | string;
}

export interface CompanyItem {
  company_id: number;
  name: string;
}

 export interface FeatureItem {
  featureid: number;
  feature_name: string;
  status: number | string;
  }
export const fetchNationalities = async (
  setNationalities: (data: NationalityItem[]) => void,
  setNationalityId?: (id: number) => void
) => {
  try {
    const res = await fetch('http://localhost:3001/api/nationality');
    const data: NationalityItem[] = await res.json();
    setNationalities(data);
    if (data.length > 0 && setNationalityId) {
      setNationalityId(data[0].nationalityid);
    }
  } catch (err) {
    toast.error('Failed to fetch nationalities');
    console.error('Fetch nationalities error:', err);
  }
}

export const fetchStates = async (
  setStates: (data: StateItem[]) => void,
  setstateid: (id: number) => void,
  currentStateId?: number
) => {
  try {
    const res = await fetch('http://localhost:3001/api/states');
    const data: StateItem[] = await res.json();
    setStates(data);
    if (data.length > 0 && !currentStateId) {
      setstateid(data[0].stateid);
    }
  } catch (err) {
    toast.error('Failed to fetch states');
    console.error('Fetch states error:', err);
  }
};



export const fetchCities = async (
  setCityItems: (data: CityItem[]) => void,
  setCityId?: (id: number) => void
) => {
  try {
    const res = await fetch('http://localhost:3001/api/cities');
    const data: CityItem[] = await res.json();
    setCityItems(data);
    if (data.length > 0 && setCityId) {
      setCityId(data[0].cityid);
    }
  } catch (err) {
    toast.error('Failed to fetch cities');
    console.error('Fetch cities error:', err);
  }
};

export const fetchCountries = async (
  setCountryItems: (data: CountryItem[]) => void,
  setFilteredCountries?: (data: CountryItem[]) => void,
  setLoading?: (loading: boolean) => void
) => {
  try {
    setLoading?.(true);
    const res = await fetch('http://localhost:3001/api/countries');
    const data: CountryItem[] = await res.json();
    setCountryItems(data);
    setFilteredCountries?.(data);
  } catch (err) {
    toast.error('Failed to fetch countries');
    console.error('Fetch countries error:', err);
  } finally {
    setLoading?.(false);
  }
};






export const fetchBlocks = async (
  setBlocks: (data: BlockItem[]) => void,
  setblockid: (id: number) => void,
  currentBlockId?: number
) => {
  try {
    const res = await fetch('http://localhost:3001/api/blocks');
    const data: BlockItem[] = await res.json();
    setBlocks(data);
    if (data.length > 0 && !currentBlockId) {
      setblockid(data[0].blockid);
    }
  } catch (err) {
    toast.error('Failed to fetch blocks');
    console.error('Fetch states error:', err);
  }
};


export const fetchFloors = async (
  setFloors: (data: FloorItem[]) => void,
  setfloorid: (id: number) => void,
  currentFloorId?: number
) => {
  try {
    const res = await fetch('http://localhost:3001/api/floors');
    const data: FloorItem[] = await res.json();
    setFloors(data);
    if (data.length > 0 && !currentFloorId) {
      setfloorid(data[0].floorid);
    }
  } catch (err) {
    toast.error('Failed to fetch floors');
    console.error('Fetch states error:', err);
  }
};


export const fetchCompanies = async (
  setCompanies: (data: CompanyItem[]) => void,
  setCompanyId: (id: number) => void,
  currentCompanyId?: number
) => {
  try {
    const res = await fetch('http://localhost:3001/api/company');
    const data: CompanyItem[] = await res.json();
    setCompanies(data);
    if (data.length > 0 && !currentCompanyId) {
      setCompanyId(data[0].company_id);
    }
  } catch (err) {
    toast.error('Failed to fetch companies');
    console.error('Fetch companies error:', err);
  }
};


export const fetchFeatures = async (
  setFeatures: (data: FeatureItem[]) => void,
  setFeatureId: (id: number) => void,
  currentFeatureId?: number
) => {
  try {
    const res = await fetch('http://localhost:3001/api/features');
    const data: FeatureItem[] = await res.json();
    setFeatures(data);
    if (data.length > 0 && !currentFeatureId) {
      setFeatureId(data[0].featureid);
    }
  } catch (err) {
    toast.error('Failed to fetch features');
    console.error('Fetch features error:', err);
  }
};

