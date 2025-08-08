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
  Dropdown,
  Pagination
} from 'react-bootstrap';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  MapPin,
  Building,
  Flag,
  Navigation,
  Globe
} from 'lucide-react';
import axios from 'axios';

const ZoneMaster = () => {
  // State management
  const [zones, setZones] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    district_id: '',
    description: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Load data on component mount
  useEffect(() => {
    loadZones();
    loadCountries();
  }, []);

  // Load zones from API
  const loadZones = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:3001/api/zones');
      console.log('Loaded zones:', response.data);
      console.log('Number of zones:', response.data.length);
      setZones(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load zones');
      console.error('Error loading zones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load countries for dropdown
  const loadCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  };

  // Load states by country
  const loadStatesByCountry = async (countryId) => {
    if (!countryId) {
      setStates([]);
      setDistricts([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:3001/api/states/by-country/${countryId}`);
      setStates(response.data);
    } catch (err) {
      console.error('Error loading states:', err);
      setStates([]);
    }
  };

  // Load districts by state
  const loadDistrictsByState = async (stateId) => {
    if (!stateId) {
      setDistricts([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:3001/api/districts/by-state/${stateId}`);
      setDistricts(response.data);
    } catch (err) {
      console.error('Error loading districts:', err);
      setDistricts([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If country changes, load states for that country
    if (name === 'country_id') {
      loadStatesByCountry(value);
      // Reset state_id and district_id when country changes
      setFormData(prev => ({
        ...prev,
        state_id: '',
        district_id: ''
      }));
    }
    
    // If state changes, load districts for that state
    if (name === 'state_id') {
      loadDistrictsByState(value);
      // Reset district_id when state changes
      setFormData(prev => ({
        ...prev,
        district_id: ''
      }));
    }
    
    // Clear validation error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Zone code is required';
    } else if (formData.code.length !== 2) {
      newErrors.code = 'Zone code must be 2 characters';
    }
    
    if (!formData.district_id) {
      newErrors.district_id = 'District is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingZone) {
        // Update existing zone
        await axios.put(`http://localhost:3001/api/zones/${editingZone.id}`, formData);
        // Reload zones to get updated data
        await loadZones();
      } else {
        // Add new zone
        const response = await axios.post('http://localhost:3001/api/zones', formData);
        console.log('New zone added:', response.data);
        
        // Add the new zone to the list immediately
        if (response.data.zone) {
          setZones(prev => [response.data.zone, ...prev]);
        }
      }
      
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save zone');
      console.error('Error saving zone:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      code: zone.code,
      district_id: zone.district_id,
      description: zone.description || ''
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = (zone) => {
    setZoneToDelete(zone);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (zoneToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/zones/${zoneToDelete.id}`);
        // Reload zones to get updated data
        await loadZones();
        setShowDeleteModal(false);
        setZoneToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete zone');
        console.error('Error deleting zone:', err);
      }
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({
      name: '',
      code: '',
      district_id: '',
      description: ''
    });
    setErrors({});
  };

  // Filter zones based on search term
  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (zone.district_name && zone.district_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (zone.state_name && zone.state_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (zone.country_name && zone.country_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentZones = filteredZones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredZones.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Globe className="me-2" size={24} />
                Zone Master
              </h2>
              <p className="text-muted mb-0">Manage zones and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Zone
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="d-flex align-items-center gap-2">
              <Filter size={16} />
              Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>All Zones</Dropdown.Item>
              <Dropdown.Item>Active Only</Dropdown.Item>
              <Dropdown.Item>Inactive Only</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Zones Table */}
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
                      <th style={{ minWidth: '200px' }}>Zone</th>
                      <th style={{ minWidth: '100px' }}>Code</th>
                      <th style={{ minWidth: '150px' }}>District</th>
                      <th style={{ minWidth: '150px' }}>State</th>
                      <th style={{ minWidth: '150px' }}>Country</th>
                      <th style={{ minWidth: '150px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Created</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentZones.map((zone, index) => (
                      <tr key={zone.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Building size={16} className="text-muted" />
                            </div>
                            <strong>{zone.name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {zone.code}
                          </Badge>
                        </td>
                        <td>
                          {zone.district_name ? (
                            <div className="d-flex align-items-center">
                              <Navigation size={14} className="text-muted me-1" />
                              {zone.district_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {zone.state_name ? (
                            <div className="d-flex align-items-center">
                              <MapPin size={14} className="text-muted me-1" />
                              {zone.state_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {zone.country_name ? (
                            <div className="d-flex align-items-center">
                              <Flag size={14} className="text-muted me-1" />
                              {zone.country_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {zone.description ? (
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                              {zone.description}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Badge bg={zone.status === 1 ? 'success' : 'secondary'}>
                            {zone.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(zone.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(zone)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(zone)}
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

              {/* Empty State */}
              {currentZones.length === 0 && (
                <div className="text-center py-5">
                  <Globe size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No zones found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first zone to get started'}
                  </p>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Pagination */}
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingZone ? 'Edit Zone' : 'Add New Zone'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter zone name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.code}
                    placeholder="e.g., Z1, Z2"
                    maxLength={2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District *</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.district_id}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.district_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter zone description"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingZone ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{zoneToDelete?.name}</strong>?
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

export default ZoneMaster; 