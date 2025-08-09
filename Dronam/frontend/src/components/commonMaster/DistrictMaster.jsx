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

const DistrictMaster = () => {
  const { user } = useAuthContext();
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState(null);

  const [formData, setFormData] = useState({
    district_name: '',
    district_code: '',
    state_id: '',
    description: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDistricts();
    loadStates();
  }, []);

  const loadDistricts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/districts');
      setDistricts(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load districts');
    } finally {
      setLoading(false);
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
    
    if (!formData.district_name.trim()) {
      newErrors.district_name = 'District name is required';
    }
    
    if (!formData.district_code.trim()) {
      newErrors.district_code = 'District code is required';
    } else if (formData.district_code.length !== 4) {
      newErrors.district_code = 'District code must be 4 characters';
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
    
    try {
      const userId = user?.id || 1;
      if (editingDistrict) {
        await axios.put(`http://localhost:3001/api/districts/${editingDistrict.district_id}`, {
          ...formData,
          updated_by_id: userId
        });
        await loadDistricts();
      } else {
        const response = await axios.post('http://localhost:3001/api/districts', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.district) {
          setDistricts(prev => [response.data.district, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save district');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setFormData({
      district_name: district.district_name,
      district_code: district.district_code,
      state_id: district.state_id,
      description: district.description || '',
      status: district.status !== undefined ? district.status : 1
    });
    setShowModal(true);
  };

  const handleDelete = (district) => {
    setDistrictToDelete(district);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (districtToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/districts/${districtToDelete.district_id}`);
        await loadDistricts();
        setShowDeleteModal(false);
        setDistrictToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete district');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDistrict(null);
    setFormData({
      district_name: '',
      district_code: '',
      state_id: '',
      description: '',
      status: 1,
      created_by_id: null
    });
    setErrors({});
  };

  const filteredDistricts = districts.filter(district =>
    district.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.district_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (district.description && district.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (district.state_name && district.state_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDistricts = filteredDistricts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Map className="me-2" size={24} />
                District Master
              </h2>
              <p className="text-muted mb-0">Manage districts and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add District
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
              placeholder="Search districts..."
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
                      <th style={{ minWidth: '200px' }}>District</th>
                      <th style={{ minWidth: '100px' }}>Code</th>
                      <th style={{ minWidth: '150px' }}>State</th>
                      <th style={{ minWidth: '200px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDistricts.map((district, index) => (
                      <tr key={district.district_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Building size={16} className="text-muted" />
                            </div>
                            <strong>{district.district_name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {district.district_code}
                          </Badge>
                        </td>
                        <td>
                          {district.state_name ? (
                            <div className="d-flex align-items-center">
                              <MapPin size={14} className="text-muted me-1" />
                              {district.state_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {district.description ? (
                            <span className="text-muted">{district.description}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Badge bg={district.status === 1 ? 'success' : 'secondary'}>
                            {district.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(district)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(district)}
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
              {currentDistricts.length === 0 && (
                <div className="text-center py-5">
                  <Map size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No districts found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first district to get started'}
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
            {editingDistrict ? 'Edit District' : 'Add New District'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="district_name"
                    value={formData.district_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.district_name}
                    placeholder="Enter district name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.district_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="district_code"
                    value={formData.district_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.district_code}
                    placeholder="e.g., MH09, MH10"
                    maxLength={4}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.district_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.state_id}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
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
                    placeholder="Enter district description (optional)"
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
              {loading ? 'Saving...' : (editingDistrict ? 'Update' : 'Save')}
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
          Are you sure you want to delete <strong>{districtToDelete?.district_name}</strong>?
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

export default DistrictMaster;
