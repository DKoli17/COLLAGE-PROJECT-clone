import jwt from 'jsonwebtoken';

export const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
  } catch (error) {
    return null;
  }
};
