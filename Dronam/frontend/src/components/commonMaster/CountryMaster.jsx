import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Spinner
} from 'reactstrap';
import PageBreadcrumb from '@/components/Common/PageBreadcrumb';
import { countryService } from '@/services/countryService';
import { toast } from 'react-toastify';

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCountry, setCurrentCountry] = useState(null);
  const [formData, setFormData] = useState({
    country_name: '',
    country_code: '',
    phoneCode: '',
    currency: '',
    currencySymbol: '',
    capital: '',
    status: '1'
  });
  const [errors, setErrors] = useState({});

  // Fetch all countries
const fetchCountries = async () => {
    try {
      setLoading(true);
      const countries = await countryService.getAll();
      setCountries(countries);
    } catch (error) {
      toast.error('Failed to fetch countries');
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Handle form input changes
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.country_name.trim()) {
      newErrors.country_name = 'Country name is required';
    }
    if (!formData.country_code.trim()) {
      newErrors.country_code = 'Country code is required';
    } else if (formData.country_code.length !== 2) {
      newErrors.country_code = 'Country code must be 2 characters';
    }
    if (!formData.phoneCode.trim()) {
      newErrors.phoneCode = 'Phone code is required';
    }
    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    }
    if (!formData.currencySymbol.trim()) {
      newErrors.currencySymbol = 'Currency symbol is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create/edit country
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        country_name: formData.country_name,
        country_code: formData.country_code,
        phoneCode: formData.phoneCode,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        capital: formData.capital,
        status: parseInt(formData.status)
      };

      if (modalMode === 'create') {
        await countryService.create(payload);
        toast.success('Country created successfully');
      } else {
        await countryService.update(currentCountry.country_id, payload);
        toast.success('Country updated successfully');
      }
      
      setModal(false);
      resetForm();
      fetchCountries();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save country';
      toast.error(errorMessage);
      console.error('Error saving country:', error);
    }
  };

  // Handle delete country
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        await countryService.delete(id);
        toast.success('Country deleted successfully');
        fetchCountries();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete country';
        toast.error(errorMessage);
        console.error('Error deleting country:', error);
      }
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode('create');
    setCurrentCountry(null);
    resetForm();
    setModal(true);
  };

  // Open modal for edit
  const openEditModal = (country) => {
    setModalMode('edit');
    setCurrentCountry(country);
    setFormData({
      country_name: country.country_name,
      country_code: country.country_code,
      phoneCode: country.phoneCode || '',
      currency: country.currency || '',
      currencySymbol: country.currencySymbol || '',
      capital: country.capital || '',
      status: country.status.toString()
    });
    setModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      country_name: '',
      country_code: '',
      phoneCode: '',
      currency: '',
      currencySymbol: '',
      capital: '',
      status: '1'
    });
    setErrors({});
  };

  // Toggle modal
  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      resetForm();
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <PageBreadcrumb title="Country Master" pageTitle="Master Management" />
        
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Country Management</h5>
                <Button 
                  color="primary" 
                  onClick={openCreateModal}
                  className="btn-sm"
                >
                  <i className="ri-add-line align-bottom me-1"></i> Add Country
                </Button>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Loading countries...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="table-striped table-nowrap align-middle">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Country Name</th>
                          <th scope="col">Code</th>
                          <th scope="col">Capital</th>
                          <th scope="col">Phone Code</th>
                          <th scope="col">Currency</th>
                          <th scope="col">Symbol</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countries.map((country, index) => (
                          <tr key={country.country_id}>
                            <td>{index + 1}</td>
                            <td>{country.country_name}</td>
                            <td>{country.country_code}</td>
                            <td>{country.capital || '-'}</td>
                            <td>{country.phoneCode || '-'}</td>
                            <td>{country.currency || '-'}</td>
                            <td>{country.currencySymbol || '-'}</td>
                            <td>
                              <span 
                                className={`badge badge-soft-${country.status === 1 ? 'success' : 'danger'}`}
                              >
                                {country.status === 1 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="hstack gap-3 fs-15">
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => openEditModal(country)}
                                  className="btn-icon"
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDelete(country.country_id)}
                                  className="btn-icon"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>
          {modalMode === 'create' ? 'Add New Country' : 'Edit Country'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <Label for="country_name">Country Name <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    id="country_name"
                    name="country_name"
                    value={formData.country_name}
                    onChange={handleInputChange}
                    invalid={!!errors.country_name}
                    placeholder="Enter country name"
                  />
                  {errors.country_name && <div className="invalid-feedback">{errors.country_name}</div>}
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="country_code">Country Code <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    id="country_code"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    invalid={!!errors.country_code}
                    placeholder="e.g., US"
                    maxLength={2}
                  />
                  {errors.country_code && <div className="invalid-feedback">{errors.country_code}</div>}
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="capital">Capital</Label>
                  <Input
                    type="text"
                    id="capital"
                    name="capital"
                    value={formData.capital}
                    onChange={handleInputChange}
                    placeholder="Enter capital city"
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="phoneCode">Phone Code</Label>
                  <Input
                    type="text"
                    id="phoneCode"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleInputChange}
                    placeholder="e.g., +1"
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="currency">Currency</Label>
                  <Input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="e.g., USD"
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="currencySymbol">Currency Symbol</Label>
                  <Input
                    type="text"
                    id="currencySymbol"
                    name="currencySymbol"
                    value={formData.currencySymbol}
                    onChange={handleInputChange}
                    placeholder="e.g., $"
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {modalMode === 'create' ? 'Create' : 'Update'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default CountryMaster;
