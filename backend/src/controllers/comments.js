const Comment = require('../models/comment');

function handleError(res, err) {
  res.status(500);
  res.json(err);
}

async function getCommentsByUser(req, res) {
  try {
    const { id: userId } = req.params;
    const { _page = 1, _limit = 10, _expand } = req.query;
    const page = parseInt(_page, 10);
    const limit = parseInt(_limit, 10);
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { userId } },
      { $skip: skip },
      { $limit: limit },
    ];

    if (_expand) {
      const expands = _expand.split(',');

      if (expands.includes('user')) {
        pipeline.push(
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: 'id',
              as: 'user',
            },
          },
          { $unwind: '$user' }
        );
      }

      if (expands.includes('post')) {
        pipeline.push(
          {
            $lookup: {
              from: 'posts',
              localField: 'postId',
              foreignField: 'id',
              as: 'post',
            },
          },
          { $unwind: '$post' }
        );
      }
    }

    const comments = await Comment.aggregate(pipeline);
    res.status(200).json(comments);
  } catch (err) {
    handleError(res, err);
  }
}

async function getCommentsByPost(req, res) {
  try {
    const { id: postId } = req.params;
    const { _page = 1, _limit = 10, _expand } = req.query;
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { postId } },
      { $skip: skip },
      { $limit: limit },
    ];

    if (_expand) {
      const expands = _expand.split(',');

      if (expands.includes('user')) {
        pipeline.push(
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: 'id',
              as: 'user',
            },
          },
          { $unwind: '$user' }
        );
      }

      if (expands.includes('post')) {
        pipeline.push(
          {
            $lookup: {
              from: 'posts',
              localField: 'postId',
              foreignField: 'id',
              as: 'post',
            },
          },
          { $unwind: '$post' }
        );
      }
    }

    const comments = await Comment.aggregate(pipeline);
    res.status(200).json(comments);
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = {
  getCommentsByUser,
  getCommentsByPost,
};
