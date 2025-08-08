import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-hot-toast'
import { Preloader } from '@/components/Misc/Preloader'
import { Button, Card, Stack, Table } from 'react-bootstrap'
import TitleHelmet from '@/components/Common/TitleHelmet'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

import { fetchCountries,
   CountryItem, 
  fetchCities, 
  CityItem,
  fetchNationalities,
  NationalityItem,
  fetchCompanies,
  CompanyItem,
} from '@/utils/commonfunction'

interface GuestItem {
  guest_id?: number
  guest_name: string
  organization: string
  address: string
  cityid: number | string
  countryid: number | string
  company_id:number|string
  name:string
  occupation: string
  postHeld: string
  phone1: string
  phone2: string
  mobile_no: string
  fax: string
  office_mail: string
  personal_mail: string
  website: string
  purpose: string
  arrivalFrom: string
  departureTo: string
  creditCard: string
  crCardExpDt: string
  type: string
  gender: string
  nationalityid: number | string
  birthday?: string
  anniversary?: string
  creditAllowed: number
  wantsToFeedDiscount: number
  discountStructure: string
  personalInstructions: string
  adhar_no: string
  pan_no: string
  driving_license: string
  discount: string
  discount_category: string
  created_by_id: string
  created_date: string
  updated_by_id?: string
  updated_date?: string
}

interface AddGuestModalProps {
  show: boolean
  onHide: () => void
  onSuccess: () => void
}

interface EditGuestModalProps {
  show: boolean
  onHide: () => void
  guest: GuestItem | null
  onSuccess: () => void
  onUpdateSelectedGuest: (guest: GuestItem) => void
}

// Debounce utility function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Main GuestMaster Component
const GuestMaster: React.FC = () => {
  const [guests, setGuests] = useState<GuestItem[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredGuests, setFilteredGuests] = useState<GuestItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GuestItem | null>(null)

  const fetchGuests = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3001/api/guest')
      const data = await res.json()
      console.log('Fetched Guests:', data)
      setGuests(data)
      setFilteredGuests(data)
    } catch (err) {
      toast.error('Failed to fetch guests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const columns = useMemo<ColumnDef<GuestItem>[]>(
    () => [
      {
        id: 'srNo',
        header: 'Sr No',
        size: 50,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>,
      },
      {
        accessorKey: 'guest_name',
        header: 'Guest Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'name',
        header: 'Company Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'office_mail',
        header: 'Office Email',
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
              title="Edit Guest">
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteGuest(row.original)}
              title="Delete Guest">
              <i className="fi fi-rr-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredGuests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
      const filteredGuestsBySearch = guests.filter((item) =>
        item.guest_name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredGuests(filteredGuestsBySearch)
    }, 300),
    [guests],
  )

  const handleEditClick = (guest: GuestItem) => {
    setSelectedGuest(guest)
    setShowEditModal(true)
  }

  const handleDeleteGuest = async (guest: GuestItem) => {
    const res = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this guest!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    })
    if (res.isConfirmed) {
      try {
        await fetch(`http://localhost:3001/api/guest/${guest.guest_id}`, { method: 'DELETE' })
        toast.success('Guest deleted successfully')
        fetchGuests()
        setSelectedGuest(null)
      } catch {
        toast.error('Failed to delete guest')
      }
    }
  }

  // AddGuestModal Component
  const AddGuestModal: React.FC<AddGuestModalProps> = ({ show, onHide, onSuccess }) => {
    const [guest_name, setGuestName] = useState('')
    const [organization, setOrganization] = useState('')
    const [address, setAddress] = useState('')
    // const [cityid, setCity] = useState('')
    // const [countryid, setCountry] = useState('')
    const [occupation, setOccupation] = useState('')
    const [postHeld, setPostHeld] = useState('')
    const [phone1, setPhone1] = useState('')
    const [phone2, setPhone2] = useState('')
    const [mobile_no, setMobile] = useState('')
    const [fax, setFax] = useState('')
    const [office_mail, setEmail] = useState('')
    const [personal_mail, setPersonalMail] = useState('')
    const [website, setWebsite] = useState('')
    const [purpose, setPurpose] = useState('')
    const [arrivalFrom, setArrivalFrom] = useState('')
    const [departureTo, setDepartureTo] = useState('')
    const [creditCard, setCreditCard] = useState('')
    const [crCardExpDt, setCrCardExpDt] = useState('')
    const [type, setType] = useState('REGULAR')
    const [gender, setGender] = useState('Male')
    // const [nationalityid, setNationality] = useState('INDIAN')
    const [creditAllowed, setCreditAllowed] = useState(false)
    const [wantsToFeedDiscount, setWantsToFeedDiscount] = useState(false)
    const [discountStructure, setDiscountStructure] = useState('General')
    const [personalInstructions, setPersonalInstructions] = useState('')
    const [adhar_no, setAdharNo] = useState('')
    const [pan_no, setPanNo] = useState('')
    const [driving_license, setDrivingLicense] = useState('')
    const [discount, setDiscount] = useState('')
    const [discount_category, setDiscountCategory] = useState('')
    const [birthday, setBirthday] = useState('') // New state for birthday
    const [anniversary, setAnniversary] = useState('') // New state for anniversary
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countryid, setCountryId] = useState<number | null>(null)
    const [cityid, setCityId] = useState<number | null>(null)
    const [company_id, setCompanyId] = useState<number | null>(null)
    const [nationalityid, setNationalityId] = useState<number | null>(null)
    const [filteredCountries, setFilteredCountries] = useState<CountryItem[]>([])
    const [countryItems, setCountryItems] = useState<CountryItem[]>([])
    const [CityItems, setCityItems] = useState<CityItem[]>([])
    const [CompanyItems, setCompanyItems] = useState<CompanyItem[]>([])
    const [nationalityItems, setNationalityItems] = useState<NationalityItem[]>([])

    useEffect(() => {
      fetchCountries(setCountryItems, setFilteredCountries, setLoading)
      fetchCities(setCityItems, setCityId)
      fetchNationalities(setNationalityItems, setNationalityId)
      fetchCompanies(setCompanyItems, setCompanyId)
    }, [])

    const handleAdd = async () => {
      if (!guest_name) {
        setError('Guest Name is required')
        return
      }
      if (!company_id) {
        setError('Company is required')
        return
      }
      if (!address) {
        setError('Address is required')
        return
      }

      // if (!phone1) {
      //   setError('Phone (1) is required')
      //   return
      // }
      // if (!office_mail) {
      //   setError('Office Email is required')
      //   return
      // }
      // if (!purpose) {
      //   setError('Purpose is required')
      //   return
      // }
      // if (!arrivalFrom) {
      //   setError('Arrival From is required')
      //   return
      // }
      // if (!departureTo) {
      //   setError('Departure To is required')
      //   return
      // }
      setError('')

      setLoading(true)
      try {
        const currentDate = new Date().toISOString()
        const payload: GuestItem = {
          guest_name,
          organization,
          address,
          cityid: cityid ?? '',
          countryid: countryid ?? '',
          company_id: company_id ?? '',
          occupation,
          postHeld,
          phone1,
          phone2,
          mobile_no,
          fax,
          office_mail,
          personal_mail,
          website,
          purpose,
          arrivalFrom,
          departureTo,
          creditCard,
          crCardExpDt,
          type,
          gender,
          nationalityid: nationalityid ?? '',
          birthday,
          anniversary,
          creditAllowed: creditAllowed ? 1 : 0,
          wantsToFeedDiscount: wantsToFeedDiscount ? 1 : 0,
          discountStructure,
          personalInstructions,
          adhar_no,
          pan_no,
          driving_license,
          discount,
          discount_category,
          created_by_id: '1',
          created_date: currentDate,
          name: ''
        }
        const res = await fetch('http://localhost:3001/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('Guest added successfully')
          setGuestName('')
          setOrganization('')
          setAddress('')
          setCityId(null)
          setCountryId(null)
          setCompanyId(null)
          setOccupation('')
          setPostHeld('')
          setPhone1('')
          setPhone2('')
          setMobile('')
          setFax('')
          setEmail('')
          setPersonalMail('')
          setWebsite('')
          setPurpose('')
          setArrivalFrom('')
          setDepartureTo('')
          setCreditCard('')
          setCrCardExpDt('')
          setType('REGULAR')
          setGender('Male')
          setNationalityId(null)
          setCreditAllowed(false)
          setWantsToFeedDiscount(false)
          setDiscountStructure('General')
          setPersonalInstructions('')
          setAdharNo('')
          setPanNo('')
          setDrivingLicense('')
          setDiscount('')
          setDiscountCategory('')
          setBirthday('')
          setAnniversary('')
          onSuccess()
          onHide()
        } else {
          toast.error('Failed to add guest')
        }
      } catch (err) {
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (!show) return null

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
            maxWidth: '850px',
            maxHeight: '950px',
            margin: '100px auto',
            borderRadius: '0',
            background: '#fff',
          }}>
          {error && (
            <div
              className="alert alert-danger py-1"
              style={{ borderRadius: '0', fontSize: '12px' }}>
              {error}
            </div>
          )}
          <div className="row g-1">
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  {/* <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>No</label>
                  <input
                    type="text"
                    className="form-control me-2"
                    style={{ width: '15%', height: '25px', fontSize: '12px', borderRadius: 0, border: '0.5px solid lightgray' }}
                    value={5666}
                  />
                  <span style={{ color: 'red', fontSize: '10px' }}>
                    Load Same Information of Guest Press [ F2 ]
                  </span> */}
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Guest Name"
                    value={guest_name}
                    onChange={(e) => setGuestName(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Organization
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    City
                  </label>

                  <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCityId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '28%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                >
                    <option value="">Select a city</option>
                    {CityItems.filter((city) => String(city.status) === '0') // Only include active cities
                      .map((city) => (
                        <option key={city.cityid} value={city.cityid}>
                          {city.city_name}
                        </option>
                      ))}
                  </select>
                  <label className="me-2 ms-3" style={{ width: '20%', fontSize: '12px' }}>
                    Country
                  </label>
                  <select
                    className="form-control"
                    value={countryid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCountryId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '32%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    >
                    <option value="">Select a country</option>
                    {countryItems.filter((country) => String(country.status) === '0') // Only include active countries
                      .map((country) => (
                        <option key={country.countryid} value={country.countryid}>
                          {country.country_name}
                        </option>
                      ))}
                  </select>
                </div>
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Occupation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Post Held
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Post Held"
                    value={postHeld}
                    onChange={(e) => setPostHeld(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                 
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* Gender and Nationality Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Gender
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '29%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <label className="me-2 ms-3" style={{ width: '20%', fontSize: '12px' }}>
                    Nationality
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={nationalityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setNationalityId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '31%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select Nationality</option>
                    {nationalityItems.map((item) => (
                      <option key={item.nationalityid} value={item.nationalityid}>
                        {item.nationality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Birthday + Anniversary Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="form-control me-2"
                    placeholder="YYYY-MM-DD"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    style={{
                      width: '28%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />

                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Anniversary
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="YYYY-MM-DD"
                    value={anniversary}
                    onChange={(e) => setAnniversary(e.target.value)}
                    style={{
                      width: '30%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Type and Credit Allowed Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Type
                  </label>
                  <select
                    className="form-select form-select-sm me-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: '28%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>REGULAR</option>
                    <option>VIP</option>
                    <option>NEW</option>
                  </select>

                  <div className="d-flex align-items-center" style={{ width: '45%' }}>
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      checked={creditAllowed}
                      onChange={(e) => setCreditAllowed(e.target.checked)}
                      style={{ marginTop: '2px', border: '0.5px solid lightgray' }}
                      disabled={loading}
                    />
                    <label style={{ fontSize: '12px', color: 'blue', cursor: 'pointer' }}>
                      Credit Allowed
                    </label>
                  </div>
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Company
                  </label>
                <select
                    className="form-select form-select-sm"
                    value={company_id ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCompanyId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '83%',
                      height: '32px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select Company</option>
                   
                    {CompanyItems.map((item) => (
                      <option key={item.company_id} value={item.company_id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (1)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone 1"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (2)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone 2"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={mobile_no}
                    onChange={(e) => setMobile(e.target.value)}
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
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Office Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Office Email"
                    value={office_mail}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Personal Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Personal Email"
                    value={personal_mail}
                    onChange={(e) => setPersonalMail(e.target.value)}
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
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '0.5px solid lightgray', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Purpose
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Arrival From
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Arrival From"
                    value={arrivalFrom}
                    onChange={(e) => setArrivalFrom(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Departure To
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Departure To"
                    value={departureTo}
                    onChange={(e) => setDepartureTo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Credit Card
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Credit Card"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Credit Card Exp.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Credit Card Expiry Date"
                    value={crCardExpDt}
                    onChange={(e) => setCrCardExpDt(e.target.value)}
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
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0', marginTop: '-140px' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Adhar No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Adhar No"
                    value={adhar_no}
                    onChange={(e) => setAdharNo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    PAN No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="PAN No"
                    value={pan_no}
                    onChange={(e) => setPanNo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Driving License
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Driving License"
                    value={driving_license}
                    onChange={(e) => setDrivingLicense(e.target.value)}
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
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-2 d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={wantsToFeedDiscount}
                    onChange={(e) => setWantsToFeedDiscount(e.target.checked)}
                    disabled={loading}
                    style={{ border: '0.5px solid lightgray' }}
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    style={{
                      fontSize: '12px',
                      height: '30px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled>
                    Wants to Feed Discount For This Guest [F9]
                  </button>
                </div>
                <fieldset
                  className="border p-2 mb-2"
                  style={{ border: '1px solid black', borderRadius: '0' }}>
                  <div className="mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      disabled={loading}
                      style={{ border: '0.5px solid lightgray' }}
                    />
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'blue',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}>
                      Select Discount Structure As Per
                    </span>
                  </div>
                  <div className="mb-2 d-flex justify-content-around" style={{ fontSize: '12px' }}>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="Company"
                        checked={discountStructure === 'Company'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      Company
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="Guest"
                        checked={discountStructure === 'Guest'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      Guest
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="General"
                        checked={discountStructure === 'General'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      General
                    </div>
                  </div>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Select...</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                  </select>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={discount_category}
                    onChange={(e) => setDiscountCategory(e.target.value)}
                    style={{ fontSize: '12px', borderRadius: 0, border: '0.5px solid lightgray' }}
                    disabled={loading}
                  />
                </fieldset>
                <div className="mb-2 d-flex align-items-start">
                  <label className="me-2" style={{ fontSize: '12px', width: '25%' }}>
                    Personal Instructions:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Personal Instructions"
                    value={personalInstructions}
                    onChange={(e) => setPersonalInstructions(e.target.value)}
                    style={{
                      fontSize: '12px',
                      height: '30px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-2 d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    style={{
                      fontSize: '12px',
                      width: '48%',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    Guest History
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    style={{
                      fontSize: '12px',
                      width: '48%',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    Like Dislike
                  </button>
                </div>
                <div
                  className="border p-2"
                  style={{ background: '#f8f9fa', minHeight: '60px', fontSize: '12px' }}>
                  <div className="d-flex mb-1">
                    {/* <input
                      className="form-control form-control-sm me-2"
                      placeholder="CheckinID"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <input
                      className="form-control form-control-sm me-2"
                      placeholder="Room"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <input
                      className="form-control form-control-sm me-2"
                      placeholder="Guest"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <button className="btn btn-sm btn-light" disabled>
                      Remove
                    </button> */}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <Button
              variant="danger"
              onClick={() => {
                setGuestName('')
                setOrganization('')
                setAddress('')
                setCityId(null)
                setCountryId(null)
                setCompanyId(null)
                setOccupation('')
                setPostHeld('')
                setPhone1('')
                setPhone2('')
                setMobile('')
                setFax('')
                setEmail('')
                setPersonalMail('')
                setWebsite('')
                setPurpose('')
                setArrivalFrom('')
                setDepartureTo('')
                setCreditCard('')
                setCrCardExpDt('')
                setType('REGULAR')
                setGender('Male')
                setNationalityId(null)
                setCreditAllowed(false)
                setWantsToFeedDiscount(false)
                setDiscountStructure('General')
                setPersonalInstructions('')
                setAdharNo('')
                setPanNo('')
                setDrivingLicense('')
                setDiscount('')
                setDiscountCategory('')
                setBirthday('')
                setAnniversary('')
                setError('')
                onHide()
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
    )
  }

  // EditGuestModal Component
  const EditGuestModal: React.FC<EditGuestModalProps> = ({
    show,
    onHide,
    guest,
    onSuccess,
    onUpdateSelectedGuest,
  }) => {
    const [guest_name, setGuestName] = useState('')
    const [organization, setOrganization] = useState('')
    const [address, setAddress] = useState('')
    const [cityid, setCity] = useState('')
    const [countryid, setCountry] = useState('')
    const [occupation, setOccupation] = useState('')
    const [postHeld, setPostHeld] = useState('')
    const [phone1, setPhone1] = useState('')
    const [phone2, setPhone2] = useState('')
    const [mobile_no, setMobile] = useState('')
    const [fax, setFax] = useState('')
    const [office_mail, setEmail] = useState('')
    const [personal_mail, setPersonalMail] = useState('')
    const [website, setWebsite] = useState('')
    const [purpose, setPurpose] = useState('')
    const [arrivalFrom, setArrivalFrom] = useState('')
    const [departureTo, setDepartureTo] = useState('')
    const [creditCard, setCreditCard] = useState('')
    const [crCardExpDt, setCrCardExpDt] = useState('')
    const [type, setType] = useState('REGULAR')
    const [gender, setGender] = useState('Male')
    const [nationalityid, setNationality] = useState('INDIAN')
    const [creditAllowed, setCreditAllowed] = useState(false)
    const [wantsToFeedDiscount, setWantsToFeedDiscount] = useState(false)
    const [discountStructure, setDiscountStructure] = useState('General')
    const [personalInstructions, setPersonalInstructions] = useState('')
    const [adhar_no, setAdharNo] = useState('')
    const [pan_no, setPanNo] = useState('')
    const [driving_license, setDrivingLicense] = useState('')
    const [discount, setDiscount] = useState('')
    const [discount_category, setDiscountCategory] = useState('')
    const [birthday, setBirthday] = useState('') // New state for birthday
    const [anniversary, setAnniversary] = useState('') // New state for anniversary
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countryId, setCountryId] = useState<number | null>(null)
    const [cityId, setCityId] = useState<number | null>(null)
    const [company_id, setCompanyId] = useState<number | null>(null)
     const [nationalityId, setNationalityId] = useState<number | null>(null)
    const [filteredCountries, setFilteredCountries] = useState<CountryItem[]>([])
    const [countryItems, setCountryItems] = useState<CountryItem[]>([])
    const [CityItems, setCityItems] = useState<CityItem[]>([])
    const [CompanyItems, setCompanyItems] = useState<CompanyItem[]>([])
    const [nationalityItems, setNationalityItems] = useState<NationalityItem[]>([])

    useEffect(() => {
      fetchCountries(setCountryItems, setFilteredCountries, setLoading)
      fetchCities(setCityItems, setCityId)
       fetchNationalities(setNationalityItems, setNationalityId)
       fetchCompanies(setCompanyItems, setCompanyId)
    }, [])

    useEffect(() => {
      if (guest) {
        setGuestName(guest.guest_name || '')
        setOrganization(guest.organization || '')
        setAddress(guest.address || '')
        setCity(guest.cityid ? String(guest.cityid) : '')
        setCountry(guest.countryid ? String(guest.countryid):'')
        setCompanyId(guest.company_id !== undefined && guest.company_id !== null && guest.company_id !== '' ? Number(guest.company_id) : null)
        setOccupation(guest.occupation || '')
        setPostHeld(guest.postHeld || '')
        setPhone1(guest.phone1 || '')
        setPhone2(guest.phone2 || '')
        setMobile(guest.mobile_no || '')
        setFax(guest.fax || '')
        setEmail(guest.office_mail || '')
        setPersonalMail(guest.personal_mail || '')
        setWebsite(guest.website || '')
        setPurpose(guest.purpose || '')
        setArrivalFrom(guest.arrivalFrom || '')
        setDepartureTo(guest.departureTo || '')
        setCreditCard(guest.creditCard || '')
        setCrCardExpDt(guest.crCardExpDt || '')
        setType(guest.type || 'REGULAR')
        setGender(guest.gender || 'Male')
        setNationality(guest.nationalityid ?String(guest.nationalityid): '')
        setCreditAllowed(Boolean(guest.creditAllowed))
        setWantsToFeedDiscount(Boolean(guest.wantsToFeedDiscount))
        setDiscountStructure(guest.discountStructure || 'General')
        setPersonalInstructions(guest.personalInstructions || '')
        setAdharNo(guest.adhar_no || '')
        setPanNo(guest.pan_no || '')
        setDrivingLicense(guest.driving_license || '')
        setDiscount(guest.discount || '')
        setDiscountCategory(guest.discount_category || '')
        setBirthday(guest.birthday || '') // Set birthday from guest data
        setAnniversary(guest.anniversary || '') // Set anniversary from guest data
      }
    }, [guest])

    const handleEdit = async () => {
      if (!guest_name) {
        setError('Guest Name is required')
        return
      }
      if (!address) {
        setError('Address is required')
        return
      }

      if (!phone1) {
        setError('Phone (1) is required')
        return
      }
      if (!office_mail) {
        setError('Office Email is required')
        return
      }
      if (!purpose) {
        setError('Purpose is required')
        return
      }
      if (!arrivalFrom) {
        setError('Arrival From is required')
        return
      }
      if (!departureTo) {
        setError('Departure To is required')
        return
      }
      setError('')

      setLoading(true)
      try {
        const currentDate = new Date().toISOString()
        const payload: GuestItem = {
          guest_id: guest?.guest_id,
          guest_name,
          organization,
          address,
          cityid,
          countryid,
          company_id: company_id ?? '',
          occupation,
          postHeld,
          phone1,
          phone2,
          mobile_no,
          fax,
          office_mail,
          personal_mail,
          website,
          purpose,
          arrivalFrom,
          departureTo,
          creditCard,
          crCardExpDt,
          type,
          birthday,
          anniversary,
          gender,
          nationalityid,
          creditAllowed: creditAllowed ? 1 : 0,
          wantsToFeedDiscount: wantsToFeedDiscount ? 1 : 0,
          discountStructure,
          personalInstructions,
          adhar_no,
          pan_no,
          driving_license,
          discount,
          discount_category,
          created_by_id: guest?.created_by_id || '1',
          created_date: guest?.created_date || currentDate,
          updated_by_id: '2',
          updated_date: currentDate,
          name: ''
        }
        const res = await fetch(`http://localhost:3001/api/guest/${guest?.guest_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('Guest updated successfully')
          onSuccess()
          onUpdateSelectedGuest(payload)
          onHide()
        } else {
          toast.error('Failed to update guest')
        }
      } catch (err) {
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (!show || !guest) return null

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
            maxWidth: '850px',
            maxHeight: '950px',
            margin: '100px auto',
            borderRadius: '0',
            background: '#fff',
          }}>
          {error && (
            <div
              className="alert alert-danger py-1"
              style={{ borderRadius: '0', fontSize: '12px' }}>
              {error}
            </div>
          )}
          <div className="row g-1">
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  {/* <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>No</label>
                  <input
                    type="text"
                    className="form-control me-2"
                    style={{ width: '15%', height: '25px', fontSize: '12px', borderRadius: 0, border: '0.5px solid lightgray' }}
                    value={5666}
                  />
                  <span style={{ color: 'red', fontSize: '10px' }}>
                    Load Same Information of Guest Press [ F2 ]
                  </span> */}
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Guest Name"
                    value={guest_name}
                    onChange={(e) => setGuestName(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Organization
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                   <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    City
                  </label>
                 <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCityId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '28%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a city</option>
                    {CityItems.filter((city) => String(city.status) === '0') // Only include active cities
                      .map((city) => (
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
                      const value = e.target.value
                      setCountryId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '32%',
                      height: '33px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select a country</option>
                    {countryItems.filter((country) => String(country.status) === '0') // Only include active countries
                      .map((country) => (
                        <option key={country.countryid} value={country.countryid}>
                          {country.country_name}
                        </option>
                      ))}
                  </select>
                </div>
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Occupation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Post Held
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Post Held"
                    value={postHeld}
                    onChange={(e) => setPostHeld(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  {/* <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>Company</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    value={company_name}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ width: '80%', height: '25px', fontSize: '12px', borderRadius: 0, border: '0.5px solid lightgray' }}
                    disabled={loading}
                  /> */}
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                {/* Gender and Nationality Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Gender
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '29%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <label className="me-2 ms-3" style={{ width: '20%', fontSize: '12px' }}>
                    Nationality
                  </label>
                   <select
                    className="form-select form-select-sm"
                    value={nationalityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setNationalityId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '30%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select Nationality</option>
                    {nationalityItems.map((item) => (
                      <option key={item.nationalityid} value={item.nationalityid}>
                        {item.nationality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Birthday + Anniversary Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="form-control me-2"
                    placeholder="YYYY-MM-DD"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    style={{
                      width: '28%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />

                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Anniversary
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="YYYY-MM-DD"
                    value={anniversary}
                    onChange={(e) => setAnniversary(e.target.value)}
                    style={{
                      width: '30%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Type and Credit Allowed Row */}
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Type
                  </label>
                  <select
                    className="form-select form-select-sm me-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: '28%',
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>REGULAR</option>
                    <option>VIP</option>
                    <option>NEW</option>
                  </select>

                  <div className="d-flex align-items-center" style={{ width: '45%' }}>
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      checked={creditAllowed}
                      onChange={(e) => setCreditAllowed(e.target.checked)}
                      style={{ marginTop: '2px', border: '0.5px solid lightgray' }}
                      disabled={loading}
                    />
                    <label style={{ fontSize: '12px', color: 'blue', cursor: 'pointer' }}>
                      Credit Allowed
                    </label>
                  </div>
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '15%', fontSize: '12px' }}>
                    Company
                  </label>
                   <select
                    className="form-select form-select-sm"
                    value={company_id ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCompanyId(value === '' ? null : Number(value))
                    }}
                    style={{
                      width: '83%',
                      height: '32px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option value="">Select Company</option>
                  
                    {CompanyItems.map((item) => (
                      <option key={item.company_id} value={item.company_id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (1)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone 1"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Phone (2)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone 2"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={mobile_no}
                    onChange={(e) => setMobile(e.target.value)}
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
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Office Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Office Email"
                    value={office_mail}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Personal Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Personal Email"
                    value={personal_mail}
                    onChange={(e) => setPersonalMail(e.target.value)}
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
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '0.5px solid lightgray', borderRadius: '0' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Purpose
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Arrival From
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Arrival From"
                    value={arrivalFrom}
                    onChange={(e) => setArrivalFrom(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Departure To
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Departure To"
                    value={departureTo}
                    onChange={(e) => setDepartureTo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Credit Card
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Credit Card"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Credit Card Exp.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Credit Card Expiry Date"
                    value={crCardExpDt}
                    onChange={(e) => setCrCardExpDt(e.target.value)}
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
              </fieldset>
            </div>
            <div className="col-md-6 text-end">
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0', marginTop: '-140px' }}>
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Adhar No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Adhar No"
                    value={adhar_no}
                    onChange={(e) => setAdharNo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    PAN No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="PAN No"
                    value={pan_no}
                    onChange={(e) => setPanNo(e.target.value)}
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
                <div className="mb-1 d-flex align-items-center">
                  <label className="me-2" style={{ width: '20%', fontSize: '12px' }}>
                    Driving License
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Driving License"
                    value={driving_license}
                    onChange={(e) => setDrivingLicense(e.target.value)}
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
              </fieldset>
              <fieldset
                className="border p-2 mb-2"
                style={{ border: '1px solid black', borderRadius: '0' }}>
                <div className="mb-2 d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={wantsToFeedDiscount}
                    onChange={(e) => setWantsToFeedDiscount(e.target.checked)}
                    disabled={loading}
                    style={{ border: '0.5px solid lightgray' }}
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    style={{
                      fontSize: '12px',
                      height: '30px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled>
                    Wants to Feed Discount For This Guest [F9]
                  </button>
                </div>
                <fieldset
                  className="border p-2 mb-2"
                  style={{ border: '1px solid black', borderRadius: '0' }}>
                  <div className="mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      disabled={loading}
                      style={{ border: '0.5px solid lightgray' }}
                    />
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'blue',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}>
                      Select Discount Structure As Per
                    </span>
                  </div>
                  <div className="mb-2 d-flex justify-content-around" style={{ fontSize: '12px' }}>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="Company"
                        checked={discountStructure === 'Company'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      Company
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="Guest"
                        checked={discountStructure === 'Guest'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      Guest
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="discountStructure"
                        className="form-check-input me-1"
                        value="General"
                        checked={discountStructure === 'General'}
                        onChange={(e) => setDiscountStructure(e.target.value)}
                        disabled={loading}
                        style={{ border: '0.5px solid lightgray' }}
                      />
                      General
                    </div>
                  </div>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{
                      height: '25px',
                      fontSize: '12px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    <option>Select...</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                  </select>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={discount_category}
                    onChange={(e) => setDiscountCategory(e.target.value)}
                    style={{ fontSize: '12px', borderRadius: 0, border: '0.5px solid lightgray' }}
                    disabled={loading}
                  />
                </fieldset>
                <div className="mb-2 d-flex align-items-start">
                  <label className="me-2" style={{ fontSize: '12px', width: '25%' }}>
                    Personal Instructions:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Personal Instructions"
                    value={personalInstructions}
                    onChange={(e) => setPersonalInstructions(e.target.value)}
                    style={{
                      fontSize: '12px',
                      height: '30px',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="mb-2 d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    style={{
                      fontSize: '12px',
                      width: '48%',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    Guest History
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    style={{
                      fontSize: '12px',
                      width: '48%',
                      borderRadius: 0,
                      border: '0.5px solid lightgray',
                    }}
                    disabled={loading}>
                    Like Dislike
                  </button>
                </div>
                <div
                  className="border p-2"
                  style={{ background: '#f8f9fa', minHeight: '60px', fontSize: '12px' }}>
                  <div className="d-flex mb-1">
                    {/* <input
                      className="form-control form-control-sm me-2"
                      placeholder="CheckinID"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <input
                      className="form-control form-control-sm me-2"
                      placeholder="Room"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <input
                      className="form-control form-control-sm me-2"
                      placeholder="Guest"
                      disabled
                      style={{ width: '25%', fontSize: '12px' }}
                    />
                    <button className="btn btn-sm btn-light" disabled>
                      Remove
                    </button> */}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <Button
              variant="danger"
              onClick={() => {
                setGuestName('')
                setOrganization('')
                setAddress('')
                setCity('')
                setCountry('')
                setCompanyId(null)
                setOccupation('')
                setPostHeld('')
                setPhone1('')
                setPhone2('')
                setMobile('')
                setFax('')
                setEmail('')
                setPersonalMail('')
                setWebsite('')
                setPurpose('')
                setArrivalFrom('')
                setDepartureTo('')
                setCreditCard('')  
                setCrCardExpDt('')
                setType('REGULAR')
                setGender('Male')
                setNationality('INDIAN')
                setCreditAllowed(false)
                setWantsToFeedDiscount(false)
                setDiscountStructure('General')
                setPersonalInstructions('')
                setAdharNo('')
                setPanNo('')
                setDrivingLicense('')
                setDiscount('')
                setDiscountCategory('')
                setBirthday('')
                setAnniversary('')
                setError('')
                onHide()
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
    )
  }

  return (
    <>
      <TitleHelmet title="Guests List" />
      <Card className="m-1">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="mb-0">Guests</h4>
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Guest Name"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
            />
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus"></i> Add Guest
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
      <AddGuestModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={fetchGuests}
      />
      <EditGuestModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        guest={selectedGuest}
        onSuccess={fetchGuests}
        onUpdateSelectedGuest={setSelectedGuest}
      />
    </>
  )
}

export default GuestMaster
