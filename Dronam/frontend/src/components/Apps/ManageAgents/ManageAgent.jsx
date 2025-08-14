import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Alert
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const ManageAgent = () => {
  const [agents, setAgents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all required data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAgents(),
        fetchCountries(),
        fetchStates(),
        fetchDistricts(),
        fetchZones()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/agents`);
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to fetch agents');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError('Failed to fetch countries');
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/states`);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
      setError('Failed to fetch states');
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/districts`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Failed to fetch districts');
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/zones`);
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setError('Failed to fetch zones');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    country_id: Yup.string().required('Country is required'),
    state_id: Yup.string().required('State is required'),
    district_id: Yup.string().required('District is required'),
    zone_id: Yup.string().required('Zone is required'),
    address: Yup.string().required('Address is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      country_id: '',
      state_id: '',
      district_id: '',
      zone_id: '',
      address: '',
      pan_number: '',
      aadhar_number: '',
      gst_number: ''
  });

  const handleSubmit = async (values) => {
    try {
      if (editMode && selectedAgent) {
        await axios.put(`${API_BASE_URL}/api/agents/${selectedAgent.id}`, values);
      } else {
        await axios.post(`${API_BASE_URL}/api/agents`, values);
      }
      fetchAgents();
      toggleModal();
      formik.resetForm();
    } catch (error) {
      console.error('Error saving agent:', error);
      setError(error.response?.data?.error || 'Failed to save agent');
    }
  };

  return (
    <div className="page-content">
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Manage Agents</h5>
              <p className="text-muted">Manage agent information with country, state, district, and zone details</p>
            </CardHeader>
            <CardBody>
              {error && <Alert color="danger">{error}</Alert>}
              
              <div className="mb-3">
                <Button color="primary" onClick={() => setModal(true)}>
                  Add New Agent
                </Button>
              </div>

              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>District</th>
                    <th>Zone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id}>
                      <td>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.phone}</td>
                      <td>{getCountryName(agent.country_id)}</td>
                      <td>{getStateName(agent.state_id)}</td>
                      <td>{getDistrictName(agent.district_id)}</td>
                      <td>{getZoneName(agent.zone_id)}</td>
                      <td>
                        <Button color="info" size="sm" onClick={() => handleEdit(agent)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={() => handleDelete(agent.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg">
        <ModalHeader toggle={() => setModal(false)}>
          {editMode ? 'Edit Agent' : 'Add New Agent'}
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            {/* Form fields for agent management */}
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input {...formik.getFieldProps('name')} invalid={formik.touched.name && formik.errors.name} />
                  <FormFeedback>{formik.errors.name}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input {...formik.getFieldProps('email')} invalid={formik.touched.email && formik.errors.email} />
                  <FormFeedback>{formik.errors.email}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input {...formik.getFieldProps('phone')} invalid={formik.touched.phone && formik.errors.phone} />
                  <FormFeedback>{formik.errors.phone}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="country_id">Country</Label>
                  <Input {...formik.getFieldProps('country_id')} invalid={formik.touched.country_id && formik.errors.country_id}>
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.country_id} value={country.country_id}>{country.country_name}</option>
                    ))}
                  </Input>
                  <FormFeedback>{formik.errors.country_id}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="state_id">State</Label>
                  <Input {...formik.getFieldProps('state_id')} invalid={formik.touched.state_id && formik.errors.state_id}>
                    <option value="">Select State</option>
                    {states.filter(s => s.country_id === formik.values.country_id).map(state => (
                      <option key={state.state_id} value={state.state_id}>{state.state_name}</option>
                    ))}
                  </Input>
                  <FormFeedback>{formik.errors.state_id}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="district_id">District</Label>
                  <Input {...formik.getFieldProps('district_id')} invalid={formik.touched.district_id && formik.errors.district_id}>
                    <option value="">Select District</option>
                    {districts.filter(d => d.state_id === formik.values.state_id).map(district => (
                      <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
                    ))}
                  </Input>
                  <FormFeedback>{formik.errors.district_id}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="zone_id">Zone</Label>
                  <Input {...formik.getFieldProps('zone_id')} invalid={formik.touched.zone_id && formik.errors.zone_id}>
                    <option value="">Select Zone</option>
                    {zones.filter(z => z.district_id === formik.values.district_id).map(zone => (
                      <option key={zone.zone_id} value={zone.zone_id}>{zone.zone_name}</option>
                    ))}
                  </Input>
                  <FormFeedback>{formik.errors.zone_id}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input {...formik.getFieldProps('address')} invalid={formik.touched.address && formik.errors.address} />
                  <FormFeedback>{formik.errors.address}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="pan_number">PAN Number</Label>
                  <Input {...formik.getFieldProps('pan_number')} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="aadhar_number">Aadhar Number</Label>
                  <Input {...formik.getFieldProps('aadhar_number')} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="gst_number">GST Number</Label>
                  <Input {...formik.getFieldProps('gst_number')} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editMode ? 'Update' : 'Save'} Agent
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAgent;
