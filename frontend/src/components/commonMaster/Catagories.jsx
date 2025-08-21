import React, { useState, useEffect, useMemo } from 'react';
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
  Tag
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const Categories = () => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    categories_name: '',
    description: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/categories');
      if (response && response.data) {
        setCategories(response.data);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to load categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    if (name === 'status') {
      val = parseInt(value, 10);
    }
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
    if (!formData.categories_name.trim()) {
      newErrors.categories_name = 'Category name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      if (editingCategory) {
        await axios.put(`http://localhost:3001/api/categories/${editingCategory.categories_id}`, {
          ...formData,
          updated_by_id: userId
        });
        // Optimistically update local state with the new status
        setCategories(prev => 
          prev.map(category => 
            category.categories_id === editingCategory.categories_id 
              ? { ...category, ...formData, status: formData.status } 
              : category
          )
        );
      } else {
        const response = await axios.post('http://localhost:3001/api/categories', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.category) {
          setCategories(prev => [response.data.category, ...prev]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categories_name: category.categories_name,
      description: category.description,
      status: category.status !== undefined ? category.status : 1
    });
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      setDeleteLoading(true);
      try {
        await axios.delete(`http://localhost:3001/api/categories/${categoryToDelete.categories_id}`);
        // Update local state by removing the deleted category
        setCategories(prev => prev.filter(category => category.categories_id !== categoryToDelete.categories_id));
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete category');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      categories_name: '',
      description: '',
      status: 1
    });
    setErrors({});
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.categories_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Tag className="me-2" size={24} />
                Category Master
              </h2>
              <p className="text-muted mb-0">Manage categories and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Category
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
              placeholder="Search categories..."
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
                      <th style={{ minWidth: '200px' }}>Category Name</th>
                      <th style={{ minWidth: '250px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((category, index) => (
                      <tr key={category.categories_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{category.categories_name}</strong>
                        </td>
                        <td>{category.description || <span className="text-muted">-</span>}</td>
                        <td>
                          {category.status === 1 ? (
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
                              onClick={() => handleEdit(category)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(category)}
                              title="Delete"
                              disabled={deleteLoading}
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

              {currentCategories.length === 0 && (
                <div className="text-center py-5">
                  <Tag size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No categories found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first category to get started'}
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
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="categories_name"
                    value={formData.categories_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.categories_name}
                    placeholder="Enter category name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.categories_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                    placeholder="Enter description"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
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
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{categoryToDelete?.categories_name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Processing...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;