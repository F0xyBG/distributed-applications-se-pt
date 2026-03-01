import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  SALT_ROUNDS,
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_SECRET,
  JWT_TOKEN_LIFE,
  COOKIE_LIFE,
  NODE_ENV,
} from '../config/constants.js';
import User from '../models/User.js';

export const register = async (req, res) => {
  const user = req.body;

  try {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

    await User.create(user);

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.sendStatus(400);
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) return res.sendStatus(401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.sendStatus(401);

    const token = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_TOKEN_LIFE,
    });

    res.cookie(ACCESS_TOKEN_NAME, token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_LIFE,
    });

    res.status(200).json({ id: user.id });
  } catch (err) {
    res.sendStatus(500);
  }
};

export const logout = async (req, res) => {
  res.clearCookie(ACCESS_TOKEN_NAME, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.sendStatus(204);
};
