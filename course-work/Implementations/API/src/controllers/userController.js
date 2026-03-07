import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { ACCESS_TOKEN_NAME, NODE_ENV, SALT_ROUNDS } from '../config/constants.js';

export const getUser = async (req, res) => {
  const id = req.user.id;

  try {
    const userData = await User.findById(id);

    if (!userData) {
      return res.sendStatus(404);
    }

    res.status(200).json(userData);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const updateUser = async (req, res) => {
  const id = req.user.id;
  const updatedFields = req.body;

  try {
    if (updatedFields.password) {
      updatedFields.password = await bcrypt.hash(updatedFields.password, SALT_ROUNDS);
    }

    await User.updateById(id, updatedFields);

    res.sendStatus(200);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.sendStatus(409);
    }
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const deleteUser = async (req, res) => {
  const id = req.user.id;

  try {
    const isDeleted = await User.deleteById(id);

    if (!isDeleted) {
      return res.sendStatus(400);
    }

    res.clearCookie(ACCESS_TOKEN_NAME, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};
