import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { Preloader } from '@/components/Misc/Preloader';
import { Button, Card, Stack, Table } from 'react-bootstrap';
import TitleHelmet from '@/components/Common/TitleHelmet';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

import { fetchCountries, CountryItem, fetchCities, CityItem } from '@/utils/commonfunction';

interface CompanyItem {
  company_id?: number;
  title: string;
  name: string;
  display_name: string;
  establishment_date: string;
  address: string;
  cityid: number | string;
  countryid: number | string;
  phone1: string;
  phone2: string;
  fax: string;
  mobile: string;
  email: string;
  website: string;
  booking_contact_name: string;
  booking_contact_mobile: string;
  booking_contact_phone: string;
  corresponding_contact_name: string;
  corresponding_contact_mobile: string;
  corresponding_contact_phone: string;
  credit_limit: string;
  has_discount: boolean;
  discount_office: string;
  discount_office_percentage: string;
  discount_food: string;
  discount_food_percentage: string;
  created_by_id: string;
  created_date: string;
  updated_by_id?: string;
  updated_date?: string;
}

interface AddCompanyModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface EditCompanyModalProps {
  show: boolean;
  onHide: () => void;
  company: CompanyItem | null;
  onSuccess: () => void;
  onUpdateSelectedCompany: (company: CompanyItem) => void;
}

// Debounce utility function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Main CompanyMaster Component
const CompanyMaster: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/company');
      const data = await res.json();
      console.log('Fetched Companies:', data);
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (err) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = useMemo<ColumnDef<CompanyItem>[]>(
    () => [
      {
        id: 'srNo',
        header: 'Sr No',
        size: 50,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>,
      },
      {
        accessorKey: 'name',
        header: 'Company Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'display_name',
        header: 'Display Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'establishment_date',
        header: 'Establishment Date',
        size: 120,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        id: 'actions',
        header: () => <div style={{ textAlign: 'center' }}>Action</div>,
        size: 150,
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditClick(row.original)}
              title="Edit Company">
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteCompany(row.original)}
              title="Remove Company">
              <i className="fi fi-rr-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredCompanies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      const filteredCompaniesBySearch = companies.filter((item) =>
        item.display_name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredCompanies(filteredCompaniesBySearch);
    }, 300),
    [companies],
  );

  const handleEditClick = (company: CompanyItem) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteCompany = async (company: CompanyItem) => {
    const res = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this company!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    });
    if (res.isConfirmed) {
      try {
        await fetch(`http://localhost:3001/api/company/${company.company_id}`, { method: 'DELETE' });
        toast.success('Company deleted successfully');
        fetchCompanies();
        setSelectedCompany(null);
      } catch {
        toast.error('Failed to delete company');
      }
    }
  };

  // AddCompanyModal Component
  const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ show, onHide, onSuccess }) => {
    const [title, setTitle] = useState('Mr');
    const [name, setLastName] = useState('');
    const [display_name, setDisplayName] = useState('');
    const [establishment_date, setEstablishmentDate] = useState('');
    const [address, setAddress] = useState('');
    const [cityid, setCityId] = useState<number | null>(null);
    const [countryid, setCountryId] = useState<number | null>(null);
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [fax, setFax] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [booking_contact_name, setBookingContactName] = useState('');
    const [booking_contact_mobile, setBookingContactMobile] = useState('');
    const [booking_contact_phone, setBookingContactPhone] = useState('');
    const [corresponding_contact_name, setCorrespondingContactName] = useState('');
    const [corresponding_contact_mobile, setCorrespondingContactMobile] = useState('');
    const [corresponding_contact_phone, setCorrespondingContactPhone] = useState('');
    const [credit_limit, setCreditLimit] = useState('');
    const [has_discount, setHasDiscount] = useState(false);
    const [discount_office, setDiscountOffice] = useState('FOR ALL CATEGORIES');
    const [discount_office_percentage, setDiscountOfficePercentage] = useState('');
    const [discount_food, setDiscountFood] = useState('Classic Veg');
    const [discount_food_percentage, setDiscountFoodPercentage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countryItems, setCountryItems] = useState<CountryItem[]>([]);
    const [cityItems, setCityItems] = useState<CityItem[]>([]);
    const [officeDiscounts, setOfficeDiscounts] = useState<{ category: string; percentage: string }[]>([]);
    const [foodDiscounts, setFoodDiscounts] = useState<{ category: string; percentage: string }[]>([]);

    useEffect(() => {
      fetchCountries(setCountryItems, () => {}, setLoading);
      fetchCities(setCityItems, () => {});
    }, []);

    const handleAddOfficeDiscount = () => {
      if (discount_office && discount_office_percentage) {
        setOfficeDiscounts([...officeDiscounts, { category: discount_office, percentage: discount_office_percentage }]);
        setDiscountOffice('FOR ALL CATEGORIES');
        setDiscountOfficePercentage('');
      }
    };

    const handleAddFoodDiscount = () => {
      if (discount_food && discount_food_percentage) {
        setFoodDiscounts([...foodDiscounts, { category: discount_food, percentage: discount_food_percentage }]);
        setDiscountFood('Classic Veg');
        setDiscountFoodPercentage('');
      }
    };

    const handleAdd = async () => {
      if (!display_name) {
        setError('Display Name is required');
        return;
      }
      if (!address) {
        setError('Address is required');
        return;
      }
      if (!email) {
        setError('Email is required');
        return;
      }
      setError('');

      setLoading(true);
      try {
        const currentDate = new Date().toISOString();
        const payload: CompanyItem = {
          title,
          name,
          display_name,
          establishment_date,
          address,
          cityid: cityid ?? '',
          countryid: countryid ?? '',
          phone1,
          phone2,
          fax,
          mobile,
          email,
          website,
          booking_contact_name,
          booking_contact_mobile,
          booking_contact_phone,
          corresponding_contact_name,
          corresponding_contact_mobile,
          corresponding_contact_phone,
          credit_limit,
          has_discount,
          discount_office: officeDiscounts.length > 0 ? officeDiscounts[0].category : '',
          discount_office_percentage: officeDiscounts.length > 0 ? officeDiscounts[0].percentage : '',
          discount_food: foodDiscounts.length > 0 ? foodDiscounts[0].category : '',
          discount_food_percentage: foodDiscounts.length > 0 ? foodDiscounts[0].percentage : '',
          created_by_id: '1',
          created_date: currentDate,
        };
        const res = await fetch('http://localhost:3001/api/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success('Company added successfully');
          setTitle('Mr');
          setLastName('');
          setDisplayName('');
          setEstablishmentDate('');
          setAddress('');
          setCityId(null);
          setCountryId(null);
          setPhone1('');
          setPhone2('');
          setFax('');
          setMobile('');
          setEmail('');
          setWebsite('');
          setBookingContactName('');
          setBookingContactMobile('');
          setBookingContactPhone('');
          setCorrespondingContactName('');
          setCorrespondingContactMobile('');
          setCorrespondingContactPhone('');
          setCreditLimit('');
          setHasDiscount(false);
          setDiscountOffice('FOR ALL CATEGORIES');
          setDiscountOfficePercentage('');
          setDiscountFood('Classic Veg');
          setDiscountFoodPercentage('');
          setOfficeDiscounts([]);
          setFoodDiscounts([]);
          onSuccess();
          onHide();
        } else {
          toast.error('Failed to add company');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <div
        className="modal"
        style={{
          display: 'block',
          background: 'rgba(0,0,0,0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <div
          className="modal-content"
          style={{
            padding: '10px',
            maxWidth: '950px',
            maxHeight: '1150px',
            margin: '100px auto',
            borderRadius: '0px',
          }}>
          {error && (
            <div className="alert alert-danger py-1" style={{ borderRadius: '0' }}>
              {error}
            </div>
          )}
          <div className="row g-1">
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* No and Load Info */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    No
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    style={{
                      width: '15%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    value="1709"
                    readOnly
                    disabled={loading}
                  />
                  <span style={{ color: 'red', fontSize: '10px' }}>
                    Load Same Information of Company Press [ F2 ]
                  </span>
                </div>
                {/* Name row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <select
                    className="form-select form-select-sm me-0"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '15%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Ms</option>
                  </select>
                  <input
                    type="text"
                    className="form-control me-0"
                    placeholder="Last Name"
                    value={name}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '65%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Display Name */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Display Name"
                    value={display_name}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Establishment Date */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Establish. Dt
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={establishment_date}
                    onChange={(e) => setEstablishmentDate(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Address */}
                <div className="mb-1 d-flex align-items-start">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '80%',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* City and Country */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    City
                  </label>
                  <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCityId(value === '' ? null : Number(value));
                    }}
                    style={{
                      width: '31%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a city</option>
                    {cityItems.filter((city) => String(city.status) === '0').map((city) => (
                      <option key={city.cityid} value={city.cityid}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Country
                  </label>
                  <select
                    className="form-control"
                    value={countryid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCountryId(value === '' ? null : Number(value));
                    }}
                    style={{
                      width: '31%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a country</option>
                    {countryItems.filter((country) => String(country.status) === '0').map((country) => (
                      <option key={country.countryid} value={country.countryid}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phone 1 */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (1)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone (1)"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Phone 2 */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (2)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone (2)"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Fax */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Fax
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Fax"
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Mobile */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Email */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '80%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Website */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Website
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* Booking Contact Person Section */}
                <div className="mb-2" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  Booking Contact Person :
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking Contact Name"
                    value={booking_contact_name}
                    onChange={(e) => setBookingContactName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Booking Contact Mobile"
                    value={booking_contact_mobile}
                    onChange={(e) => setBookingContactMobile(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                  <label className="me-2" style={{ width: '24%', fontSize: '12px' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking Contact Phone"
                    value={booking_contact_phone}
                    onChange={(e) => setBookingContactPhone(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Corresponding Contact Person Section */}
                <div className="mb-2" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  Corresponding Contact Person :
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Corresponding Contact Name"
                    value={corresponding_contact_name}
                    onChange={(e) => setCorrespondingContactName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder=" Mobile no"
                    value={corresponding_contact_mobile}
                    onChange={(e) => setCorrespondingContactMobile(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                  <label className="me-2" style={{ width: '24%', fontSize: '12px' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone no"
                    value={corresponding_contact_phone}
                    onChange={(e) => setCorrespondingContactPhone(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Credit Limit */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Credit Limit
                  </label>
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Credit Limit"
                    value={credit_limit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Discount Section */}
                <fieldset className="border p-2 mt-2">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="discountCheck"
                      checked={has_discount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      style={{ borderRadius: 0, border: '0.5px solid lightgray' }}
                      disabled={loading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="discountCheck"
                      style={{ fontSize: '12px' }}>
                      Have Discount to this Company?
                    </label>
                  </div>
                  {/* From Office Discount */}
                  <div className="mb-1 d-flex align-items-center">
                    <label style={{ width: '20%', fontSize: '12px' }}>From Office</label>
                    <select
                      className="form-select form-select-sm me-2"
                      value={discount_office}
                      onChange={(e) => setDiscountOffice(e.target.value)}
                      style={{
                        width: '45%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}>
                      <option>FOR ALL CATEGORIES</option>
                      <option>Category 1</option>
                      <option>Category 2</option>
                    </select>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="%"
                      value={discount_office_percentage}
                      onChange={(e) => setDiscountOfficePercentage(e.target.value)}
                      style={{
                        width: '15%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '12px', height: '30px', padding: '0 10px' }}
                      onClick={handleAddOfficeDiscount}
                      disabled={loading || !has_discount}>
                      Add
                    </button>
                  </div>
                  {/* Discount Office Table */}
                  <table className="table table-bordered table-sm" style={{ fontSize: '12px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th>Disc. to.</th>
                        <th>ID</th>
                        <th>Disc in %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officeDiscounts.map((discount, index) => (
                        <tr key={index}>
                          <td>{discount.category}</td>
                          <td>{index + 1}</td>
                          <td>{discount.percentage}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                const updatedDiscounts = officeDiscounts.filter((_, i) => i !== index);
                                setOfficeDiscounts(updatedDiscounts);
                              }}
                              title="Remove Discount"
                              disabled={loading}>
                              <i className="fi fi-rr-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Food & Bev Discount */}
                  <div className="mb-1 d-flex align-items-center">
                    <label style={{ width: '20%', fontSize: '12px' }}>Food & Bev</label>
                    <select
                      className="form-select form-select-sm me-2"
                      value={discount_food}
                      onChange={(e) => setDiscountFood(e.target.value)}
                      style={{
                        width: '45%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}>
                      <option>Classic Veg</option>
                      <option>Non Veg</option>
                      <option>Buffet</option>
                    </select>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="%"
                      value={discount_food_percentage}
                      onChange={(e) => setDiscountFoodPercentage(e.target.value)}
                      style={{
                        width: '15%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '12px', height: '30px', padding: '0 10px' }}
                      onClick={handleAddFoodDiscount}
                      disabled={loading || !has_discount}>
                      Add
                    </button>
                  </div>
                  {/* Discount Food Table */}
                  <table className="table table-bordered table-sm" style={{ fontSize: '12px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th>Disc. to.</th>
                        <th>ID</th>
                        <th>Disc in %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodDiscounts.map((discount, index) => (
                        <tr key={index}>
                          <td>{discount.category}</td>
                          <td>{index + 1}</td>
                          <td>{discount.percentage}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                const updatedDiscounts = foodDiscounts.filter((_, i) => i !== index);
                                setFoodDiscounts(updatedDiscounts);
                              }}
                              title="Remove Discount"
                              disabled={loading}>
                              <i className="fi fi-rr-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </fieldset>
              </fieldset>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <Button
              variant="danger"
              onClick={() => {
                setTitle('Mr');
                setLastName('');
                setDisplayName('');
                setEstablishmentDate('');
                setAddress('');
                setCityId(null);
                setCountryId(null);
                setPhone1('');
                setPhone2('');
                setFax('');
                setMobile('');
                setEmail('');
                setWebsite('');
                setBookingContactName('');
                setBookingContactMobile('');
                setBookingContactPhone('');
                setCorrespondingContactName('');
                setCorrespondingContactMobile('');
                setCorrespondingContactPhone('');
                setCreditLimit('');
                setHasDiscount(false);
                setDiscountOffice('FOR ALL CATEGORIES');
                setDiscountOfficePercentage('');
                setDiscountFood('Classic Veg');
                setDiscountFoodPercentage('');
                setOfficeDiscounts([]);
                setFoodDiscounts([]);
                setError('');
                onHide();
              }}
              style={{ fontSize: '13.5px', marginRight: '10px' }}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleAdd}
              style={{ fontSize: '13.5px' }}
              disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // EditCompanyModal Component
  const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
    show,
    onHide,
    company,
    onSuccess,
    onUpdateSelectedCompany,
  }) => {
    const [title, setTitle] = useState('Mr');
    const [name, setLastName] = useState('');
    const [display_name, setDisplayName] = useState('');
    const [establishment_date, setEstablishmentDate] = useState('');
    const [address, setAddress] = useState('');
    const [cityid, setCityId] = useState<number | null>(null);
    const [countryid, setCountryId] = useState<number | null>(null);
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [fax, setFax] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [booking_contact_name, setBookingContactName] = useState('');
    const [booking_contact_mobile, setBookingContactMobile] = useState('');
    const [booking_contact_phone, setBookingContactPhone] = useState('');
    const [corresponding_contact_name, setCorrespondingContactName] = useState('');
    const [corresponding_contact_mobile, setCorrespondingContactMobile] = useState('');
    const [corresponding_contact_phone, setCorrespondingContactPhone] = useState('');
    const [credit_limit, setCreditLimit] = useState('');
    const [has_discount, setHasDiscount] = useState(false);
    const [discount_office, setDiscountOffice] = useState('FOR ALL CATEGORIES');
    const [discount_office_percentage, setDiscountOfficePercentage] = useState('');
    const [discount_food, setDiscountFood] = useState('Classic Veg');
    const [discount_food_percentage, setDiscountFoodPercentage] = useState('');
    const [loading, setLoading] = useState(false);
    const [countryItems, setCountryItems] = useState<CountryItem[]>([]);
    const [cityItems, setCityItems] = useState<CityItem[]>([]);
    const [officeDiscounts, setOfficeDiscounts] = useState<{ category: string; percentage: string }[]>([]);
    const [foodDiscounts, setFoodDiscounts] = useState<{ category: string; percentage: string }[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
      fetchCountries(setCountryItems, () => {}, setLoading);
      fetchCities(setCityItems, () => {});
    }, []);

    useEffect(() => {
      if (company) {
        setTitle(company.title || 'Mr');
        setLastName(company.name || '');
        setDisplayName(company.display_name || '');
        setEstablishmentDate(company.establishment_date || '');
        setAddress(company.address || '');
        setCityId(company.cityid ? Number(company.cityid) : null);
        setCountryId(company.countryid ? Number(company.countryid) : null);
        setPhone1(company.phone1 || '');
        setPhone2(company.phone2 || '');
        setFax(company.fax || '');
        setMobile(company.mobile || '');
        setEmail(company.email || '');
        setWebsite(company.website || '');
        setBookingContactName(company.booking_contact_name || '');
        setBookingContactMobile(company.booking_contact_mobile || '');
        setBookingContactPhone(company.booking_contact_phone || '');
        setCorrespondingContactName(company.corresponding_contact_name || '');
        setCorrespondingContactMobile(company.corresponding_contact_mobile || '');
        setCorrespondingContactPhone(company.corresponding_contact_phone || '');
        setCreditLimit(company.credit_limit || '');
        setHasDiscount(company.has_discount || false);
        setDiscountOffice(company.discount_office || 'FOR ALL CATEGORIES');
        setDiscountOfficePercentage(company.discount_office_percentage || '');
        setDiscountFood(company.discount_food || 'Classic Veg');
        setDiscountFoodPercentage(company.discount_food_percentage || '');
        setOfficeDiscounts([{ category: company.discount_office || 'FOR ALL CATEGORIES', percentage: company.discount_office_percentage || '' }]);
        setFoodDiscounts([{ category: company.discount_food || 'Classic Veg', percentage: company.discount_food_percentage || '' }]);
      }
    }, [company]);

    const handleAddOfficeDiscount = () => {
      if (discount_office && discount_office_percentage) {
        setOfficeDiscounts([...officeDiscounts, { category: discount_office, percentage: discount_office_percentage }]);
        setDiscountOffice('FOR ALL CATEGORIES');
        setDiscountOfficePercentage('');
      }
    };

    const handleAddFoodDiscount = () => {
      if (discount_food && discount_food_percentage) {
        setFoodDiscounts([...foodDiscounts, { category: discount_food, percentage: discount_food_percentage }]);
        setDiscountFood('Classic Veg');
        setDiscountFoodPercentage('');
      }
    };

    const handleEdit = async () => {
      if (!display_name) {
        setError('Display Name is required');
        return;
      }
      if (!address) {
        setError('Address is required');
        return;
      }
      if (!email) {
        setError('Email is required');
        return;
      }
      setError('');

      setLoading(true);
      try {
        const currentDate = new Date().toISOString();
        const payload: CompanyItem = {
          company_id: company?.company_id,
          title,
          name,
          display_name,
          establishment_date,
          address,
          cityid: cityid ?? '',
          countryid: countryid ?? '',
          phone1,
          phone2,
          fax,
          mobile,
          email,
          website,
          booking_contact_name,
          booking_contact_mobile,
          booking_contact_phone,
          corresponding_contact_name,
          corresponding_contact_mobile,
          corresponding_contact_phone,
          credit_limit,
          has_discount,
          discount_office: officeDiscounts.length > 0 ? officeDiscounts[0].category : '',
          discount_office_percentage: officeDiscounts.length > 0 ? officeDiscounts[0].percentage : '',
          discount_food: foodDiscounts.length > 0 ? foodDiscounts[0].category : '',
          discount_food_percentage: foodDiscounts.length > 0 ? foodDiscounts[0].percentage : '',
          created_by_id: company?.created_by_id || '1',
          created_date: company?.created_date || currentDate,
          updated_by_id: '2',
          updated_date: currentDate,
        };
        const res = await fetch(`http://localhost:3001/api/company/${company?.company_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success('Company updated successfully');
          onSuccess();
          onUpdateSelectedCompany(payload);
          onHide();
        } else {
          toast.error('Failed to update company');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (!show || !company) return null;

    return (
      <div
        className="modal"
        style={{
          display: 'block',
          background: 'rgba(0,0,0,0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <div
          className="modal-content"
          style={{
            padding: '10px',
            maxWidth: '950px',
            maxHeight: '1150px',
            margin: '100px auto',
            borderRadius: '0px',
          }}>
          {error && (
            <div className="alert alert-danger py-1" style={{ borderRadius: '0' }}>
              {error}
            </div>
          )}
          <div className="row g-1">
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* No and Load Info */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    No
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    style={{
                      width: '15%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    value="1709"
                    readOnly
                    disabled={loading}
                  />
                  <span style={{ color: 'red', fontSize: '10px' }}>
                    Load Same Information of Company Press [ F2 ]
                  </span>
                </div>
                {/* Name row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <select
                    className="form-select form-select-sm me-0"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '15%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Ms</option>
                  </select>
                  <input
                    type="text"
                    className="form-control me-0"
                    placeholder="Last Name"
                    value={name}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '65%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Display Name */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Display Name"
                    value={display_name}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Establishment Date */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Establish. Dt
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={establishment_date}
                    onChange={(e) => setEstablishmentDate(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Address */}
                <div className="mb-1 d-flex align-items-start">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '80%',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* City and Country */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    City
                  </label>
                  <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCityId(value === '' ? null : Number(value));
                    }}
                    style={{
                      width: '31%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a city</option>
                    {cityItems.filter((city) => String(city.status) === '0').map((city) => (
                      <option key={city.cityid} value={city.cityid}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Country
                  </label>
                  <select
                    className="form-control"
                    value={countryid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCountryId(value === '' ? null : Number(value));
                    }}
                    style={{
                      width: '31%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a country</option>
                    {countryItems.filter((country) => String(country.status) === '0').map((country) => (
                      <option key={country.countryid} value={country.countryid}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phone 1 */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (1)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone (1)"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Phone 2 */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (2)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone (2)"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Fax */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Fax
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Fax"
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Mobile */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Email */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '80%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Website */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Website
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* Booking Contact Person Section */}
                <div className="mb-2" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  Booking Contact Person :
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking Contact Name"
                    value={booking_contact_name}
                    onChange={(e) => setBookingContactName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Booking Contact Mobile"
                    value={booking_contact_mobile}
                    onChange={(e) => setBookingContactMobile(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                  <label className="me-2" style={{ width: '24%', fontSize: '12px' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking Contact Phone"
                    value={booking_contact_phone}
                    onChange={(e) => setBookingContactPhone(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Corresponding Contact Person Section */}
                <div className="mb-2" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  Corresponding Contact Person :
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Corresponding Contact Name"
                    value={corresponding_contact_name}
                    onChange={(e) => setCorrespondingContactName(e.target.value)}
                    style={{
                      width: '80%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder=" Mobile no"
                    value={corresponding_contact_mobile}
                    onChange={(e) => setCorrespondingContactMobile(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                  <label className="me-2" style={{ width: '24%', fontSize: '12px' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone no"
                    value={corresponding_contact_phone}
                    onChange={(e) => setCorrespondingContactPhone(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Credit Limit */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '29%', fontSize: '12px' }}>
                    Credit Limit
                  </label>
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Credit Limit"
                    value={credit_limit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    style={{
                      width: '40%',
                      height: '30px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Discount Section */}
                <fieldset className="border p-2 mt-2">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="discountCheck"
                      checked={has_discount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      style={{ borderRadius: 0, border: '0.5px solid lightgray' }}
                      disabled={loading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="discountCheck"
                      style={{ fontSize: '12px' }}>
                      Have Discount to this Company?
                    </label>
                  </div>
                  {/* From Office Discount */}
                  <div className="mb-1 d-flex align-items-center">
                    <label style={{ width: '20%', fontSize: '12px' }}>From Office</label>
                    <select
                      className="form-select form-select-sm me-2"
                      value={discount_office}
                      onChange={(e) => setDiscountOffice(e.target.value)}
                      style={{
                        width: '45%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}>
                      <option>FOR ALL CATEGORIES</option>
                      <option>Category 1</option>
                      <option>Category 2</option>
                    </select>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="%"
                      value={discount_office_percentage}
                      onChange={(e) => setDiscountOfficePercentage(e.target.value)}
                      style={{
                        width: '15%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '12px', height: '30px', padding: '0 10px' }}
                      onClick={handleAddOfficeDiscount}
                      disabled={loading || !has_discount}>
                      Add
                    </button>
                  </div>
                  {/* Discount Office Table */}
                  <table className="table table-bordered table-sm" style={{ fontSize: '12px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th>Disc. to.</th>
                        <th>ID</th>
                        <th>Disc in %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officeDiscounts.map((discount, index) => (
                        <tr key={index}>
                          <td>{discount.category}</td>
                          <td>{index + 1}</td>
                          <td>{discount.percentage}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                const updatedDiscounts = officeDiscounts.filter((_, i) => i !== index);
                                setOfficeDiscounts(updatedDiscounts);
                              }}
                              title="Remove Discount"
                              disabled={loading}>
                              <i className="fi fi-rr-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Food & Bev Discount */}
                  <div className="mb-1 d-flex align-items-center">
                    <label style={{ width: '20%', fontSize: '12px' }}>Food & Bev</label>
                    <select
                      className="form-select form-select-sm me-2"
                      value={discount_food}
                      onChange={(e) => setDiscountFood(e.target.value)}
                      style={{
                        width: '45%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}>
                      <option>Classic Veg</option>
                      <option>Non Veg</option>
                      <option>Buffet</option>
                    </select>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="%"
                      value={discount_food_percentage}
                      onChange={(e) => setDiscountFoodPercentage(e.target.value)}
                      style={{
                        width: '15%',
                        height: '30px',
                        fontSize: '12px',
                        borderRadius: 0,
                        border: '0.5px solid lightgray',
                      }}
                      disabled={loading || !has_discount}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '12px', height: '30px', padding: '0 10px' }}
                      onClick={handleAddFoodDiscount}
                      disabled={loading || !has_discount}>
                      Add
                    </button>
                  </div>
                  {/* Discount Food Table */}
                  <table className="table table-bordered table-sm" style={{ fontSize: '12px' }}>
                    <thead className="table-dark">
                      <tr>
                        <th>Disc. to.</th>
                        <th>ID</th>
                        <th>Disc in %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodDiscounts.map((discount, index) => (
                        <tr key={index}>
                          <td>{discount.category}</td>
                          <td>{index + 1}</td>
                          <td>{discount.percentage}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                const updatedDiscounts = foodDiscounts.filter((_, i) => i !== index);
                                setFoodDiscounts(updatedDiscounts);
                              }}
                              title="Remove Discount"
                              disabled={loading}>
                              <i className="fi fi-rr-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </fieldset>
              </fieldset>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <Button
              variant="danger"
              onClick={() => {
                setTitle('Mr');
                setLastName('');
                setDisplayName('');
                setEstablishmentDate('');
                setAddress('');
                setCityId(null);
                setCountryId(null);
                setPhone1('');
                setPhone2('');
                setFax('');
                setMobile('');
                setEmail('');
                setWebsite('');
                setBookingContactName('');
                setBookingContactMobile('');
                setBookingContactPhone('');
                setCorrespondingContactName('');
                setCorrespondingContactMobile('');
                setCorrespondingContactPhone('');
                setCreditLimit('');
                setHasDiscount(false);
                setDiscountOffice('FOR ALL CATEGORIES');
                setDiscountOfficePercentage('');
                setDiscountFood('Classic Veg');
                setDiscountFoodPercentage('');
                setOfficeDiscounts([]);
                setFoodDiscounts([]);
                setError('');
                onHide();
              }}
              style={{ fontSize: '13.5px', marginRight: '10px' }}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleEdit}
              style={{ fontSize: '13.5px' }}
              disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <TitleHelmet title="Companies List" />
      <Card className="m-1">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="mb-0">Companies</h4>
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Company Name"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
            />
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus"></i> Add Company
            </Button>
          </div>
        </div>
        <div className="p-3">
          {loading ? (
            <Stack className="align-items-center justify-content-center flex-grow-1 h-100">
              <Preloader />
            </Stack>
          ) : (
            <Table responsive>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size,
                          textAlign: header.id === 'actions' ? 'left' : 'center',
                        }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ textAlign: cell.column.id === 'actions' ? 'left' : 'center' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
      <AddCompanyModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={fetchCompanies}
      />
      <EditCompanyModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        company={selectedCompany}
        onSuccess={fetchCompanies}
        onUpdateSelectedCompany={setSelectedCompany}
      />
    </>
  );
};

export default CompanyMaster;