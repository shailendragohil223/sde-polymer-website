const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sde_polymer_jwt_secret_key_2026_vadodara';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No authentication token provided. Please log in.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

module.exports = {
  authMiddleware,
  JWT_SECRET
};
