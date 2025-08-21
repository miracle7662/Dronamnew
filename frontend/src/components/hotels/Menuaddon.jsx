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
  Spinner
} from 'react-bootstrap';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Menuaddon = () => {
  const [menuAddons, setMenuAddons] = useState([]);
  const [menus, setMenus] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMenuAddon, setEditingMenuAddon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuAddonToDelete, setMenuAddonToDelete] = useState(null);

  const [formData, setFormData] = useState({
    menu_id: '',
    addon_ids: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [menuAddonsRes, menusRes, addonsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/menuaddons`),
        axios.get(`${API_BASE_URL}/menumaster`),
        axios.get(`${API_BASE_URL}/addons`)
      ]);
      
      setMenuAddons(menuAddonsRes.data);
      setMenus(menusRes.data);
      setAddons(addonsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddonChange = (selectedAddons) => {
    setFormData(prev => ({
      ...prev,
      addon_ids: selectedAddons
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.menu_id) {
      newErrors.menu_id = 'Please select a menu';
    }
    if (!formData.addon_ids || formData.addon_ids.length === 0) {
      newErrors.addon_ids = 'Please select at least one addon';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editingMenuAddon) {
        await axios.put(`${API_BASE_URL}/menuaddons/menu/${formData.menu_id}`, {
          menu_id: formData.menu_id,
          addon_ids: formData.addon_ids
        });
      } else {
        await axios.post(`${API_BASE_URL}/menuaddons`, {
          menu_id: formData.menu_id,
          addon_ids: formData.addon_ids
        });
      }
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu addon');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menuAddon) => {
    setEditingMenuAddon(menuAddon);
    setFormData({
      menu_id: menuAddon.menu_id,
      addon_ids: [menuAddon.addon_id]
    });
    setShowModal(true);
  };

  const handleDelete = (menuAddon) => {
    setMenuAddonToDelete(menuAddon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (menuAddonToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/menuaddons/${menuAddonToDelete.menuaddon_id}`);
        await loadData();
        setShowDeleteModal(false);
        setMenuAddonToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete menu addon');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMenuAddon(null);
    setFormData({
      menu_id: '',
      addon_ids: []
    });
    setErrors({});
  };

  const groupAddonsByMenu = () => {
    const grouped = {};
    menuAddons.forEach(addon => {
      if (!grouped[addon.menu_id]) {
        grouped[addon.menu_id] = {
          menu_id: addon.menu_id,
          menu_name: addon.menu_name,
          addons: []
        };
      }
      grouped[addon.menu_id].addons.push({
        addon_id: addon.addon_id,
        addon_name: addon.addon_name,
        menuaddon_id: addon.menuaddon_id
      });
    });
    return Object.values(grouped);
  };

  const filteredMenuAddons = groupAddonsByMenu().filter(group =>
    group.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenuAddons = filteredMenuAddons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenuAddons.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Package className="me-2" size={24} />
                Menu Addons Management
              </h2>
              <p className="text-muted mb-0">Manage menu addons and their relationships</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Menu Addon
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
              placeholder="Search menus..."
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
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table hover className="mb-0">
                  <thead className="table-light sticky-top bg-white" style={{ zIndex: 1 }}>
                    <tr>
                      <th style={{ minWidth: '50px' }}>#</th>
                      <th style={{ minWidth: '200px' }}>Menu</th>
                      <th style={{ minWidth: '300px' }}>Addons</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMenuAddons.map((group, index) => (
                      <tr key={group.menu_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{group.menu_name}</strong>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {group.addons.map((addon) => (
                              <Badge key={addon.addon_id} bg="info" className="me-1">
                                {addon.addon_name}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleEdit(group)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(group.addons[0])}
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

              {currentMenuAddons.length === 0 && (
                <div className="text-center py-5">
                  <Package size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No menu addons found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first menu addon to get started'}
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
          <Modal.Title>{editingMenuAddon ? 'Edit Menu Addon' : 'Add New Menu Addon'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Menu *</Form.Label>
                  <Form.Select
                    name="menu_id"
                    value={formData.menu_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.menu_id}
                  >
                    <option value="">Select a menu</option>
                    {menus.map((menu) => (
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
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Addons *</Form.Label>
                  <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {addons.map((addon) => (
                      <Form.Check
                        key={addon.addon_id}
                        type="checkbox"
                        id={`addon-${addon.addon_id}`}
                        label={addon.addon_name}
                        checked={formData.addon_ids.includes(addon.addon_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddonChange([...formData.addon_ids, addon.addon_id]);
                          } else {
                            handleAddonChange(formData.addon_ids.filter(id => id !== addon.addon_id));
                          }
                        }}
                      />
                    ))}
                  </div>
                  {errors.addon_ids && (
                    <div className="invalid-feedback d-block">
                      {errors.addon_ids}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingMenuAddon ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this menu addon?
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

export default Menuaddon;
