// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { db } = require('../config/database');
// const { sendWelcomeEmail } = require('../utils/emailService');

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // Login agent/admin
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const agent = db.prepare('SELECT * FROM agents WHERE email = ? AND status = 1').get(email);
    
//     if (!agent) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, agent.password);
    
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { 
//         id: agent.id, 
//         email: agent.email, 
//         name: agent.name, 
//         role: agent.role 
//       }, 
//       JWT_SECRET, 
//       { expiresIn: '24h' }
//     );

//     const { password: _, ...agentWithoutPassword } = agent;
    
//     res.json({
//       message: 'Login successful!',
//       agent: agentWithoutPassword,
//       token
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Login failed', details: error.message });
//   }
// };

// const getAllAgents = (req, res) => {
//   try {
//     const agents = db.prepare('SELECT id, email, name, role, phone, address, country_id, state_id, district_id, zone_id, pan_number, aadhar_number, gst_number, status FROM agents ORDER BY created_at DESC').all();
//     res.json(agents);
//   } catch (error) {
//     console.error('Error fetching agents:', error);
//     res.status(500).json({ error: 'Failed to fetch agents' });
//   }
// };

// // Get agent by ID
// const getAgentById = (req, res) => {
//   try {
//     const { id } = req.params;
//     const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    
//     if (!agent) {
//       return res.status(404).json({ error: 'Agent not found' });
//     }
    
//     res.json(agent);
//   } catch (error) {
//     console.error('Error fetching agent:', error);
//     res.status(500).json({ error: 'Failed to fetch agent' });
//   }
// };

// // Create new agent
// const createAgent = async (req, res) => {
//   try {
//     const { 
//       email, 
//       password, 
//       name, 
//       role, 
//       phone, 
//       address, 
//       country_id, 
//       state_id, 
//       district_id, 
//       zone_id, 
//       pan_number, 
//       aadhar_number,
//       gst_number
//     } = req.body;
    
//     if (!email || !password || !name) {
//       return res.status(400).json({ error: 'Email, password, and name are required' });
//     }

//     // Check if email already exists
//     const existingAgent = db.prepare('SELECT id FROM agents WHERE email = ?').get(email);
//     if (existingAgent) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = db.prepare(`
//       INSERT INTO agents (
//         email, password, name, role, phone, address, 
//         country_id, state_id, district_id, zone_id, 
//         pan_number, aadhar_number, gst_number, created_by_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `).run(
//       email, hashedPassword, name, role || 'agent', phone, address,
//       country_id, state_id, district_id, zone_id,
//       pan_number, aadhar_number, gst_number, 1 // created_by_id = 1 (superadmin)
//     );

//     const newAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid);
//     const { password: _, ...agentWithoutPassword } = newAgent;
    
//     // Send welcome email with login credentials
//     try {
//       await sendWelcomeEmail(email, name, password);
//     } catch (emailError) {
//       console.error('Error sending welcome email:', emailError);
//       // Don't fail the request if email fails
//     }
    
//     res.status(201).json({
//       message: 'Agent created successfully! Welcome email sent.',
//       agent: agentWithoutPassword
//     });
//   } catch (error) {
//     console.error('Error creating agent:', error);
//     res.status(500).json({ error: 'Failed to create agent' });
//   }
// };

// // Update agent
// const updateAgent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       email, 
//       password, 
//       name, 
//       role, 
//       phone, 
//       address, 
//       country_id, 
//       state_id, 
//       district_id, 
//       zone_id, 
//       pan_number, 
//       aadhar_number,
//       gst_number,
//       status,
//       updated_by_id
//     } = req.body;
    
//     const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
//     if (!agent) {
//       return res.status(404).json({ error: 'Agent not found' });
//     }

//     let hashedPassword = agent.password;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     db.prepare(`
//       UPDATE agents 
//       SET email = ?, password = ?, name = ?, role = ?, phone = ?, address = ?, 
//           country_id = ?, state_id = ?, district_id = ?, zone_id = ?, 
//           pan_number = ?, aadhar_number = ?, gst_number = ?, status = ?, 
//           updated_by_id = ?, Updated_date = CURRENT_TIMESTAMP
//       WHERE id = ?
//     `).run(
//       email || agent.email, 
//       hashedPassword, 
//       name || agent.name, 
//       role || agent.role, 
//       phone || agent.phone, 
//       address || agent.address,
//       country_id || agent.country_id,
//       state_id || agent.state_id,
//       district_id || agent.district_id,
//       zone_id || agent.zone_id,
//       pan_number || agent.pan_number,
//       aadhar_number || agent.aadhar_number,
//       gst_number || agent.gst_number,
//       status !== undefined ? status : agent.status,
//       updated_by_id || 1, // Default to 1 (superadmin) if not provided
//       id
//     );

//     const updatedAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
//     const { password: _, ...agentWithoutPassword } = updatedAgent;
    
//     res.json({
//       message: 'Agent updated successfully!',
//       agent: agentWithoutPassword
//     });
//   } catch (error) {
//     console.error('Error updating agent:', error);
//     res.status(500).json({ error: 'Failed to update agent' });
//   }
// };

// // Toggle agent status (block/unblock)
// const toggleAgentStatus = (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
//     if (!agent) {
//       return res.status(404).json({ error: 'Agent not found' });
//     }

//     const newStatus = status === 1 ? 1 : 0;
    
//     db.prepare('UPDATE agents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);
    
//     const updatedAgent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
//     const { password: _, ...agentWithoutPassword } = updatedAgent;
    
//     const statusText = newStatus === 1 ? 'activated' : 'blocked';
//     res.json({ 
//       message: `Agent ${statusText} successfully!`,
//       agent: agentWithoutPassword
//     });
//   } catch (error) {
//     console.error('Error toggling agent status:', error);
//     res.status(500).json({ error: 'Failed to update agent status' });
//   }
// };

// // Delete agent
// const deleteAgent = (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
//     if (!agent) {
//       return res.status(404).json({ error: 'Agent not found' });
//     }

//     db.prepare('DELETE FROM agents WHERE id = ?').run(id);
    
//     res.json({ message: 'Agent deleted successfully!' });
//   } catch (error) {
//     console.error('Error deleting agent:', error);
//     res.status(500).json({ error: 'Failed to delete agent' });
//   }
// };

// module.exports = {
//   login,
//   getAllAgents,
//   getAgentById,
//   createAgent,
//   updateAgent,
//   toggleAgentStatus,
//   deleteAgent
// }; 



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login agent/admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM agents WHERE email = ? AND status = 1', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const agent = rows[0];

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

const getAllAgents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.email, a.name, a.role, a.phone, a.address, a.country_id, a.state_id, a.district_id, a.zone_id, 
             a.pan_number, a.aadhar_number, a.gst_number, a.status, 
             c.country_name, s.state_name, d.district_name, z.zone_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      ORDER BY a.created_by_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents', details: error.message });
  }
};

// Get agent by ID
const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT a.*, c.country_name, s.state_name, d.district_name, z.zone_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      WHERE a.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent', details: error.message });
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
    const [existingRows] = await pool.query('SELECT id FROM agents WHERE email = ?', [email]);
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
      INSERT INTO agents (
        email, password, name, role, phone, address, 
        country_id, state_id, district_id, zone_id, 
        pan_number, aadhar_number, gst_number, created_by_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      email, hashedPassword, name, role || 'agent', phone, address,
      country_id, state_id, district_id, zone_id,
      pan_number, aadhar_number, gst_number, 1 // created_by_id = 1 (superadmin)
    ]);

    const [newRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [result.insertId]);
    const newAgent = newRows[0];
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
    res.status(500).json({ error: 'Failed to create agent', details: error.message });
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
      status,
      updated_by_id
    } = req.body;
    
    const [agentRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    if (agentRows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentRows[0];

    let hashedPassword = agent.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await pool.query(`
      UPDATE agents 
      SET email = ?, password = ?, name = ?, role = ?, phone = ?, address = ?, 
          country_id = ?, state_id = ?, district_id = ?, zone_id = ?, 
          pan_number = ?, aadhar_number = ?, gst_number = ?, status = ?, 
          updated_by_id = ?, updated_by_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
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
      updated_by_id || 1, // Default to 1 (superadmin) if not provided
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const [updatedRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    const updatedAgent = updatedRows[0];
    const { password: _, ...agentWithoutPassword } = updatedAgent;
    
    res.json({
      message: 'Agent updated successfully!',
      agent: agentWithoutPassword
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent', details: error.message });
  }
};

// Toggle agent status (block/unblock)
const toggleAgentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [agentRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    if (agentRows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const newStatus = status === 1 ? 1 : 0;
    
    const [result] = await pool.query('UPDATE agents SET status = ?, updated_by_date = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const [updatedRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    const updatedAgent = updatedRows[0];
    const { password: _, ...agentWithoutPassword } = updatedAgent;
    
    const statusText = newStatus === 1 ? 'activated' : 'blocked';
    res.json({ 
      message: `Agent ${statusText} successfully!`,
      agent: agentWithoutPassword
    });
  } catch (error) {
    console.error('Error toggling agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status', details: error.message });
  }
};

// Delete agent
const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [agentRows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    if (agentRows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const [result] = await pool.query('DELETE FROM agents WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({ message: 'Agent deleted successfully!' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent', details: error.message });
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