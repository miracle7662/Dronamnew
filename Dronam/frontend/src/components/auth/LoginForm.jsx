import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const LoginForm = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: type // 'hotel' or 'agent'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.token, data.user);
        window.location.href = type === 'hotel' ? '/hotels' : '/agents';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <Card.Body>
        <h3>{type === 'hotel' ? 'Hotel Login' : 'Agent Login'}</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </Form.Group>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
