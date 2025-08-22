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
  OverlayTrigger,
  Tooltip,
  Stack
} from 'react-bootstrap';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const AddonMaster = () => {
  const { user } = useAuthContext();
  const [addons, setAddons] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState(null);

  const [formData, setFormData] = useState({
    addon_name: '',
    description: '',
    rate: '',
    unit_id: '',
    unit_conversion: '',
    status: 1,
    created_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAddons();
    loadUnits();
  }, []);

  const loadAddons = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/addons');
      if (response && response.data) {
        setAddons(response.data);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load addons');
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/units');
      setUnits(response.data);
    } catch (err) {
      console.error('Error loading units:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value
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
    if (!formData.addon_name.trim()) {
      newErrors.addon_name = 'Addon name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.rate || isNaN(formData.rate) || formData.rate < 0) {
      newErrors.rate = 'Valid rate is required (non-negative number)';
    }
    if (!formData.unit_id) {
      newErrors.unit_id = 'Unit is required';
    }
    if (!formData.unit_conversion.trim()) {
      newErrors.unit_conversion = 'Unit conversion is required';
    }
    if (![0, 1].includes(formData.status)) {
      newErrors.status = 'Status must be Active (1) or Inactive (0)';
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
      if (editingAddon) {
        const response = await axios.put(`http://localhost:3001/api/addons/${editingAddon.addon_id}`, {
          ...formData,
          updated_by_id: userId
        });
        if (response.status === 200) {
          // Update the local state immediately to reflect the change
          setAddons(addons.map(addon => 
            addon.addon_id === editingAddon.addon_id ? { ...addon, ...formData } : addon
          ));
        }
      } else {
        const response = await axios.post('http://localhost:3001/api/addons', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.addon) {
          setAddons(prev => [response.data.addon, ...prev]);
        }
      }
      await loadAddons(); // Refresh to ensure backend sync
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save addon');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addon) => {
    setEditingAddon(addon);
    setFormData({
      addon_name: addon.addon_name || '',
      description: addon.description || '',
      rate: addon.rate || '',
      unit_id: addon.unit_id || '',
      unit_conversion: addon.unit_conversion || '',
      status: addon.status !== undefined ? Number(addon.status) : 1,
      created_by_id: null
    });
    setShowModal(true);
  };

  const handleDelete = (addon) => {
    setAddonToDelete(addon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (addonToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/addons/${addonToDelete.addon_id}`);
        await loadAddons();
        setShowDeleteModal(false);
        setAddonToDelete(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete addon');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddon(null);
    setFormData({
      addon_name: '',
      description: '',
      rate: '',
      unit_id: '',
      unit_conversion: '',
      status: 1,
      created_by_id: null
    });
    setErrors({});
  };

  const filteredAddons = addons.filter(addon =>
    addon.addon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (addon.description && addon.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAddons = filteredAddons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Package className="me-2" size={24} />
                Addon Master
              </h2>
              <p className="text-muted mb-0">Manage addon items</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Addon
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
              placeholder="Search addons..."
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
                      <th style={{ minWidth: '200px' }}>Addon Name</th>
                      <th style={{ minWidth: '300px' }}>Description</th>
                      <th style={{ minWidth: '100px' }}>Rate</th>
                      <th style={{ minWidth: '150px' }}>Unit</th>
                      <th style={{ minWidth: '150px' }}>Unit Conversion</th>
                      <th style={{ minWidth: '100px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAddons.map((addon, index) => (
                      <tr key={addon.addon_id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong>{addon.addon_name}</strong>
                        </td>
                        <td>{addon.description || <span className="text-muted">-</span>}</td>
                        <td>{addon.rate ? `₹${addon.rate}` : <span className="text-muted">-</span>}</td>
                        <td>{units.find(u => u.unit_id === addon.unit_id)?.unit_name || <span className="text-muted">-</span>}</td>
                        <td>{addon.unit_conversion || <span className="text-muted">-</span>}</td>
                        <td>
                          <Badge bg={addon.status === 1 ? 'success' : 'secondary'}>
                            {addon.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-edit-${addon.addon_id}`}>Edit addon</Tooltip>}
                            >
                              <Button
                                size="sm"
                                variant="outline-info"
                                onClick={() => handleEdit(addon)}
                                title="Edit"
                              >
                                <Edit size={14} />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-delete-${addon.addon_id}`}>Delete addon</Tooltip>}
                            >
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(addon)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {currentAddons.length === 0 && (
                <div className="text-center py-5">
                  <Package size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No addons found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first addon to get started'}
                  </p>
                </div>
              )}
              {!loading && currentAddons.length > 0 && (
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingAddon ? 'Edit Addon' : 'Add New Addon'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Addon Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="addon_name"
                    value={formData.addon_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.addon_name}
                    placeholder="Enter addon name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.addon_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit *</Form.Label>
                  <Form.Select
                    name="unit_id"
                    value={formData.unit_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.unit_id}
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit.unit_id} value={unit.unit_id}>
                        {unit.unit_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.unit_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Conversion *</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit_conversion"
                    value={formData.unit_conversion}
                    onChange={handleInputChange}
                    isInvalid={!!errors.unit_conversion}
                    placeholder="Enter unit conversion"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.unit_conversion}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingAddon ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{addonToDelete?.addon_name}</strong>?
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

export default AddonMaster;