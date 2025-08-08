import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '@/Layouts/AuthLayout'
import TitleHelmet from '@/components/Common/TitleHelmet'
import { Button, Form, Stack, Alert } from 'react-bootstrap'
import AuthMinmal from './AuthMinmal'
import axios from 'axios'
import { useAuthContext } from '@/common/context'

const Login = () => {
  const navigate = useNavigate()
  const { saveSession } = useAuthContext()
  const [email, setEmail] = useState<string>('email@admin.com')
  const [password, setPassword] = useState<string>('1')
  const [userType, setUserType] = useState<string>('superadmin')
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateEmail = (input: string) => {
    if (!input) {
      setEmailError('Email is required')
      return false
    } else {
      setEmailError(null)
      return true
    }
  }

  const validatePassword = (input: string) => {
    if (!input) {
      setPasswordError('Password is required')
      return false
    } else {
      setPasswordError(null)
      return true
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      setLoading(true)
      
      try {
        console.log('📡 Making API call to login...')
        
        // Determine API endpoint based on user type
        let apiEndpoint = ''
        let userData: any = {}
        
        switch (userType) {
          case 'superadmin':
            apiEndpoint = 'http://localhost:3001/api/superadmin/login'
            const superadminResponse = await axios.post(apiEndpoint, { email, password })
            userData = {
              id: superadminResponse.data.superadmin.id,
              email: superadminResponse.data.superadmin.email,
              name: superadminResponse.data.superadmin.name,
              role: 'superadmin',
              token: superadminResponse.data.token
            }
            break
            
          case 'agent':
          case 'admin':
            apiEndpoint = 'http://localhost:3001/api/agents/login'
            const agentResponse = await axios.post(apiEndpoint, { email, password })
            userData = {
              id: agentResponse.data.agent.id,
              email: agentResponse.data.agent.email,
              name: agentResponse.data.agent.name,
              role: agentResponse.data.agent.role,
              token: agentResponse.data.token
            }
            break
            
          case 'hotel':
            apiEndpoint = 'http://localhost:3001/api/hotels/login'
            const hotelResponse = await axios.post(apiEndpoint, { email, password })
            userData = {
              id: hotelResponse.data.hotel.id,
              email: hotelResponse.data.hotel.email,
              name: hotelResponse.data.hotel.name,
              role: 'hotel',
              token: hotelResponse.data.token
            }
            break
            
          default:
            throw new Error('Invalid user type')
        }
        
        console.log('✅ Login successful!', userData)
        
        // Save to auth context
        saveSession(userData)
        
        // Store token in localStorage for API calls
        localStorage.setItem('authToken', userData.token)
        
        console.log('💾 User data stored successfully')
        console.log('🔄 Redirecting to dashboard...')
        
        // Redirect to dashboard
        navigate('/dashboards')
        
      } catch (error: any) {
        console.error('❌ Login failed!', error)
        setLoading(false)
        
        if (error.response?.data?.error) {
          setError(error.response.data.error)
        } else {
          setError('Login failed. Please try again.')
        }
      }
    }
  }

  return (
    <>
      <TitleHelmet title="Login" />
      <AuthLayout>
        <AuthMinmal>
                     <div className="mb-12">
             <h4 className="fw-bold mb-3">Login to your account</h4>
             <p className="fs-16 lead">Hey, Enter your details to get login to your account.</p>
           </div>
           {error && (
             <Alert variant="danger" className="mb-3">
               {error}
             </Alert>
           )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mb-3"
              >
                <option value="superadmin">Superadmin</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
                <option value="hotel">Hotel</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateEmail(e.target.value)
                }}
                isInvalid={!!emailError}
                required
              />
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validatePassword(e.target.value)
                }}
                isInvalid={!!passwordError}
                required
              />
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
              <span
                className="btn btn-icon position-absolute translate-middle top-50"
                style={{ right: '-1rem' }}
                onClick={togglePasswordVisibility}
              >
                <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
              </span>
            </Form.Group>
            <Stack direction="horizontal">
              <Form.Check type="checkbox" id="check-api-checkbox">
                <Form.Check.Input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Form.Check.Label>Remember me</Form.Check.Label>
              </Form.Check>
              <Link to="/auth/minimal/forgot-password" className="link-primary ms-auto">
                Forgot password?
              </Link>
            </Stack>
            <div className="d-grid gap-2 my-4">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                className="text-white"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
            <div>
              Don't have an account? <Link to="/auth/minimal/register">Create an Account</Link>
            </div>
            
            {/* Test User Credentials - Development Only */}
            <div className="mt-4 p-3 bg-light rounded border">
              <h6 className="text-muted mb-3">
                <i className="fi fi-rr-info me-2"></i>
                Test User Credentials (Development)
              </h6>
              <div className="row g-2">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                    <span className="fw-semibold text-primary">Superadmin:</span>
                    <span className="text-muted">email@admin.com / 1</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                    <span className="fw-semibold text-success">Agent:</span>
                    <span className="text-muted">agent@test.com / agent123</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                    <span className="fw-semibold text-warning">Admin:</span>
                    <span className="text-muted">admin@test.com / admin123</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                    <span className="fw-semibold text-info">Hotel:</span>
                    <span className="text-muted">hotel@test.com / hotel123</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 mb-6 border-bottom position-relative">
              <span className="small py-1 px-3 text-uppercase text-muted bg-body-tertiary rounded position-absolute translate-middle start-50">
                or
              </span>
            </div>
            <div className="d-grid flex-wrap d-sm-flex gap-2">
              <Button variant="neutral" className="px-3 flex-fill">
                <i className="fi fi-brands-google"></i>
                <span className="ms-2">Login with Google</span>
              </Button>
              <Button variant="neutral" className="px-3 flex-fill">
                <i className="fi fi-brands-facebook"></i>
                <span className="ms-2">Login with Facebook</span>
              </Button>
            </div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </>
  )
}

export default Login
