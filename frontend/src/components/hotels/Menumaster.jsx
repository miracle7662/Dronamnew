
// import React, { useState, useEffect } from 'react';
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Button, 
//   Modal, 
//   Form, 
//   Alert,
//   Badge,
//   InputGroup,
//   Pagination
// } from 'react-bootstrap';
// import { 
//   Plus, 
//   Search, 
//   Edit, 
//   Trash2, 
//   Utensils
// } from 'lucide-react';
// import axios from 'axios';
// import { useAuthContext } from '@/common/context/useAuthContext';

// const MenuMaster = () => {
//   const { user } = useAuthContext();
//   const [menus, setMenus] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingMenu, setEditingMenu] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [menuToDelete, setMenuToDelete] = useState(null);

//   const [formData, setFormData] = useState({
//     menu_name: '',
//     menu_code: '',
//     categories_id: '',
//     preparation_time: '',
//     description: '',
//     status: 1,
//     created_by_id: null
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     loadMenus();
//     loadCategories();
//   }, []);

//   const loadMenus = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get('http://localhost:3001/api/menumaster');
//       setMenus(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to load menus');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/categories');
//       setCategories(response.data);
//     } catch (err) {
//       console.error('Error loading categories:', err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
//     setFormData(prev => ({
//       ...prev,
//       [name]: val
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.menu_name.trim()) {
//       newErrors.menu_name = 'Menu name is required';
//     }
    
//     if (!formData.menu_code.trim()) {
//       newErrors.menu_code = 'Menu code is required';
//     } else if (formData.menu_code.length !== 4) {
//       newErrors.menu_code = 'Menu code must be 4 characters';
//     }
    
//     if (!formData.categories_id) {
//       newErrors.categories_id = 'Category is required';
//     }
    
//     if (formData.preparation_time && !/^\d{2}:\d{2}:\d{2}$/.test(formData.preparation_time)) {
//       newErrors.preparation_time = 'Preparation time must be in HH:MM:SS format (e.g., 00:20:00)';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setLoading(true);
    
//     try {
//       const userId = user?.id || 1;
//       if (editingMenu) {
//         await axios.put(`http://localhost:3001/api/menumaster/${editingMenu.menu_id}`, {
//           ...formData,
//           updated_by_id: userId
//         });
//         await loadMenus();
//       } else {
//         const response = await axios.post('http://localhost:3001/api/menumaster', {
//           ...formData,
//           created_by_id: userId
//         });
//         if (response.data.menuItem) {
//           setMenus(prev => [response.data.menuItem, ...prev]);
//         }
//       }
//       handleCloseModal();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to save menu');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (menu) => {
//     setEditingMenu(menu);
//     setFormData({
//       menu_name: menu.menu_name,
//       menu_code: menu.menu_code || '',
//       categories_id: menu.categories_id || '',
//       preparation_time: menu.preparation_time || '',
//       description: menu.description || '',
//       status: menu.status !== undefined ? menu.status : 1
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (menu) => {
//     setMenuToDelete(menu);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (menuToDelete) {
//       try {
//         await axios.delete(`http://localhost:3001/api/menumaster/${menuToDelete.menu_id}`);
//         await loadMenus();
//         setShowDeleteModal(false);
//         setMenuToDelete(null);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to delete menu');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingMenu(null);
//     setFormData({
//       menu_name: '',
//       menu_code: '',
//       categories_id: '',
//       preparation_time: '',
//       description: '',
//       status: 1,
//       created_by_id: null
//     });
//     setErrors({});
//   };

//   const filteredMenus = menus.filter(menu =>
//     menu.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (menu.menu_code && menu.menu_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (menu.category_name && menu.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (menu.preparation_time && menu.preparation_time.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h2 className="mb-1">
//                 <Utensils className="me-2" size={24} />
//                 Menu Master
//               </h2>
//               <p className="text-muted mb-0">Manage menus and their information</p>
//             </div>
//             <Button 
//               variant="primary" 
//               onClick={() => setShowModal(true)}
//               className="d-flex align-items-center gap-2"
//             >
//               <Plus size={18} />
//               Add Menu
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={6}>
//           <InputGroup>
//             <InputGroup.Text>
//               <Search size={16} />
//             </InputGroup.Text>
//             <Form.Control
//               type="text"
//               placeholder="Search menus..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </InputGroup>
//         </Col>
//       </Row>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       <Card>
//         <Card.Body className="p-0">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                 <Table hover className="mb-0">
//                   <thead className="table-light sticky-top bg-white" style={{ zIndex: 1 }}>
//                     <tr>
//                       <th style={{ minWidth: '50px' }}>#</th>
//                       <th style={{ minWidth: '200px' }}>Menu</th>
//                       <th style={{ minWidth: '100px' }}>Code</th>
//                       <th style={{ minWidth: '150px' }}>Category</th>
//                       <th style={{ minWidth: '150px' }}>Preparation Time</th>
//                       <th style={{ minWidth: '200px' }}>Description</th>
//                       <th style={{ minWidth: '100px' }}>Status</th>
//                       <th style={{ minWidth: '120px' }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentMenus.map((menu, index) => (
//                       <tr key={menu.menu_id}>
//                         <td>{indexOfFirstItem + index + 1}</td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="me-2">
//                               <Utensils size={16} className="text-muted" />
//                             </div>
//                             <strong>{menu.menu_name}</strong>
//                           </div>
//                         </td>
//                         <td>
//                           <Badge bg="info" className="text-uppercase">
//                             {menu.menu_code || '-'}
//                           </Badge>
//                         </td>
//                         <td>
//                           {menu.category_name ? (
//                             <span>{menu.category_name}</span>
//                           ) : (
//                             <span className="text-muted">-</span>
//                           )}
//                         </td>
//                         <td>
//                           {menu.preparation_time || <span className="text-muted">-</span>}
//                         </td>
//                         <td>
//                           {menu.description ? (
//                             <span className="text-muted">{menu.description}</span>
//                           ) : (
//                             <span className="text-muted">-</span>
//                           )}
//                         </td>
//                         <td>
//                           <Badge bg={menu.status === 1 ? 'success' : 'secondary'}>
//                             {menu.status === 1 ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-1">
//                             <Button
//                               size="sm"
//                               variant="outline-info"
//                               onClick={() => handleEdit(menu)}
//                               title="Edit"
//                             >
//                               <Edit size={14} />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline-danger"
//                               onClick={() => handleDelete(menu)}
//                               title="Delete"
//                             >
//                               <Trash2 size={14} />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>

//               {currentMenus.length === 0 && (
//                 <div className="text-center py-5">
//                   <Utensils size={48} className="text-muted mb-3" />
//                   <h5 className="text-muted">No menus found</h5>
//                   <p className="text-muted">
//                     {searchTerm ? 'Try adjusting your search terms' : 'Add your first menu to get started'}
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>

//       {totalPages > 1 && (
//         <Row className="mt-4">
//           <Col className="d-flex justify-content-center">
//             <Pagination>
//               <Pagination.First 
//                 onClick={() => setCurrentPage(1)}
//                 disabled={currentPage === 1}
//               />
//               <Pagination.Prev 
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               />
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <Pagination.Item
//                   key={page}
//                   active={page === currentPage}
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </Pagination.Item>
//               ))}
              
//               <Pagination.Next 
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               />
//               <Pagination.Last 
//                 onClick={() => setCurrentPage(totalPages)}
//                 disabled={currentPage === totalPages}
//               />
//             </Pagination>
//           </Col>
//         </Row>
//       )}

//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {editingMenu ? 'Edit Menu' : 'Add New Menu'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Menu Name *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="menu_name"
//                     value={formData.menu_name}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.menu_name}
//                     placeholder="Enter menu name"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.menu_name}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Menu Code *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="menu_code"
//                     value={formData.menu_code}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.menu_code}
//                     placeholder="e.g., MN01, MN02"
//                     maxLength={4}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.menu_code}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select
//                     name="categories_id"
//                     value={formData.categories_id}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.categories_id}
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category.categories_id} value={category.categories_id}>
//                         {category.category_name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.categories_id}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Preparation Time</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="preparation_time"
//                     value={formData.preparation_time}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.preparation_time}
//                     placeholder="e.g., 00:20:00"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.preparation_time}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Status</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                   >
//                     <option value={1}>Active</option>
//                     <option value={0}>Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}></Col>
//             </Row>
//             <Row>
//               <Col md={12}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Enter menu description (optional)"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : (editingMenu ? 'Update' : 'Save')}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete <strong>{menuToDelete?.menu_name}</strong>?
//           This action cannot be undone.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default MenuMaster;

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
  const [itemsPerPage] = useState(10);
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
        await axios.put(`http://localhost:3001/api/menumaster/${editingMenuItem.menu_id}`, {
          ...formData,
          updated_by_id: userId
        });
      } else {
        const response = await axios.post('http://localhost:3001/api/menumaster', {
          ...formData,
          created_by_id: userId
        });
        if (response.data.menuItem) {
          setMenuItems(prev => [response.data.menuItem, ...prev]);
        }
      }
      await loadMenuItems();
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
      status: menuItem.status !== undefined ? menuItem.status : 1
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
              <p className="text-muted mb-0">Manage menu items</p>
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