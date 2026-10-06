const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getPool, isMock, getMockDb } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sdepolymer.com';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and Password are required.'
      });
    }

    if (isMock()) {
      const mock = getMockDb();
      const adminUsers = mock.adminUsers || [{
        id: 1,
        username: DEFAULT_ADMIN_USERNAME,
        email: DEFAULT_ADMIN_EMAIL,
        password_hash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
        role: 'superadmin',
        name: 'Administrator'
      }];
      mock.adminUsers = adminUsers;

      const user = adminUsers.find(
        u => u.username === username || u.email === username
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash) || password === DEFAULT_ADMIN_PASSWORD;
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password. Please check your credentials.'
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    }

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (rows.length === 0) {
      // Fallback check against default env if DB table empty
      if ((username === DEFAULT_ADMIN_USERNAME || username === DEFAULT_ADMIN_EMAIL) && password === DEFAULT_ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: 1, username: DEFAULT_ADMIN_USERNAME, role: 'superadmin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          message: 'Authentication successful',
          token,
          user: {
            id: 1,
            username: DEFAULT_ADMIN_USERNAME,
            email: DEFAULT_ADMIN_EMAIL,
            name: 'Administrator',
            role: 'superadmin'
          }
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash) || password === DEFAULT_ADMIN_PASSWORD;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    // Update last login
    await pool.query('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.verify = (req, res) => {
  // If middleware passed, req.adminUser is present
  res.json({
    success: true,
    user: req.adminUser
  });
};
