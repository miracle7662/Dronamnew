const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login agent/admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const agent = db.prepare('SELECT * FROM agents WHERE email = ? AND status = 1').get(email);
    
    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, agent.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: agent.id, 
        email: agent.email, 
        name: agent.name, 
        role: agent.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    const { password: _, ...agentWithoutPassword } = agent;
    
    res.json({
      message: 'Login successful!',
      agent: agentWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Get all agents
const getAllAgents = (req, res) => {
  try {
    const agents = db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

// Get agent by ID
const getAgentById = (req, res) => {
  try {
    const { id } = req.params;
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
};

// Create new agent
const createAgent = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      address, 
      country_id, 
      state_id, 
      district_id, 
      zone_id, 
      pan_number, 
      aadhar_number,
      gst_number
    } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if email already exists
    const existingAgent = db.prepare('SELECT id FROM agents WHERE email = ?').get(email);
    if (existingAgent) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO agents (
        email, password, name, role, phone, address, 
        country_id, state_id, district_id, zone_id, 
        pan_number, aadhar_number, gst_number, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      email, hashedPassword, name, role || 'agent', phone, address,
      country_id, state_id, district_id, zone_id,
      pan_number, aadhar_number, gst_number, 1 // created_by = 1 (superadmin)
    );

    const newAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid);
    const { password: _, ...agentWithoutPassword } = newAgent;
    
    // Send welcome email with login credentials
    try {
      await sendWelcomeEmail(email, name, password);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({
      message: 'Agent created successfully! Welcome email sent.',
      agent: agentWithoutPassword
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
};

// Update agent
const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      address, 
      country_id, 
      state_id, 
      district_id, 
      zone_id, 
      pan_number, 
      aadhar_number,
      gst_number,
      status 
    } = req.body;
    
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    let hashedPassword = agent.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    db.prepare(`
      UPDATE agents 
      SET email = ?, password = ?, name = ?, role = ?, phone = ?, address = ?, 
          country_id = ?, state_id = ?, district_id = ?, zone_id = ?, 
          pan_number = ?, aadhar_number = ?, gst_number = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      email || agent.email, 
      hashedPassword, 
      name || agent.name, 
      role || agent.role, 
      phone || agent.phone, 
      address || agent.address,
      country_id || agent.country_id,
      state_id || agent.state_id,
      district_id || agent.district_id,
      zone_id || agent.zone_id,
      pan_number || agent.pan_number,
      aadhar_number || agent.aadhar_number,
      gst_number || agent.gst_number,
      status !== undefined ? status : agent.status, 
      id
    );

    const updatedAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    const { password: _, ...agentWithoutPassword } = updatedAgent;
    
    res.json({
      message: 'Agent updated successfully!',
      agent: agentWithoutPassword
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

// Toggle agent status (block/unblock)
const toggleAgentStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const newStatus = status === 1 ? 1 : 0;
    
    db.prepare('UPDATE agents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);
    
    const updatedAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    const { password: _, ...agentWithoutPassword } = updatedAgent;
    
    const statusText = newStatus === 1 ? 'activated' : 'blocked';
    res.json({ 
      message: `Agent ${statusText} successfully!`,
      agent: agentWithoutPassword
    });
  } catch (error) {
    console.error('Error toggling agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
};

// Delete agent
const deleteAgent = (req, res) => {
  try {
    const { id } = req.params;
    
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    db.prepare('DELETE FROM agents WHERE id = ?').run(id);
    
    res.json({ message: 'Agent deleted successfully!' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
};

module.exports = {
  login,
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  toggleAgentStatus,
  deleteAgent
}; 