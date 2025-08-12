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
  MapPin,
  Building,
  Flag,
  Map
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const ZoneMasterUpdated = () => {
  const { user } = useAuthContext();
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);

  const [formData, setFormData] = useState({
    zone_name: '',
    zone_code: '',
    district_id: '',
    description: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadZones();
    loadDistricts();
    loadStates();
  }, []);

  const loadZones = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/zones');
      setZones(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load zones');
    } finally {
      setLoading(false);
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

  const loadStates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/states');
      setStates(response.data);
    } catch (err) {
      console.error('Error loading states:', err);
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
    
    if (!formData.zone_name.trim()) {
      newErrors.zone_name = 'Zone name is required';
    }
    
    if (!formData.zone_code.trim()) {
      newErrors.zone_code = 'Zone code is required';
    } else if (formData.zone_code.length > 3) {
      newErrors.zone_code = 'Zone code must be 3 characters or less';
    }
    
    if (!formData.district_id) {
      newErrors.district_id = 'District is required';
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
      if (editingZone) {
        await axios.put(`http://localhost:3001/api/zones/${editingZone.zone_id}`, {
          ...formData,
          updated_by_id: userId
        });
        await loadZones();
      } else {
        const response = await axios.post('http://localhost:3001/api/zones', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.zone) {
          setZones(prev => [response.data.zone, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save zone');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      zone_name: zone.zone_name,
      zone_code: zone.zone_code,
      district_id: zone.district_id,
      description: zone.description || '',
      status: zone.status !== undefined ? zone.status : 1
    });
    setShowModal(true);
  };

  const handleDelete = (zone) => {
    setZoneToDelete(zone);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (zoneToDelete) {
      try {
      await axios.delete(`http://localhost:3001/api/zones/${zoneToDelete.zone_id}`);
      await loadZones();
      setShowDeleteModal(false);
      setZoneToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete zone');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({
      zone_name: '',
      zone_code: '',
      district_id: '',
      description: '',
      status: 1,
      created_by_id: null
    });
    setErrors({});
  };

  const filteredZones = zones.filter(zone =>
    zone.zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.zone_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (zone.district_name && zone.district_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (zone.state_name && zone.state_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentZones = filteredZones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredZones.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <MapPin className="me-2" size={24} />
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
                      <th style={{ minWidth: '200px' }}>Zone</th>
                      <th style={{ minWidth: '100px' }}>Code</th>
                      <th style={{ minWidth: '150px' }}>District</th>
                      <th style={{ minWidth: '150px' }}>State</th>
                      <th style={{ minWidth: '200px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentZones.map((zone, index) => (
                      <tr key={zone.zone_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Map size={16} className="text-muted" />
                            </div>
                            <strong>{zone.zone_name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {zone.zone_code}
                          </Badge>
                        </td>
                        <td>
                          {zone.district_name ? (
                            <div className="d-flex align-items-center">
                              <Building size={14} className="text-muted me-1" />
                              {zone.district_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {zone.state_name ? (
                            <div className="d-flex align-items-center">
                              <Flag size={14} className="text-muted me-1" />
                              {zone.state_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {zone.description ? (
                            <span className="text-muted">{zone.description}</span>
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
                  <Map size={48} className="text-muted mb-3" />
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
                    name="zone_name"
                    value={formData.zone_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.zone_name}
                    placeholder="Enter zone name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zone_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="zone_code"
                    value={formData.zone_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.zone_code}
                    placeholder="e.g., ZN01, ZN02"
                    maxLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zone_code}
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
                      <option key={district.district_id} value={district.district_id}>
                        {district.district_name}
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
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter zone description (optional)"
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
          Are you sure you want to delete <strong>{zoneToDelete?.zone_name}</strong>?
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

export default ZoneMasterUpdated;
