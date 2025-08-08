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
  Flag
} from 'lucide-react';
import axios from 'axios';

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    country_name: '',
    country_code: '',
    capital: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/countries');
      setCountries(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load countries');
    } finally {
      setLoading(false);
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
    if (!formData.country_name.trim()) {
      newErrors.country_name = 'Country name is required';
    }
    if (!formData.country_code.trim()) {
      newErrors.country_code = 'Country code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const userId = 1; // TODO: Replace with actual logged-in user ID from auth context
      if (editingCountry) {
        await axios.put(`http://localhost:3001/api/countries/${editingCountry.country_id}`, {
          ...formData,
          updated_by_id: userId
        });
        await loadCountries();
      } else {
        const response = await axios.post('http://localhost:3001/api/countries', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.country) {
          setCountries(prev => [response.data.country, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save country');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({
      country_name: country.country_name,
      country_code: country.country_code,
      capital: country.capital || ''
    });
    setShowModal(true);
  };

  const handleDelete = (country) => {
    setCountryToDelete(country);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (countryToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/countries/${countryToDelete.country_id}`);
        await loadCountries();
        setShowDeleteModal(false);
        setCountryToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete country');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCountry(null);
    setFormData({
      country_name: '',
      country_code: '',
      capital: ''
    });
    setErrors({});
  };

  const filteredCountries = countries.filter(country =>
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.country_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (country.capital && country.capital.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Flag className="me-2" size={24} />
                Country Master
              </h2>
              <p className="text-muted mb-0">Manage countries and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Country
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
              placeholder="Search countries..."
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
                      <th style={{ minWidth: '200px' }}>Country</th>
                      <th style={{ minWidth: '100px' }}>Code</th>
                      <th style={{ minWidth: '150px' }}>Capital</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCountries.map((country, index) => (
                      <tr key={country.country_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{country.country_name}</strong>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {country.country_code}
                          </Badge>
                        </td>
                        <td>{country.capital || <span className="text-muted">-</span>}</td>
                        <td>
                          {country.status === 1 ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(country)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(country)}
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

              {currentCountries.length === 0 && (
                <div className="text-center py-5">
                  <Flag size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No countries found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first country to get started'}
                  </p>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCountry ? 'Edit Country' : 'Add New Country'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="country_name"
                    value={formData.country_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.country_name}
                    placeholder="Enter country name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.country_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.country_code}
                    placeholder="e.g., US, IN"
                    maxLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.country_code}
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
              {loading ? 'Saving...' : (editingCountry ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{countryToDelete?.country_name}</strong>?
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

export default CountryMaster;
