import PageDashBreadcrumb from '@/components/Common/PageDashBreadcrumb'
import { Col, Row, Card, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface DashboardData {
  countries: number;
  states: number;
  districts: number;
  zones: number;
}

const CRM = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('🔍 Loading dashboard data...')
      
      // For now, use mock data since we removed authentication
      const mockData = {
        countries: 6,
        states: 17,
        districts: 10,
        zones: 20
      }
      
      console.log('✅ Dashboard data loaded:', mockData)
      setDashboardData(mockData)
    } catch (error: any) {
      console.error('❌ Dashboard loading failed:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  return (
    <>
      <PageDashBreadcrumb title="Superadmin Dashboard" subName="Dashboards" />
      <Row className="g-3 g-md-4">
        <Col xl={12}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">Superadmin Dashboard</h2>
                  <p className="mb-0">Welcome to the Miracle Hotels Management System</p>
                </div>
                <div className="text-end">
                  <Button variant="light" size="sm" onClick={() => navigate('/apps/countries')}>
                    Manage Countries
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3}>
          <Card className="border-success">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="fi fi-rr-globe fs-1"></i>
              </div>
              <h3 className="mb-2">{dashboardData?.countries || 0}</h3>
              <p className="text-muted mb-0">Countries</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3}>
          <Card className="border-info">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="fi fi-rr-map fs-1"></i>
              </div>
              <h3 className="mb-2">{dashboardData?.states || 0}</h3>
              <p className="text-muted mb-0">States</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3}>
          <Card className="border-warning">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="fi fi-rr-building fs-1"></i>
              </div>
              <h3 className="mb-2">{dashboardData?.districts || 0}</h3>
              <p className="text-muted mb-0">Districts</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3}>
          <Card className="border-danger">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="fi fi-rr-marker fs-1"></i>
              </div>
              <h3 className="mb-2">{dashboardData?.zones || 0}</h3>
              <p className="text-muted mb-0">Zones</p>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={3}>
                  <Button variant="outline-primary" className="w-100" onClick={() => navigate('/apps/countries')}>
                    <i className="fi fi-rr-globe me-2"></i>
                    Manage Countries
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-info" className="w-100" onClick={() => navigate('/apps/states')}>
                    <i className="fi fi-rr-map me-2"></i>
                    Manage States
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-warning" className="w-100" onClick={() => navigate('/apps/districts')}>
                    <i className="fi fi-rr-building me-2"></i>
                    Manage Districts
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="outline-danger" className="w-100" onClick={() => navigate('/apps/zones')}>
                    <i className="fi fi-rr-marker me-2"></i>
                    Manage Zones
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Overview</h5>
            </Card.Header>
            <Card.Body>
              <p>As a Superadmin, you have full access to manage:</p>
              <ul>
                <li><strong>Common Masters:</strong> Countries, States, Districts, and Zones</li>
                <li><strong>User Management:</strong> Create and manage agents/admins</li>
                <li><strong>Hotel Management:</strong> Manage hotel registrations and details</li>
                <li><strong>System Settings:</strong> Configure system-wide settings</li>
              </ul>
              <p className="text-muted mb-0">Use the navigation menu to access different sections of the system.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CRM
