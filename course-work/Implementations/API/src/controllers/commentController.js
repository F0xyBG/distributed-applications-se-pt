import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.getByPostId(postId);

    res.status(200).json(comments);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const createComment = async (req, res) => {
  const userId = req.user.id;

  const comment = {
    author_id: userId,
    post_id: req.body.post_id,
    comment: req.body.comment,
  };

  try {
    const isCreated = await Comment.create(comment);

    if (!isCreated) {
      res.sendStatus(400);
    }

    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};
export const updateComment = async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.id;
  const updatedFields = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (comment.author_id !== userId) {
      return res.sendStatus(401);
    }

    const isUpdated = await Comment.updateById(commentId, updatedFields);

    if (!isUpdated) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

export const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.id;

  try {
    const comment = await Comment.findById(commentId);

    if (comment.author_id !== userId) {
      return res.sendStatus(401);
    }

    const isDeleted = await Comment.deleteById(commentId);

    if (!isDeleted) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};
