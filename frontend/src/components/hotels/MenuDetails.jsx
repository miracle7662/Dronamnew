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
  DollarSign,
  Tag
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const MenuDetails = () => {
  const { user } = useAuthContext();
  const [menuDetails, setMenuDetails] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMenuDetail, setEditingMenuDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuDetailToDelete, setMenuDetailToDelete] = useState(null);

  const [formData, setFormData] = useState({
    menu_id: '',
    variant_type: '',
    rate: '',
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMenuDetails();
    loadMenus();
  }, []);

  const loadMenuDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/menudetails');
      setMenuDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load menu details');
    } finally {
      setLoading(false);
    }
  };

  const loadMenus = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/menumaster');
      setMenus(response.data);
    } catch (err) {
      console.error('Error loading menus:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
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
    
    if (!formData.menu_id) {
      newErrors.menu_id = 'Menu is required';
    }
    
    if (!formData.variant_type.trim()) {
      newErrors.variant_type = 'Variant type is required';
    }
    
    if (!formData.rate || formData.rate <= 0) {
      newErrors.rate = 'Rate must be greater than 0';
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
      const payload = {
        ...formData,
        created_by_id: userId
      };
      
      if (editingMenuDetail) {
        await axios.put(`http://localhost:3001/api/menudetails/${editingMenuDetail.menudetails_id}`, payload);
      } else {
        await axios.post('http://localhost:3001/api/menudetails', payload);
      }
      await loadMenuDetails();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu detail');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menuDetail) => {
    setEditingMenuDetail(menuDetail);
    setFormData({
      menu_id: menuDetail.menu_id,
      variant_type: menuDetail.variant_type,
      rate: menuDetail.rate
    });
    setShowModal(true);
  };

  const handleDelete = (menuDetail) => {
    setMenuDetailToDelete(menuDetail);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (menuDetailToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/menudetails/${menuDetailToDelete.menudetails_id}`);
        await loadMenuDetails();
        setShowDeleteModal(false);
        setMenuDetailToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete menu detail');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMenuDetail(null);
    setFormData({
      menu_id: '',
      variant_type: '',
      rate: ''
    });
    setErrors({});
  };

  const filteredMenuDetails = menuDetails.filter(menuDetail =>
    menuDetail.variant_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menuDetail.rate.toString().includes(searchTerm) ||
    (menuDetail.menu_name && menuDetail.menu_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenuDetails = filteredMenuDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenuDetails.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Tag className="me-2" size={24} />
                Menu Details Master
              </h2>
              <p className="text-muted mb-0">Manage menu details and pricing information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Menu Detail
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
              placeholder="Search menu details..."
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
                      <th style={{ minWidth: '200px' }}>Menu</th>
                      <th style={{ minWidth: '150px' }}>Variant Type</th>
                      <th style={{ minWidth: '100px' }}>Rate</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMenuDetails.map((menuDetail, index) => (
                      <tr key={menuDetail.menudetails_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Building size={16} className="text-muted" />
                            </div>
                            <strong>{menuDetail.menu_name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-uppercase">
                            {menuDetail.variant_type}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="success">
                            ₹{menuDetail.rate}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(menuDetail)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(menuDetail)}
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
              {currentMenuDetails.length === 0 && (
                <div className="text-center py-5">
                  <Tag size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No menu details found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first menu detail to get started'}
                  </p>
                </div>
              )}
            </>
          )}

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
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMenuDetail ? 'Edit Menu Detail' : 'Add New Menu Detail'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Menu *</Form.Label>
                  <Form.Select
                    name="menu_id"
                    value={formData.menu_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.menu_id}
                  >
                    <option value="">Select Menu</option>
                    {menus.map(menu => (
                      <option key={menu.menu_id} value={menu.menu_id}>
                        {menu.menu_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.menu_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Variant Type *</Form.Label>
                  <Form.Control
                    type="text"
                    name="variant_type"
                    value={formData.variant_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.variant_type}
                    placeholder="e.g., Half, Full, Quarter"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.variant_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rate *</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    isInvalid={!!errors.rate}
                    placeholder="Enter rate"
                    min="0"
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rate}
                  </Form.Control.Feedback>
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
              {loading ? 'Saving...' : (editingMenuDetail ? 'Update' : 'Save')}
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
          Are you sure you want to delete <strong>{menuDetailToDelete?.variant_type}</strong> for menu <strong>{menuDetailToDelete?.menu_name}</strong>?
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

export default MenuDetails;
