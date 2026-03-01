import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_NAME, ACCESS_TOKEN_SECRET } from '../config/constants.js';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN_NAME];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};
