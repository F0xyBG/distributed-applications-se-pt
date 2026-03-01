import User from '../models/User.js';

export const getUser = async (req, res) => {
  const { id } = req.user;

  try {
    const userData = await User.findById(id);

    res.status(200).json(userData);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;

  try {
    await User.updateById(id, req.body);

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.user;

  try {
    await User.deleteById(id);

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};
