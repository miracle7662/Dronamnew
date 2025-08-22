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
  Stack
} from 'react-bootstrap';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Utensils
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const MenuMaster = () => {
  const { user } = useAuthContext();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    menu_name: '',
    description: '',
    food_type: 'veg',
    categories_id: '',
    preparation_time: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/menumaster');
      if (response && response.data) {
        // Ensure categories_name is included, fallback to fetching from categories if needed
        const itemsWithCategory = response.data.map(item => ({
          ...item,
          categories_name: item.categories_name || (categories.find(cat => cat.categories_id === item.categories_id)?.categories_name || '-')
        }));
        setMenuItems(itemsWithCategory);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? Number(val) : val
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
    if (!formData.menu_name.trim()) {
      newErrors.menu_name = 'Menu name is required';
    }
    if (!formData.categories_id) {
      newErrors.categories_id = 'Category is required';
    }
    if (!formData.food_type) {
      newErrors.food_type = 'Food type is required';
    }
    if (formData.preparation_time && !/^\d{2}:\d{2}:\d{2}$/.test(formData.preparation_time)) {
      newErrors.preparation_time = 'Preparation time must be in HH:MM:SS format';
    }
    if (![0, 1].includes(formData.status)) {
      newErrors.status = 'Invalid status value';
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
      if (editingMenuItem) {
        const response = await axios.put(`http://localhost:3001/api/menumaster/${editingMenuItem.menu_id}`, {
          ...formData,
          updated_by_id: userId
        });
        if (response.status === 200) {
          // Immediately update local state
          setMenuItems(prevItems => prevItems.map(item => 
            item.menu_id === editingMenuItem.menu_id 
              ? { 
                  ...item, 
                  ...formData,
                  categories_name: categories.find(cat => cat.categories_id === formData.categories_id)?.categories_name || '-' 
                } 
              : item
          ));
        }
      } else {
        const response = await axios.post('http://localhost:3001/api/menumaster', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.menuItem) {
          const newItem = {
            ...response.data.menuItem,
            categories_name: categories.find(cat => cat.categories_id === formData.categories_id)?.categories_name || '-'
          };
          setMenuItems(prev => [newItem, ...prev]);
        }
      }
      await loadMenuItems(); // Refresh from server to ensure sync
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menuItem) => {
    setEditingMenuItem(menuItem);
    setFormData({
      menu_name: menuItem.menu_name,
      description: menuItem.description || '',
      food_type: menuItem.food_type || 'veg',
      categories_id: menuItem.categories_id || '',
      preparation_time: menuItem.preparation_time || '',
      status: menuItem.status !== undefined ? Number(menuItem.status) : 1
    });
    setShowModal(true);
  };

  const handleDelete = (menuItem) => {
    setMenuItemToDelete(menuItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (menuItemToDelete) {
      try {
        const userId = user?.id || 1;
        await axios.delete(`http://localhost:3001/api/menumaster/${menuItemToDelete.menu_id}`, {
          data: { updated_by_id: userId }
        });
        await loadMenuItems();
        setShowDeleteModal(false);
        setMenuItemToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete menu item');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMenuItem(null);
    setFormData({
      menu_name: '',
      description: '',
      food_type: 'veg',
      categories_id: '',
      preparation_time: '',
      status: 1,
      created_by_id: null
    });
    setErrors({});
  };

  const filteredMenuItems = menuItems.filter(menuItem =>
    menuItem.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (menuItem.description && menuItem.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (menuItem.categories_name && menuItem.categories_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenuItems = filteredMenuItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Utensils className="me-2" size={24} />
                Menu Master
              </h2>
              <p className="text-muted mb-0">Manage all menu items</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Menu Item
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
              placeholder="Search menu items..."
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
                      <th style={{ minWidth: '200px' }}>Menu Name</th>
                      <th style={{ minWidth: '300px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Food Type</th>
                      <th style={{ minWidth: '150px' }}>Category</th>
                      <th style={{ minWidth: '150px' }}>Prep Time</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMenuItems.map((menuItem, index) => (
                      <tr key={menuItem.menu_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{menuItem.menu_name}</strong>
                        </td>
                        <td>{menuItem.description || <span className="text-muted">-</span>}</td>
                        <td>
                          <Badge bg={menuItem.food_type === 'veg' ? 'success' : 'danger'}>
                            {menuItem.food_type}
                          </Badge>
                        </td>
                        <td>{menuItem.categories_name || <span className="text-muted">-</span>}</td>
                        <td>{menuItem.preparation_time || <span className="text-muted">-</span>}</td>
                        <td>
                          <Badge bg={menuItem.status === 1 ? 'success' : 'secondary'}>
                            {menuItem.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(menuItem)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(menuItem)}
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

              {currentMenuItems.length === 0 && (
                <div className="text-center py-5">
                  <Utensils size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No menu items found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first menu item to get started'}
                  </p>
                </div>
              )}
              {!loading && currentMenuItems.length > 0 && (
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
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      style={{
                        color: currentPage === 1 ? '#d3d3d3' : '#6c757d',
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
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      style={{
                        color: currentPage === totalPages ? '#d3d3d3' : '#6c757d',
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
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Menu Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="menu_name"
                    value={formData.menu_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.menu_name}
                    placeholder="Enter menu name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.menu_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Food Type *</Form.Label>
                  <Form.Select
                    name="food_type"
                    value={formData.food_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.food_type}
                  >
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.food_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="categories_id"
                    value={formData.categories_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.categories_id}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.categories_id} value={category.categories_id}>
                        {category.categories_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categories_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preparation Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="preparation_time"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                    isInvalid={!!errors.preparation_time}
                    placeholder="HH:MM:SS (e.g., 00:20:00)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.preparation_time}
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
                    isInvalid={!!errors.status}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
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
                    placeholder="Enter description (optional)"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingMenuItem ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{menuItemToDelete?.menu_name}</strong>?
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

export default MenuMaster;