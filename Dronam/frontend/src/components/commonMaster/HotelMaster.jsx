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
  Pagination
} from 'react-bootstrap';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building,
  Phone,
  MapPin,
  Flag
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
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hotel_name: '',
    hotel_type: '',
    address: '',
    phone: '',
    country_id: '',
    state_id: '',
    district_id: '',
    zone_id: '',
    gst_no: '',
    pan_no: '',
    aadhar_no: '',
    owner_name: '',
    Owner_mobile: '',
    hotel_timeMorning: '',
    hotel_timeEvening: '',
    status: 1,
    created_by_id: null,
    masteruserid: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadHotels();
    loadCountries();
    loadStates();
    loadDistricts();
    loadZones();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/hotels');
      setHotels(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  };

  const loadStates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/states');
      setStates(response.data);
    } catch (err) {
      console.error('Error loading states:', err);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/districts');
      setDistricts(response.data);
    } catch (err) {
      console.error('Error loading districts:', err);
    }
  };

  const loadZones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/zones');
      setZones(response.data);
    } catch (err) {
      console.error('Error loading zones:', err);
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
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const userId = user?.id || 1;
      if (editingHotel) {
        await axios.put(`http://localhost:3001/api/hotels/${editingHotel.hotelid}`, {
          ...formData,
          updated_by_id: userId
        });
        await loadHotels();
      } else {
        const response = await axios.post('http://localhost:3001/api/hotels', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.hotel) {
          setHotels(prev => [response.data.hotel, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      email: hotel.email,
      password: hotel.password,
      hotel_name: hotel.hotel_name,
      hotel_type: hotel.hotel_type,
      address: hotel.address,
      phone: hotel.phone,
      country_id: hotel.country_id,
      state_id: hotel.state_id,
      district_id: hotel.district_id,
      zone_id: hotel.zone_id,
      gst_no: hotel.gst_no,
      pan_no: hotel.pan_no,
      aadhar_no: hotel.aadhar_no,
      owner_name: hotel.owner_name,
      Owner_mobile: hotel.Owner_mobile,
      hotel_timeMorning: hotel.hotel_timeMorning,
      hotel_timeEvening: hotel.hotel_timeEvening,
      status: hotel.status !== undefined ? hotel.status : 1,
      created_by_id: hotel.created_by_id,
      masteruserid: hotel.masteruserid
    });
    setShowModal(true);
  };

  const handleDelete = (hotel) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (hotelToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/hotels/${hotelToDelete.hotelid}`);
        await loadHotels();
        setShowDeleteModal(false);
        setHotelToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete hotel');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHotel(null);
    setFormData({
      email: '',
      password: '',
      hotel_name: '',
      hotel_type: '',
      address: '',
      phone: '',
      country_id: '',
      state_id: '',
      district_id: '',
      zone_id: '',
      gst_no: '',
      pan_no: '',
      aadhar_no: '',
      owner_name: '',
      Owner_mobile: '',
      hotel_timeMorning: '',
      hotel_timeEvening: '',
      status: 1,
      created_by_id: null,
      masteruserid: null
    });
    setErrors({});
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hotel.country_name && hotel.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (hotel.state_name && hotel.state_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (hotel.district_name && hotel.district_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (hotel.zone_name && hotel.zone_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table hover className="mb-0">
                  <thead className="table-light sticky-top bg-white" style={{ zIndex: 1 }}>
                    <tr>
                      <th style={{ minWidth: '50px' }}>#</th>
                      <th style={{ minWidth: '200px' }}>Hotel Name</th>
                      <th style={{ minWidth: '150px' }}>Email</th>
                      <th style={{ minWidth: '150px' }}>Phone</th>
                      <th style={{ minWidth: '150px' }}>Country</th>
                      <th style={{ minWidth: '150px' }}>State</th>
                      <th style={{ minWidth: '150px' }}>District</th>
                      <th style={{ minWidth: '150px' }}>Zone</th>
                      <th style={{ minWidth: '200px' }}>Address</th>
                      <th style={{ minWidth: '150px' }}>Owner Name</th>
                      <th style={{ minWidth: '150px' }}>Owner Mobile</th>
                      <th style={{ minWidth: '150px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHotels.map((hotel, index) => (
                      <tr key={hotel.hotelid}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{hotel.hotel_name}</strong>
                        </td>
                        <td>{hotel.email}</td>
                        <td>{hotel.phone}</td>
                        <td>{hotel.country_name || <span className="text-muted">-</span>}</td>
                        <td>{hotel.state_name || <span className="text-muted">-</span>}</td>
                        <td>{hotel.district_name || <span className="text-muted">-</span>}</td>
                        <td>{hotel.zone_name || <span className="text-muted">-</span>}</td>
                        <td>{hotel.address || <span className="text-muted">-</span>}</td>
                        <td>{hotel.owner_name || <span className="text-muted">-</span>}</td>
                        <td>{hotel.Owner_mobile || <span className="text-muted">-</span>}</td>
                        <td>
                          <Badge bg={hotel.status === 1 ? 'success' : 'secondary'}>
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
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(hotel)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Pagination>
                      <Pagination.First 
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last 
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</Modal.Title>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hotel_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.district_id} value={district.district_id}>
                        {district.district_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone</Form.Label>
                  <Form.Select
                    name="zone_id"
                    value={formData.zone_id}
                    onChange={handleInputChange}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GST No</Form.Label>
                  <Form.Control
                    type="text"
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>PAN No</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_no"
                    value={formData.pan_no}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar No</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar_no"
                    value={formData.aadhar_no}
                    onChange={handleInputChange}
                    placeholder="Enter Aadhar number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleInputChange}
                    placeholder="Enter owner name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="Owner_mobile"
                    value={formData.Owner_mobile}
                    onChange={handleInputChange}
                    placeholder="Enter owner mobile number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hotel Time Morning</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_timeMorning"
                    value={formData.hotel_timeMorning}
                    onChange={handleInputChange}
                    placeholder="Enter morning time"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hotel Time Evening</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_timeEvening"
                    value={formData.hotel_timeEvening}
                    onChange={handleInputChange}
                    placeholder="Enter evening time"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hotel Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="hotel_type"
                    value={formData.hotel_type}
                    onChange={handleInputChange}
                    placeholder="Enter hotel type"
                  />
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
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingHotel ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{hotelToDelete?.hotel_name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HotelMaster;
