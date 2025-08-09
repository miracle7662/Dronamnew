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
  Flag
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const StateMaster = () => {
  const { user } = useAuthContext();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);

  const [formData, setFormData] = useState({
    state_name: '',
    state_code: '',
    capital: '',
    country_id: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadStates();
    loadCountries();
  }, []);

  const loadStates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/states');
      setStates(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load states');
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
    
    if (!formData.state_name.trim()) {
      newErrors.state_name = 'State name is required';
    }
    
    if (!formData.state_code.trim()) {
      newErrors.state_code = 'State code is required';
    } else if (formData.state_code.length !== 2) {
      newErrors.state_code = 'State code must be 2 characters';
    }
    
    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
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
      if (editingState) {
        await axios.put(`http://localhost:3001/api/states/${editingState.state_id}`, {
          ...formData,
          updated_by_id: userId
        });
        await loadStates();
      } else {
        const response = await axios.post('http://localhost:3001/api/states', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.state) {
          setStates(prev => [response.data.state, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save state');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData({
      state_name: state.state_name,
      state_code: state.state_code,
      capital: state.capital || '',
      country_id: state.country_id,
      status: state.status !== undefined ? state.status : 1
    });
    setShowModal(true);
  };

  const handleDelete = (state) => {
    setStateToDelete(state);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (stateToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/states/${stateToDelete.state_id}`);
        await loadStates();
        setShowDeleteModal(false);
        setStateToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete state');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingState(null);
    setFormData({
      state_name: '',
      state_code: '',
      capital: '',
      country_id: '',
      status: 1,
      created_by_id: null
    });
    setErrors({});
  };

  const filteredStates = states.filter(state =>
    state.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.state_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (state.capital && state.capital.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (state.country_name && state.country_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStates = filteredStates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <MapPin className="me-2" size={24} />
                State Master
              </h2>
              <p className="text-muted mb-0">Manage states and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add State
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
              placeholder="Search states..."
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
                      <th style={{ minWidth: '200px' }}>State</th>
                      <th style={{ minWidth: '100px' }}>Code</th>
                      <th style={{ minWidth: '150px' }}>Capital</th>
                      <th style={{ minWidth: '150px' }}>Country</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStates.map((state, index) => (
                      <tr key={state.state_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Building size={16} className="text-muted" />
                            </div>
                            <strong>{state.state_name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {state.state_code}
                          </Badge>
                        </td>
                        <td>
                          {state.capital ? (
                            <div className="d-flex align-items-center">
                              <MapPin size={14} className="text-muted me-1" />
                              {state.capital}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {state.country_name ? (
                            <div className="d-flex align-items-center">
                              <Flag size={14} className="text-muted me-1" />
                              {state.country_name}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Badge bg={state.status === 1 ? 'success' : 'secondary'}>
                            {state.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(state)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(state)}
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
              {currentStates.length === 0 && (
                <div className="text-center py-5">
                  <MapPin size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No states found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first state to get started'}
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
            {editingState ? 'Edit State' : 'Add New State'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="state_name"
                    value={formData.state_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.state_name}
                    placeholder="Enter state name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.state_code}
                    placeholder="e.g., Maharashtra-27, 28,29"
                    maxLength={2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capital City</Form.Label>
                  <Form.Control
                    type="text"
                    name="capital"
                    value={formData.capital}
                    onChange={handleInputChange}
                    isInvalid={!!errors.capital}
                    placeholder="Enter capital city"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capital}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.country_id}
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
            </Row>
            <Row>
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
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingState ? 'Update' : 'Save')}
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
          Are you sure you want to delete <strong>{stateToDelete?.state_name}</strong>?
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

export default StateMaster;
