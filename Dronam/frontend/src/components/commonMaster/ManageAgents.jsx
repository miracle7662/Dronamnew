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
//   Pagination,
//   Tab,
//   Tabs
// } from 'react-bootstrap';
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   Users,
//   Flag,
//   Home,
//   Building,
//   CreditCard,
//   Shield
// } from 'lucide-react';
// import axios from 'axios';
// import { useAuthContext } from '@/common/context/useAuthContext';

// const ManageAgents = () => {
//   const { user } = useAuthContext();
//   const [agents, setAgents] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingAgent, setEditingAgent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [agentToDelete, setAgentToDelete] = useState(null);
//   const [activeTab, setActiveTab] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     address: '',
//     country_id: '',
//     state_id: '',
//     district_id: '',
//     zone_id: '',
//     agent_code: '',
//     commission_rate: '',
//     bank_name: '',
//     account_number: '',
//     ifsc_code: '',
//     pan_number: '',
//     gst_number: '',
//     status: 1,
//     created_by_id: null,
//     masteruserid: null
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     loadAgents();
//     loadCountries();
//     loadStates();
//     loadDistricts();
//     loadZones();
//   }, []);

//   const loadAgents = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get('http://localhost:3001/api/agents');
//       setAgents(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to load agents');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCountries = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/countries');
//       setCountries(response.data);
//     } catch (err) {
//       console.error('Error loading countries:', err);
//     }
//   };

//   const loadStates = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/states');
//       setStates(response.data);
//     } catch (err) {
//       console.error('Error loading states:', err);
//     }
//   };

//   const loadDistricts = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/districts');
//       setDistricts(response.data);
//     } catch (err) {
//       console.error('Error loading districts:', err);
//     }
//   };

//   const loadZones = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/zones');
//       setZones(response.data);
//     } catch (err) {
//       console.error('Error loading zones:', err);
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
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Agent name is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     }
    
//     if (!formData.country_id) {
//       newErrors.country_id = 'Country is required';
//     }
    
//     if (!formData.state_id) {
//       newErrors.state_id = 'State is required';
//     }
    
//     if (!formData.commission_rate) {
//       newErrors.commission_rate = 'Commission rate is required';
//     } else if (isNaN(formData.commission_rate) || formData.commission_rate < 0 || formData.commission_rate > 100) {
//       newErrors.commission_rate = 'Commission rate must be between 0 and 100';
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
      
//       if (editingAgent) {
//         await axios.put(`http://localhost:3001/api/agents/${editingAgent.id}`, {
//           ...formData,
//           updated_by_id: userId
//         });
//         await loadAgents();
//       } else {
//         const response = await axios.post('http://localhost:3001/api/agents', {
//           ...formData,
//           created_by_id: userId,
//           masteruserid: userId
//         });
//         if (response.data.agent) {
//           setAgents(prev => [response.data.agent, ...prev]);
//         }
//       }
//       handleCloseModal();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to save agent');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (agent) => {
//     setEditingAgent(agent);
//     setFormData({
//       name: agent.name || '',
//       email: agent.email || '',
//       password: agent.password || '',
//       phone: agent.phone || '',
//       address: agent.address || '',
//       country_id: agent.country_id || '',
//       state_id: agent.state_id || '',
//       district_id: agent.district_id || '',
//       zone_id: agent.zone_id || '',
//       agent_code: agent.agent_code || '',
//       commission_rate: agent.commission_rate || '',
//       bank_name: agent.bank_name || '',
//       account_number: agent.account_number || '',
//       ifsc_code: agent.ifsc_code || '',
//       pan_number: agent.pan_number || '',
//       gst_number: agent.gst_number || '',
//       status: agent.status !== undefined ? agent.status : 1
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (agent) => {
//     setAgentToDelete(agent);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (agentToDelete) {
//       try {
//         await axios.delete(`http://localhost:3001/api/agents/${agentToDelete.id}`);
//         await loadAgents();
//         setShowDeleteModal(false);
//         setAgentToDelete(null);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to delete agent');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingAgent(null);
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       phone: '',
//       address: '',
//       country_id: '',
//       state_id: '',
//       district_id: '',
//       zone_id: '',
//       agent_code: '',
//       commission_rate: '',
//       bank_name: '',
//       account_number: '',
//       ifsc_code: '',
//       pan_number: '',
//       gst_number: '',
//       status: 1,
//       created_by_id: null,
//       masteruserid: null
//     });
//     setErrors({});
//   };

//   const filteredAgents = agents.filter(agent =>
//     agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     agent.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     agent.agent_code?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getFilteredAgentsByStatus = (status) => {
//     return filteredAgents.filter(agent => 
//       status === 'all' ? true : agent.status === (status === 'active' ? 1 : 0)
//     );
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentAgents = getFilteredAgentsByStatus(activeTab).slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(getFilteredAgentsByStatus(activeTab).length / itemsPerPage);

//   const getAgentStatusBadge = (status) => {
//     return status === 1 ? 'success' : 'secondary';
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h2 className="mb-1">
//                 <Users className="me-2" size={24} />
//                 Manage Agents
//               </h2>
//               <p className="text-muted mb-0">Manage agents and their information</p>
//             </div>
//             <Button 
//               variant="primary" 
//               onClick={() => setShowModal(true)}
//               className="d-flex align-items-center gap-2"
//             >
//               <Plus size={18} />
//               Add Agent
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
//               placeholder="Search agents..."
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
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => {
//               setActiveTab(k);
//               setCurrentPage(1);
//             }}
//             className="mb-0"
//             fill
//           >
//             <Tab eventKey="all" title={`All (${getFilteredAgentsByStatus('all').length})`} />
//             <Tab eventKey="active" title={`Active (${getFilteredAgentsByStatus('active').length})`} />
//             <Tab eventKey="inactive" title={`Inactive (${getFilteredAgentsByStatus('inactive').length})`} />
//           </Tabs>

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
//                       <th style={{ minWidth: '200px' }}>Agent</th>
//                       <th style={{ minWidth: '120px' }}>Agent Code</th>
//                       <th style={{ minWidth: '150px' }}>Commission</th>
//                       <th style={{ minWidth: '200px' }}>Contact</th>
//                       <th style={{ minWidth: '250px' }}>Address</th>
//                       <th style={{ minWidth: '150px' }}>Location</th>
//                       <th style={{ minWidth: '100px' }}>Status</th>
//                       <th style={{ minWidth: '120px' }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentAgents.map((agent, index) => (
//                       <tr key={agent.id}>
//                         <td>{indexOfFirstItem + index + 1}</td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="me-2">
//                               <User size={16} className="text-muted" />
//                             </div>
//                             <div>
//                               <strong>{agent.name}</strong>
//                               <br />
//                               <small className="text-muted">{agent.email}</small>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <Badge bg="info" className="text-uppercase">
//                             {agent.agent_code || 'N/A'}
//                           </Badge>
//                         </td>
//                         <td>
//                           <Badge bg="success">
//                             {agent.commission_rate}%
//                           </Badge>
//                         </td>
//                         <td>
//                           <div>
//                             <Mail size={14} className="text-muted me-1" />
//                             {agent.email}
//                           </div>
//                           <div>
//                             <Phone size={14} className="text-muted me-1" />
//                             {agent.phone}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <MapPin size={14} className="text-muted me-1" />
//                             <span className="text-truncate" style={{ maxWidth: '200px' }}>
//                               {agent.address}
//                             </span>
//                           </div>
//                         </td>
//                         <td>
//                           <div>
//                             <Flag size={14} className="text-muted me-1" />
//                             {agent.country_name}
//                           </div>
//                           <div>
//                             <Home size={14} className="text-muted me-1" />
//                             {agent.state_name}
//                           </div>
//                         </td>
//                         <td>
//                           <Badge bg={getAgentStatusBadge(agent.status)}>
//                             {agent.status === 1 ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-1">
//                             <Button
//                               size="sm"
//                               variant="outline-info"
//                               onClick={() => handleEdit(agent)}
//                               title="Edit"
//                             >
//                               <Edit size={14} />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline-danger"
//                               onClick={() => handleDelete(agent)}
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

//               {currentAgents.length === 0 && (
//                 <div className="text-center py-5">
//                   <Users size={48} className="text-muted mb-3" />
//                   <h5 className="text-muted">No agents found</h5>
//                   <p className="text-muted">
//                     {searchTerm ? 'Try adjusting your search terms' : 'Add your first agent to get started'}
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

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {editingAgent ? 'Edit Agent' : 'Add New Agent'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Agent Name *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.name}
//                     placeholder="Enter agent name"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.name}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Agent Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="agent_code"
//                     value={formData.agent_code}
//                     onChange={handleInputChange}
//                     placeholder="Enter agent code"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email *</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.email}
//                     placeholder="Enter email address"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.email}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Enter password"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Phone *</Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.phone}
//                     placeholder="Enter phone number"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.phone}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Commission Rate (%)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="commission_rate"
//                     value={formData.commission_rate}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.commission_rate}
//                     placeholder="Enter commission rate"
//                     min="0"
//                     max="100"
//                     step="0.01"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.commission_rate}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={12}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Address</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     placeholder="Enter complete address"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Country *</Form.Label>
//                   <Form.Select
//                     name="country_id"
//                     value={formData.country_id}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.country_id}
//                   >
//                     <option value="">Select Country</option>
//                     {countries.map(country => (
//                       <option key={country.country_id} value={country.country_id}>
//                         {country.country_name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.country_id}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>State *</Form.Label>
//                   <Form.Select
//                     name="state_id"
//                     value={formData.state_id}
//                     onChange={handleInputChange}
//                     isInvalid={!!errors.state_id}
//                   >
//                     <option value="">Select State</option>
//                     {states.filter(state => state.country_id == formData.country_id).map(state => (
//                       <option key={state.state_id} value={state.state_id}>
//                         {state.state_name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.state_id}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>District</Form.Label>
//                   <Form.Select
//                     name="district_id"
//                     value={formData.district_id}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select District</option>
//                     {districts.filter(district => district.state_id == formData.state_id).map(district => (
//                       <option key={district.district_id} value={district.district_id}>
//                         {district.district_name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Zone</Form.Label>
//                   <Form.Select
//                     name="zone_id"
//                     value={formData.zone_id}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select Zone</option>
//                     {zones.map(zone => (
//                       <option key={zone.zone_id} value={zone.zone_id}>
//                         {zone.zone_name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Bank Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="bank_name"
//                     value={formData.bank_name}
//                     onChange={handleInputChange}
//                     placeholder="Enter bank name"
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Account Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="account_number"
//                     value={formData.account_number}
//                     onChange={handleInputChange}
//                     placeholder="Enter account number"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>IFSC Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="ifsc_code"
//                     value={formData.ifsc_code}
//                     onChange={handleInputChange}
//                     placeholder="Enter IFSC code"
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>PAN Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="pan_number"
//                     value={formData.pan_number}
//                     onChange={handleInputChange}
//                     placeholder="Enter PAN number"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>GST Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="gst_number"
//                     value={formData.gst_number}
//                     onChange={handleInputChange}
//                     placeholder="Enter GST number"
//                   />
//                 </Form.Group>
//               </Col>
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
//               {loading ? 'Saving...' : (editingAgent ? 'Update' : 'Save')}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete <strong>{agentToDelete?.name}</strong>?
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

// export default ManageAgents;



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
  Tab,
  Tabs,
  Spinner
} from 'react-bootstrap';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  Users,
  Flag,
  Home,
  CreditCard,
  Shield
} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '@/common/context/useAuthContext';

const ManageAgents = () => {
  const { user } = useAuthContext();
  const [agents, setAgents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    country_id: '',
    state_id: '',
    district_id: '',
    zone_id: '',
    pan_number: '',
    aadhar_number: '',
    gst_number: '',
    role: 'agent',
    status: 1,
    created_by_id: user?.id || null,
    updated_by_id: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadAgents(),
          loadCountries(),
          loadStates(),
          loadDistricts(),
          loadZones()
        ]);
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Initial data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/agents');
      setAgents(response.data);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to load agents');
    }
  };

  const loadCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/countries');
      setCountries(response.data);
    } catch (err) {
      throw new Error('Failed to load countries');
    }
  };

  const loadStates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/states');
      setStates(response.data);
    } catch (err) {
      throw new Error('Failed to load states');
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/districts');
      setDistricts(response.data);
    } catch (err) {
      throw new Error('Failed to load districts');
    }
  };

  const loadZones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/zones');
      setZones(response.data);
    } catch (err) {
      throw new Error('Failed to load zones');
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
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
    setError('');
    
    try {
      if (editingAgent) {
        await axios.put(`http://localhost:3001/api/agents/${editingAgent.id}`, {
          ...formData,
          updated_by_id: user?.id || null
        });
      } else {
        await axios.post('http://localhost:3001/api/agents', {
          ...formData,
          created_by_id: user?.id || null
        });
      }
      await loadAgents();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save agent');
      console.error('Save agent error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name || '',
      email: agent.email || '',
      password: '',
      phone: agent.phone || '',
      address: agent.address || '',
      country_id: agent.country_id || '',
      state_id: agent.state_id || '',
      district_id: agent.district_id || '',
      zone_id: agent.zone_id || '',
      pan_number: agent.pan_number || '',
      aadhar_number: agent.aadhar_number || '',
      gst_number: agent.gst_number || '',
      role: agent.role || 'agent',
      status: agent.status !== undefined ? agent.status : 1,
      created_by_id: agent.created_by_id || null,
      updated_by_id: agent.updated_by_id || null
    });
    setShowModal(true);
  };

  const handleDelete = (agent) => {
    setAgentToDelete(agent);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!agentToDelete) return;
    
    setLoading(true);
    setError('');
    
    try {
      await axios.delete(`http://localhost:3001/api/agents/${agentToDelete.id}`);
      await loadAgents();
      setShowDeleteModal(false);
      setAgentToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete agent');
      console.error('Delete agent error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAgent(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      country_id: '',
      state_id: '',
      district_id: '',
      zone_id: '',
      pan_number: '',
      aadhar_number: '',
      gst_number: '',
      role: 'agent',
      status: 1,
      created_by_id: user?.id || null,
      updated_by_id: null
    });
    setErrors({});
  };

  const filteredAgents = agents.filter(agent => {
    if (!agent) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (agent.name?.toLowerCase().includes(searchLower) || '') ||
      (agent.email?.toLowerCase().includes(searchLower) || '') ||
      (agent.phone?.toLowerCase().includes(searchLower) || '') ||
      (agent.role?.toLowerCase().includes(searchLower) || '')
    );
  });

  const getFilteredAgentsByStatus = (status) => {
    return filteredAgents.filter(agent => 
      status === 'all' ? true : agent.status === (status === 'active' ? 1 : 0)
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = getFilteredAgentsByStatus(activeTab).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(getFilteredAgentsByStatus(activeTab).length / itemsPerPage);

  const getAgentStatusBadge = (status) => {
    return status === 1 ? 'success' : 'secondary';
  };

  const getCountryName = (countryId) => {
    const country = countries.find(c => c.country_id === countryId);
    return country ? country.country_name : 'N/A';
  };

  const getStateName = (stateId) => {
    const state = states.find(s => s.state_id === stateId);
    return state ? state.state_name : 'N/A';
  };

  if (loading && agents.length === 0) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading agents data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <Users className="me-2" size={24} />
                Manage Agents
              </h2>
              <p className="text-muted mb-0">Manage agents and their information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={18} />
              Add Agent
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
              placeholder="Search agents..."
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
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setCurrentPage(1);
            }}
            className="mb-0"
            fill
          >
            <Tab eventKey="all" title={`All (${getFilteredAgentsByStatus('all').length})`} />
            <Tab eventKey="active" title={`Active (${getFilteredAgentsByStatus('active').length})`} />
            <Tab eventKey="inactive" title={`Inactive (${getFilteredAgentsByStatus('inactive').length})`} />
          </Tabs>

          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Table hover className="mb-0">
              <thead className="table-light sticky-top bg-white" style={{ zIndex: 1 }}>
                <tr>
                  <th style={{ minWidth: '50px' }}>#</th>
                  <th style={{ minWidth: '200px' }}>Agent</th>
                  <th style={{ minWidth: '100px' }}>Role</th>
                  <th style={{ minWidth: '200px' }}>Contact</th>
                  <th style={{ minWidth: '250px' }}>Address</th>
                  <th style={{ minWidth: '150px' }}>Location</th>
                  <th style={{ minWidth: '120px' }}>Documents</th>
                  <th style={{ minWidth: '100px' }}>Status</th>
                  <th style={{ minWidth: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.length > 0 ? (
                  currentAgents.map((agent, index) => (
                    <tr key={agent.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <User size={16} className="text-muted" />
                          </div>
                          <div>
                            <strong>{agent.name}</strong>
                            <br />
                            <small className="text-muted">{agent.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="text-uppercase">
                          {agent.role}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <Mail size={14} className="text-muted me-1" />
                          {agent.email}
                        </div>
                        <div>
                          <Phone size={14} className="text-muted me-1" />
                          {agent.phone || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <MapPin size={14} className="text-muted me-1" />
                          <span className="text-truncate" style={{ maxWidth: '200px' }}>
                            {agent.address || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <Flag size={14} className="text-muted me-1" />
                          {getCountryName(agent.country_id)}
                        </div>
                        <div>
                          <Home size={14} className="text-muted me-1" />
                          {getStateName(agent.state_id)}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {agent.pan_number && (
                            <div>
                              <CreditCard size={14} className="text-muted me-1" />
                              PAN: {agent.pan_number}
                            </div>
                          )}
                          {agent.aadhar_number && (
                            <div>
                              <Shield size={14} className="text-muted me-1" />
                              Aadhar: {agent.aadhar_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getAgentStatusBadge(agent.status)}>
                          {agent.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-info"
                            onClick={() => handleEdit(agent)}
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(agent)}
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      <Users size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No agents found</h5>
                      <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first agent to get started'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
              />
              <Pagination.Prev 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              />
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => !loading && setCurrentPage(page)}
                  disabled={loading}
                >
                  {page}
                </Pagination.Item>
              ))}
              
              <Pagination.Next 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              />
              <Pagination.Last 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
              />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Agent Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter agent name"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password {!editingAgent && '*'}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    disabled={loading}
                    required={!editingAgent}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.country_id}
                    disabled={loading}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.state_id}
                    disabled={loading}
                  >
                    <option value="">Select State</option>
                    {states
                      .filter(state => state.country_id == formData.country_id)
                      .map(state => (
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
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select District</option>
                    {districts
                      .filter(district => district.state_id == formData.state_id)
                      .map(district => (
                        <option key={district.district_id} value={district.district_id}>
                          {district.district_name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zone</Form.Label>
                  <Form.Select
                    name="zone_id"
                    value={formData.zone_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select Zone</option>
                    {zones.map(zone => (
                      <option key={zone.zone_id} value={zone.zone_id}>
                        {zone.zone_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleInputChange}
                    placeholder="Enter Aadhar number"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                    disabled={loading}
                  />
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
                    disabled={loading}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Saving...</span>
                </>
              ) : editingAgent ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => !loading && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{agentToDelete?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAgents;