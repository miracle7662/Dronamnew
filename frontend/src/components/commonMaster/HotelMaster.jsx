import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  InputGroup,
  Pagination,
  Tab,
  Tabs,
  Spinner,
  Stack
} from 'react-bootstrap';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  Phone,
  MapPin,
  Flag,
  Mail,
  User,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const HotelMaster = () => {
  const { user } = useAuthContext();
  const [hotels, setHotels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    hotel_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    country_id: '',
    state_id: '',
    district_id: '',
    zone_id: '',
    hotel_type: '',
    gst_no: '',
    pan_no: '',
    aadhar_no: '',
    owner_name: '',
    owner_mobile: '',
    hotel_timeMorning: '',
    hotel_timeEvening: '',
    status: 1,
    created_by_id: user?.id || null,
    updated_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadHotels(),
          loadCountries(),
          loadStates(),
          loadDistricts(),
          loadZones()
        ]);
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Initial data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/hotels');
      setHotels(response.data);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to load hotels');
    }
  };

  const loadCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/countries');
      setCountries(response.data);
    } catch (err) {
      throw new Error('Failed to load countries');
    }
  };

  const loadStates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/states');
      setStates(response.data);
    } catch (err) {
      throw new Error('Failed to load states');
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/districts');
      setDistricts(response.data);
    } catch (err) {
      throw new Error('Failed to load districts');
    }
  };

  const loadZones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/zones');
      setZones(response.data);
    } catch (err) {
      throw new Error('Failed to load zones');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hotel_name.trim()) {
      newErrors.hotel_name = 'Hotel name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!editingHotel && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
    }
    
    if (!formData.state_id) {
      newErrors.state_id = 'State is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (editingHotel) {
        await axios.put(`http://localhost:3001/api/hotels/${editingHotel.hotelid}`, {
          ...formData,
          updated_by_id: user?.id || null
        });
      } else {
        await axios.post('http://localhost:3001/api/hotels', {
          ...formData,
          created_by_id: user?.id || null
        });
      }
      await loadHotels();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save hotel');
      console.error('Save hotel error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      hotel_name: hotel.hotel_name || '',
      email: hotel.email || '',
      password: '',
      phone: hotel.phone || '',
      address: hotel.address || '',
      country_id: hotel.country_id || '',
      state_id: hotel.state_id || '',
      district_id: hotel.district_id || '',
      zone_id: hotel.zone_id || '',
      hotel_type: hotel.hotel_type || '',
      gst_no: hotel.gst_no || '',
      pan_no: hotel.pan_no || '',
      aadhar_no: hotel.aadhar_no || '',
      owner_name: hotel.owner_name || '',
      owner_mobile: hotel.owner_mobile || '',
      hotel_timeMorning: hotel.hotel_timeMorning || '',
      hotel_timeEvening: hotel.hotel_timeEvening || '',
      status: hotel.status !== undefined ? hotel.status : 1,
      created_by_id: hotel.created_by_id || null,
      updated_by_id: hotel.updated_by_id || null
    });
    setShowModal(true);
  };

  const handleDelete = (hotel) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    
    setLoading(true);
    setError('');
    
    try {
      await axios.delete(`http://localhost:3001/api/hotels/${hotelToDelete.hotelid}`);
      await loadHotels();
      setShowDeleteModal(false);
      setHotelToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete hotel');
      console.error('Delete hotel error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHotel(null);
    setFormData({
      hotel_name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      country_id: '',
      state_id: '',
      district_id: '',
      zone_id: '',
      hotel_type: '',
      gst_no: '',
      pan_no: '',
      aadhar_no: '',
      owner_name: '',
      owner_mobile: '',
      hotel_timeMorning: '',
      hotel_timeEvening: '',
      status: 1,
      created_by_id: user?.id || null,
      updated_by_id: null
    });
    setErrors({});
  };

  const filteredHotels = hotels.filter(hotel => {
    if (!hotel) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (hotel.hotel_name?.toLowerCase().includes(searchLower) || '') ||
      (hotel.email?.toLowerCase().includes(searchLower) || '') ||
      (hotel.phone?.toLowerCase().includes(searchLower) || '') ||
      (hotel.owner_name?.toLowerCase().includes(searchLower) || '')
    );
  });

  const getFilteredHotelsByStatus = (status) => {
    return filteredHotels.filter(hotel => 
      status === 'all' ? true : hotel.status === (status === 'active' ? 1 : 0)
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = getFilteredHotelsByStatus(activeTab).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(getFilteredHotelsByStatus(activeTab).length / itemsPerPage);

  const getHotelStatusBadge = (status) => {
    return status === 1 ? 'success' : 'secondary';
  };

  const getCountryName = (countryId) => {
    const country = countries.find(c => c.country_id === countryId);
    return country ? country.country_name : 'N/A';
  };

  const getStateName = (stateId) => {
    const state = states.find(s => s.state_id === stateId);
    return state ? state.state_name : 'N/A';
  };

  const getDistrictName = (districtId) => {
    const district = districts.find(d => d.district_id === districtId);
    return district ? district.district_name : 'N/A';
  };

  if (loading && hotels.length === 0) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading hotels data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Building className="me-2" size={24} />
                Hotel Master
              </h2>
              <p className="text-muted mb-0">Manage hotels and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Hotel
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setCurrentPage(1);
            }}
            className="mb-0"
            fill
          >
            <Tab eventKey="all" title={`All (${getFilteredHotelsByStatus('all').length})`} />
            <Tab eventKey="active" title={`Active (${getFilteredHotelsByStatus('active').length})`} />
            <Tab eventKey="inactive" title={`Inactive (${getFilteredHotelsByStatus('inactive').length})`} />
          </Tabs>

          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Table hover className="mb-0">
              <thead className="table-light sticky-top bg-white" style={{ zIndex: 1 }}>
                <tr>
                  <th style={{ minWidth: '50px' }}>#</th>
                  <th style={{ minWidth: '200px' }}>Hotel</th>
                  <th style={{ minWidth: '150px' }}>Contact</th>
                  <th style={{ minWidth: '250px' }}>Address</th>
                  <th style={{ minWidth: '200px' }}>Location</th>
                  <th style={{ minWidth: '150px' }}>Owner Details</th>
                  <th style={{ minWidth: '120px' }}>Documents</th>
                  <th style={{ minWidth: '100px' }}>Status</th>
                  <th style={{ minWidth: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentHotels.length > 0 ? (
                  currentHotels.map((hotel, index) => (
                    <tr key={hotel.hotelid}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <Building size={16} className="text-muted" />
                          </div>
                          <div>
                            <strong>{hotel.hotel_name}</strong>
                            <br />
                            <small className="text-muted">{hotel.hotel_type}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <Mail size={14} className="text-muted me-1" />
                          {hotel.email}
                        </div>
                        <div>
                          <Phone size={14} className="text-muted me-1" />
                          {hotel.phone || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <MapPin size={14} className="text-muted me-1" />
                          <span className="text-truncate" style={{ maxWidth: '200px' }}>
                            {hotel.address || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <Flag size={14} className="text-muted me-1" />
                          {getCountryName(hotel.country_id)}
                        </div>
                        <div>
                          <MapPin size={14} className="text-muted me-1" />
                          {getStateName(hotel.state_id)}
                        </div>
                        <div>
                          <MapPin size={14} className="text-muted me-1" />
                          {getDistrictName(hotel.district_id)}
                        </div>
                      </td>
                      <td>
                        <div>
                          <User size={14} className="text-muted me-1" />
                          {hotel.owner_name || 'N/A'}
                        </div>
                        <div>
                          <Phone size={14} className="text-muted me-1" />
                          {hotel.owner_mobile || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {hotel.gst_no && (
                            <div>
                              <CreditCard size={14} className="text-muted me-1" />
                              GST: {hotel.gst_no}
                            </div>
                          )}
                          {hotel.pan_no && (
                            <div>
                              <CreditCard size={14} className="text-muted me-1" />
                              PAN: {hotel.pan_no}
                            </div>
                          )}
                          {hotel.aadhar_no && (
                            <div>
                              <Shield size={14} className="text-muted me-1" />
                              Aadhar: {hotel.aadhar_no}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getHotelStatusBadge(hotel.status)}>
                          {hotel.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-info"
                            onClick={() => handleEdit(hotel)}
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(hotel)}
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      <Building size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No hotels found</h5>
                      <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first hotel to get started'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {!loading && currentHotels.length > 0 && (
            <Stack
              className="p-2 border-top d-flex flex-row align-items-center justify-content-between"
              style={{ gap: '6px', padding: '8px 12px' }}
            >
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page on page size change
                }}
                style={{
                  borderRadius: '4px',
                  padding: '2px 4px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  cursor: 'pointer',
                  width: '80px',
                  height: '24px',
                }}
              >
                {[10, 20, 30].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <Pagination
                className="m-0"
                style={{ display: 'flex', alignItems: 'center', gap: '0px', marginRight: '20px' }}
              >
                <Pagination.Prev
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  aria-label="Previous page"
                  style={{
                    color: currentPage === 1 || loading ? '#d3d3d3' : '#6c757d',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                >
                  <i className="fi fi-rr-angle-left" style={{ fontSize: '12px' }} />
                </Pagination.Prev>
                <Pagination.Item active>
                  {currentPage}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  aria-label="Next page"
                  style={{
                    color: currentPage === totalPages || loading ? '#d3d3d3' : '#6c757d',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                >
                  <i className="fi fi-rr-angle-right" style={{ fontSize: '12px' }} />
                </Pagination.Next>
              </Pagination>
            </Stack>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hotel Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_name"
                    value={formData.hotel_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.hotel_name}
                    placeholder="Enter hotel name"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hotel_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hotel Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_type"
                    value={formData.hotel_type}
                    onChange={handleInputChange}
                    placeholder="Enter hotel type"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password {!editingHotel && '*'}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    disabled={loading}
                    required={!editingHotel}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.country_id}
                    disabled={loading}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.country_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.state_id}
                    disabled={loading}
                  >
                    <option value="">Select State</option>
                    {states
                      .filter(state => state.country_id == formData.country_id)
                      .map(state => (
                        <option key={state.state_id} value={state.state_id}>
                          {state.state_name}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.state_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select District</option>
                    {districts
                      .filter(district => district.state_id == formData.state_id)
                      .map(district => (
                        <option key={district.district_id} value={district.district_id}>
                          {district.district_name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone</Form.Label>
                  <Form.Select
                    name="zone_id"
                    value={formData.zone_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select Zone</option>
                    {zones.map(zone => (
                      <option key={zone.zone_id} value={zone.zone_id}>
                        {zone.zone_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleInputChange}
                    placeholder="Enter owner name"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner_mobile"
                    value={formData.owner_mobile}
                    onChange={handleInputChange}
                    placeholder="Enter owner mobile"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_no"
                    value={formData.pan_no}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar_no"
                    value={formData.aadhar_no}
                    onChange={handleInputChange}
                    placeholder="Enter Aadhar number"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Morning Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_timeMorning"
                    value={formData.hotel_timeMorning}
                    onChange={handleInputChange}
                    placeholder="Enter morning time"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Evening Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_timeEvening"
                    value={formData.hotel_timeEvening}
                    onChange={handleInputChange}
                    placeholder="Enter evening time"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Saving...</span>
                </>
              ) : editingHotel ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => !loading && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{hotelToDelete?.hotel_name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HotelMaster;