const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

// General token verification (renamed req.company to req.user to be more generic)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store user info (includes role)
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Government-only middleware
const isGovernment = (req, res, next) => {
  if (req.user.role !== 'government') {
    return res.status(403).json({ 
      message: 'Access denied. Government authorization required.' 
    });
  }
  next();
};

// Company-only middleware
const isCompany = (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ 
      message: 'Access denied. Company authorization required.' 
    });
  }
  next();
};

// Company owner or government middleware
const isCompanyOwnerOrGovernment = (req, res, next) => {
  if (req.user.role === 'government') {
    return next();
  }
  
  if (req.user.role === 'company' && req.user.id === parseInt(req.params.id)) {
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied. You can only access your own company information.' 
  });
};

module.exports = {
  verifyToken,
  isGovernment,
  isCompany,
  isCompanyOwnerOrGovernment,
  JWT_SECRET
};