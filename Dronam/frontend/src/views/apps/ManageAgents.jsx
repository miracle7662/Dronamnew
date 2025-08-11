import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Table, Modal, Badge } from 'react-bootstrap'
import { toast } from 'react-hot-toast'
import axios from 'axios'

// Create axios instance with proxy configuration
const api = axios.create({
  baseURL: '/api', // Use proxy instead of direct URL
  headers: {
    'Content-Type': 'application/json',
  },
})

interface Agent {
  id: number
  name: string
  email: string
  phone: string
  country_id: number
  state_id: number
  district_id: number
  zone_id: number
  pan_number: string
  aadhar_number: string
  gst_number: string
  status: number
  created_at: string
}

interface Country {
  id: number
  name: string
  code: string
}

interface State {
  id: number
  name: string
  country_id: number
}

interface District {
  id: number
  name: string
  state_id: number
}

interface Zone {
  id: number
  name: string
  district_id: number
}

const ManageAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    country_id: '',
    state_id: '',
    district_id: '',
    zone_id: '',
    pan_number: '',
    aadhar_number: '',
    gst_number: '',
    status: '1'
  })

  // Load initial data
  useEffect(() => {
    loadAgents()
    loadCountries()
  }, [])

  // Load states when modal opens and country is selected
  useEffect(() => {
    console.log('useEffect triggered - showModal:', showModal, 'country_id:', formData.country_id)
    if (showModal && formData.country_id) {
      console.log('Loading states for country:', formData.country_id)
      loadStates(formData.country_id)
    }
  }, [showModal, formData.country_id])

  // Load districts when state is selected
  useEffect(() => {
    if (showModal && formData.state_id) {
      loadDistricts(formData.state_id)
    }
  }, [showModal, formData.state_id])

  // Load zones when district is selected
  useEffect(() => {
    if (showModal && formData.district_id) {
      loadZones(formData.district_id)
    }
  }, [showModal, formData.district_id])

  const loadAgents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/agents')
      setAgents(response.data)
    } catch (error) {
      console.error('Error loading agents:', error)
      toast.error('Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
      const response = await api.get('/countries')
      setCountries(response.data)
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const loadStates = async (countryId: string) => {
    if (!countryId) {
      setStates([])
      return
    }
    try {
      console.log('Loading states for country ID:', countryId)
      const response = await api.get(`/states/country/${countryId}`)
      console.log('States response:', response.data)
      console.log('States array length:', response.data.length)
      setStates(response.data)
    } catch (error: any) {
      console.error('Error loading states:', error)
      console.error('Error details:', error.response?.data)
    }
  }

  const loadDistricts = async (stateId: string) => {
    if (!stateId) {
      setDistricts([])
      return
    }
    try {
      console.log('Loading districts for state ID:', stateId)
      const response = await api.get(`/districts/by-state/${stateId}`)
      console.log('Districts response:', response.data)
      setDistricts(response.data)
    } catch (error) {
      console.error('Error loading districts:', error)
    }
  }

  const loadZones = async (districtId: string) => {
    if (!districtId) {
      setZones([])
      return
    }
    try {
      const response = await api.get(`/zones/by-district/${districtId}`)
      setZones(response.data)
    } catch (error) {
      console.error('Error loading zones:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Handle cascading dropdowns
    if (name === 'country_id') {
      setFormData(prev => ({ ...prev, state_id: '', district_id: '', zone_id: '' }))
      loadStates(value)
    } else if (name === 'state_id') {
      setFormData(prev => ({ ...prev, district_id: '', zone_id: '' }))
      loadDistricts(value)
    } else if (name === 'district_id') {
      setFormData(prev => ({ ...prev, zone_id: '' }))
      loadZones(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const agentData = {
        ...formData,
        country_id: parseInt(formData.country_id),
        state_id: parseInt(formData.state_id),
        district_id: parseInt(formData.district_id),
        zone_id: parseInt(formData.zone_id),
        status: parseInt(formData.status)
      }

      if (editingAgent) {
        await api.put(`/agents/${editingAgent.id}`, agentData)
        toast.success('Agent updated successfully!')
      } else {
        await api.post('/agents', agentData)
        toast.success('Agent created successfully! Welcome email sent.')
      }

      handleCloseModal()
      loadAgents()
    } catch (error: any) {
      console.error('Error saving agent:', error)
      toast.error(error.response?.data?.error || 'Failed to save agent')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      password: '',
      country_id: agent.country_id?.toString() || '',
      state_id: agent.state_id?.toString() || '',
      district_id: agent.district_id?.toString() || '',
      zone_id: agent.zone_id?.toString() || '',
      pan_number: agent.pan_number || '',
      aadhar_number: agent.aadhar_number || '',
      gst_number: agent.gst_number || '',
      status: agent.status?.toString() || '1'
    })
    setShowModal(true)
  }

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1
    const action = newStatus === 1 ? 'activate' : 'block'
    
    if (window.confirm(`Are you sure you want to ${action} this agent?`)) {
      try {
        await api.patch(`/agents/${id}/status`, { status: newStatus })
        toast.success(`Agent ${action}ed successfully!`)
        loadAgents()
      } catch (error: any) {
        console.error('Error updating agent status:', error)
        toast.error(error.response?.data?.error || 'Failed to update agent status')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await api.delete(`/agents/${id}`)
        toast.success('Agent deleted successfully!')
        loadAgents()
      } catch (error: any) {
        console.error('Error deleting agent:', error)
        toast.error(error.response?.data?.error || 'Failed to delete agent')
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAgent(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      country_id: '',
      state_id: '',
      district_id: '',
      zone_id: '',
      pan_number: '',
      aadhar_number: '',
      gst_number: '',
      status: '1'
    })
  }

  const handleOpenModal = () => {
    setShowModal(true)
    // Set default country to India (ID: 12)
    setFormData(prev => ({ ...prev, country_id: '12' }))
  }

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="danger">Inactive</Badge>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Manage Agents</h4>
              <Button variant="primary" onClick={handleOpenModal}>
                <i className="fi fi-rr-plus me-2"></i>
                Add New Agent
              </Button>
            </Card.Header>
            <Card.Body>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>PAN Number</th>
                      <th>Aadhar Number</th>
                      <th>GST Number</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent, index) => (
                      <tr key={agent.id}>
                        <td>{index + 1}</td>
                        <td>{agent.name}</td>
                        <td>{agent.email}</td>
                        <td>{agent.phone}</td>
                        <td>{agent.pan_number}</td>
                        <td>{agent.aadhar_number}</td>
                        <td>{agent.gst_number}</td>
                        <td>{getStatusBadge(agent.status)}</td>
                        <td>{new Date(agent.created_at).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(agent)}
                          >
                            <i className="fi fi-rr-edit"></i>
                          </Button>
                          <Button
                            variant={agent.status === 1 ? "outline-warning" : "outline-success"}
                            size="sm"
                            className="me-2"
                            onClick={() => handleToggleStatus(agent.id, agent.status)}
                            title={agent.status === 1 ? "Block Agent" : "Activate Agent"}
                          >
                            <i className={`fi ${agent.status === 1 ? 'fi-rr-ban' : 'fi-rr-check'}`}></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(agent.id)}
                          >
                            <i className="fi fi-rr-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Password {!editingAgent && '*'}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAgent}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.country_id}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>District *</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.state_id}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Zone *</Form.Label>
                  <Form.Select
                    name="zone_id"
                    value={formData.zone_id}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.district_id}
                  >
                    <option value="">Select Zone</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>PAN Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    placeholder="ABCDE1234F"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleInputChange}
                    required
                    maxLength={12}
                    placeholder="123456789012"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>GST Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    required
                    maxLength={15}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status?.toString() || '1'}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                editingAgent ? 'Update Agent' : 'Create Agent'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageAgents 