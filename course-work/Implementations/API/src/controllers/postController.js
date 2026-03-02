import Post from '../models/Post.js';
import { HOST_NAME, PORT } from '../config/constants.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAllPosts();

    res.status(200).json(posts);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const getUserPosts = async (req, res) => {
  const id = req.user.id;

  try {
    const posts = await Post.getPostsByAuthorId(id);

    res.status(200).json(posts);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const createPost = async (req, res) => {
  const image = `http://${HOST_NAME}:${PORT}/public/${req.file.filename}`;

  const post = {
    author_id: req.user.id,
    title: req.body.title,
    description: req.body.description,
    image,
    category: req.body.category,
    lostAt: req.body.lostAt,
  };

  try {
    const isCreated = await Post.create(post);

    if (!isCreated) {
      res.sendStatus(400);
    }

    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const updatePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const updatedFields = req.body;

  if (req.file.filename) {
    updatedFields.image = `http://${HOST_NAME}:${PORT}/public/${req.file.filename}`;
  }

  try {
    const post = await Post.findById(postId);

    if (post.author_id !== userId) {
      return res.sendStatus(401);
    }

    const isUpdated = await Post.updateById(postId, updatedFields);

    if (!isUpdated) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (post.author_id !== userId) {
      return res.sendStatus(401);
    }

    const isDeleted = await Post.deleteById(id);

    if (!isDeleted) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};
