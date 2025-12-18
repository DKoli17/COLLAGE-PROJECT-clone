import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // For now, we'll skip role checking as we need to fetch user from DB
      // This will be enhanced later
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }
  };
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
