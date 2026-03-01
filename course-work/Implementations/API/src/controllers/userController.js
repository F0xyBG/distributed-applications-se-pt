import User from '../models/User.js';
import { ACCESS_TOKEN_NAME, NODE_ENV } from '../config/constants.js';

export const getUser = async (req, res) => {
  const { id } = req.user;

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
  const { id } = req.user;

  try {
    const isUpdated = await User.updateById(id, req.body);

    if (!isUpdated) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.user;

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
